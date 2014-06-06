/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

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