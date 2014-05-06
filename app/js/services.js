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

simulationApp.service('HumanService', ['DatabaseService', 'JsonService',
	function (DatabaseService, JsonService) {
		var movement;
		var action;
		var morale;
		var thoughts;

		this.getFromHumanType = function (human_type_id) {
			DatabaseService.loadByType("human_type", human_type_id);
			JsonService.load("human_type").then(function (data) {
				var humans_by_type = data.data;
				console.log(humans_by_type);
				return humans_by_type;

			});
		};
		this.createHuman = function (name, gender, human_type_id) {
			var value = [name, gender, human_type_id];
			DatabaseService.save("human", value);
		};
		this.getHumans = function () {
			DatabaseService.load("human");
			JsonService.load("human").then(function (data) {
				var humans = data.data;
				console.log(humans);
				return humans;
			});
		};
		this.killHuman = function (id) {
			DatabaseService.delete("human", id);
		};
		this.calculateMoralThought = function () {
			// choose one of the defined 1-10 morales/thoughts by waiting / receive cold food / get stressed / boring
		};
	}
]);

simulationApp.service('WaiterService', ['ChefService', 'CustomerService',
	function (ChefService, CustomerService) {
		var order;
		var product;

		this.pickOrder = function (new_order) {
			var ordered = CustomerService.getOrdered()
			if (ordered === null) {
				order = CustomerService.takeOrder();
			}
		};
		this.placeOrder = function () {
			ChefService.setOrder(order);
			order = null;
		};
		this.pickProduct = function () {
			product = ChefService.takeProduct();
		};
		this.placeProduct = function (new_product) {
			// todo: cash buchen
			var ordered = CustomerService.getOrdered;
			var temp_order = CustomerService.getOrder;
			if (ordered === true && temp_order == product) {
				CustomerService.eat(product);
				product = null;
			}
		};

		this.getOrder = function () {
			return order;
		}

		this.getProduct = function () {
			return product;
		}
	}]);

simulationApp.service('ChefService', [
	function () {
		var products = [];
		var orders = [];

		this.cook = function () {
			for (var i = 0; i < orders.length; i++) {
				products[i] = orders[i];
				// todo: product in die datenbank schreiben
				array.splice(orders, i);
			}
			// Todo: Ressourcen löschen
		}

		this.setOrder = function (order) {
			orders.push(order);
		}

		this.takeProduct = function () {
			for (var i = 0; i < products.length; i++) {
				var temp_product = products[i];
				array.splice(products, i);
				return temp_product;
			}
			return false;
		}
	}]);

simulationApp.service('StoremanService', [
	function () {
		this.buyResources = function () {
			// Todo füge resources in der datenbank hinzu und ziehe die cash kosten ab
		}
	}]);

simulationApp.service('CustomerService', [
	function () {
		var order;
		var ordered = null;

		this.generateOrder = function () {
			// TODO: erstelle eine zufällige order
		};

		this.takeOrder = function () {
			ordered = true;
			return order;
		};

		this.getOrdered = function () {
			return ordered;
		};

		this.getOrder = function () {
			return order;
		};

		this.eat = function ($product) {
			// todo: check product oder so
			ordered = false;
		}
	}]);

simulationApp.service('ResourceService', [
	function () {

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

		this.researchProduct = function (type, ingredients, time_to_cold, price) {
			// save Product into db or json
		};
		this.createProduct = function (product_type, creation_time) {
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
		this.loadByType = function (table_name, table_type) {
			var type = "loadByType";
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						data: table_type,
						type: type
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
			// saves the result into a json file
		};
		this.delete = function (table_name, id) {
			var type = "delete";
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						data: id,
						type: type
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};
		this.save = function (table_name, data) {
			var type = "create";
			console.log(data);
			var enc_data = JSON.stringify(data);
			console.log(enc_data);
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						type: type,
						data: enc_data
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
			file = 'json/' + file + '.json';
			return $http.get(file).success(function (data) {
				console.log(file, data);
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