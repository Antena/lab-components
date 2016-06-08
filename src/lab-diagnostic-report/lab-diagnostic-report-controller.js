'use strict';

/**
 * @ngdoc controller
 * @name lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
 *
 * @description
 * `LabDiagnosticReportController` provides some utilitary functions for mapping report observations to order items, and grouping observations.
 *
 * Each instance of {@link lab-components.lab-diagnostic-report.directive:labDiagnosticReport labDiagnosticReport} directive creates an instance of this controller.
 *
 */

var _ = require('underscore');
var $ = require('jquery');

// @ngInject
module.exports = function($scope) {

	$scope.$watch('vm.observations', function(observations) {
		$scope.vm.groupedObservations = _.groupBy(observations, function(obs) {
			return obs.extension && obs.extension[0].valueIdentifier ? obs.extension[0].valueIdentifier.value : obs.id;
		});
	});

	/**
	 * @ngdoc function
	 * @name getOrderItemDisplay
	 * @methodOf lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
	 * @description
	 *
	 * //TODO (denise) add description
	 *
	 * @param {Object} orderItemCode The code (identifier) of a diagnostic order item (`item.code.extension[0].valueIdentifier.value`). See https://www.hl7.org/fhir/2015MAY/diagnosticorder.html.
	 *
	 * @returns {String} A string representation for an order item which matches the given code.
	 *
	 */
	$scope.getOrderItemDisplay = function(orderItemCode) {
		var result = "";

		var item = _.find($scope.vm.diagnosticOrder.item, function(item) {
			return item.code.extension[0].valueIdentifier.value === orderItemCode;
		});

		if (item) {
			result = item.code.coding[0].display;
		} else {
			var observation = _.findWhere($scope.vm.observations, {id: orderItemCode});
			if (observation) {
				result = observation.code.coding[0].display;
			}
		}

		return result;
	};

	/**
	 * @ngdoc function
	 * @name isTopLevel
	 * @methodOf lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
	 * @description
	 *
	 * //TODO (denise) add description
	 *
	 * @param {Object} orderItemCode The code (identifier) of a diagnostic order item (`diagnosticOrder.item[x].code.extension[0].valueIdentifier.value`). See https://www.hl7.org/fhir/2015MAY/diagnosticorder.html.
	 *
	 * @param {Array} observationsPerOrderItem A list of observations grouped by groupId.
	 *
	 * @returns {Boolean} `true` if the group contains only one observation.
	 *
	 */
	$scope.isTopLevel = function(orderItemCode, observationsPerOrderItem) {
		return observationsPerOrderItem.length === 1 && observationsPerOrderItem[0].id === orderItemCode;
	};

	//TODO (denise) check if still used here
	$scope.getObservationValueDisclosure = function(observation) {
		var result;
		if (observation.valueQuantity) {
			var valueKey = observation.valueQuantity;
			var value = valueKey.value,
				unit = valueKey.unit ? valueKey.unit : "",
				code = !observation.referenceRange[0].meaning ? "" :
				" (" + observation.referenceRange[0].meaning.coding[0].code + ")";

			result = value + " " + unit + code;
		} else if (observation.valueString) {
			result = observation.valueString;
		} else {
			result = "-";
		}
		return result;
	};

	//TODO (denise) de-dupe (lab-observation-range-controller.js)
	$scope.valueStringMatchesReference = function(observation) {
		return observation.valueString === observation.referenceRange[0].text || observation.referenceRange[0].text === '.' || _.isUndefined(observation.referenceRange[0].text);
	};
};
