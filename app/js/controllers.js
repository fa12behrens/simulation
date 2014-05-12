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

simulationApp.controller('HumanController', ['$scope', 'HumanService', function ($scope, HumanService) {
	//HumanService.createHuman("Caitlyn", "female", "1");
	//HumanService.getHumans();
	HumanService.getFromHumanType(1);
	//HumanService.killHuman(11);
}]);

simulationApp.controller('WaiterController', ['$scope', 'HumanService', 'WaiterService', function ($scope, HumanService, WaiterService) {
	$scope.pick = function () {
		WaiterService.pickOrder($scope.order);
		//WaiterService.placeOrder();
		WaiterService.pickProduct($scope.product);
		//WaiterService.placeProduct();
		$scope.holding_order = WaiterService.getOrder();
		$scope.holding_product = WaiterService.getProduct();
	};
	$scope.place = function () {
		//WaiterService.pickOrder($scope.order);
		WaiterService.placeOrder();
		//WaiterService.pickProduct($scope.product);
		WaiterService.placeProduct();
		$scope.holding_order = WaiterService.getOrder();
		$scope.holding_product = WaiterService.getProduct();
	};
	//HumanService.createHuman("Caitlyn", "female", "1");
	//HumanService.getHumans();
	//HumanService.getFromHumanType(1);
	//HumanService.killHuman(11);
}]);

// This controller starts the Simulator each round, need human_ids.
simulationApp.controller('RoundController', ['$scope', 'PrepareService', function ($scope, PrepareService) {
	$scope.start = function () {
		//PrepareService.execute(1,2);
		//PrepareService.buyResources();
		//PrepareService.prepareCook(3);
	}
}]);

simulationApp.controller('MyCtrl2', [function () {
}]);
