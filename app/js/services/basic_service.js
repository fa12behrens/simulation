/**
 * Created by T.Behrens on 06.06.14.
 */

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
