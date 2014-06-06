/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

// This controller starts the Simulator each round.
// It's like the motherboard of our app, which can started and stopped via button.
// If started, each interval called the intervalJob which doing all the stuff for a round / interval.
simulationApp.controller('RoundController', ['$scope', 'PrepareService', 'DatabaseService', 'JsonService', 'CanvasService', 'DefinePathsService',
	function ($scope, PrepareService, DatabaseService, JsonService, CanvasService, DefinePathsService) {
		var interval;
		var max = 20;
		var object_container;
		// Set interval to 10 seconds and add intervalJob() to it.
		$scope.start = function () {
			object_container = new object_container(max);
			interval = setInterval(function () {
				intervalJob();
			}, 10000);
		};
		// Stop the interval interval.
		$scope.end = function () {
			window.clearInterval(interval);
		};
		// This function work with the json gui_logic which is a 2 dimensional Array.
		// A complex chain of actions control:
		// if the Array[x][x] contains a number over 0, then it's a human_id,
		// which will used to load the similar human from the database and check which human_type it is.
		// Each human_type has it's own case and will start their function,
		// additional functions will called at the end, because they must be called every interval.
		var intervalJob = function () {
			JsonService.load('gui_logic').then(function (data) {
				var logic_array = data.data;
				var timeout = 0;
				for (var out = 0; out < logic_array.length; out++) {
					for (var inner = 0; inner < logic_array[out].length; inner++) {
						if (logic_array[out][inner] != 0) {
							var temp_id = logic_array[out][inner];
							timeout += 200;
							setTimeout(function (temp_id, out, inner) {
								return function () {
									DatabaseService.special('human', 'loadById', temp_id);
									setTimeout(function () {
										JsonService.load('human').then(function (data) {
											var human_type = data.data[0]['type'];
											var human = data.data[0];
											var algo = [
												[out, inner - 1],
												[out, inner + 1],
												[out - 1, inner],
												[out - 1, inner - 1],
												[out - 1, inner + 1],
												[out + 1, inner],
												[out + 1, inner - 1],
												[out + 1, inner + 1]
											];
											switch (human_type) {
												case 'Waiter':
													var waiter_id = temp_id;
													angular.forEach(algo, function (value, key) {
														if (logic_array[value[0]][value[1]] != 0) {
															var human_id = logic_array[value[0]][value[1]];
															PrepareService.execute(waiter_id, human_id);
														}
													});
													DefinePathsService.execute(object_container, human, out, inner);
													break;
												case 'Chef':
													var chef_id = temp_id;
													PrepareService.prepareCook(chef_id);
													break;
												case 'Customer':
													var customer_id = temp_id;
													JsonService.load('gui').then(function (data) {
														angular.forEach(algo, function (value, key) {
															if (data.data[value[0]][value[1]] == 6) {
																PrepareService.prepareGenerateOrder(customer_id);
															}
														});
														DefinePathsService.execute(object_container, human, out, inner);
													});
													break;
												default:
											}
										});
									}, 50);
								}
							}(temp_id, out, inner), timeout)
						}
					}
				}
			});
			//Todo: Maximale Kunden definieren
			var limit = 5;
			PrepareService.spawnCustomer(limit);
			PrepareService.removeCustomer();
			PrepareService.buyResources();
			$scope.data_array = PrepareService.loadData();
			CanvasService.draw();
		}
	}]);