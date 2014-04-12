'use strict';


// Declare app level module which depends on filters, and services
var simulationApp = angular.module('simulationApp', [
	'ngRoute',
	'simulationApp.filters',
	'simulationApp.services',
	'simulationApp.directives',
	'simulationApp.controllers']);

simulationApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);