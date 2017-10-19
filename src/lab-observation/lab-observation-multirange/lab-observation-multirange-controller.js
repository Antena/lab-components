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
 * Colors:
 * This library provides some default mappings from range meaning code scales to colour palettes. These can be extended or overwritten in two ways:
 *
 * <ol>
 * <li>Via {@link lab-components.mappings.$fhirMappingsProvider#methods_setcoding2classnamemappings $fhirMappingsProvider's setCodeScale2ClassNameMappings} on the configuration phase.</li>
 *
 * <li>Via css, by providing styles for the observation/ranges:
 *    <ul style="list-style-type: lower-latin">
 *    <li>The parent element for the observation component gets a className based on the observation code (taken from it's code/coding element).</li>
 *
 *    <li>Each range receives a className for it's meaning code (taken from it's meaning code/coding).</li>
 *
 *    <li>Additionally, if the meaning code is part of the defaults included in {@link lab-components.mappings.$fhirMappingsProvider $fhirMappingsProvider},
 *       then another class will be added, with className indicating a more semantic interpretation of how desirable it is for a value falling in this range.
 *       These classes are described in {@link lab-components.mappings.$fhirMappingsProvider $fhirMappingsProvider's documentation}.</li>
 *
 * 	  </ul>
 *
 *     <br>
 *    For all cases where a className is generated from a code `(a)`, `(b)` the {@link https://antena.github.io/angular-utilities/docs/index.html#/api/angular-utilities.text.filter:toClassName toClassName}
 *    filter (part of the `angular-utilities` package) will be run, to guarantee the generated className is valid.
 *    This filter will strip invalid characters, and replace these with `_`. There are also some special rules for the very first character.
 *    <br>
 *    Also, a prefix is added, to avoid className collision. For the observation code `(a)`, it's `lc-obs--`, and for the range mening codes `(b)`
 *    it's `lc-range--`.
 *
 *    </li>
 * </ol>
 *
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function($scope, $filter, fhirMappings, FhirReferenceRangeConverterService, EXTENSION_SYSTEM) {

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

	$scope.init = function() {
		if ($scope.vm.options) {
			$scope.vm.graphOptions.precision = $scope.vm.options.precision;
		}
	};

	/*jshint sub:true*/
	function mapScaleToClasses(codeScale) {
		var result = { };

		var rangeClassMappings = fhirMappings.getCodeScale2ClassNameMappings();
		var found = _.filter(rangeClassMappings, function(map) {
			return _.isEqual(_.sortBy(map.codes), _.sortBy(codeScale));
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

	function transformRangesForGraphDisplay(ranges) {
		var codeScale = _.map(ranges, function(range) {
			return range.meaning.coding[0].code;
		});

		var codeToClassMap = mapScaleToClasses(codeScale);

		return _.map(ranges, function(r) {
			var coding = r.meaning.coding && r.meaning.coding.length ? r.meaning.coding[0] : null;
			var translationKey = coding ? $filter('coding2TranslationKey')(coding) : null;
			return {
				low: r.low ? r.low.value : undefined,
				lowComparator: r.low && r.low.comparator ? r.low.comparator : undefined,
				high: r.high ? r.high.value : undefined,
				highComparator: r.high && r.high.comparator ? r.high.comparator : undefined,
				label: translationKey ? $filter('translate')(translationKey) : (coding ? coding.display : ''),
				class: codeToClassMap[coding.code] || 'range-catch-all'
			};
		});
	}

	$scope.$watch('vm.observation', function(observation) {

		if (observation && observation.referenceRange && observation.referenceRange.length) {

			var domainExtension = EXTENSION_SYSTEM.DOMAIN ? _.findWhere(observation.extension, {url: EXTENSION_SYSTEM.DOMAIN}) : null;

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
