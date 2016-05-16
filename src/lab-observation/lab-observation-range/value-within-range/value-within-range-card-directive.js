'use strict';

/**
 * @ngdoc directive
 * @name valueWithinRange
 * @restrict AE
 *
 * @description
 * Generic d3 graph to represent a value visually, which consists of a domain and a range. The graph will
 * display the domain and range with different visual aids, and will highlight the value differently, depending
 * on whether it's within the given range, or outside of it.
 *
 * The domain is optional, and will be defined as a percentage outside of the range if not provided.
 * The range and value must always belong to the given domain.
 *
 * Additionally, a unit for the value can be provided, which will be displayed next to the value.
 *
 *
 * @param {Number} value (required) A numeric value to be displayed.
 *
 * @param {String} unit (optional) A string representation of the value unit.
 *
 * @param {Object} range (required) An object representing the range to be displayed.
 * 									This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {String} insideClass (optional) A class name to be applied to the value element, when it falls inside the range.
 *
 * @param {String} outsideClass (optional) A class name to be applied to the value element, when it falls outside the range.
 *
 *
 *
 * @example
 *
 *  Ad-hoc values:
 *
 * 		<value-within-range-card  value="34.4"
 * 	    						  unit="g/dL"
 * 								  range="{ low: 31.6, high: 34.9 }"
 *  							  inside-class="good-value"
 * 								  outside-class="bad-value">
 *		</value-within-range-card>
 *
 * 	or, you can provide scope variables:
 *
 * 	- Template:
 *
 * 		<value-within-range-card value="example.value" unit="example.value" range="example.value"></value-within-range-card>
 *
 *  - Directive/Controller:
 *
 * 		$scope.example = {
 *       	value: 28,
 *          unit: "pg",
 *      	range: {
 *      		low: 27,
 *      		high: 33
 *      	}
 * 		};
 *
 *
 */

// @ngInject
module.exports = function() {

	return {
		scope: {
			value: '=',
			unit: '=?',
			range: '=',
			unitClass: '@?',
			insideClass: '@?',
			outsideClass: '@?'
		},
		restrict: 'EA',
		templateUrl: require('./value-within-range-card.html'),
		link: function($scope) {
			$scope.outsideClass = $scope.outsideClass || '';
			var isWithinRange = $scope.value >= $scope.range.low && $scope.value <= $scope.range.high;
			$scope.valueClass = isWithinRange ? $scope.insideClass : $scope.outsideClass;
		}
	};
};
