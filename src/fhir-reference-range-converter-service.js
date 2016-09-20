'use strict';

/**
 * @ngdoc service
 * @name lab-components.service:FhirReferenceRangeConverterService
 * @kind function
 *
 * @description
 *
 *
 *
 */

var _ = require('underscore');
var lodash = require('lodash');

// @ngInject
module.exports = function() {

	function shouldFillMissingRanges(observation) {
		return observation.referenceRange.length === 1 && observation.referenceRange[0].low && observation.referenceRange[0].high;
	}

	function getDecimalCount(value) {
		return Math.floor(value) === value ? 0 : (value.toString().split(".")[1].length || 0);
	}

	function calculateLowBorder(originalRange, observation) {
		var highDecimals = getDecimalCount(originalRange.high.value);
		var lowDecimals = getDecimalCount(originalRange.low.value);
		var valueDecimals = getDecimalCount(observation.valueQuantity.value);
		var decimalCount = Math.max(valueDecimals, Math.max(highDecimals, lowDecimals));
		var minUnit;

		var diffToApply = 0;

		if (originalRange.low.value > 0) {
			if (decimalCount > 0) {
				minUnit = Math.pow(10, decimalCount);
				diffToApply = 1 / minUnit;
			} else {
				// var digits = ("" + originalRange.low.value).length;
				// minUnit = Math.pow(10, digits);
				// diffToApply = 1 * minUnit;

				diffToApply = 1;
			}
		}

		var lowBorder = originalRange.low.value - diffToApply;
		if (decimalCount > 0) {
			lowBorder = parseFloat(lowBorder.toFixed(decimalCount));
		}
		return lowBorder;
	}

	function fillMissingRanges(observation, domain) {
		var originalRange = observation.referenceRange[0];

		var lowBorder = calculateLowBorder(originalRange, observation);

		var firstRange = {
			high: {
				value: lowBorder,
				units: originalRange.low.units,
				system: originalRange.low.system,
				code: originalRange.low.code
			},
			meaning: {
				coding: [
					{
						system: "http://hl7.org/fhir/v2/0078",
						code: "L"
					}
				]
			}
		};

		if(domain) {
			firstRange.low = {
				value: domain.low,
				units: originalRange.low.units,
				system: originalRange.low.system,
				code: originalRange.low.code
			};
		}

		var result = [
			firstRange,
			{
				low: originalRange.low,
				high: originalRange.high,
				meaning: {
					coding: [
						{
							system: "http://hl7.org/fhir/v2/0078",
							code: "N" 	//TODO (denise) remove onces this is fixed from KERN!!!!!
						}
					]
				}
			},
			{
				low: originalRange.high,
				meaning: {
					coding: [
						{
							system: "http://hl7.org/fhir/v2/0078",
							code: "H"
						}
					]
				}
			}
		];

		if (domain) {
			if (originalRange.low.value === domain.low) {
				result.shift();
			}

			if (originalRange.high.value === domain.high) {
				result.pop();
			}
		}

		return result;
	}

	return {

		convertToMultipleRanges: function(observation) {
			var ranges;

			if(shouldFillMissingRanges(observation)) {
				ranges = fillMissingRanges(observation);
			} else {
				ranges = observation.referenceRange;
			}

			return ranges;
		},
		convertToMultipleRangesWithDomain: function(observation, domain) {
			var ranges;

			if(shouldFillMissingRanges(observation)) {
				ranges = fillMissingRanges(observation, domain);
			} else {
				ranges = observation.referenceRange;
			}

			return ranges;
		}
	};
};
