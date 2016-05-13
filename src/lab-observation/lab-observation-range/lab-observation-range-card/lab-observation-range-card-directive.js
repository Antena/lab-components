'use strict';

// @ngInject
module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			observation: '='
		},
		templateUrl: require('./lab-observation-range-card.html'),
		controller: 'LabObservationRangeController'
	};
};
