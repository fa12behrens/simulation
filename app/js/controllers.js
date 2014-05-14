'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

// This controller starts the Simulator each round.
// It's like the motherboard of our app, which can started and stopped via button.
// If started, each interval called the intervalJob which doing all the stuff for a round / interval.
simulationApp.controller('RoundController', ['$scope', 'PrepareService', 'DatabaseService', 'JsonService', 'CanvasService',
	function ($scope, PrepareService, DatabaseService, JsonService, CanvasService) {
		var interval;
		// Set interval to 10 seconds and add intervalJob() to it.
		$scope.start = function () {
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
			//PrepareService.removeCustomer();
			//PrepareService.buyResources();
			//$scope.data_array = PrepareService.loadData();
			//CanvasService.draw();
		}
	}]);

// This Controller let you add, change, load and save the grid array.
simulationApp.controller('PreController', ['$scope', 'DatabaseService', 'JsonService', 'RngService', function ($scope, DatabaseService, JsonService, RngService) { // function referenced by the drop target
	var grid = [
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
	];
	var grid_logic = [
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
		["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
	];
	var objects = {
		'green': '4',
		'red': '8',
		'blue': '7',
		'black': '1',
		'grey': '0',
		'yellow': '3',
		'brown': '2',
		'magenta': '6',
		'orange': '5'
	};

	// Load the grid jsons into the grid arrays
	$scope.load = function () {
		JsonService.load('gui').then(function (data) {
			grid = data.data;
		});
		JsonService.load('gui_logic').then(function (data) {
			grid_logic = data.data;
		});
	};
	// Save the grid arrays into the grid jsons
	$scope.save = function () {
			JsonService.overwrite('gui', grid);
			JsonService.overwrite('gui_logic', grid_logic);
		};
	// Handle the drag and drop actions by getting the current moved html elements.
	// Set the color, if there already is an color, the color will be changed, or deleted when color is empty.
	// The given drop element will be explored in several steps,
	// split, forEach get the required data, if checks if any color is set,
	// if it's true it will set the object into the array position and if the object is a human,
	// it will load and save the human_id into the grid_logic array too.
	// At last, elements that would drag away lose their color.
	$scope.dropped = function (dragEl, dropEl) {
		//the directive provides a native dom object, wrap with jqlite
		var drop = angular.element(dropEl);
		var drag = angular.element(dragEl);

		//clear the previously applied color, if it exists
		var bgClass = drop.attr('data-color');
		if (bgClass) {
			drop.removeClass(bgClass);
		}

		//add the dragged color
		bgClass = drag.attr("data-color");
		drop.addClass(bgClass);
		drop.attr('data-color', bgClass);

		var drop_html = drop[0].outerHTML;
		var drop_splitted = drop_html.split('"', 50);
		var position = [];
		var color;

		angular.forEach(drop_splitted, function (value, key) {
			if (value == ' value=') {
				position.push(drop_splitted[key + 1]);
			}
			if (value == ' data-color=') {
				color = drop_splitted[key + 1];
			}
		});

		if (color !== undefined) {
			var object = objects[color];
			if (object == 3 || object == 4 || object == 7) {
				var human_types = {3:'Customer', 4:'Chef', 7:'Waiter'};
				var human_type = human_types[object];
				DatabaseService.special('human', 'loadByType', human_type);
				setTimeout(function () {
					JsonService.load('human').then(function (data) {
						var random_number = RngService.generate(data.data.length, 0);
						var human_id = data.data[random_number]['id'];
						grid_logic[position[0] - 1][position[1] - 1] = human_id;
					});
				}, 100);
			}
			grid[position[0] - 1][position[1] - 1] = object;
		}

		//if element has been dragged from the grid, clear dragged color
		if (drag.attr("x-lvl-drop-target")) {
			drag.removeClass(bgClass);
		}
	};
	$scope.rix = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	$scope.cix = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
}]);


