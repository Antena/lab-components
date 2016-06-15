'use strict';

var _ = require('underscore');
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

	$scope.ranges = [
		{
			"value": 5,
			"unit": "mg/dl",
			ranges: [
				{
					"high": 15,
					"label": "Low",
					"class": "range-danger"
				},
				{
					"low": 15,
					"high": 36,
					"label": "Normal",
					"class": "range-great"
				},
				{
					"low": 36,
					"label": "High",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 75,
			"unit": "mg/dl",
			ranges: [
				{
					"high": 130,
					"label": "Óptimo",
					"class": "range-great"
				},
				{
					"low": 130,
					"high": 190,
					"label": "Límite",
					"class": "range-so-so"
				},
				{
					"low": 190,
					"label": "Riesgo alto",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 85,
			"unit": "mg/dl",
			ranges: [
				{
					"high": 200,
					"label": "Deseable",
					"class": "range-great"
				},
				{
					"low": 200,
					"high": 239,
					"label": "Límite",
					"class": "range-so-so"
				},
				{
					"low": 239,
					"label": "Elevado",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 8.5,
			ranges: [
				{
					"high": 0,
					"label": "Low",
					"class": "range-danger"
				},
				{
					"low": 0,
					"high": 4.5,
					"label": "Normal",
					"class": "range-great"
				},
				{
					"low": 4.5,
					"label": "High",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 0.05,
			"unit": "mg/dl",
			ranges: [
				{
					"high": 0.20,
					"label": "Low",
					"class": "range-danger"
				},
				{
					"low": 0.21,
					"high": 0.60,
					"label": "Near Optimal",
					"class": "range-good"
				},
				{
					"low": 0.61,
					"high": 0.85,
					"label": "Optimal",
					"class": "range-great"
				},
				{
					"low": 0.85,
					"label": "High",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 69,
			"unit": "mg/dl",
			options: {
				arrowWidth: 10
			},
			ranges: [
				{
					"high": 100,
					"label": "Óptimo",
					"class": "range-great"
				},
				{
					"low": 100,
					"high": 129,
					"label": "Cercano al óptimo",
					"class": "range-good"
				},
				{
					"low": 130,
					"high": 159,
					"label": "Límite",
					"class": "range-so-so"
				},
				{
					"low": 160,
					"high": 190,
					"label": "Elevado",
					"class": "range-bad"
				},
				{
					"low": 190,
					"label": "Muy elevado",
					"class": "range-danger"
				}
			]
		},
		{
			"value": 72,
			"unit": "mg/dl",
			ranges: [
				{
					"high": 50,
					"label": "Low",
					"class": "range-danger"
				},
				{
					"low": 50,
					"label": "Normal",
					"class": "range-great"
				}
			]
		}
	]
};
