'use strict';

/**
 * @ngdoc directive
 * @name lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph
 * @restrict AE
 * @scope
 *
 * @description
 * Generic d3 graph to visually represent a value within a set of ranges.
 * The graph can visually differentiate several ranges and where the actual value lies within the ranges.
 *
 * @element ANY
 * @param {Number} value A numeric value to be displayed.
 *
 * @param {String=} unit A string representation of the value unit.
 *
 * @param {Array} ranges An list of objects representing the ranges to be displayed.
 * These must contain at least one of two numeric properties: 'low' and/or 'high'.
 *
 * @param {Object=} options An object with options to override the default configuration.
 * Defaults:
 * * ```js
 * {
 * 	height: 80,
 * 	padding: { left: 10, right: 10, top: 10, bottom: 20 },
 * 	innerSpacing: 10,
 * 	arrowWidth: 7,
 * 	labelHeight: 25,
 * 	rangeSeparator: 'a',
 * 	lowerThanSymbol: '<',
 * 	graterThanSymbol: '>',
 * 	meterTriangle: { base: 12, height: 10 },
 * 	meterOffset: { x: 0, y: -4 },
 * 	meterLabelOffset: { x: -10, y: 0 },
 * 	domain: {}
 * }
 * ```
 *
 *
 * @example
 <example module="value-within-multiple-ranges-graph-example">
	 <file name="index.html">

		 <div ng-controller="ExampleController" class="example">
			 <form name="exampleForm" class="form-inline" novalidate>
				 <div class="row">
					 <div class="col col-third">
						 <div class="form-group">
							 <label for="exampleValue" class="control-label">Value</label>
							 <input type="number" class="form-control input-sm" id="exampleValue" ng-model="example.value" ng-pattern="/^[0-9]{1,5}$/" required>
						 </div>
					 </div>
				 </div>
			 </form>

			 <hr/>

			 <div value-within-multiple-ranges-graph
			 value="example.value"
			 unit="example.unit"
			 ranges="example.ranges"
			 options="example.options"></div>
		 </div>

	 </file>

	 <file name="styles.css">

		 .example .range-great {
							stroke: #70AB4E;
							fill: #70AB4E;
							color: #70AB4E;
						}

		 .example .range-good {
							stroke: #DDC100;
							fill: #DDC100;
							color: #DDC100;
						}

		 .example .range-so-so {
							stroke: #DD8B05;
							fill: #DD8B05;
							color: #DD8B05;
						}

		 .example .range-bad {
							stroke: #C86403;
							fill: #C86403;
							color: #C86403;
						}

		 .example .range-danger {
							stroke: #C10000;
							fill: #C10000;
							color: #C10000;
						}

		 .example .range-catch-all {
							stroke: #747474;
							fill: #747474;
							color: #747474;
						}



		 .example .range-text {
							display: table;
							width: 100%;
							height: 100%;
						}

		 .example .range-text span {
							display: table-cell;
							vertical-align: middle;
							text-align: center;
							color: white;
							font-size: 12px;
						}

		 .example .range-label {
							height: 100%;
							width: 100%;
							text-transform: uppercase;
							font-size: 11px;
							font-weight: 900;
							line-height: 1.1em;
							display: inline-block;
							text-align: left;
						}
	 </file>

	 <file name="demo.js">

		 angular.module('value-within-multiple-ranges-graph-example', ['lab-components.components.value-within-multiple-ranges'])
			.controller('ExampleController', ['$scope', function($scope) {
				 $scope.example = {
					value: 131,
					unit: "mg/dl",
					options: {
						domain: { low: 0, high: 220 }
					},
					ranges: [
						{
							high: 100,
							label: "Óptimo",
							class: "range-great"
						},
						{
							low: 100,
							high: 129,
							label: "Cercano al óptimo",
							class: "range-good"
						},
						{
							low: 130,
							high: 159,
							label: "Límite",
							class: "range-so-so"
						},
						{
							low: 160,
							high: 190,
							label: "Elevado",
							class: "range-bad"
						},
						{
							low: 190,
							label: "Muy elevado",
							class: "range-danger"
						}
					]
				}
			}]);

	 </file>
 </example>
 */

var d3 = require('d3');
var _ = require('underscore');
var angular = require('angular');

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			value: '=',
			unit: '=?',
			ranges: '=',
			options: '=?'
		},
		link: function (scope, elem) {

			var modelChanged = _.debounce(function(newValue, oldValue) {
					scope.$apply(function() {
						refresh();
					});
				}, 100),
				validModel = function() {
					return _.isNumber(scope.value);
				};

			function watchModel(modelName) {
				scope.$watch(modelName, function(newValue, oldValue) {
					if (newValue !== oldValue && validModel()) {
						modelChanged(newValue, oldValue);
					}
				});
			}

			watchModel('value');

			var options = _.defaults({}, scope.options, {
				height: 80,
				padding: { left: 10, right: 10, top: 10, bottom: 20 },
				innerSpacing: 10,
				arrowWidth: 7,
				labelHeight: 25,
				rangeSeparator: 'a',
				lowerThanSymbol: '<',
				graterThanSymbol: '>',
				meterTriangle: { base: 12, height: 10 },
				meterOffset: { x: 0, y: -4 },
				meterLabelOffset: { x: -10, y: 0 },
				domain: {}
			});

			var svg, width, sector, sectors, rect, target, meter, targetScale;

			setTimeout(function() {
				width = angular.element(elem.parent()[0]).width();
				init();
			}, 0);

			/**
			 * Generates the text to describe a range.
			 *
			 * @param range: the range.
			 * @returns {*}
			 */
			var rangeText = function(range) {
				if (_.isNumber(range.low) && _.isNumber(range.high)) {
					return [range.low, options.rangeSeparator, range.high].join(" ");
				} else if (_.isNumber(range.low) && !_.isNumber(range.high)) {
					return [options.graterThanSymbol, range.low].join(" ");
				} else if (_.isNumber(range.high) && !_.isNumber(range.low)) {
					return [options.lowerThanSymbol, range.high].join(" ");
				} else {
					return "";
				}
			};

			/**
			 * Determines if a value fits in a specified range.
			 *
			 * @param value: the value.
			 * @param range: the range to test.
			 * @returns {boolean}
			 */
			var valueInRange = function(value, range) {
				if (_.isNumber(range.low) && _.isNumber(range.high)) {
					return value >= range.low && value <= range.high;
				} else if (_.isNumber(range.low) && !_.isNumber(range.high)) {
					return value > range.low;
				} else if (_.isNumber(range.high) && !_.isNumber(range.low)) {
					return value < range.high;
				}
				return false;
			};

			/**
			 * Generates a linear scale for a range within other ranges.
			 *
			 * @param value: the value.
			 * @param range: the target range.
			 * @param ranges: the other ranges.
			 * @returns {number}: output of the scale applied to the value.
			 */
			var scale = function (value, range, ranges) {

				// Build scale
				var domain = [null, null];

				if (_.isNumber(range.low) || _.isNumber(options.domain.low)) {
					domain[0] = _.isNumber(options.domain.low) && range.first ? options.domain.low : range.low;
				}

				if (_.isNumber(range.high) || _.isNumber(options.domain.high)) {
					domain[1] = _.isNumber(options.domain.high) && range.last ? options.domain.high : range.high;
				}

				if (!_.isNumber(domain[0])) {
					if (_.isNumber(options.domain.low))
						var nextConcreteRange = _.find(ranges, function(sector) { return _.isNumber(sector.low) && _.isNumber(sector.high); })
					if (nextConcreteRange) {
						domain[0] = range.high - (nextConcreteRange.high - nextConcreteRange.low);
					} else {
						domain[0] = _.isNumber(options.domain.low) ? options.domain.low : range.high - 2 * (Math.abs(value - range.high));
					}
				}

				if (!_.isNumber(domain[1])) {
					var rangesCopy = _.map(ranges, _.clone);
					var previousConcreteRange = _.find(rangesCopy.reverse(), function(sector) { return _.isNumber(sector.low) && _.isNumber(sector.high); });

					if (previousConcreteRange) {
						domain[1] = range.low + (previousConcreteRange.high - previousConcreteRange.low);
					} else {
						domain[1] = _.isNumber(options.domain.high) ? options.domain.high : range.low + 2*(Math.abs(value-range.low));
					}
				}

				return d3.scale.linear()
					.clamp(true)
					.range([0, range.width])
					.domain(domain);
			};

			/**
			 * Draws basic elements and initializes constant properties.
			 */
			function init() {
				svg = d3.select(elem[0]).append('svg')
					.attr('width', width)
					.attr('height', options.height);

				// Pre-process ranges
				var sectorWidth = (width - options.padding.left - options.padding.right - (2 * options.arrowWidth) - ((scope.ranges.length - 1) * options.innerSpacing)) / scope.ranges.length;
				sectors = _.map(scope.ranges, function (range, i) {
					range.index = i;
					range.fist = i == 0;
					range.last = i == scope.ranges.length - 1;
					range.x = options.padding.left + options.arrowWidth + i * (sectorWidth + options.innerSpacing);
					range.width = sectorWidth;
					range.height = options.height - options.padding.top - options.padding.bottom;
					range.rectHeight = range.height - options.labelHeight;
					return range;
				});

				// Sectors
				sector = svg.selectAll('g.sector')
					.data(sectors)
					.enter().append('g')
					.classed('sector', true)
					.attr('transform', function (d) { return 'translate(' + d.x + ')'; });

				// Rectangles
				rect = sector.append('g')
					.attr('transform', 'translate(0, ' + options.labelHeight + ')')
					.classed('target', function(d) { return valueInRange(scope.value, d) });
				rect.append('rect')
					.attr('width', function(d) { return d.width })
					.attr('height', function(d) { return d.rectHeight })
					.classed('range-danger', function (d) { return d.class == 'range-danger' })
					.classed('range-bad', function (d) { return d.class == 'range-bad' })
					.classed('range-so-so', function (d) { return d.class == 'range-so-so' })
					.classed('range-good', function (d) { return d.class == 'range-good' })
					.classed('range-great', function (d) { return d.class == 'range-great' })


				// Range text
				rect.append('foreignObject')
					.attr('x', '0')
					.attr('y', '0')
					.attr('width', function(d) { return d.width })
					.attr('height', function(d) { return d.rectHeight })
					.append('xhtml:div')
					.classed('range-text', true)
					.append('span')
					.html(function(d) { return rangeText(d) });


				// Range label
				sector.append('foreignObject')
					.attr('x', '0')
					.attr('y', '0')
					.attr('width', function(d) { return d.width })
					.attr('height', options.labelHeight)
					.append('xhtml:div')
					.classed('range-label', true)
					.append('span')
					.html(function(d) { return d.label });

				// Arrows
				rect.append('path')
					.attr('d', function (d) {
						return '' +
							'M' + '0' + ' ' + '0' + ' ' +
							'L' + (-options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + '0' + ' ' + d.rectHeight;
					})
					.style('visibility', function (d, i) { return i == 0 ? 'visible': 'hidden' } )
					.attr('class', function(d) { return d.class });

				rect.append('path')
					.attr('d', function (d) {
						return '' +
							'M' + d.width + ' ' + '0' + ' ' +
							'L' + (d.width + options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + d.width + ' ' + d.rectHeight;
					})
					.style('visibility', function (d, i) { return i == (sectors.length - 1) ? 'visible': 'hidden' } )
					.attr('class', function(d) { return d.class });

				target = svg.selectAll('g.target');
				targetScale = scale(scope.value, target.data()[0], sectors);

				appendMeter(target);

				refresh();

			};

			/**
			 * Redraws the graph to display updated values.
			 */
			function refresh() {
				// Target
				var oldTarget = target;
				rect.classed('target', function(d) { return valueInRange(scope.value, d) });

				// Value
				target = svg.selectAll('g.target');
				if (target.data()[0].index != oldTarget.data()[0].index) {
					oldTarget.selectAll('g.meter').remove();
					targetScale = scale(scope.value, target.data()[0], sectors);
					appendMeter(target);
				}
				meter = target.selectAll('g.meter');
				meter.attr('transform', function(d) { return 'translate(' + targetScale(scope.value) + ',' + (d.rectHeight) + ')' });
				meter.select('span')
					.html([scope.value, scope.unit].join(' '));
				meter.select('foreignObject')
					.attr('width', '100%')
					.attr('height', '100%');
			};

			/**
			 * Appends a 'meter' to the target range.
			 *
			 * @param targetSector: the target sector or range.
			 */
			function appendMeter(targetSector) {
				meter = targetSector.append('g')
					.classed('meter', true);

				meter.append('path')
					.attr('d', isoscelesTriangle(options.meterTriangle.base, options.meterTriangle.height))
					.attr('transform', translate(options.meterOffset.x, options.meterOffset.y));

				var fo = meter.append('foreignObject')
					.attr('y', options.meterLabelOffset.y + options.meterTriangle.height + options.meterOffset.y)
					.style('visibility', 'hidden');
				var label = fo.append('xhtml:div');

				label.append('xhtml:span');

				setTimeout(function() {
					var offsetX = targetSector.data()[0].x + targetScale(scope.value) + options.meterLabelOffset.x;
					var labelWidth = label[0][0].clientWidth;
					var foOffsetX = (offsetX + labelWidth) > width ? -labelWidth - options.meterLabelOffset.x : options.meterLabelOffset.x;
					fo
						.attr('x', foOffsetX)
						.style('visibility', 'visible');
				}, 0);
			}

			/**
			 * Calculates the path string for an isosceles triangle.
			 *
			 * @param base: the base of the triangle.
			 * @param height: the height of the triangle.
			 * @returns {string}: the svg path string for the triangle.
			 */
			function isoscelesTriangle(base, height) {
				return '' +
					'M' + '0' + ' ' + '0' + ' ' +
					'L' + (base/2) + ' ' + height + ' ' +
					'L' + (-base/2) + ' ' + height
			}

			/**
			 * Calculates the transform's translate string.
			 *
			 * @param x: translation in x.
			 * @param y: translation in y.
			 * @returns {string}: the transform string for the translation.
			 */
			function translate(x, y) {
				return 'translate(' + x + ',' + y + ')';
			}


		}
	}
};
