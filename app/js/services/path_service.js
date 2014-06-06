/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

simulationApp.service('DefinePathsService', ['DatabaseService', 'JsonService', 'RngService', 'PlaceAroundService', function (DatabaseService, JsonService, RngService, PlaceAroundService) {
	this.execute = function (object_container, human, current_out, current_inner) {
		var id = human['id'];
		if (human['path'] != 1) {
			var temp_array = {id: [current_out, current_inner]};
			object_container.create_content(temp_array);
		}
		var gui = [];
		var gui_logic = [];
		JsonService.load('gui').then(
			function (data) {
				gui = data.data;
			}
		);
		JsonService.load('gui_logic').then(
			function (data) {
				gui_logic = data.data;
			}
		);
		setTimeout(function () {
				var positions = [];
				var position;
				if (human['type'] = 'Waiter') {
					// wenn kein product und keine bestellung
					// laufe zu einem kunden, mit offener bestellung, gibt es keinen, dann lauf zum koch
					if (human['product_id'] == null && human['order_id'] == null) {
						// Todo: abfragen, ob die kunden eine offene Bestellung haben
						positions = PlaceAroundService.forLoop(3);
						position = PlaceAroundService.execute(positions);
						if (!position[1]) {
							// wenn position = empty
							positions = PlaceAroundService.forLoop(4);
							position = PlaceAroundService.execute(positions);
						}
					} else if (human['product_id'] != null) {
						// wenn product und keine bestellung
						// laufe ein feld neben einen Kunden mit entsprechender order
						// Todo: abfragen, ob die order der Kunden mit dem product übereinstimmt
						positions = PlaceAroundService.forLoop(3);
						position = PlaceAroundService.execute(positions);
					} else if (human['order_id'] != null) {
						// wenn bestellung und kein product
						// laufe ein feld neben den koch

						positions = PlaceAroundService.forLoop(4);
						position = PlaceAroundService.execute(positions);
					}
				}
				else if (human['type'] = 'Customer') {
					if (human['order_id'] == null) {
						// wenn keine bestellung da
						// zum feld neben random Tisch bewegen
						positions = PlaceAroundService.forLoop(6);
						position = PlaceAroundService.execute(positions);
					} else if (['ordered'] == 0 && ['ordered'] !== null) {
						// wenn bestellung auf 0
						// zum Ausgang bewegen
						position = [1, 1];
					}
					// wenn bestellung auf 1 / null
					// nicht bewegen
				}
				var target = {id: [position[0], position[1]]};
				var object = object_container.create_shit(target);
				var new_position = [object[id]['current_out'], object[id]['current_inner']];
				return new_position;
			}, 100
		)
		;
	};
}
])
;

simulationApp.service('PlaceAroundService', ['RngService', function (RngService) {
	this.execute = function (positions) {
		var random_position = RngService.generate(positions.length, 0);
		var position = positions[random_position];
		var random_number = RngService.generate(2, 0);
		if (random_number == 2) {
			position[0] += 1;
		}
		else if (random_number === 1) {
			position[0] -= 1;
		}
		random_number = RngService.generate(2, 0);
		if (random_number == 2) {
			position[1] += 1;
		}
		else if (random_number === 1) {
			position[1] -= 1;
		}
		if (position[0] == positions[random_position][0] && position[1] == positions[random_position][1]) {
			position[1] -= 1;
		}
		return position;
	};
	this.forLoop = function (id) {
		var positions = [];
		var out = 0;
		var inner = 0;
		for (out; out < gui.length; out++) {
			for (inner; inner < gui[out].length; inner++) {
				if (gui[out][inner] == id) {
					positions.push([out, inner]);
				}
			}
		}
		return positions;
	};
}]);