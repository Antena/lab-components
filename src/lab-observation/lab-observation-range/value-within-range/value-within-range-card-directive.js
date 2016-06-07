'use strict';

/**
 * @ngdoc directive
 * @name common.value-within-range.directive:valueWithinRangeCard
 * @restrict AE
 * @scope
 *
 * @description
 *
 * TODO...
 *
 * @element ANY
 * @param {Number} value A numeric value to be displayed.
 *
 * @param {String} [unit=""] A string representation of the value unit.
 *
 * @param {Object} range An object representing the range to be displayed.
 * 									This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {String} [insideClass=""] A class name to be applied to the value element, when it falls inside the range.
 *
 * @param {String} [outsideClass=""] A class name to be applied to the value element, when it falls outside the range.
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
 *      ```
 * 		<value-within-range-graph value="example.value"
 * 								  unit="example.value"
 * 								  range="example.value">
 * 		</value-within-range-graph>
 * 		```
 *
 *  - Directive/Controller:
 *
 *      ```
 * 		$scope.example = {
 *       	value: 28,
 *          unit: "pg",
 *      	range: {
 *      		low: 27,
 *      		high: 33
 *      	}
 * 		};
 *      ```
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
