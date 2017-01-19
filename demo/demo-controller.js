'use strict';

var _ = require('underscore');
var lodash = require('lodash');

// var fhirBundle = require('./grouped-bundle.json');
var fhirBundle = require('./with-notes.json');
var historyBundle = require('./with-history.json');

var anotherFhirBundle = require('./another-bundle.json');
var multirangeObs = require('./multirange-obsevation.json');

// @ngInject
module.exports = function($scope, $location, $rootScope, LabObservationService, FhirBundleResolverService) {

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		$scope.contentOnly = !!$location.search().contentOnly;
		$scope.fullWidth = !!$location.search().fullWidth;
	});

	var resolvedBundle = FhirBundleResolverService.resolveOrderAndReportReferences(fhirBundle);
	var anotherResolvedBundle = FhirBundleResolverService.resolveOrderAndReportReferences(anotherFhirBundle);
	var historyResolvedBundle = FhirBundleResolverService.resolveOrderAndReportReferences(historyBundle);

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

	// Observation history
	var histories = require('./observation-history.json');

	// Process observation histories
	var observation = [];
	_.each(histories.observation, function (o) {
		var anObservation = _.first(o.data);
		var config = o.config;
		config.title = anObservation.code.coding[0].display + ' (' + anObservation.valueQuantity.units + ')';
		observation.push({
			title: o.title,
			clazz: o.class,
			config: config,
			data: o.data
		})
	});

	// Process metric histories
	var metric = [];
	_.each(histories.metric, function (m) {
		var data = [];
		_.each(m.data, function (datum) {
			data.push({
				date: datum.createdDate,
				value: datum.value
			})
		});
		metric.push({
			title: m.title,
			config: m.config,
			data: data
		})
	});

	$scope.histories = {
		observation: observation,
		metric: metric
	};

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

	$scope.demo3 = {
		rawObservations: historyResolvedBundle.observations,
		order: historyResolvedBundle.diagnosticOrder,
		status: historyResolvedBundle.diagnosticReport.status,
		reportDate: historyResolvedBundle.diagnosticReport.issued,
		patient: historyResolvedBundle.diagnosticReport.subject,
		organization: historyResolvedBundle.diagnosticReport.performer,
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

	$scope.multiRangeObservations = _.map(_.union(multirangeObs, resolvedBundle.observations), function(obs) {
		return {
			description: obs.code.coding[0].display,
			observation: obs
		};
	});

	$scope.ranges = [
		{
			description: "Rango normal (bajo)",
			value: 36,
			unit: "mg/dl",
			ranges: [
				{
					high: 15,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 15,
					high: 36,
					label: "Normal",
					class: "range-great"
				},
				{
					low: 36,
					label: "Alto",
					class: "range-danger"
				}
			],
			options: {
				domain: { low: 0 }
			}
		},
		{
			description: "Rango normal (normal)",
			value: 20,
			unit: "mg/dl",
			ranges: [
				{
					high: 15,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 15,
					high: 36,
					label: "Normal",
					class: "range-great"
				},
				{
					low: 36,
					label: "Alto",
					class: "range-danger"
				}
			]
		},
		{
			description: "Rango normal (alto)",
			value: 60,
			unit: "mg/dl",
			ranges: [
				{
					high: 15,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 15,
					high: 36,
					label: "Normal",
					class: "range-great"
				},
				{
					low: 36,
					label: "Alto",
					class: "range-danger"
				}
			]
		},
		{
			description: "Gradual range",
			value: 75,
			unit: "mg/dl",
			ranges: [
				{
					high: 130,
					label: "Desirable",
					class: "range-great"
				},
				{
					low: 130,
					high: 190,
					label: "Limit",
					class: "range-so-so"
				},
				{
					low: 190,
					label: "High Risk",
					class: "range-danger"
				}
			],
			options: {
				rangeSeparator: "to"
			}
		},
		{
			description: "Rango gradual",
			value: 85,
			unit: "mg/dl",
			ranges: [
				{
					high: 200,
					label: "Deseable",
					class: "range-great"
				},
				{
					low: 200,
					high: 239,
					label: "Límite",
					class: "range-so-so"
				},
				{
					low: 239,
					label: "Elevado",
					class: "range-danger"
				}
			],
			options: {
				domain: { low: 0 }
			}
		},
		{
			description: "3 rangos",
			value: 8.5,
			ranges: [
				{
					high: 0,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 0,
					high: 4.5,
					label: "Normal",
					class: "range-great"
				},
				{
					low: 4.5,
					label: "Alto",
					class: "range-danger"
				}
			]
		},
		{
			description: "4 rangos",
			value: 0.05,
			unit: "mg/dl",
			ranges: [
				{
					high: 0.20,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 0.21,
					high: 0.60,
					label: "Cercano al óptimo",
					class: "range-good"
				},
				{
					low: 0.61,
					high: 0.85,
					label: "Óptimo",
					class: "range-great"
				},
				{
					low: 0.85,
					label: "Alto",
					class: "range-danger"
				}
			],
			options: {
				domain: { low: 0 }
			}
		},
		{
			description: "5 rangos",
			value: 130,
			unit: "mg/dl",
			options: {
				arrowWidth: 10
			},
			ranges: [
				{
					high: 100,
					label: "Óptimo",
					class: "range-great"
				},
				{
					low: 100,
					high: 129,
					label: "Cercano al óptimo",
					class: "range-good"
				},
				{
					low: 130,
					high: 159,
					label: "Límite",
					class: "range-so-so"
				},
				{
					low: 160,
					high: 190,
					label: "Elevado",
					class: "range-bad"
				},
				{
					low: 190,
					label: "Muy elevado",
					class: "range-danger"
				}
			]
		},
		{
			description: "2 rangos",
			value: 48,
			unit: "mg/dl",
			ranges: [
				{
					high: 50,
					label: "Bajo",
					class: "range-danger"
				},
				{
					low: 50,
					label: "Normal",
					class: "range-great"
				}
			],
			options: {
				domain: { low: 0, high: 200 }
			}
		}
	];

	$scope.sparklines = [
		{
			title: "Several points (9)",
			data: [
				{ date: "2016-06-29", value: 55 },
				{ date: "2016-06-21", value: 60 },
				{ date: "2016-06-02", value: 63 },
				{ date: "2016-05-03", value: 52 },
				{ date: "2016-04-03", value: 51 },
				{ date: "2016-03-03", value: 50 },
				{ date: "2016-01-10", value: 48 },
				{ date: "2015-01-10", value: 55 },
				{ date: "2014-01-10", value: 58 }
			]
		},
		{
			"title": "Fewer points (3)",
			data: [
				{ date: "2016-06-29", value: 55 },
				{ date: "2016-06-21", value: 60 },
				{ date: "2016-06-02", value: 63 }
			]
		},
		{
			"title": "Even fewer points (2)",
			data: [
				{ date: "2016-06-29", value: 55 },
				{ date: "2016-06-21", value: 60 }
			]
		},
		{
			"title": "Just one point (1)",
			data: [
				{ date: "2016-06-29", value: 55 }
			]
		},
		{
			"title": "Data with gaps (3 and 1)",
			data: [
				{ date: "2016-06-29", value: 55 },
				{ date: "2016-01-10", value: 48 },
				{ date: "2015-01-10", value: 62 },
				{ date: "2014-01-10", value: 58 }
			]
		},
		{
			"title": "Data with gaps (1 and 3)",
			data: [
				{ date: "2016-06-29", value: 55 },
				{ date: "2016-06-21", value: 63 },
				{ date: "2016-06-02", value: 60 },
				{ date: "2014-01-10", value: 58 }
			]
		}
	];
};
