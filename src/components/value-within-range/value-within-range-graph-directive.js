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
 * The domain is optional, and will be defined as a percentage of the range's amplitude if not provided.
 * The range and value must always belong to the given domain.
 *
 * Additionally, a unit for the value can be provided, which will be displayed next to the value.
 *
 * @element ANY
 * @param {Number} value A numeric value to be displayed.
 *
 * @param {String=} unit A string representation of the value unit.
 *
 * @param {Object} range An object representing the range to be displayed.
 * This must contain two numeric properties: 'low' and 'high'.
 *
 * @param {Object=} domain An object representing the range to be displayed. This cab contain two numeric properties: 'low' and 'high', which are the low and high absolute values of the domain.
 *
 * @param {String=} insideClass A class name to be applied to the value element, when it falls inside the range.
 * If not provided, 'rangeClass' will be used.
 *
 * @param {String=} outsideClass A class name to be applied to the value element, when it falls outside the range.
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
  			<div class="col col-third">
 				<div class="form-group">
  				  <label for="domainLow" class="control-label">domain.low</label>
 				  <input type="number" class="form-control input-sm" id="domainLow"
 					ng-model="example.domain.low" required>
 				</div>
 				<div class="form-group">
  				  <label for="domainHigh" class="control-label">domain.high</label>
  				  <input type="number" class="form-control input-sm" id="domainHigh"
 					ng-model="example.domain.high" required>
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

	/**
	 * Calculates the domain of the scale based on a value and range.
	 * May apply a bleed factor based on the range, and can be overrided.
	 *
	 * @param domain: the domain override.
	 * @param value: the value.
	 * @param range: the low and high values of the range.
	 * @param bleedFactor: the desired bleed factor.
	 * @returns {{low: number, high: number}}
     */
	function calculateDomain(domain, value, range, bleedFactor) {
		var f = (range.high - range.low) * bleedFactor;
		return {
			low: domain && !isNaN(domain.low) ? domain.low : (Math.min(value, range.low) - f),
			high: domain && !isNaN(domain.high) ? domain.high : (Math.max(value, range.high) + f)
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
			watchModel('domain.low');
			watchModel('domain.high');

			var svg,
				scale,
				width = 0,
				height = 50,
				circleRadius = 5,
				strokeWeight = 2,
				yPos = height / 2 + strokeWeight / 2,
				yOffset = circleRadius * 2,
				axisLabelVerticalShift = '0.375em',			// The vertical shift of the axis' labels
				bleedFactor = 0.1,
				padding = {
					left: 20,
					right: 20
				};

			// Setting timeout 0 to ensure Angular's digest cycle has finished, because... Angular.
			setTimeout(function() {
				var container = elem.parent()[0];
				width = angular.element(container).width();
				init();
			}, 0);


			/**
			 * Draw the basic elements with its constant properties
			 */
			function init() {
				// SVG
				svg = d3.select(elem[0]).append('svg')
					.attr('width', width)
					.attr('height', height)
					.classed('value-within-range-graph', true);

				// X-Scale
				scale = d3.scale.linear()
					.range([padding.left, width - padding.right]);

				// Low range line + text
				svg.append('line')
					.classed('low-range-line', true)
					.attr("stroke-width", strokeWeight);
				svg.append('text')
					.classed('low-range-text', true)
					.attr('dy', axisLabelVerticalShift);

				// Healthy range line
				svg.append('line')
					.attr("stroke-width", strokeWeight)
					.classed('inside-range-line', true);

				// High range line + text
				svg.append('line')
					.classed('high-range-line', true)
					.attr("stroke-width", strokeWeight);
				svg.append('text')
					.classed('high-range-text', true)
					.attr('dy', axisLabelVerticalShift);

				// Value circle + text
				svg.append('circle')
					.classed('value-point', true)
					.attr("cy", yPos)
					.attr("r", circleRadius);
				svg.append('text')
					.classed('value-text', true)
					.attr('y', yPos - yOffset)
					.attr('dy', 0);

				refresh();
			}


			/**
			 * Re-draw the graph when something changes
			 */
			function refresh() {
				// Data
				var value = parseFloat(scope.value),
					unit = scope.unit,
					range = scope.range,
					insideClass = scope.insideClass || scope.rangeClass,
					outsideClass = scope.insideClass || scope.domainClass;

				// Update: scale's domain
				var domain = calculateDomain(scope.domain, value, range, bleedFactor);
				scale.domain([domain.low, domain.high]);

				// Update: low range line + text
				svg.select('line.low-range-line')
					.attr('x1', padding.left)
					.attr('y1', yPos)
					.attr('x2', scale(range.low))
					.attr('y2', yPos)
					.classed(scope.domainClass, true);
				svg.select('text.low-range-text')
					.attr('x', scale(range.low))
					.attr('y', yPos + yOffset)
					.attr('text-anchor', 'middle')
					.text(range.low);

				// Update: healthy range
				svg.select('line.inside-range-line')
					.attr('x1', scale(range.low))
					.attr('y1', yPos)
					.attr('x2', scale(range.high))
					.attr('y2', yPos)
					.classed(scope.rangeClass, true);

				// Update: high range
				svg.select('line.high-range-line')
					.attr('x1', scale(range.high))
					.attr('y1', yPos)
					.attr('x2', width - padding.right)
					.attr('y2', yPos)
					.classed(scope.domainClass, true);
				svg.select('text.high-range-text')
					.attr('x', scale(range.high))
					.attr('y', yPos + yOffset)
					.attr('text-anchor', 'middle')
					.text(range.high);

				// Update: value
				var valueWithinRange = value >= range.low && value <= range.high,
					valueInDomain = value < range.low || value > range.high,
					textAnchor = value < range.low ? 'start' : ( value > range.high ? 'end': 'middle');
				svg.select('text.value-text')
					.attr('x', scale(value))
					.attr('text-anchor', textAnchor)
					.classed(outsideClass, valueInDomain && !valueWithinRange)
					.classed(insideClass, valueWithinRange)
					.text(value + (unit ? (' ' + unit) : ''));
				svg.select('circle.value-point')
					.attr("cx", scale(value))
					.classed(outsideClass, valueInDomain && !valueWithinRange)
					.classed(insideClass, valueWithinRange);
			}
		}
	};
};
