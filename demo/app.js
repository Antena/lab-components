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

function getReferencedId(reference) {
	var lastSlash = _.lastIndexOf(reference, '/');
	return lastSlash > -1 ? reference.substring(lastSlash + 1, reference.length) : null;
}

app.controller('DemoController', ['$scope', 'LabObservationService', function($scope, LabObservationService) {

	var obs = _.where(fhirBundleResources, { resourceType: "Observation"});
	var order = _.findWhere(fhirBundleResources, { resourceType: "DiagnosticOrder"});
	var report = _.findWhere(fhirBundleResources, { resourceType: "DiagnosticReport"});
	var patient = _.findWhere(fhirBundleResources, { resourceType: "Patient", id: getReferencedId(report.subject.reference)});
	var organization = _.findWhere(fhirBundleResources, { resourceType: "Organization", id: getReferencedId(report.performer.reference)});

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
		order: order,
		status: report.status,
		reportDate: report.issued,
		dateFormat: "DD-MM-YYYY",
		patient: patient,
		organization: organization,
		observationHistoryService: LabObservationService.getHistory
	};
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

