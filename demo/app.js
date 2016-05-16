'use strict';

var angular = require('angular');
var _ = require('underscore');

var demoObservations = require('./observations.json').observations;
var demoGroupedObservations = require('./grouped-observations.json');
var observationHistory = require('./observation-history.json');

var app = angular.module('app', [
	require('../src/index.js')
]);

app.service('LabObservationService', function() {
	return {
		getHistory: function(displayCode, cb) {
			cb(null, observationHistory.results);
		}
	};
});

app.controller('DemoController', ['$scope', 'LabObservationService', function($scope, LabObservationService) {
	_.each(demoObservations, function (observation) {
		observation.actions = [
			{
				labelOn: "Ocultar Historia",
				labelOff: "Mostrar Historia",
				isToggle: true,
				click: function (observation) {
					if (observation.history) {
						observation.showHistory = !observation.showHistory;
					} else {
						LabObservationService.getHistory(observation, function (data) {
							observation.showHistory = !observation.showHistory;
							observation.history = data;
						});
					}
				},
				check: function(observation) {
					return !!observation.valueQuantity;
				}
			}
		];

		observation.headerActions = [
			{
				activeAndHoveredLabel: "Dejar de monitorear",
				activeLabel: "Valor monitoreado",
				inactiveLabel: "Monitorear este valor",
				click: function(observation) {
					observation.monitored = !observation.monitored;
				},
				check: function(observation) {
					return !!observation.valueQuantity;
				},
				isActive: function(observation) {
					return !!observation.monitored;
				},
				showAsHovered: function(observation) {
					return false;
				}
			}
		];
		return observation;
	});

	$scope.demo = {
		observations: demoObservations,
		groupObservationByMID: function() {
			return demoGroupedObservations;
		},
		observationHistoryService: LabObservationService.getHistory
	};
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

