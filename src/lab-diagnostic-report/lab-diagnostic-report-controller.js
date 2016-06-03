'use strict';

var _ = require('underscore');
var $ = require('jquery');

// @ngInject
module.exports = function($scope) {

	$scope.$watch('vm.observations', function(observations) {
		$scope.vm.groupedObservations = _.groupBy(observations, function(obs) {
			return obs.extension && obs.extension[0].valueIdentifier ? obs.extension[0].valueIdentifier.value : obs.id;
		});
	});

	$scope.getOrderItemDisplay = function(itemCode) {
		var result = "";

		var item = _.find($scope.vm.diagnosticOrder.item, function(item) {
			return item.code.extension[0].valueIdentifier.value === itemCode;
		});

		if (item) {
			result = item.code.coding[0].display;
		} else {
			var observation = _.findWhere($scope.vm.observations, {id: itemCode});
			if (observation) {
				result = observation.code.coding[0].display;
			}
		}

		return result;
	};

	$scope.isTopLevel = function(group, observationsPerGroup) {
		return observationsPerGroup.length === 1 && observationsPerGroup[0].id === group;
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
