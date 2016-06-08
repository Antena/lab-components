'use strict';

/**
 * @ngdoc filter
 * @name lab-components.lab-observation.lab-observation-range.filter:referenceRangeToSimpleRange
 * @kind function
 *
 * @description
 *   Simplifies the structure of an Observation's reference range.
 *
 *   To avoid caucing an infinite digest loop when running this filter (http://www.terrencewatson.com/2014/06/28/memoize/),
 *   the filter result is memoized. And, since the result is an object, a custom hash is provided to the memoized function.
 *   This hash is generated with Szudzik's elegant pairing for signed values {@link http://szudzik.com/ElegantPairing.pdf}.
 *   More at: http://stackoverflow.com/a/13871379/6317595
 *
 * @param {Object} input An object representing a FHIR observation's referenceRange. See: https://www.hl7.org/fhir/2015MAY/observation-definitions.html#Observation.referenceRange
 * @returns {Object} A simplified range object, with the following structure: `{ low: x, high: y }`
 *
 *
 * @example
 <example module="reference-range-to-simple-range-example">
 <file name="index.html">
 <div ng-controller="ExampleController">
 <p>Reference range: <strong>{{ example.observation.referenceRange[0] | json }}</strong></p>
 <p>Simplified range: <strong>{{ example.observation.referenceRange[0] | referenceRangeToSimpleRange | json }}</strong></p>
 </div>
 </file>
 <file name="demo.js">

 angular.module('reference-range-to-simple-range-example', ['lab-components.lab-observations.lab-observation-range'])
 .controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			observation: {
				referenceRange: [
					{
						low: {
							value: 4.6,
							units: "µg/dl",
							system: "http://unitsofmeasure.org",
							code: "µg/dl"
						},
						high: {
							value: 12,
							units: "µg/dl",
							system: "http://unitsofmeasure.org",
							code: "µg/dl"
						}
					}
				]
			}
		};
	}]);

 </file>
 </example>
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function() {

	// Hash function for two signed numbers.
	// Szudzik's elegant pairing for signed values [http://szudzik.com/ElegantPairing.pdf]
	// http://stackoverflow.com/a/13871379/6317595
	function elegantPairing(x, y) {
		var A = x >= 0 ? 2 * x : -2 * x - 1;
		var B = y >= 0 ? 2 * y : -2 * y - 1;
		var C = (A >= B ? A * A + A + B : A + B * B) / 2;
		return x < 0 && y < 0 || x >= 0 && y >= 0 ? C : -C - 1;
	}

	return _.memoize(function(input) {
		return {
			low: input.low.value,
			high: input.high.value
		};
	}, function(input) {
		return elegantPairing(input.low.value, input.high.value);
	});
};
