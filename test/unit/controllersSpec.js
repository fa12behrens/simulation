'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
	beforeEach(module('simulationApp.controllers'));


	it('should ....', inject(function ($controller) {
		//spec body
		var simulationCash = $controller('simulationCash');
		expect(simulationCash).toBeDefined();
	}));

	it('should ....', inject(function ($controller) {
		//spec body
		var myCtrl2 = $controller('MyCtrl2');
		expect(myCtrl2).toBeDefined();
	}));
});
