'use strict';

/**
 * @ngdoc controller
 * @name lab-components.lab-observation.lab-observation-range.controller:LabObservationRangeController
 *
 * @description
 * `LabObservationRangeController` provides some utilitary functions for transfoming and validating observation data.
 *
 * Shared between {@link lab-components.lab-observation.lab-observation-range.directive:labObservationRangeGraph labObservationRangeGraph} and {@link lab-components.lab-observation.lab-observation-range.directive:labObservationRangeCard labObservationRangeCard} directives.
 * Each instance of these directives creates an instance of `LabObservationRangeController`.
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function($scope) {

	/**
	 * @ngdoc function
	 * @name valueStringMatchesReference
	 * @methodOf lab-components.lab-observation.lab-observation-range.controller:LabObservationRangeController
	 * @description Checks whether an observation's string value (`observation.valueString`) matches the string reference (`observation.referenceRange[0].text`). Considers it a match if the reference is undefined or `.`.
	 *
	 * @param {Object} observation A valid FHIR Observation.
	 *
	 * @returns {Boolean} True if it's a match.
	 *
	 *
	 */
	$scope.valueStringMatchesReference = function(observation) {
		return observation.valueString === observation.referenceRange[0].text ||
				observation.referenceRange[0].text === '.' ||
				_.isUndefined(observation.referenceRange[0].text);
	};

	/**
	 * @ngdoc function
	 * @name getObservationValueDisclosure
	 * @methodOf lab-components.lab-observation.lab-observation-range.controller:LabObservationRangeController
	 * @description Produces a string representation of the observation's value, which includes it's value, unit and
	 * range meaning when it's a numeric value, or the valueString when it's not numeric.
	 * If there's no value in the given observation (neither numeric nor string), then it returns `"-"`.
	 *
	 * @param {Object} observation A valid FHIR Observation.
	 *
	 * @returns {String} The composed string.
	 *
	 */
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
};
