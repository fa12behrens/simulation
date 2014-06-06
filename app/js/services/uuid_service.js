/**
 * Created by T.Behrens on 06.06.14.
 */

'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var simulationApp = angular.module('simulationApp.services', []);


// This function is irrelevant for the simulator but without, the drag and drop would not work,
// because the directives need this id, which is returned in this function.
simulationApp.factory('uuid', function () {
	var svc = {
		new: function () {
			function _p8(s) {
				var p = (Math.random().toString(16) + "000000000").substr(2, 8);
				return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
			}

			return _p8() + _p8(true) + _p8(true) + _p8();
		},

		empty: function () {
			return '00000000-0000-0000-0000-000000000000';
		}
	};

	return svc;
});