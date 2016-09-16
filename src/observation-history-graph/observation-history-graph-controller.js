'use strict';

/**
 * @ngdoc controller
 * @name lab-components.observation-history-graph.controller:ObservationHistoryGraphController
 *
 * @description
 * `LabDiagnosticReportController` provides some utilitary functions for mapping report observations to order items, and grouping observations.
 *
 * Each instance of {@link lab-components.lab-diagnostic-report.directive:labDiagnosticReport labDiagnosticReport} directive creates an instance of this controller.
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function ($scope) {

	/**
	 * @ngdoc function
	 * @name simplifyObservations
	 * @methodOf lab-components.observation-history-graph.controller:ObservationHistoryGraphController
	 * @description
	 *
	 * //TODO (denise) add description
	 *
	 * @param {Array} observations TODO
	 *
	 * @returns {Array} The list of simplifed observations.
	 *
	 */
	this.simplifyObservations = function (observations) {

		return _.map(observations, function (observation) {
			return {
				'value': observation.valueQuantity.value,
				'lowValue': observation.referenceRange[0].low.value,
				'highValue': observation.referenceRange[0].high.value,
				'date': (observation.issued),
				'unit': observation.valueQuantity.units
			};
		});
	};

	function calculateDottedLines(data) {
		var dottedLines = [];
		for (var i = 0; i < data.length; i++) {
			if (i < data.length - 1) {
				var currValue = $scope.dimensions.x(data[i].date);
				var nextValue = $scope.dimensions.x(data[i + 1].date);
				var dottedline = {x: ( (nextValue - currValue) / 2 ) + currValue};
				dottedLines.push(dottedline);
			}
		}
		return dottedLines;
	}

	/**
	 * @ngdoc function
	 * @name calculateRectangles
	 * @methodOf lab-components.observation-history-graph.controller:ObservationHistoryGraphController
	 * @description
	 *
	 * //TODO (denise) add description
	 *
	 * @param {Array} data TODO
	 *
	 * @returns {Array} The list of rectangles.
	 *
	 */
	this.calculateRectangles = function (data) {
		var rectangles = [];
		var xRectangles = calculateDottedLines(data);
		xRectangles.unshift({x: 0});

		for (var i = 0; i < data.length; i++) {
			if (i < data.length) {
				var widthRectangle;

				if (i === (data.length - 1)) {
					widthRectangle = $scope.dimensions.width;
				} else {
					widthRectangle = xRectangles[i + 1].x - xRectangles[i].x;
				}

				var rectangle = {
					x: xRectangles[i].x,
					y: $scope.dimensions.y(data[i].highValue),
					width: widthRectangle,
					height: -($scope.dimensions.y(data[i].highValue) - $scope.dimensions.y(data[i].lowValue))
				};

				rectangles.push(rectangle);
			}
		}
		return rectangles;
	};

};
