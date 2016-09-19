'use strict';

// @ngInject
module.exports = function () {

	return {
		scope: {
			observationList: '=',
			config: '=?'
		},
		templateUrl: require('./observation-history-graph.html'),
		restrict: 'AE',
		controller: 'ObservationHistoryGraphController'
	};
};
