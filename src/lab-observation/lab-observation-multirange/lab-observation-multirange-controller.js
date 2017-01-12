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
module.exports = function($scope, $filter, fhirMappings, FhirReferenceRangeConverterService) {

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
		meterLabelOffset: { x: 0, y: -2 },
		precision: $scope.vm.options.precision
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


		var rangeClassMappings = fhirMappings.getScaleRangeClasses();
		var found = _.find(rangeClassMappings, function(map) {
			var intersection = _.intersection(map.codes, codeScale);
			var result = intersection.length === map.codes.length && intersection.length === codeScale.length;

			if (_.contains(codeScale, 'RR')) {
				console.log("---------------------------");	//TODO (denise) remove log
				console.log("map.codes = ", JSON.stringify(map.codes, null, 2));	//TODO (denise) remove log
				console.log("codeScale = ", JSON.stringify(codeScale, null, 2));	//TODO (denise) remove log
				console.log("intersection = ", intersection);	//TODO (denise) remove log
				console.log("result = ", result);	//TODO (denise) remove log
			}



			return result;
		});

		console.log(".............................");	//TODO (denise) remove log
		console.log("found = ", found);	//TODO (denise) remove log
		console.log("---------------------------");	//TODO (denise) remove log

		if(found && found.classMap &&_.keys(found.classMap).length > 0) {
			result = found.classMap;
		} else {
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
		}

		return result;
	}

	function transformRangesForGraphDisplay(ranges) {
		var codeScale = _.map(ranges, function(range) { return range.meaning.coding[0].code; });

		var codeToClassMap = mapScaleToClasses(codeScale);

		return _.map(ranges, function(r) {
			console.log("r.meaning = ", r.meaning);	//TODO (denise) remove log
			var coding = r.meaning.coding && r.meaning.coding.length ? r.meaning.coding[0] : null;
			var translationKey = coding ? $filter('coding2TranslationKey')(coding) : null;
			console.log("translationKey = ", translationKey);	//TODO (denise) remove log
			return {
				low: r.low ? r.low.value : undefined,
				high: r.high ? r.high.value : undefined,
				label: translationKey ? $filter('translate')(translationKey) : (coding ? coding.display : ''),
				class: codeToClassMap[coding.code] || 'range-catch-all'
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
