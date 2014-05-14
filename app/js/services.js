'use strict';

/* Services */

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
			DatabaseService.loadById(table_name, waiter_id);
			setTimeout(function () {
				JsonService.load(table_name).then(function (data) {
					waiter = data.data;
				});
				DatabaseService.loadById(table_name, human_id);
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
		this.spawnCustomer = function () {
			var random_number = RngService.generate(100, 1);
			if (random_number == 50) {
				CustomerService.generateCustomer();
			}
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

simulationApp.factory('uuid', function() {
	var svc = {
		new: function() {
			function _p8(s) {
				var p = (Math.random().toString(16)+"000000000").substr(2,8);
				return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
			}
			return _p8() + _p8(true) + _p8(true) + _p8();
		},

		empty: function() {
			return '00000000-0000-0000-0000-000000000000';
		}
	};

	return svc;
});