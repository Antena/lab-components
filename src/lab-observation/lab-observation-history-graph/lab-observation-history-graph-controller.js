'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function ($scope, FhirReferenceRangeConverterService) {
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
	_.each(_.filter($scope.observationList, function(obs) { return obs.resourceType == 'Observation' && !_.isEmpty(obs.valueQuantity) && !_.isEmpty(obs.issued) }), function(obs) {
		var datum = {};
		datum.date = obs.issued;
		datum.value = obs.valueQuantity.value;
		datum.ranges = processReferenceRange(obs);

		data.push(datum);
	});

	$scope.data = data;
};
