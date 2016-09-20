'use strict';

// @ngInject
module.exports = function () {

	return {
		scope: {
			observationList: '=',
			config: '=?'
		},
		templateUrl: require('./lab-observation-history-graph.html'),
		restrict: 'AE',
		controller: 'LabObservationHistoryGraphController'
	};
};
