'use strict';

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '='
		},
		templateUrl: require('./lab-observation-range-graph.html'),
		controller: 'LabObservationRangeController'
	};
};
