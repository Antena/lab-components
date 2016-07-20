'use strict';

require("./_lab-observation-sparkline.scss");

// @ngInject
module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			observation: '='
		},
		templateUrl: require('./lab-observation-sparkline.html'),
		bindToController: true,
		controllerAs: 'vm',
		controller: 'LabObservationSparklineController'
	};
};
