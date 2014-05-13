'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

simulationApp.controller('CanvasController', ['$scope', 'VisualizationService', 'SocketGridService', 'HandleGridService',
	function ($scope, VisualizationService, SocketGridService, HandleGridService) {

		var canvas = document.getElementById("canvas");
		if (canvas.getContext) {
			var engine = canvas.getContext("2d");
			VisualizationService.setEngine(engine);
		}

		var grid = [
			[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 5, 1, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 1, 4, 1, 1, 8, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6]
		];
		SocketGridService.set_array(grid);
		HandleGridService.canvas();

	}]);

// This controller starts the Simulator each round.
simulationApp.controller('RoundController', ['$scope', 'PrepareService', 'DatabaseService', 'JsonService',
	function ($scope, PrepareService, DatabaseService, JsonService) {
		var interval;
		$scope.start = function () {
			interval = setInterval(function () {
				intervalJob();
			}, 10000);
		};
		$scope.end = function () {
			window.clearInterval(interval);
		};
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
											switch (human_type) {
												case 'Waiter':
													var waiter_id = temp_id;
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
													angular.forEach(algo, function (value, key) {
														if (logic_array[value[0]][value[1]] != 0) {
															var human_id = logic_array[value[0]][value[1]];
															//PrepareService.execute(waiter_id, human_id);
														}
													});
													break;
												case 'Chef':
													var chef_id = temp_id;
													//PrepareService.prepareCook(chef_id);
													break;
												case 'Customer':
													var customer_id = temp_id;
													//PrepareService.prepareGenerateOrder(customer_id);
													//PrepareService.removeCustomer();
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
			//PrepareService.spawnCustomer();
			//PrepareService.buyResources();
			//var data_array = PrepareService.loadData();
		}
	}]);
