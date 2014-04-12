'use strict';

/* Controllers */

var simulationApp = angular.module('simulationApp.controllers', []);

simulationApp.controller('CashController', ['$scope', '$http', 'CashService', function ($scope, $http, CashService) {

	$scope.set = function () {
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
simulationApp.controller('MyCtrl2', [function () {
}]);
