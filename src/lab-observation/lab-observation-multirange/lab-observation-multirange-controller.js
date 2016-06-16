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

	var RANGE_CLASSES = {
		GREAT: 'range-great',
		GOOD: 'range-good',
		SO_SO: 'range-so-so',
		BAD: 'range-bad',
		DANGER: 'range-danger'
	};

	function mapScaleToClasses(codeScale) {

		var result = {
			'L': RANGE_CLASSES.DANGER,
			'N': RANGE_CLASSES.GREAT
		};

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

		return result;
	}

	function shouldFillMissingRanges(observation) {
		return observation.referenceRange.length === 1 && observation.referenceRange[0].low && observation.referenceRange[0].high;
	}

	function fillMissingRanges(observation) {
		var originalRange = observation.referenceRange[0];

		originalRange.meaning.coding[0].code = "N";	//TODO (denise) remove onces this is fixed from KERN!!!!!

		return [
			{
				high: originalRange.low,
				meaning: {
					coding: [
						{
							system: "http://hl7.org/fhir/v2/0078",
							code: "L"
						}
					]
				}
			},
			originalRange,
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
	}

	function transformRangesForGraphDisplay(ranges) {
		var codeScale = _.map(ranges, function(range) { return range.meaning.coding[0].code });

		var codeToClassMap = mapScaleToClasses(codeScale);

		return _.map(ranges, function(r) {
			return {
				low: r.low ? r.low.value : undefined,
				high: r.high ? r.high.value : undefined,
				label: $filter('translate')($filter('referenceRangeMeaning')(r.meaning)),
				class: codeToClassMap[r.meaning.coding[0].code] || 'range-catch-all'
			}
		});
	}

	$scope.$watch('vm.observation', function(observation) {

		if(observation && observation.referenceRange && observation.referenceRange.length) {
			var ranges;

			if(shouldFillMissingRanges(observation)) {
				ranges = fillMissingRanges(observation);
			} else {
				ranges = observation.referenceRange;
			}

			$scope.vm.calculatedRanges = transformRangesForGraphDisplay(ranges);
		}
	});
};
