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
module.exports = function($scope, $filter, FhirReferenceRangeConverterService) {

	$scope.vm.calculatedRanges = [];

	$scope.vm.graphOptions = {
		innerSpacing: 0,
		domain: {
			low: 0  // Default low domain to 0
		},
		meterShape: {
			type: 'BALLOON'
		},
		labelHeight: 30,
		meterLabelWithUnits: false,
		meterPosition: 'top',
		meterOffset: { x: 0, y: 0 },
		meterLabelOffset: { x: 0, y: -2 }
	};

	if(!!$scope.vm.options && !_.isUndefined($scope.vm.options.precision)) {
		$scope.vm.graphOptions.precision = $scope.vm.options.precision;
	}

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

			var domainExtension = _.findWhere(observation.extension, {url: "http://www.cdrossi.com/domain"});

			if (domainExtension) {

				if (_.has(domainExtension.valueRange, 'low')) {
					$scope.vm.graphOptions.domain.low = domainExtension.valueRange.low.value;
				}

				if (_.has(domainExtension.valueRange, 'high')) {
					$scope.vm.graphOptions.domain.high = domainExtension.valueRange.high.value;
				}

			}

			var ranges = FhirReferenceRangeConverterService.convertToMultipleRangesWithDomain(observation, $scope.vm.graphOptions.domain);

			$scope.vm.calculatedRanges = transformRangesForGraphDisplay(ranges);
		}
	});
};
