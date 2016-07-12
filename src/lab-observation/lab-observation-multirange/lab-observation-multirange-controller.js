'use strict';

/**
 * @ngdoc controller
 * @name lab-components.lab-observation.lab-observation-multirange.controller:LabObservationMultirangeController
 *
 * @description
 * `LabObservationMultirangeController` transforms and curates observation ranges in order to display the observation data as a multirange graph.
 *
 * Each instance of {@link lab-components.lab-observation.lab-observation-multirange.directive:labObservationMultirangeGraph labObservationMultirangeGraph} directive creates an instance of this controller.
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function($scope, $filter) {

	$scope.vm.calculatedRanges = [];
	$scope.vm.options = [];

	$scope.vm.graphOptions = {
		innerSpacing: 0,
		domain: {
			low: 0  // Default low domain to 0
		},
		meterShape: {
			type: 'BALLOON'
		},
		meterLabelWithUnits: false,
		meterPosition: 'top',
		meterOffset: { x: 0, y: 0 },
		meterLabelOffset: { x: 0, y: -2 }
	};


	var RANGE_CLASSES = {
		GREAT: 'range-great',
		GOOD: 'range-good',
		SO_SO: 'range-so-so',
		BAD: 'range-bad',
		DANGER: 'range-danger'
	};

	/*jshint sub:true*/
	function mapScaleToClasses(codeScale) {

		var result = { };

		if(_.contains(codeScale, 'L')) {
			result['L'] = RANGE_CLASSES.DANGER;
		}
		if(_.contains(codeScale, 'N')) {
			result['N'] = RANGE_CLASSES.GREAT;
		}

		var hasHH = _.contains(codeScale, 'HH');
		var hasHU = _.contains(codeScale, 'HU');
		var hasLIM = _.contains(codeScale, 'LIM');
		var hasNN = _.contains(codeScale, 'NN');

		if(!hasHH && !hasHU) {
			result['H'] = RANGE_CLASSES.DANGER;
		} else if(hasHH && hasHU) {
			result['H'] = RANGE_CLASSES.SO_SO;
			result['HU'] = RANGE_CLASSES.BAD;
			result['HH'] = RANGE_CLASSES.DANGER;
		} else if(hasHH && !hasHU) {
			result['H'] = RANGE_CLASSES.BAD;
			result['HH'] = RANGE_CLASSES.DANGER;
		} else if(!hasHH && hasHU) {
			result['H'] = RANGE_CLASSES.BAD;
			result['HU'] = RANGE_CLASSES.DANGER;
		}

		if(hasLIM && hasNN) {
			result['LIM'] = RANGE_CLASSES.SO_SO;
			result['NN'] = RANGE_CLASSES.GOOD;
		} else if(hasLIM && !hasNN) {
			result['LIM'] = RANGE_CLASSES.SO_SO;
		} else if(!hasLIM && hasNN) {
			result['NN'] = RANGE_CLASSES.GOOD;
		}

		if(_.contains(codeScale, 'NR')) {
			result['NR'] = RANGE_CLASSES.GREAT;
		}
		if(_.contains(codeScale, 'RR')) {
			result['RR'] = RANGE_CLASSES.DANGER;
		}
		if(_.contains(codeScale, 'IND')) {
			result['IND'] = RANGE_CLASSES.SO_SO;
		}

		return result;
	}

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

	function fillMissingRanges(observation) {
		var originalRange = observation.referenceRange[0];

		var lowBorder = calculateLowBorder(originalRange, observation);

		var result = [
			{
				low: {
					value: $scope.vm.graphOptions.domain.low,
					units: originalRange.low.units,
					system: originalRange.low.system,
					code: originalRange.low.code
				},
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
			},
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

		if (originalRange.low.value === $scope.vm.graphOptions.domain.low) {
			result.shift();
		}

		if (originalRange.high.value === $scope.vm.graphOptions.domain.high) {
			result.pop();
		}

		return result;
	}

	function transformRangesForGraphDisplay(ranges) {
		var codeScale = _.map(ranges, function(range) { return range.meaning.coding[0].code; });

		var codeToClassMap = mapScaleToClasses(codeScale);

		return _.map(ranges, function(r) {
			return {
				low: r.low ? r.low.value : undefined,
				high: r.high ? r.high.value : undefined,
				label: $filter('translate')($filter('referenceRangeMeaning')(r.meaning)),
				class: codeToClassMap[r.meaning.coding[0].code] || 'range-catch-all'
			};
		});
	}

	$scope.$watch('vm.observation', function(observation) {

		if(observation && observation.referenceRange && observation.referenceRange.length) {
			var ranges;

			var domainExtension = _.findWhere(observation.extension, {url: "http://www.cdrossi.com/domain"});

			if (domainExtension) {

				if (_.has(domainExtension.valueRange, 'low')) {
					$scope.vm.graphOptions.domain.low = domainExtension.valueRange.low.value;
				}

				if (_.has(domainExtension.valueRange, 'high')) {
					$scope.vm.graphOptions.domain.high = domainExtension.valueRange.high.value;
				}

			}

			if(shouldFillMissingRanges(observation)) {
				ranges = fillMissingRanges(observation);
			} else {
				ranges = observation.referenceRange;
			}

			$scope.vm.calculatedRanges = transformRangesForGraphDisplay(ranges);
		}
	});
};
