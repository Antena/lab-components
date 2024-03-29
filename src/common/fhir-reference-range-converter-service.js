'use strict';

var _ = require('underscore');

/**
 * @ngdoc service
 * @name lab-components.common.service:FhirReferenceRangeConverterService
 * @kind function
 *
 * @description
 * Provides conversion utilities related to fhir ranges.
 *
 */

// @ngInject
module.exports = function(MathUtilService) {

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
			lowBorder = parseFloat(MathUtilService.toFixedDecimals(lowBorder, decimalCount));
		}
		return lowBorder;
	}

	function fillMissingRanges(observation, domain, options) {

		options = options || {};

		var defaultMeanings = {
			low: {
				system: "http://hl7.org/fhir/v2/0078",
				code: "L"
			},
			original: {
				system: "http://hl7.org/fhir/v2/0078",
				code: "N"
			},
			high: {
				system: "http://hl7.org/fhir/v2/0078",
				code: "H"
			}
		};

		var meanings = {
			original: _.defaults(options.original || {}, defaultMeanings.original),
			low: _.defaults(options.low || {}, defaultMeanings.low),
			high: _.defaults(options.high || {}, defaultMeanings.high)
		};

		var originalRange = observation.referenceRange[0];

		if (originalRange.low.value === originalRange.high.value && !originalRange.low.comparator && !originalRange.high.comparator) {
			originalRange.low.comparator = '>=';
			originalRange.high.comparator = '<=';
		}

		var firstRange = {
			high: _.extend({}, originalRange.low, { comparator: '<' }),
			meaning: {
				coding: [
					meanings.low
				]
			}
		};

		if (domain && _.isNumber(domain.low) ) {
			firstRange.low = {
				value: domain.low,
				units: originalRange.low.units || originalRange.low.unit,
				system: originalRange.low.system,
				code: originalRange.low.code
			};

			var lowBorder = calculateLowBorder(originalRange, observation);

			firstRange.high = {
				value: lowBorder,
				units: originalRange.low.units || originalRange.low.unit,
				system: originalRange.low.system,
				code: originalRange.low.code,
				comparator: '<='
			};

			//TODO (denise) add same border calculation logic if domain.high is available...
		}

		var result = [
			firstRange,
			{
				low: originalRange.low,
				high: originalRange.high,
				meaning: {
					coding: [
						meanings.original
					]
				}
			},
			{
				low: _.extend({}, originalRange.high, { comparator: '>' }),
				meaning: {
					coding: [
						meanings.high
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

		/**
		 * @ngdoc function
		 * @name convertToMultipleRanges
		 * @methodOf lab-components.common.service:FhirReferenceRangeConverterService
		 * @description
		 *
		 * Converts a single FHIR range into a set of ranges. The given range must contain both low and high properties.
		 * This assumes the given range is the recommended/desired range ('N', normal range), and generates two open ended ranges:
		 * - Low: < givenRange.low
		 * - Normal: givenRange.low to givenRange.high
		 * - High: > givenRange.high
		 *
		 * This is useful for representing single-range observations in the same manner as multirange ones.
		 * See {@link http://localhost:4000/docs/#/api/lab-components.lab-observation.directive:labObservation#usage_directive-info_parameters multiRangeMode}.
		 *
		 * @param {Object} observation A valid FHIR observation.
		 *
		 * @returns {Array} The generated list of ranges.
		 *
		 */
		convertToMultipleRanges: function(observation, options) {
			var ranges = [];

			if (observation.referenceRange && observation.referenceRange.length > 0) {
				if (shouldFillMissingRanges(observation)) {
					ranges = fillMissingRanges(observation, null, options);
				} else {
					ranges = observation.referenceRange;
				}
			}

			return ranges;
		},

		/**
		 * @ngdoc function
		 * @name convertToMultipleRangesWithDomain
		 * @methodOf lab-components.common.service:FhirReferenceRangeConverterService
		 * @description
		 *
		 * Converts a single FHIR range into a set of ranges.
		 * This assumes the given range is the recommended/desired range ('N', normal range), and generates two open ended ranges:
		 * - Low: `domain.low` to `givenRange.low`
		 * - Normal: `givenRange.low` to `givenRange.high`
		 * - High: `givenRange.high` to `domain.high`
		 *
		 * This is useful for representing single-range observations in the same manner as multirange ones.
		 *
		 * @param {Object} observation A valid FHIR observation.
		 * @param {Object} domain A valid FHIR range.
		 *
		 * @returns {Array} The generated list of ranges.
		 *
		 */
		convertToMultipleRangesWithDomain: function(observation, domain, options) {
			var ranges;

			if (shouldFillMissingRanges(observation)) {
				ranges = fillMissingRanges(observation, domain, options);
			} else {
				ranges = observation.referenceRange;
			}

			return ranges;
		}
	};
};
