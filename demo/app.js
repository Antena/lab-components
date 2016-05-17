'use strict';

var angular = require('angular');
var _ = require('underscore');

var observationHistory = require('./observation-history.json');

var fhirBundle = require('./full-study-bundle.json');
var fhirBundleResources = _.pluck(fhirBundle.entry, 'resource');

var app = angular.module('app', [
	require('../src/index.js')
]);

app.service('LabObservationService', function() {
	return {
		getHistory: function(displayCode, cb) {
			cb(observationHistory.results);
		}
	};
});

app.controller('DemoController', ['$scope', 'LabObservationService', function($scope, LabObservationService) {

	var obs = _.where(fhirBundleResources, { resourceType: "Observation"});
	var report = _.findWhere(fhirBundleResources, { resourceType: "DiagnosticOrder"});

	var observations = _.map(obs, function(observation) {
		observation.actions = [
			{
				labelOn: "Ocultar Historia",
				labelOff: "Mostrar Historia",
				isToggle: true,
				click: function(observation) {
					if (observation.history) {
						observation.showHistory = !observation.showHistory;
					} else {
						LabObservationService.getHistory(observation, function(data) {
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
				icon: "icon",
				activeAndHoveredLabel: "Dejar de monitorear",
				activeLabel: "Valor monitoreado",
				activeIcon: "icon-check",
				inactiveLabel: "Monitorear este valor",
				inactiveIcon: "icon-more",
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
		observations: observations,
		report: report,
		observationHistoryService: LabObservationService.getHistory
	};
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

