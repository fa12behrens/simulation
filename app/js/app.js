'use strict';


// Declare app level module which depends on filters, and services.
var simulationApp = angular.module('simulationApp', [
	'ngRoute',
	'simulationApp.filters',
	'simulationApp.services',
	'simulationApp.directives',
	'simulationApp.controllers']);

// Route partials which are shown with ng-view, also adds a controller to this partial.
simulationApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html'});
	$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html'});
	$routeProvider.when('/view10', {templateUrl: 'partials/partial10.html', controller: 'RoundController'});
	$routeProvider.otherwise({redirectTo: '/view1'});
}]);