'use strict';

/**
 * @ngdoc directive
 * @name lab-components.components.value-within-range.directive:valueWithinRangeGraph
 * @restrict AE
 * @scope
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
 * @element ANY
 * @param {Number} value A numeric value to be displayed.
 *
 * @param {String} [unit=""] A string representation of the value unit.
 *
 * @param {Object} range An object representing the range to be displayed.
 * This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {Object} [domain={ low: range.low * 0.1, high: range.high * 0.1}] An object representing the range to be displayed. This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {String} [insideClass=""] A class name to be applied to the value element, when it falls inside the range.
 * If not provided, 'rangeClass' will be used.
 *
 * @param {String} [outsideClass=""] A class name to be applied to the value element, when it falls outside the range.
 * If not provided, 'domainClass' will be used.
 *
 * @param {String} rangeClass A class name to be applied to the range element.
 *
 * @param {String} domainClass A class name to be applied to the domain element.
 *
 *
 *
 *
 * @example
 <example module="value-within-range-graph-example">
	 <file name="index.html">

		<div ng-controller="ExampleController" class="example">
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

		  <hr/>

		 <div value-within-range-graph
			  value="example.value"
 			  unit="example.unit"
 			  range="example.range"
 			  range-class="good"
 			  domain-class="bad">
		 </div>
	 </div>

	 </file>
	 <file name="styles.css">

		.example .value-within-range-graph .bad {
			stroke: #C0334E;
			fill: #C0334E;
			color: #C0334E;
		}
		.example .value-within-range-graph .good {
			stroke: #00b752;
			fill: #00b752;
			color: #00b752;
		}

	 </file>
	 <file name="demo.js">

		 angular.module('value-within-range-graph-example', ['lab-components.components.value-within-range'])
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


var d3 = require('d3');
var _ = require('underscore');
var angular = require('angular');

// @ngInject
module.exports = function() {

	function calculateDomainFromRange(value, range, bleedFactor) {
		var domainLow = function(value, range) {
			if (value < range.low) {
				return value - value * bleedFactor;
			} else {
				return range.low - range.low * bleedFactor;
			}
		};
		var domainHigh = function(value, range) {
			if (value > range.high) {
				return value + value * bleedFactor;
			} else {
				return range.high + range.high * bleedFactor;
			}
		};

		return {
			low: domainLow(value, range),
			high: domainHigh(value, range)
		};
	}

	return {
		restrict: 'EA',
		scope: {
			value: '=',
			unit: '=?',
			range: '=',
			domain: '=?',
			insideClass: '@?',
			outsideClass: '@?',
			rangeClass: '@',
			domainClass: '@'
		},
		link: function(scope, elem) {
			var modelChanged = _.debounce(function(newValue, oldValue) {
					scope.$apply(function() {
						refresh();
					});
				}, 300),
				validModel = function() {
					return _.isNumber(scope.value) &&
							_.isObject(scope.range) &&
							_.has(scope.range, 'low') &&
							_.has(scope.range, 'high') &&
							_.isNumber(scope.range.low) &&
							_.isNumber(scope.range.high) &&
							scope.range.high > scope.range.low;
				};

			function watchModel(modelName) {
				scope.$watch(modelName, function(newValue, oldValue) {
					if (newValue !== oldValue && validModel()) {
						modelChanged(newValue, oldValue);
					}
				});
			}


			//TODO (denise) this sucks
			watchModel('value');
			watchModel('unit');
			watchModel('range.low');
			watchModel('range.high');


			// var parent = $(elem[0].parentNode);

			var width = 256,
				height = 50,
				circleRadius = 5,
				strokeWeight = 2,
				yPos = height / 2 + strokeWeight / 2,
				yOffset = circleRadius * 2,
				bleedFactor = 0.1,
				padding = {
					left: 20,
					right: 20
				};

			var svg = d3.select(elem[0]).append('svg')
				.attr('width', width)
				.attr('height', height)
				.classed('value-within-range-graph', true);

			refresh();


			function refresh() {

				var svgElem = $(elem[0]).find('svg');
				svgElem.empty();

				var value = parseFloat(scope.value),
					unit = scope.unit,
					range = scope.range,
					insideClass = scope.insideClass || scope.rangeClass,
					outsideClass = scope.insideClass || scope.domainClass;

				var domain = scope.domain || calculateDomainFromRange(value, range, bleedFactor);

				var scale = d3.scale.linear()
					.domain([domain.low, domain.high])
					.range([padding.left, width - padding.right]);

				// Low range
				svg.append('line')
					.attr('x1', padding.left)
					.attr('y1', yPos)
					.attr('x2', scale(range.low))
					.attr('y2', yPos)
					.attr("stroke-width", strokeWeight)
					.classed('low-range-line', true)
					.classed(scope.domainClass, true);
				svg.append('text')
					.attr('x', scale(range.low))
					.attr('y', yPos + yOffset)
					.attr('dy', '0.375em')
					.attr('text-anchor', 'middle')
					.classed('low-range-text', true)
					.text(range.low);

				// Healthy range
				svg.append('line')
					.attr('x1', scale(range.low))
					.attr('y1', yPos)
					.attr('x2', scale(range.high))
					.attr('y2', yPos)
					.attr("stroke-width", strokeWeight)
					.classed(scope.rangeClass, true)
					.classed('inside-range-line', true);

				// High range
				svg.append('line')
					.attr('x1', scale(range.high))
					.attr('y1', yPos)
					.attr('x2', width - padding.right)
					.attr('y2', yPos)
					.attr("stroke-width", strokeWeight)
					.classed('high-range-line', true)
					.classed(scope.domainClass, true);
				svg.append('text')
					.attr('x', scale(range.high))
					.attr('y', yPos + yOffset)
					.attr('dy', '0.375em')
					.attr('text-anchor', 'middle')
					.classed('high-range-text', true)
					.text(range.high);

				// Value
				var valueWithinRange = value >= range.low && value <= range.high;
				var valueInDomain = value < range.low || value > range.high;
				var valueText = value + (unit ? (' ' + unit) : '');

				svg.append('text')
					.attr('x', scale(value))
					.attr('y', yPos - yOffset)
					.attr('dy', '0.375em')
					.attr('dy', 0)
					.attr('text-anchor', 'middle')
					.classed(outsideClass, valueInDomain && !valueWithinRange)
					.classed(insideClass, valueWithinRange)
					.classed('value-text', true)
					.text(valueText);

				svg.append('circle')
					.attr("cx", scale(value))
					.attr("cy", yPos)
					.attr("r", circleRadius)
					.classed(outsideClass, valueInDomain && !valueWithinRange)
					.classed(insideClass, valueWithinRange)
					.classed('value-point', true);
			}
		}
	};
};
