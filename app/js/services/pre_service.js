/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

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
		this.spawnCustomer = function (limit) {
			var current_costumers;
			JsonService.load('gui').then(function (data) {
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