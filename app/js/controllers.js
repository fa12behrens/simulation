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

simulationApp.controller('HumanController', [function () {

}]);

simulationApp.controller('MyCtrl2', [function () {
}]);
