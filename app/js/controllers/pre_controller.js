/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

// This Controller let you add, change, load and save the grid array.
simulationApp.controller('PreController', ['$scope', 'DatabaseService', 'JsonService', 'RngService', function ($scope, DatabaseService, JsonService, RngService) { // function referenced by the drop target
	var empty_array = [
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
	var grid = empty_array;
	var grid_logic = empty_array;

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
				var human_types = {3: 'Customer', 4: 'Chef', 7: 'Waiter'};
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
	var value_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	$scope.rix = value_array;
	$scope.cix = value_array;
}]);