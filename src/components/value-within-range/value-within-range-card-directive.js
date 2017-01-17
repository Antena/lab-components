'use strict';

/**
 * @ngdoc directive
 * @name lab-components.components.value-within-range.directive:valueWithinRangeCard
 * @restrict AE
 * @scope
 *
 * @description
 *
 * Visually represents if an observation's value falls within a range or not.
 *
 * @element ANY
 * @param {Number} value A numeric value to be displayed.
 *
 * @param {String=} unit A string representation of the value unit.
 *
 * @param {Object} range An object representing the range to be displayed.
 * This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {String=} unitClass A class name to be applied to the unit text element.
 *
 * @param {String=} insideClass A class name to be applied to the value element, when it falls inside the range.
 *
 * @param {String=} outsideClass A class name to be applied to the value element, when it falls outside the range.

 *
 *
 * @example
 <example module="value-within-range-card-example">
 <file name="index.html">

	 <div ng-controller="ExampleController" class="example">

	   <div value-within-range-card
			 value="example.value"
			 unit="example.unit"
			 range="example.range"
			 inside-class="good"
			 outside-class="bad">
	   </div>

	   <hr/>

	   <form name="exampleForm" class="form-inline" novalidate>
	     <div class="row">
	       <div class="col col-third">
	         <div class="form-group">
	           <label for="exampleValue" class="control-label">Value</label>
	           <input type="number" class="form-control input-sm" id="exampleValue"
	               ng-model="example.value" ng-pattern="/^[0-9]{1,5}$/" required>
	         </div>
	         <div class="form-group">
	           <label for="exampleUnit" class="control-label">Unit</label>
	           <input type="text" class="form-control input-sm" id="exampleUnit"
	               ng-model="example.unit">
	         </div>
	       </div>
	       <div class="col col-third">
	         <div class="form-group">
	           <label for="rangeLow" class="control-label">Range Low</label>
	           <input type="number" class="form-control input-sm" id="rangeLow"
	               ng-model="example.range.low" required>
	         </div>
	         <div class="form-group">
	           <label for="rangeHigh" class="control-label">Range High</label>
	           <input type="number" class="form-control input-sm" id="rangeHigh"
	               ng-model="example.range.high" required>
	         </div>
	       </div>
	     </div>
	   </form>
	 </div>

 </file>
 <file name="main.css">

	.value-within-range-card p,
	.value-within-range-card p {
		padding: 0;
		line-height: 1;
	}

	.value-within-range-card .reference-range,
	.value-within-range-card .reference-range {
		padding: 4px 0;
	}

	.value-within-range-card .reference-range .reference,
	.value-within-range-card .reference-range .reference {
		font-size: 12px;
		vertical-align: text-top;
	}

	.value-within-range-card .reference-range .reference-type,
	.value-within-range-card .reference-range .reference-type {
		text-align: left;
		color: #CCC;
	}

	.value-within-range-card .reference-range .value,
	.value-within-range-card .reference-range .value {
		text-align: right;
	}

	.value-within-range-card .main-value,
	.value-within-range-card .main-value {
		font-size: 36px !important;
		line-height: 36px;
	}

	.value-within-range-card .unit,
	.value-within-range-card .unit {
		margin-top: 0;
		font-size: 12px;
	}

	.value-within-range-card {
		min-height: 80px;
	}

	.left {
		float: left;
		display: block;
		margin-right: 10px;
	}
 </file>
 <file name="styles.css">

 		.example .value-within-range-card .bad {
			color: #C0334E;
		}
 		.example .value-within-range-card .good {
			color: #00b752;
		}

 </file>
 <file name="demo.js">

 		angular.module('value-within-range-card-example', ['lab-components.components.value-within-range'])
 			.controller('ExampleController', ['$scope', function($scope) {
					$scope.example = {
						value: 28,
						unit: "pg",
						range: {
							low: 19,
							high: 33
						}
					};
				}]);

 </file>
 </example>
 */

require("./_value-within-range.scss");

// @ngInject
module.exports = function() {

	return {
		scope: {
			value: '=',
			unit: '=?',
			range: '=?',
			unitClass: '@?',
			insideClass: '@?',
			outsideClass: '@?'
		},
		restrict: 'EA',
		templateUrl: require('./value-within-range-card.html'),
		link: function($scope) {
			$scope.outsideClass = $scope.outsideClass || '';

			$scope.isWithinRange = function() {
				return $scope.value >= $scope.range.low && $scope.value <= $scope.range.high;
			};
		}
	};
};
