'use strict';

var fhirBundle = require('./full-study-bundle.json');

// @ngInject
module.exports = function($scope, LabObservationService, FhirBundleService) {

	var resolvedBundle = FhirBundleService.resolveOrderAndReportReferences(fhirBundle);

	var observations = _.map(resolvedBundle.observations, function(observation) {
		observation.actions = [
			{
				labelOn: "Ocultar Historia",
				labelOff: "Mostrar Historia",
				isToggle: true,
				click: function(observation) {
					if (observation.history) {
						observation.showHistory = !observation.showHistory;
					} else {
						LabObservationService.getHistory(observation.id, function(data) {
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
		order: resolvedBundle.diagnosticOrder,
		status: resolvedBundle.diagnosticReport.status,
		reportDate: resolvedBundle.diagnosticReport.issued,
		patient: resolvedBundle.diagnosticReport.subject,
		organization: resolvedBundle.diagnosticReport.performer,
		dateFormat: "DD-MM-YYYY",
		observationHistoryService: LabObservationService.getHistory
	};

	$scope.cards = [
		{
			value: 100,
			unit: "ml",
			range: {
				low: 0,
				high: 500
			}
		},
		{
			value: 4.3,
			unit: "ml",
			range: {
				low: 12,
				high: 25
			}
		}
	];

	$scope.graphs = [
		{
			value: 100,
			unit: "ml",
			range: {
				low: 0,
				high: 500
			}
		},
		{
			value: 4.3,
			unit: "ml",
			range: {
				low: 12,
				high: 25
			}
		},
		{
			value: 0.3,
			unit: "µg/dl",
			range: {
				low: 12,
				high: 25
			}
		},
		{
			value: 100,
			unit: "µg/dl",
			range: {
				low: 12,
				high: 25
			}
		},
		{
			value: 100,
			unit: "µg/dl",
			range: {
				low: 12,
				high: 25
			}
		}
	];
};
