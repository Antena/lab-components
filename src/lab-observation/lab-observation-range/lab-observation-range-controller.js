'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function($scope) {

	$scope.valueStringMatchesReference = function(observation) {
		return observation.valueString === observation.referenceRange[0].text || observation.referenceRange[0].text === '.' || _.isUndefined(observation.referenceRange[0].text);
	};

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
