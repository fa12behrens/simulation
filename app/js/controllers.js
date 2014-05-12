'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

simulationApp.controller('CashController', ['$scope', '$http', 'CashService', function ($scope, $http, CashService) {

	$scope.setCash = function () {
		var data = $scope.data;
		CashService.setCash(data);
		$scope.clicked = data + '€ wurden gebucht!';

		CashService.getCash().then(function (data) {
			var cashlist = data.data.cashlist;
			$scope.cashlist = cashlist;
			$scope.calculated = CashService.calculate(cashlist);
		});
	};
}]);
simulationApp.controller('RngController', ['$scope', 'RngService', function ($scope, RngService) {
	$scope.getRng = function () {
		var probability = $scope.probability;
		var bonus = $scope.bonus;
		$scope.random_number = RngService.generate(probability, bonus);
	}
}]);
simulationApp.controller('TimeController', ['$scope', 'TimeService', function ($scope, TimeService) {
	var date = TimeService.createDate();
	var time = TimeService.createTime();
	$scope.date = date;
	$scope.time = time;
	$scope.foo = "droggelbecher";
}]);

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

simulationApp.controller('TestDbController', ['$scope', 'DatabaseService', 'JsonService', function ($scope, DatabaseService, JsonService) {
	DatabaseService.save("cash", "666");
	DatabaseService.load("cash");
	JsonService.load("cash").then(function (data) {
		$scope.data = data.data;
	});
}]);

// This controller starts the Simulator each round.
simulationApp.controller('RoundController', ['$scope', 'PrepareService', 'DatabaseService', 'JsonService',
	function ($scope, PrepareService, DatabaseService, JsonService) {
		$scope.start = function () {
			JsonService.load(gui_logic).then(function (data) {
				var logic_array = data.data;
				for (var out = 0; out < logic_array.length; out++) {
					for (var inner = 0; inner < logic_array[out].length; inner++) {
						if (logic_array[out][inner] != 0) {
							var temp_id = logic_array[out][inner];
							DatabaseService.special('human', 'loadById', temp_id);
							// Todo: Lade human by id nur wenn waiter wird weiter gemacht
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
												// Todo: Lade Human, wenn chef oder customer
												if ('' == 'Chef' || '' == 'Customer') {
													//PrepareService.execute(waiter_id, human_id);
												}
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
						}
					}
				}
			});
			//PrepareService.spawnCustomer();
			//PrepareService.buyResources();
			// Todo: load statistics
		}
	}]);

simulationApp.controller('MyCtrl2', [function () {
}]);
