'use strict';


// Declare app level module which depends on filters, and services
var simulationApp = angular.module('simulationApp', [
	'ngRoute',
	'simulationApp.filters',
	'simulationApp.services',
	'simulationApp.directives',
	'simulationApp.controllers']);

simulationApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl2'});
	$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
	$routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl2'});
	$routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'MyCtrl2'});
	$routeProvider.when('/view5', {templateUrl: 'partials/partial5.html', controller: 'RngController'});
	$routeProvider.when('/view6', {templateUrl: 'partials/partial6.html', controller: 'TimeController'});
	$routeProvider.when('/view7', {templateUrl: 'partials/partial7.html', controller: 'CanvasController'});
	$routeProvider.when('/view8', {templateUrl: 'partials/partial8.html', controller: 'TestDbController'});
	$routeProvider.when('/view9', {templateUrl: 'partials/partial9.html', controller: 'HumanController'});
	$routeProvider.when('/view10', {templateUrl: 'partials/partial10.html', controller: 'WaiterController'});
	$routeProvider.otherwise({redirectTo: '/view1'});
}]);