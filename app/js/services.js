'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);

simulationApp.value('version', '0.1');

simulationApp.service('CashService', ['$http',
	function ($http) {

		this.getCash = function () {
			return $http.get('json/cash.json').success(function (data) {
				return  data;
			});
		};

		this.setCash = function (data) {
			$(document).ready(function () {
				$.post('php/jsonHandler.php',
					{
						data: data,
						list: "cashlist"
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
