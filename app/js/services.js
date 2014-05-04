'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

simulationApp.value('version', '0.1');

simulationApp.service('CashService', ['$http',
	function ($http) {

		this.getCash = function () {
			return $http.get('json/json.json').success(function (data) {
				return  data;
			});
		};

		this.setCash = function (data) {
			$(document).ready(function () {
				$.post('php/jsonHandler.php',
					{
						data: data,
						list: "cashlist",
						file: "json"
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};

		this.calculate = function (cash) {
			var calculated = 0;
			angular.forEach(cash, function (value, key) {
				calculated = calculated + parseFloat(value);
			});
			return calculated;
		};

	}
]);

simulationApp.service('RngService', [
	function () {
		this.generate = function (probability, bonus) {
			var random_number = Math.floor((Math.random() * parseInt(probability)) + parseInt(bonus));
			if (random_number > probability) {
				random_number = probability;
			}
			return random_number;
		}
	}
]);

simulationApp.service('TimeService', [
	function () {
		this.createDate = function () {
			var date = new Date();
			date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
			return date;
		};
		this.createTime = function () {
			var time = new Date();
			time = time.getHours() + '-' + time.getMinutes() + '-' + time.getSeconds();
			return time;
		}
	}
]);

simulationApp.service('HumanService', [
	function () {
		var id;
		var name;
		var movement;
		var action;
		var gender;
		var morale;
		var thoughts;
		var human_type;

		this.createHumanType = function (type) {
			this.type = type;
			// save human type into db or json
		};
		this.createHuman = function (name, gender, human_type) {
			this.name = name;
			this.gender = gender;
			this.human_type = human_type;
			// save human into db or json
		};
		this.getHuman = function (id) {
			// get human by id
		};
		this.killHuman = function (id) {
			// remove human by id
		};
		this.calculateMoralThought = function () {
			// choose one of the defined 1-10 morales/thoughts by waiting / receive cold food / get stressed / boring
		};
	}
]);

simulationApp.service('ResourceService', [
	function () {
		var id;
		var type;
		var amount;
		var purchase_price;
		var durability;
		var resource_type;

		this.createResource = function (type, purchase_price) {
			this.type = type;
			this.purchase_price = purchase_price;
			// save Resource into db or json
		};
		this.buyResource = function (resource_type, amount, durability) {
			this.resource_type = resource_type;
			this.amount = amount;
			this.durability = durability;
			// save Resource into db or json
		};
		this.consumeResource = function (id, amount) {
			// update the amount by id
		};
		this.getResource = function (type) {
			// load all resources by type
		};
		this.checkResourceDurability = function (type) {
			// delete all resources which run out of date
		};
	}
]);

simulationApp.service('ProductService', [
	function () {
		var id;
		var type;
		var ingredients;
		var price;
		var time_to_cold;
		var product_type;
		var creation_time;

		this.researchProduct = function (type, ingredients, time_to_cold, price) {
			this.type = type;
			this.ingredients = ingredients;
			this.time_to_cold = time_to_cold;
			this.price = price;
			// save Product into db or json
		};
		this.createProduct = function (product_type, creation_time) {
			this.product_type = product_type;
			this.creation_time = creation_time;
			// save Resource into db or json;
		};
		this.consumeProduct = function (id) {
			// remove the product by id;
		};
		this.getProduct = function (id) {
			// load all products by id
		};
	}
]);

simulationApp.service('DatabaseService', [ '$http',
	function ($http) {
		this.load = function (table_name) {
			var type = "load";
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						type: type
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
			// saves the result into a json file
		};
		this.save = function (table_name, data) {
			var type = "create";
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						type: type,
						data: data
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};
	}
]);

simulationApp.service('JsonService', [ '$http',
	function ($http) {
		this.load = function (file) {
			file = 'json/'+ file +'.json';
			return $http.get(file).success(function (data) {
				return  data;
			});
		};
		this.save = function (data, list, file) {
			$(document).ready(function () {
				$.post('php/jsonHandler.php',
					{
						data: data,
						list: list,
						file: file
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};
	}
]);

simulationApp.service('SocketGridService', [
	function () {
		var canvas_grid = new Array();

		this.set_array = function (array) {
			canvas_grid = array;
		};

		this.get_array = function () {
			return canvas_grid;
		};

		this.get_grid_height = function () {
			return canvas_grid[0].length;
		};

		this.get_grid_width = function () {
			return canvas_grid.length;
		}
	}
])
;

simulationApp.service('HandleGridService', ['SocketGridService', 'VisualizationService',
	function (SocketGridService, VisualizationService) {
		this.canvas = function () {
			var max_x = SocketGridService.get_grid_width();
			var max_y = SocketGridService.get_grid_height();
			var canvas_array = new Array();
			canvas_array = SocketGridService.get_array();

			for (var current_width = 0; current_width < max_x; current_width++) {

				for (var current_height = 0; current_height < max_y; current_height++) {

					var current_x = current_width * 25;
					var current_y = current_height * 25;

					VisualizationService.draw_images(canvas_array[current_width][current_height], current_x, current_y);
				}
			}
		}
	}
]);

simulationApp.service('VisualizationService', [
	function () {
		var current_engine;
		this.setEngine = function (engine) {
			current_engine = engine;
		};
		this.draw_images = function (imageNumber, xPosition, yPosition) {
//reference to the images and make an array of references to call them
			var pictures = new Array();

			pictures[0] = document.getElementById("field_image");
			pictures[1] = document.getElementById("wall_image");
			pictures[2] = document.getElementById("door_image");
			pictures[3] = document.getElementById("customer_image");
			pictures[4] = document.getElementById("cook_image");
			pictures[5] = document.getElementById("kitchen_image");
			pictures[6] = document.getElementById("table_image");
			pictures[7] = document.getElementById("waiter_image");
			pictures[8] = document.getElementById("storage_image");
//drawing the single objects
			current_engine.drawImage(pictures[imageNumber], xPosition, yPosition);
		}
	}
]);