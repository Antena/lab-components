'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function ($scope, $filter, FhirReferenceRangeConverterService) {
	function obtainNumericValue(obs) {
		var numericValue = obs.valueQuantity.value;
		var precisionExtension = _.findWhere(obs.extension, {url: "http://www.cdrossi.com/precision"});
		if (precisionExtension) {
			var precision = precisionExtension.valueInteger;
			numericValue = $filter('number')(obs.valueQuantity.value, precision);
		}
		return numericValue;
	}

	function processReferenceRange(observation) {
		var ranges = [];

		var convertedRanges = FhirReferenceRangeConverterService.convertToMultipleRanges(observation);

		_.each(convertedRanges, function(range) {
			ranges.push({
				code: range.meaning.coding[0].code,
				low: range.low ? range.low.value : null,
				high: range.high ? range.high.value : null
			})
		});

		return ranges;
	}

	// Data points
	var data = [];
	var filtered = _.filter($scope.observationList, function(obs) {
		return obs.resourceType == 'Observation' && !_.isEmpty(obs.valueQuantity) && !_.isEmpty(obs.issued);
	});

	_.each(filtered, function(obs) {
		var datum = {};
		datum.date = obs.issued;

		var numericValue = obtainNumericValue(obs);

		datum.value = numericValue;
		datum.ranges = processReferenceRange(obs);

		data.push(datum);
	});

	$scope.data = data;
};
