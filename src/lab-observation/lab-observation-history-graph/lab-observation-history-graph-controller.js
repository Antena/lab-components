'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function($scope, $filter, fhirMappings, FhirReferenceRangeConverterService) {
	function obtainNumericValue(obs) {
		var numericValue = obs.valueQuantity.value;
		var precisionExtension = _.findWhere(obs.extension, {url: "http://www.cdrossi.com/precision"});
		if (precisionExtension) {
			var precision = precisionExtension.valueInteger;
			numericValue = $filter('number')(obs.valueQuantity.value, precision);
		}
		return numericValue;
	}

	/*jshint sub:true*/
	function mapScaleToClasses(codeScale) {
		var result = { };

		var rangeClassMappings = fhirMappings.getCodeScale2ClassNameMappings();
		var found = _.filter(rangeClassMappings, function(map) {
			var intersection = _.intersection(map.codes, codeScale);
			return intersection.length === map.codes.length && intersection.length === codeScale.length;
		});

		if (found) {
			if (found.length > 1) {
				var withObsCode = _.filter(found, function(map) {
					return !!map.observationCode;
				});

				found = withObsCode && withObsCode.length > 0 ? _.first(withObsCode) : _.first(found);

			} else {
				found = _.first(found);
			}
		}

		if (found && found.classMap &&_.keys(found.classMap).length > 0) {
			result = found.classMap;
		}

		result = _.mapObject(result, function(val, key) {
			return val + " " + $filter('toClassName')(key, "lc-range--");
		});

		return result;
	}

	function processReferenceRange(observation) {
		var ranges = [];

		var convertedRanges = FhirReferenceRangeConverterService.convertToMultipleRanges(observation);

		var codeScale = _.map(convertedRanges, function(range) {
			return range.meaning.coding[0].code;
		});

		var codeToClassMap = mapScaleToClasses(codeScale);

		_.each(convertedRanges, function(range) {
			var code = range.meaning.coding[0].code;

			ranges.push({
				code: code,
				low: range.low ? range.low.value : null,
				high: range.high ? range.high.value : null,
				clazz: codeToClassMap[code]
			});
		});

		return ranges;
	}

	// Data points
	var data = [];
	var filtered = _.filter($scope.observationList, function(obs) {
		return obs.resourceType === 'Observation' && !_.isEmpty(obs.valueQuantity) && !_.isEmpty(obs.issued);
	});

	_.each(filtered, function(obs) {
		var datum = {};
		datum.date = obs.issued;

		datum.value = obtainNumericValue(obs);
		datum.ranges = processReferenceRange(obs);

		data.push(datum);
	});

	$scope.data = data;
};
