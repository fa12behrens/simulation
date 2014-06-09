'use strict';

/* Services */
// old file, includes all services

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

// Add version to the App value
simulationApp.value('version', '0.1');

// Create a random number based on given parameters (probability = max, bonus = min)
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

// This Service can create a current Timestamp for Date, Time or for an Date in the future,
// called as durability and need days as parameter.
simulationApp.service('TimeService', [
	function () {
		this.createDate = function () {
			var date = new Date();
			date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			return date;
		};
		this.createDurability = function (days) {
			var date = new Date();
			date.setDate(date.getDate() + days);
			date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
			return date;
		};
		this.createTime = function () {
			var time = new Date();
			time = time.getHours() + '-' + time.getMinutes() + '-' + time.getSeconds();
			return time;
		}
	}
]);

// The waiter is the only human who can call other humans to do something,
// his relations are bind to chefs and customers, he can also use the DatabaseService.
// He can pick and place orders and products in cooperation with his relations.
// This service is supposed to call from CallWaiterService, because of required parameters.
simulationApp.service('WaiterService', ['ChefService', 'CustomerService', 'DatabaseService',
	function (ChefService, CustomerService, DatabaseService) {
		// expect two human data (one waiter and one customer) and just call the customers getOrder function.
		this.pickOrder = function (waiter, customer) {
			CustomerService.getOrder(waiter, customer);
		};
		// expect three ids (from waiter, chef and order) and just the chefs setOrder function,
		// also remove the order from current waiter.
		this.placeOrder = function (waiter_id, chef_id, order_id) {
			ChefService.setOrder(chef_id, order_id);
			var data = [waiter_id, order_id];
			DatabaseService.special('human_has_order', 'delete', data);
		};
		// expect two ids (from waiter and chef) and just call the chefs pickProduct function.
		this.pickProduct = function (waiter_id, chef_id) {
			ChefService.takeProduct(waiter_id, chef_id);
		};
		// expect two human data (one waiter and one customer),
		// book the price of the sold product and call the customers takeOrder function,
		// if the current product_type match the order of the customer.
		this.placeProduct = function (waiter, customer) {
			if (waiter['product_type_id'] == customer['order_product_type_id']) {
				DatabaseService.special('cash', 'create', waiter['price']);
				CustomerService.takeOrder(waiter, customer);
			}
		};
	}]);

// The service can accept orders, cook and deliver products,
// he use DatabaseService and JsonService.
simulationApp.service('ChefService', [ 'DatabaseService', 'JsonService',
	function (DatabaseService, JsonService) {
		// This function require the chef id and the product type id from current order,
		// it loads several needed data and check if the resource must be deleted (empty) or just updated by amount.
		// After this, it create a new product in database and define the human_has_product relationship,
		// the human_has_order relation will be deleted as last process.
		this.cook = function (chef_id, product_type_id) {
			DatabaseService.special('product_type', 'loadById', product_type_id);
			setTimeout(function () {
				JsonService.load('product_type').then(function (data) {
					var product_type = data.data[0];
					var resource_type = product_type['ingredients'];
					DatabaseService.special('resources', 'loadByType', resource_type);
					setTimeout(function () {
						JsonService.load('resources').then(function (data) {
							var resource = data.data[0];
							var amount = resource['amount'];
							amount -= 1;
							if (amount === 0) {
								DatabaseService.special('resources', 'delete', resource['id']);
							} else {
								data = [resource['id'], amount];
								DatabaseService.special('resources', 'update', data);
							}
							DatabaseService.special('product', 'create', product_type_id);
							setTimeout(function () {
								DatabaseService.special('product', 'loadByType', product_type_id);
								setTimeout(function () {
									JsonService.load('product').then(function (data) {
										var product = data.data[0];
										data = [chef_id, product['id']];
										DatabaseService.special('human_has_product', 'create', data);
										DatabaseService.special('human_has_order', 'deleteByHuman', chef_id);
									});
								}, 100);
							}, 100);
						});
					}, 100);
				});
			}, 100);
			setTimeout(function () {
			}, 100);
		};
		// Just set an relationship in the database.
		this.setOrder = function (chef_id, order_id) {
			var data = [chef_id, order_id];
			DatabaseService.special('human_has_order', 'create', data);
		};
		// This function load required data with given human_ids and
		// move the product from chef to waiter, by editing the database relations.
		this.takeProduct = function (waiter_id, chef_id) {
			var table_name = 'human_has_product';
			DatabaseService.special(table_name, 'loadOneById', chef_id);
			setTimeout(function () {
				JsonService.load(table_name).then(function (data) {
					var product = data.data;
					if (product) {
						data = [product[0]['human_id'], product[0]['product_id']];
						DatabaseService.special(table_name, 'delete', data);
						data = [waiter_id, product[0]['product_id']];
						DatabaseService.special(table_name, 'create', data);
					}
				});
			}, 100);
		}
	}]);

// This Service add new database entries, one for an given amount of resources and one for the purchase price in cash.
simulationApp.service('StoremanService', ['DatabaseService', 'TimeService', 'JsonService',
	function (DatabaseService, TimeService, JsonService) {
		this.buyResources = function (resource_type_id, amount) {
			DatabaseService.special('resource_type', 'loadById', resource_type_id);
			setTimeout(function () {
				JsonService.load('resource_type').then(function (data) {
					var purchase_price = -1 * (parseInt(data.data[0]['purchase_price']));
					DatabaseService.special('cash', 'create', purchase_price);
				});
				var durability = TimeService.createDurability(5);
				var data = [durability, amount, resource_type_id];
				DatabaseService.special('resources', 'create', data);
			}, 100);
		}
	}]);

// The Service can order, take order and generate order.
// The customer has relations with DatabaseService, JsonService and RngService.
simulationApp.service('CustomerService', ['DatabaseService', 'JsonService', 'RngService',
	function (DatabaseService, JsonService, RngService) {
		// This function create a new order for the customer which is given by parameters,
		// the product_type which ordered is generated with a RNG, based on the parameters, probability and bonus.
		this.generateOrder = function (customer_id, probability, bonus) {
			var random_product_type_id = RngService.generate(probability, bonus);
			DatabaseService.special('order', 'create', random_product_type_id);
			setTimeout(function () {
				DatabaseService.special('order', 'loadByType', random_product_type_id);
				setTimeout(function () {
					JsonService.load('order').then(function (data) {
						var order_id = data.data[0]['id'];
						data = [customer_id, order_id];
						DatabaseService.special('human_has_order', 'create', data);
					});
				}, 100);
			}, 100);
		};
		// This function delete the relation between the waiter and his product,
		// but also it set the order status to 0, which means closed. (null->open, 1->ordered, 0->closed)
		this.takeOrder = function (waiter, customer) {
			var data = [waiter['id'], waiter['product_id']];
			DatabaseService.special('human_has_product', 'delete', data);
			data = [customer['order_id'], 0];
			DatabaseService.special('order', 'update', data);
		};
		// This function set the order status to 1 and create a relation between waiter and order.
		this.getOrder = function (waiter, customer) {
			var data = [customer['order_id'], 1];
			DatabaseService.special('order', 'update', data);
			data = [waiter['id'], customer['order_id']];
			DatabaseService.special('human_has_order', 'create', data);
		};
		// Function generate a random customer, save him into db and spawn him at the grid spawn point.
		this.generateCustomer = function () {
			var names = [
				['GandalfBengston', 'Christoph', 'Martin'],
				['Katarina', 'Sara', 'Melissa']
			];
			var gender = ['male', 'female'];
			var human_type_id = 2;
			var random_gender = gender[RngService.generate(gender.length, 0)];
			var random_name = 'Undefined';
			if (random_gender == 'male') {
				random_name = names[0][RngService.generate(names[0].length, 0)];
			}
			else {
				random_name = names[1][RngService.generate(names[0].length, 0)];
			}
			var data = [random_name, random_gender, human_type_id];
			DatabaseService.special('human', 'create', data);
			JsonService.load('gui').then(function (data) {
				var grid = data.data;
				var spawn_point = [1, 1];
				grid[spawn_point[0]][spawn_point[1]] = 3;
				JsonService.overwrite('gui', grid);
				JsonService.load('gui_logic').then(function (data) {
					grid = data.data;
					DatabaseService.special('human', 'loadLast');
					setTimeout(function () {
						JsonService.load('human').then(function (data) {
							var human_id = data.data[0]['id'];
							grid[spawn_point[0]][spawn_point[1]] = human_id;
							JsonService.overwrite('gui_logic', grid);
						});
					}, 100);
				});
			});
		};
		// Remove the entries on the spawn point from grid
		// and remove the customer from db to.
		this.removeCustomer = function (customer_id) {
			var spawn_point = [1, 1];
			JsonService.load('gui').then(function (data) {
				var grid = data.data;
				grid[spawn_point[0]][spawn_point[1]] = 0;
				JsonService.overwrite('gui', grid);
			});
			JsonService.load('gui_logic').then(function (data) {
				var grid = data.data;
				grid[spawn_point[0]][spawn_point[1]] = 0;
				JsonService.overwrite('gui_logic', grid);
			});
			DatabaseService.special('human', 'delete', customer_id);
			DatabaseService.special('human_has_order', 'deleteByHuman', customer_id);
		}
	}])
;

// This service is supposed to be called in each round of progress,
// because it prepare parameter, check conditions and call other services,
// these services doing all the logic for the simulator except gui components.
// The PrepareService implement the CallWaiterService, StoremanService, ChefService, CustomerService, TimeServices, RngService, DatabaseService and JsonService.
simulationApp.service('PrepareService', ['DatabaseService', 'JsonService', 'CallWaiterService', 'TimeService', 'RngService', 'StoremanService', 'ChefService', 'CustomerService',
	function (DatabaseService, JsonService, CallWaiterService, TimeService, RngService, StoremanService, ChefService, CustomerService) {
		var table_name = 'human';
		var waiter;
		var human;
		// Function which load human data by the two ids which are required as parameter and call the CallWaiterService.
		// It loads the data by using the defined api and  the timeouts tell js to wait for the server.
		// function expect waiter_id and human_id
		this.execute = function (waiter_id, human_id) {
			DatabaseService.special(table_name, 'loadById', waiter_id);
			setTimeout(function () {
				JsonService.load(table_name).then(function (data) {
					waiter = data.data;
				});
				DatabaseService.special(table_name, 'loadById', human_id);
				setTimeout(function () {
					JsonService.load(table_name).then(function (data) {
						human = data.data;
					});
					setTimeout(function () {
						CallWaiterService.execute(waiter[0], human[0]);
					}, 100);
				}, 100);
			}, 100);
		};
		// Function which check what the storeman must do,
		// at first it will delete all expired resources
		// and after this it will call the storeman to buy resources, if any resource_type has under 10 pieces in stock.
		this.buyResources = function () {
			var resources;
			var amounts = [];
			var table_name = 'resources';
			var current_date = TimeService.createDate();
			DatabaseService.special(table_name, 'deleteExpired', current_date);
			setTimeout(function () {
				DatabaseService.load(table_name);
				setTimeout(function () {
					JsonService.load(table_name).then(function (data) {
						resources = data.data;
						for (var i = 0; i < resources.length; i++) {
							var resource_type_id = resources[i]['resource_type_id'];
							if (amounts[resource_type_id]) {
								amounts[resource_type_id] += parseInt(resources[i]['amount']);
							}
							else {
								amounts[resource_type_id] = parseInt(resources[i]['amount']);
							}
						}
						angular.forEach(amounts, function (amount, resource_type_id) {
							if (amount < 10) {
								var to_buy = 20 - amount;
								StoremanService.buyResources(resource_type_id, to_buy);
							}
						});
					});
				}, 100);
			}, 100);
		};
		// Function checks if the current chef has an order, if this is true, it will call the chef cook function.
		this.prepareCook = function (chef_id) {
			DatabaseService.special('human', 'loadById', chef_id);
			setTimeout(function () {
				JsonService.load(table_name).then(function (data) {
					var chef = data.data[0];
					if (chef['order_id'] !== null) {
						ChefService.cook(chef['id'], chef['order_product_type_id']);
					}
				});
			}, 100);
		};
		// Function require the current customer id and call the customer to generate an order
		// after it created a probability based on the number of product_types.
		this.prepareGenerateOrder = function (customer_id) {
			var table_name = 'product_type';
			DatabaseService.load(table_name);
			setTimeout(function () {
				JsonService.load(table_name).then(function (data) {
					var product_types = data.data;
					var probability = 0;
					angular.forEach(product_types, function (value, key) {
						probability += 1;
					});
					CustomerService.generateOrder(customer_id, probability, 1);
				});
			}, 100);
		};
		// Function has a chance of 1 percent to call the generateCustomer
		this.spawnCustomer = function (limit) {
			var current_costumers;
			JsonService.load('gui').then(function (data) {
				var gui = data.data;
				for (var out; out < gui.length; out++) {
					for (var inner; inner < gui[out].length; inner++) {
						if (gui[out][inner] == 3) {
							current_costumers++;
						}
					}
				}
				if (current_costumers <= limit) {
					var random_number = RngService.generate(100, 1);
					if (random_number == 50) {
						CustomerService.generateCustomer();
					}
				}
			});
		};
		// Function checks, if someone stand on the spawn point, if it's a customer,
		// the CustomerService is called with the customer_id.
		this.removeCustomer = function () {
			var spawn_point = [1, 1];
			JsonService.load('gui_logic').then(function (data) {
				var gui_logic = data.data[spawn_point[0]][spawn_point[1]];
				if (gui_logic != 0) {
					DatabaseService.special('human', 'loadById', gui_logic);
					setTimeout(function () {
						JsonService.load('human').then(function (data) {
							var human = data.data[0];
							if (human['type'] == 'Customer' && human['ordered'] == 0 && human['ordered'] != null) {
								CustomerService.removeCustomer(human['id']);
							}
						});
					}, 100);
				}
			});
		};
		// Todo:
		this.loadData = function () {
			var data_array = [];

			return data_array;
		}
	}])
;

// The service call one function from the WaiterService after checking which one can be called.
simulationApp.service('CallWaiterService', ['WaiterService',
	function (WaiterService) {
		this.execute = function (waiter, human) {
			// If the human is a chef, it will try to give him a order or to pick up a product
			// by checking if the waiter has an order or already has a product
			if (human['type'] == 'Chef') {
				if (waiter['order_id']) {
					//WaiterService.placeOrder(waiter['id'], human['id'], waiter['order_id']);
				}
				if (!waiter['product_id']) {
					//WaiterService.pickProduct(waiter['id'], human['id']);
				}
			}
			// If the human is a customer, it will try to take a order or to place the product
			// by checking if the waiter already has an order or has a product
			else if (human['type'] == 'Customer') {
				if (human['ordered'] == null && human['ordered'] !== 0) {
					if (!waiter['order_id']) {
						//WaiterService.pickOrder(waiter, human);
					}
				}
				else if (human['ordered'] == 1) {
					if (waiter['product_id']) {
						//WaiterService.placeProduct(waiter, human);
					}
				}
			}
		}
	}]);

// This service returned an multidimensional array with data which should be displayed.
simulationApp.service('LoaderService', [ 'DatabaseService', 'JsonService',
	function (DatabaseService, JsonService) {
		var data = [];
		DatabaseService.load('cash');
		DatabaseService.load('resources');
		setTimeout(function () {
			JsonService.load('cash').then(function (data) {
				data['cash'] = data.data;
			});
			JsonService.load('resources').then(function (data) {
				data['resources'] = data.data;
			});
			// Additional data will added if wanted
			setTimeout(function () {
				return data;
			}, 50);
		}, 100)
	}
]);

// This Service send post requests with data to the server, exact to databaseHandler.php.
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
		};
		this.special = function (table_name, type, data) {
			var enc_data = JSON.stringify(data);
			$(document).ready(function () {
				$.post('php/databaseHandler.php',
					{
						table_name: table_name,
						data: enc_data,
						type: type
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};
	}
]);

// This Service send post requests with data to the server, exact to jsonHandler.php,
// or load data from given json file.
simulationApp.service('JsonService', [ '$http',
	function ($http) {
		this.load = function (file) {
			file = 'json/' + file + '.json';
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
		this.overwrite = function (file, data) {
			$(document).ready(function () {
				$.post('php/jsonHandler.php',
					{
						data: data,
						file: file
					},
					function (data, status) {
						//alert('Data: ' + data);
					});
			});
		};
	}
]);

// This function is irrelevant for the simulator but without, the drag and drop would not work,
// because the directives need this id, which is returned in this function.
simulationApp.factory('uuid', function () {
	var svc = {
		new: function () {
			function _p8(s) {
				var p = (Math.random().toString(16) + "000000000").substr(2, 8);
				return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
			}

			return _p8() + _p8(true) + _p8(true) + _p8();
		},

		empty: function () {
			return '00000000-0000-0000-0000-000000000000';
		}
	};

	return svc;
});

// This Service is the core of canvas initiate the context and start all other components.
simulationApp.service('CanvasService', ['VisualizationService', 'SocketGridService', 'HandleGridService', 'JsonService',
	function (VisualizationService, SocketGridService, HandleGridService, JsonService) {
		this.draw = function () {
			var canvas = document.getElementById("canvas");
			if (canvas.getContext) {
				var engine = canvas.getContext("2d");
				VisualizationService.setEngine(engine);
			}

			JsonService.load('gui').then(function (data) {
				var grid = data.data;
				SocketGridService.set_array(grid);
				HandleGridService.canvas();
			});
		}
	}]);
// This Service is holding the canvas_grid and the specific getter and setter.
simulationApp.service('SocketGridService', [
	function () {
		var canvas_grid = [];

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
]);
// This service start the visualisation for every object in the max x/y.
simulationApp.service('HandleGridService', ['SocketGridService', 'VisualizationService',
	function (SocketGridService, VisualizationService) {
		this.canvas = function () {
			var max_x = SocketGridService.get_grid_width();
			var max_y = SocketGridService.get_grid_height();
			var canvas_array = [];
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
// This service controls which images match which id, it use the 2d engine and draw the final canvas gui.
simulationApp.service('VisualizationService', [
	function () {
		var current_engine;
		this.setEngine = function (engine) {
			current_engine = engine;
		};
		this.draw_images = function (imageNumber, xPosition, yPosition) {
			//reference to the images and make an array of references to call them
			var pictures = [];

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
// This Service is called by the RoundController it expect the human object and the current position.
// It load the gui and the gui_logik array, if the human has no path, several querys check conditions and decide the correct path,
// with this path starts the first_turn from pathfinding. If the human has a path, it just start the pathfinding make_turn.
simulationApp.service('DefinePathsService', ['DatabaseService', 'JsonService', 'RngService', 'PlaceAroundService', 'PathfindingService', function (DatabaseService, JsonService, RngService, PlaceAroundService, PathfindingService) {
	this.execute = function (human, current_out, current_inner) {
		var id = human['id'];
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
		if (human['path'] == null) {
			var temp_array = [current_out, current_inner];
			setTimeout(function (human) {
				return function () {
					var positions = [];
					var position;
					if (human['type'] == 'Customer') {
						if (human['order_id'] == null) {
							positions = PlaceAroundService.forLoop(6, gui);
							position = PlaceAroundService.execute(positions);
						} else if (['ordered'] == 0 && ['ordered'] !== null) {
							// Todo: a dynamic spawnpoint
							position = [1, 1];
						}
					}
					else if (human['type'] == 'Waiter') {
						if (human['product_id'] == null && human['order_id'] == null) {
							// Todo: abfragen, ob die kunden eine offene Bestellung haben
							positions = PlaceAroundService.forLoop(3, gui);
							position = PlaceAroundService.execute(positions);
							if (!position[1]) {
								// wenn position = empty
								positions = PlaceAroundService.forLoop(4, gui);
								position = PlaceAroundService.execute(positions);
							}
						} else if (human['product_id'] != null) {
							// Todo: abfragen, ob die order der Kunden mit dem product übereinstimmt
							positions = PlaceAroundService.forLoop(3, gui);
							position = PlaceAroundService.execute(positions);
						} else if (human['order_id'] != null) {
							positions = PlaceAroundService.forLoop(4, gui);
							position = PlaceAroundService.execute(positions);
						}
					}
					if (angular.isArray(position)){
					var target = [position[0], position[1]];
					PathfindingService.firstTurn(target, temp_array, id);
					}
				}
			}(human), 50);
		}
		else {
			setTimeout(function (human) {
				return function () {
					PathfindingService.makeTurn(human, gui, gui_logic);
				}
			}(human), 100);
		}
	}
}
]);
// This service duty is to find and decide which positions must be used.
simulationApp.service('PlaceAroundService', ['RngService', function (RngService) {
	// Choose a random position where to go and retrun this position.
	this.execute = function (positions) {
		var random_position = RngService.generate(positions.length, 0);
		var position = positions[random_position];
		// not needed in the current version
		/*
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
		 if (position[0] >= 1 && position[1] >= 1 && position[0] <= 18 && position[1] <= 18) {
		 return position;
		 }
		 this.execute(positions);
		 */
		return position;
	};
	// Search in the array after the given number and return all matches
	this.forLoop = function (id, gui) {
		var positions = [];
		var out = 0;
		for (out; out < gui.length; out++) {
			var inner = 0;
			for (inner; inner < gui[out].length; inner++) {
				if (gui[out][inner] == id) {
					positions.push([out, inner]);
				}
			}
		}
		return positions;
	};
}]);
// The pathfinding works with the path, gui and gui_logic array, the first turn just creates the path array (with
// 0 empty, 1 already walked, 2 current and 3 target) and save it into the Database.
// The makeTurn function provides the real pathfinding, it calculate the difference between the target and the current
// position, with this difference and the given arrays it can decide which position is next.
simulationApp.service('PathfindingService', ['JsonService', 'DatabaseService', function (JsonService, DatabaseService) {
	// Fill the empty array with the target and the current position, then save it into the database.
	this.firstTurn = function (target, current, id) {
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
		if (target[0] >= 1 && target[1] >= 1 && target[0] <= 18 && target[1] <= 18) {
			empty_array[target[0]][target[1]] = 3;
			empty_array[current[0]][current[1]] = 2;
			var data = [id, empty_array];
			DatabaseService.special('human', 'update_path', data);
		}
	};
	// Search the target and the current position in the path array, calculate the difference
	// and decide if x/y must be decrease or increase or nothing, the difference must be bigger or smaller than 1,
	// otherwise the path will be deleted because it's already in range.
	// If it's true it will go throw several queries which check if the position is walkable,
	// if possible it will save this new grid arrays.
	this.makeTurn = function (human, gui, gui_logic) {
		var path = angular.fromJson(human['path']);
		var id = human['id'];
		var current;
		var target;
		for (var i = 0; i < path.length; i++) {
			if (path[i].indexOf(2) != -1) {
				current = [i, path[i].indexOf(2)];
			}
			if (path[i].indexOf(3) != -1) {
				target = [i, path[i].indexOf(3)];
			}
		}
		var difference = [(target[0] - current[0]), (target[1] - current[1])];
		var x;
		var y;
		if (difference[0] > 1 || difference[1] > 1 || difference[0] < -1 || difference[1] < -1) {
			if (difference[0] > 0) {
				x = 1;
			}
			else if (difference[0] < 0) {
				x = -1;
			}
			else {
				x = 0;
			}
			if (difference[1] > 0) {
				y = 1;
			}
			else if (difference[1] < 0) {
				y = -1;
			}
			else {
				y = 0;
			}
			if (gui[current[0] + x][current[1] + y] == 0 && path[current[0] + x][current[1] + y] == 0) {
				gui[current[0] + x][current[1] + y] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0] + x][current[1] + y] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0] + x][current[1] + y] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0] + x][current[1]] == 0 && path[current[0] + x][current[1]] == 0) {
				gui[current[0] + x][current[1]] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0] + x][current[1]] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0] + x][current[1]] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0]][current[1] + y] == 0 && path[current[0]][current[1] + y] == 0) {
				gui[current[0]][current[1] + y] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0]][current[1] + y] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0]][current[1] + y] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0]][current[1] - y] == 0 && path[current[0]][current[1] - y] == 0) {
				gui[current[0]][current[1] - y] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0]][current[1] - y] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0]][current[1] - y] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0] - x][current[1]] == 0 && path[current[0] - x][current[1]] == 0) {
				gui[current[0] - x][current[1]] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0] - x][current[1]] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0] - x][current[1]] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0] - x][current[1] - y] == 0 && path[current[0] - x][current[1] - y] == 0) {
				gui[current[0] - x][current[1] - y] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0] - x][current[1] - y] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0] - x][current[1] - y] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
			else if (gui[current[0] + 1][current[1]] == 0 && path[current[0] + 1][current[1]] == 0) {
				gui[current[0] - 1][current[1]] = gui[current[0]][current[1]];
				gui[current[0]][current[1]] = 0;
				gui_logic[current[0] - 1][current[1]] = gui_logic[current[0]][current[1]];
				gui_logic[current[0]][current[1]] = 0;
				path[current[0] - 1][current[1]] = path[current[0]][current[1]];
				path[current[0]][current[1]] = 1;
				this.saveArray(gui, gui_logic, path, id);
			}
		} else {
		this.deletePath(id);
		}
	};
	// Update the value of the 3 grid Arrays (gui, gui_logik, path)
	this.saveArray = function (gui, gui_logic, path, id) {
		JsonService.overwrite('gui', gui);
		JsonService.overwrite('gui_logic', gui_logic);
		var data = [id, path];
		DatabaseService.special('human', 'update_path', data);
	};
	// Delete the path from human which id is given.
	this.deletePath = function (id) {
		var data = id;
		DatabaseService.special('human', 'delete_path', data);
	};
}]);
