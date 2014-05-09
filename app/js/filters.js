'use strict';

/* Filters */
// Nothing change here, at the moment.

var simulationApp = angular.module('simulationApp.filters', []);

simulationApp.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);
