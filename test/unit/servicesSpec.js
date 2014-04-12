'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('simulationApp.services'));

	it('should ....', inject(function($service){
		var simulationGetCash = service('simulationGetCash');
		expect(simulationGetCash).toBeDefined();
	}));

	it('should ....', inject(function($service){
		var simulationSetCash = service('simulationSetCash');
		expect(simulationSetCash).toBeDefined();
	}));

  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
