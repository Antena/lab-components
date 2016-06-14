'use strict';

var _ = require('underscore');
var lodash = require('lodash');
var fhirBundle = require('./full-study-bundle.json');
var anotherFhirBundle = require('./another-bundle.json');

// @ngInject
module.exports = function($scope, LabObservationService, FhirBundleService) {

	var resolvedBundle = FhirBundleService.resolveOrderAndReportReferences(fhirBundle);
	var anotherResolvedBundle = FhirBundleService.resolveOrderAndReportReferences(anotherFhirBundle);

	var observations = _.map(resolvedBundle.observations, function(observation) {
		var result = lodash.cloneDeep(observation);

		result.actions = [
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

		result.headerActions = [
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
		return result;
	});

	var historyJson = require('./observation-history.json');

	var curatedHistory = [];
	_.each(historyJson, function(samples) {
		if(_.isArray(samples[0])) {
			curatedHistory = _.union(curatedHistory, samples);

		} else {
			curatedHistory.push(samples);
		}
	});

	$scope.histories = _.map(curatedHistory, function(history) {
		var description = "";
		var obsType = history[0].code.coding[0].display;
		if(obsType === "Recuento De Plaquetas") {
			description = "Big safe zone, with values inside";
		} else if(obsType === "Hematocrito") {
			description = "Different safe zones for each point";
		} if(obsType === "Recuento De Globulos Rojos") {
			description = "Big time difference between points";
		} if(obsType === "GLUCEMIA") {
			description = "Mix of points inside and outisde of safe zone, with different safe zones";
		} if(obsType === "IGA - INMUNOGLOBULINA A") {
			description = "Big safe zone, with values outside";
		} if(obsType === "Sodio") {
			description = "Small safe zone";
		} if(obsType === "UREMIA") {
			description = "Big safe zone, with different safe zones";
		} if(obsType === "Fosfatasa Alcalina") {
			description = "Small container";
		}


		return {
			description: description,
			data: history
		};
	});

	$scope.demo = {
		observations: observations,
		rawObservations: resolvedBundle.observations,
		order: resolvedBundle.diagnosticOrder,
		status: resolvedBundle.diagnosticReport.status,
		reportDate: resolvedBundle.diagnosticReport.issued,
		patient: resolvedBundle.diagnosticReport.subject,
		organization: resolvedBundle.diagnosticReport.performer,
		dateFormat: "DD-MM-YYYY",
		observationHistoryService: LabObservationService.getHistory
	};

	$scope.demo2 = {
		observations: observations,
		rawObservations: anotherResolvedBundle.observations,
		order: anotherResolvedBundle.diagnosticOrder,
		status: anotherResolvedBundle.diagnosticReport.status,
		reportDate: anotherResolvedBundle.diagnosticReport.issued,
		patient: anotherResolvedBundle.diagnosticReport.subject,
		organization: anotherResolvedBundle.diagnosticReport.performer,
		dateFormat: "DD-MM-YYYY",
		observationHistoryService: LabObservationService.getHistory
	};

	$scope.cards = [
		{
			description: "Value inside range",
			data: {
				value: 100,
				unit: "ml",
				range: {
					low: 0,
					high: 500
				}
			}
		},
		{
			description: "Value outside range",
			data: {
				value: 4.3,
				unit: "ml",
				range: {
					low: 12,
					high: 25
				}
			}
		}
	];

	$scope.graphs = [
		{
			description: "Value inside range",
			data: {
				value: 100,
				unit: "ml",
				range: {
					low: 0,
					high: 500
				}
			}
		},
		{
			description: "Value inside (smaller) range",
			data: {
				value: 10,
				unit: "ml",
				range: {
					low: 7,
					high: 26
				}
			}
		},
		{
			description: "Value inside range - domain [0,?]",
			data: {
				value: 100,
				unit: "ml",
				range: {
					low: 0,
					high: 500
				},
				domain: {
					low: 0
				}
			}
		},
		{
			description: "Value inside range  - domain [?,1000]",
			data: {
				value: 100,
				unit: "ml",
				range: {
					low: 0,
					high: 500
				},
				domain: {
					high: 1000
				}
			}
		},
		{
			description: "Value inside range - domain [0,1000]",
			data: {
				value: 100,
				unit: "ml",
				range: {
					low: 0,
					high: 500
				},
				domain: {
					low: 0,
					high: 1000
				}
			}
		},
		{
			description: "Value outside range",
			data: {
				value: 4.3,
				unit: "ml",
				range: {
					low: 12,
					high: 25
				}
			}
		},
		{
			description: "Long string for unit, with very low value outside range (far left)",
			data: {
				value: 0.3,
				unit: "µg/dl",
				range: {
					low: 12,
					high: 25
				}
			}
		},
		{
			description: "Long string for unit, with very high value outside range (far right)",
			data: {
				value: 100,
				unit: "µg/dl",
				range: {
					low: 12,
					high: 25
				}
			}
		},
		{
			description: "Small container",
			data: {
				value: 100,
				unit: "µg/dl",
				range: {
					low: 12,
					high: 25
				}
			}
		}
	];
};
