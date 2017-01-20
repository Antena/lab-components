'use strict';
// jscs:disable requireBlocksOnNewline

/**
 * @ngdoc directive
 * @name lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph
 * @restrict AE
 * @scope
 *
 * @description
 * Generic d3 graph to visually represent a value within a set of ranges.
 * The graph can visually differentiate several ranges and where the actual value lies within the ranges.
 * Each range or sector is labeled and colored as per input.
 * The value is represented in a 'meter' that contains a label to show the actual value and it's units.
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
		        <div class="form-group">
		          <label for="exampleUnit" class="control-label">Unit</label>
		          <input type="text" class="form-control input-sm" id="exampleUnit" ng-model="example.unit" required>
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
var $ = require('jquery');
var angular = require('angular');

require('./_value-within-multiple-ranges.scss');

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
		link: function(scope, elem) {

			/**
			 * Helper functions to re-draw graph based on scope's updates.
			 * @type {Function}
			 */
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
			watchModel('unit');

			/**
			 * Parse and extend options object.
			 */
			var options = _.defaults({}, scope.options, {
				height: 120,
				padding: { left: 0, right: 10, top: 10, bottom: 0 },
				innerSpacing: 10,
				arrowWidth: 7,
				labelHeight: 25,
				rangeSeparator: 'a',
				lowerThanSymbol: '<',
				graterThanSymbol: '>',
				meterShape: {
					type: 'BOX',
					meterTriangle: { base: 12, height: 10 }
				},
				meterPosition: 'bottom',
				meterOffset: { x: 0, y: -4 },
				meterLabelOffset: { x: -10, y: 0 },
				meterLabelWithUnits: true,
				domain: {},
				rangeEndShape: 'HALF_CIRCLE'
			});

			/**
			 * textValue
			 * Formats the value returning the final label
			 * i.e: Formatting the value according to options (precision) to return a safe value label.
			 */

			function textValue(value) {
				return !_.isUndefined(options.precision) ? value.toFixed(options.precision) : value;
			}

			/**
			 * Declare local variables and initialize the graph
			 */
			var svg,
				width,
				sectors, targetSector,
				rect, targetRect, targetScale,
				meter, meterWrapper, rangeRectHeight;

			var RANGE_END_SHAPES = {
				TRIANGLE: function(options, direction, d) {
					var result;

					if (direction === 'left') {
						result = '' +
							'M' + '0' + ' ' + '0' + ' ' +
							'L' + (-options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + '0' + ' ' + d.rectHeight;
					} else if (direction === 'right') {
						result = '' +
							'M' + d.width + ' ' + '0' + ' ' +
							'L' + (d.width + options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + d.width + ' ' + d.rectHeight;
					}

					return result;
				},
				HALF_CIRCLE: function(options, direction, d) {
					/*
					 M cx cy
					 m -r, 0
					 a r,r 0 1,0 (r * 2),0
					 a r,r 0 1,0 -(r * 2),0
					 */

					var cx;

					if (direction === 'left') {
						cx = 0;
					} else if (direction === 'right') {
						cx = d.width;
					}

					var cy = d.rectHeight / 2;
					var radius = d.rectHeight / 2;

					return '' +
						'M ' + cx + ' ' + cy + ' ' +
						'm ' + -radius + ',' + ' 0' + ' ' +
						'a ' + radius + ',' + radius + ' 0 1,0 ' + (radius * 2) + ',0' + ' ' +
						'a ' + radius + ',' + radius + ' 0 1,0 ' + -(radius * 2) + ',0';
				}
			};

			var METER_SHAPES = {
				BOX: {
					marker: function(options, placement) {
						// if placement === bottom // TODO (denise) [issue #29] add support for bottom placement
						return isoscelesTriangle(options.meterShape.meterTriangle.base, options.meterShape.meterTriangle.height);
					},
					label: function(meter) {
						meterWrapper = meter.append('foreignObject')
							.attr('y', options.meterLabelOffset.y + options.meterShape.meterTriangle.height + options.meterOffset.y)
							.attr('width', '100%')
							.attr('height', '100%')
							.style('visibility', 'hidden');
						var meterLabel = meterWrapper.append('xhtml:div');
						meterLabel.attr('class', 'meter-label-container');
						meterLabel.append('xhtml:span').attr('class', 'meter-label');
					},
					updateLabel: function(meterLabel, text) {
						meterLabel.html(text);
					},
					getIndicatorOverflow: function() {
						return 0;
					},
					getIndicatorHeight: function() {
						return 0;
					}
				},
				BALLOON: {
					cx: 0.15,
					cy: 23.8,
					r: 20.3,
					marker: function(options, placement) {
						//TODO (denise) [issue #30] dismantle path so that width is configurable

						// if placement === top	// TODO (denise) [issue #29] does it make sense to support this shape placed at bottom?
						return "M0 .15" +
							"c-12.5 0-22.7 10.2-22.7 22.7 0 15.4 15.2 28.8 21.7 30.2v5.7h2v-5.7" +
							"c6.3-1.4 21.7-14.4 21.7-30.2C22.7 10.35 12.6.15 0 .15m0 42.4" +
							"c-10.9 0-19.7-8.8-19.7-19.7 0-10.9 8.8-19.7 19.7-19.7 10.9 0 19.7 8.8 19.7 19.7.1 10.9-8.8 19.7-19.7 19.7z";
					},
					label: function(meter) {
						meter.append('circle')
							.attr('class', 'meter-center-area')
							.attr("cx", this.cx)
							.attr("cy", this.cy)
							.attr("r", this.r);
						meter.append('text')
							.attr('y', (meter.node().getBBox().height / 2) + options.meterLabelOffset.y)
							.attr('x', '0')
							.attr('text-anchor', 'middle')
							.attr('class', 'meter-label meter-label-container');
					},
					updateLabel: function(meterLabel, text) {
						meterLabel.text(textValue(text));
					},
					getIndicatorOverflow: function() {
						return (45 / 2);	//TODO (denise) [issue #30] extract width from path (45)
					},
					getIndicatorHeight: function() {
						return 58;	//TODO (denise) [issue #30] extract from path
					}
				}
			};

			setTimeout(function() {
				width = angular.element(elem.parent()[0]).width();
				init();
			}, 0);

			/**
			 * Draws basic elements and initializes constant properties.
			 */
			function init() {
				svg = d3.select(elem[0]).append('svg')
					.attr('width', width)
					.attr('height', options.height)
					.classed('value-within-multiple-ranges-graph', true);

				// Pre-process ranges
				var paddingAndBuffer = options.padding.left + options.padding.right + (2 * options.arrowWidth) + METER_SHAPES[options.meterShape.type].getIndicatorOverflow();
				var sectorWidth = (width - paddingAndBuffer - ((scope.ranges.length - 1) * options.innerSpacing)) / scope.ranges.length;
				var sectorHeight = options.height - options.padding.top - options.padding.bottom;
				rangeRectHeight = sectorHeight - options.labelHeight - METER_SHAPES[options.meterShape.type].getIndicatorHeight();

				sectors = _.map(scope.ranges, function(range, i) {
					var sector = {};
					sector.range = range;
					sector.class = range.class;
					sector.label = range.label;
					sector.index = i;
					sector.first = (i === 0);
					sector.last = (i === scope.ranges.length - 1);
					sector.x = (paddingAndBuffer / 2) + i * (sectorWidth + options.innerSpacing);
					sector.width = sectorWidth;
					sector.height = sectorHeight;
					sector.rectHeight = rangeRectHeight;
					return sector;
				});

				// Create sector groups
				targetSector = svg.selectAll('g.sector')
					.data(sectors)
					.enter().append('g')
					.classed('sector', true)
					.attr('transform', function(d) { return translate(d.x, 0); });

				// Append rectangles to sectors
				rect = targetSector.append('g')
					.attr('transform', translate(0, options.meterPosition === 'top' ? 0 : options.labelHeight))
					.classed('target', function(d) { return valueInRange(scope.value, d.range); });
				rect.append('rect')
					.attr('width', function(d) { return d.width; })
					.attr('height', function(d) { return d.rectHeight; })
					.attr('class', function(d) { return d.class + ' sector-rect'; });

				// Create labels for ranges
				var switchElem = targetSector.append("switch");

				// Labels for modern browsers
				// If the 'requiredFeatures' test passes, this element is displayed
				switchElem.append('foreignObject')
					.attr("requiredFeatures", "http://www.w3.org/TR/SVG11/feature#Extensibility")
					.attr('x', '0')
					.attr('y', options.meterPosition === 'top' ? '5' : '0')
					.attr('width', function(d) { return d.width; })
					.attr('height', options.labelHeight)
					.classed('sector-meaning-rect', true)
					.classed('range-label-wrapper', true)
					.append('xhtml:div')
					.classed('range-label', true)
					.append('span')
					.html(function(d) { return d.label; });

				// Labels for IE < IE10
				// If it fails, show fallback labels instead.
				switchElem.append("text")
					.attr('dx', '0')
					.attr('dy', options.meterPosition === 'top' ? '5' : '0')
					.classed('range-label', true)
					.classed('range-label-fallback', true)
					.text(function(d) { return d.label; });

				// Create range end shape
				rect.append('path')
					.attr('d', _.partial(RANGE_END_SHAPES[options.rangeEndShape], options, 'left'))
					.style('visibility', function(d, i) { return i === 0 ? 'visible': 'hidden'; } )
					.attr('class', function(d) { return d.class + ' sector-rect'; });

				rect.append('path')
					.attr('d', _.partial(RANGE_END_SHAPES[options.rangeEndShape], options, 'right'))
					.style('visibility', function(d, i) { return i === (sectors.length - 1) ? 'visible': 'hidden'; } )
					.attr('class', function(d) { return d.class + ' sector-rect'; });

				// Find the target and append a meter
				targetRect = svg.selectAll('g.target');
				targetScale = scale(scope.value, targetRect.data()[0], sectors);

				// Create labels for ranges
				var rectLabelSwitchElem = rect.append("switch");

				// Labels for modern browsers
				// If the 'requiredFeatures' test passes, this element is displayed
				rectLabelSwitchElem.append('foreignObject')
					.attr('x', '0')
					.attr('y', '0')
					.attr('width', function(d) { return d.width; })
					.attr('height', function(d) { return d.rectHeight; })
					.classed('sector-rect', true)
					.append('xhtml:div')
					.classed('range-text', true)
					.append('span')
					.classed('range-text-content', true)
					.html(function(d) { return rangeText(d.range, options.domain); });

				// Labels for IE < IE10
				// If it fails, show fallback labels instead.
				rectLabelSwitchElem.append("text")
					.attr('x', function(d) { return d.width / 2; })
					.attr('y', function(d) { return d.rectHeight / 2; })
					.classed('range-text-fallback', true)
					.text(function(d) { return rangeText(d.range, options.domain); });

				appendMeter(targetRect);

				// Refresh to update values
				refresh();
			}

			/**
			 * Redraws the graph to display updated values.
			 */
			function refresh() {
				// Find the new target (if changed)
				var oldTarget = targetRect;
				rect.classed('target', function(d) { return valueInRange(scope.value, d.range); });

				// Update the meter's position (build new scale if target changed)
				targetRect = svg.selectAll('g.target');
				if (targetRect.data()[0].index !== oldTarget.data()[0].index) {
					oldTarget.selectAll('g.meter').remove();
					targetScale = scale(scope.value, targetRect.data()[0], sectors);
					appendMeter(targetRect);
				}
				meter = targetRect.selectAll('g.meter');
				meter.attr('transform', function(d) { return translate(targetScale(scope.value), (options.meterPosition === 'bottom' ? d.rectHeight : 0 )); });

				// Update the meter's label
				var labelValue = options.meterLabelWithUnits ? ([scope.value, scope.unit].join(' ')) : scope.value;
				var meterLabelComponent = meter.select('.meter-label');
				METER_SHAPES[options.meterShape.type].updateLabel(meterLabelComponent, labelValue);
				var meterLabelContainer = meter.select('.meter-label-container');
				var offsetX = targetRect.data()[0].x + targetScale(scope.value) + options.meterLabelOffset.x;
				var labelWidth = meterLabelContainer[0][0].clientWidth;
				var foOffsetX = (offsetX + labelWidth) > width ? -labelWidth - options.meterLabelOffset.x : options.meterLabelOffset.x;
				if (meterWrapper) {
					meterWrapper
						.attr('x', foOffsetX)
						.style('visibility', 'visible');
				}

				if (options.meterPosition === 'top') {
					//shift all sector components down so that meter fits at top
					var meterHeight = meter.node().getBBox().height;
					svg.selectAll('.sector-rect').attr('transform', function(d) { return translate(0, meterHeight); });

					var fallbackLabels = svg.selectAll('.range-text-fallback');
					fallbackLabels.each(function() {
						var bbox = this.getBBox();
						$(this).attr('transform', function() {
							return translate(-bbox.width / 2, meterHeight + bbox.height / 4);
						});
					});

					svg.selectAll('.sector-meaning-rect').attr('transform', function(d) { return translate(0, meterHeight + rangeRectHeight); });
					svg.selectAll('.range-label-fallback').attr('transform', function(d) { return translate(0, meterHeight + rangeRectHeight + 5); });
				}
			}

			/**
			 * Appends a 'meter' to the target range.
			 *
			 * @param targetSector: the target sector or range.
			 */
			function appendMeter(targetSector) {
				// Create group for meter
				meter = targetSector.append('g')
					.classed('meter', true)
					.classed('meter-' + options.meterShape.type.toLowerCase(), true);

				// Append the triangle
				meter.append('path')
					.attr('d', _.partial(METER_SHAPES[options.meterShape.type].marker, options, 'bottom'))
					.attr('transform', translate(options.meterOffset.x, options.meterOffset.y));

				// Append the label
				METER_SHAPES[options.meterShape.type].label(meter);
			}

			/**
			 * Calculates the path string for an up-pointing isosceles triangle.
			 *
			 * @param base: the base of the triangle.
			 * @param height: the height of the triangle.
			 * @returns {string}: the svg path string for the triangle.
			 */
			function isoscelesTriangle(base, height) {
				return '' +
					'M' + '0' + ' ' + '0' + ' ' +
					'L' + (base / 2) + ' ' + height + ' ' +
					'L' + (-base / 2) + ' ' + height;
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

			/**
			 * Generates the text to describe a range.
			 *
			 * @param range: the range.
			 * @param domain: total domain.
			 * @returns {*}
			 */
			var rangeText = function(range, domain) {
				if (_.isNumber(range.low) && _.isNumber(range.high)) {
					// Middle Sector
					return [textValue(range.low), options.rangeSeparator, textValue(range.high)].join(' ');
				} else if (_.isNumber(range.low) && !_.isNumber(range.high)) {
					// Last Sector
					if ((_.isNumber(domain.high)) && (range.low <= domain.high)) {
						// Checks if we defined a high in Domain
						return [textValue(range.low), options.rangeSeparator, textValue(domain.high)].join(' ');
					} else {
						return [options.graterThanSymbol, textValue(range.low)].join(' ');
					}
				} else if (_.isNumber(range.high) && !_.isNumber(range.low)) {
					// First Sector
					if ((_.isNumber(domain.low)) && (domain.low <= range.high)) {
						// Checks if we defined a low in Domain
						return [textValue(domain.low), options.rangeSeparator, textValue(range.high)].join(' ');
					} else {
						return [options.lowerThanSymbol, textValue(range.high)].join(' ');
					}
				} else {
					return '';
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
			 * @param sector: the sector.
			 * @param ranges: the other ranges.
			 * @returns {number}: output of the scale applied to the value.
			 */
			var scale = function(value, sector, ranges) {

				// Build scale
				var domain = [null, null];

				if (_.isNumber(sector.range.low) || _.isNumber(options.domain.low)) {
					domain[0] = _.isNumber(options.domain.low) && sector.first ? options.domain.low : sector.range.low;
				}

				if (_.isNumber(sector.range.high) || _.isNumber(options.domain.high)) {
					domain[1] = _.isNumber(options.domain.high) && sector.last ? options.domain.high : sector.range.high;
				}

				if (!_.isNumber(domain[0])) {
					var nextConcreteRange;
					if (_.isNumber(options.domain.low)) {
						nextConcreteRange = _.find(ranges, function(sector) {
							return _.isNumber(sector.range.low) && _.isNumber(sector.range.high);
						});
					}

					if (nextConcreteRange) {
						domain[0] = sector.range.high - (nextConcreteRange.range.high - nextConcreteRange.range.low);
					} else {
						domain[0] = _.isNumber(options.domain.low) ? options.domain.low : sector.range.high - 2 * (Math.abs(value - sector.range.high));
					}
				}

				if (!_.isNumber(domain[1])) {
					var rangesCopy = _.map(ranges, _.clone);
					var previousConcreteRange = _.find(rangesCopy.reverse(), function(sector) { return _.isNumber(sector.range.low) && _.isNumber(sector.range.high); });

					if (previousConcreteRange) {
						domain[1] = sector.range.low + (previousConcreteRange.range.high - previousConcreteRange.range.low);
					} else {
						domain[1] = _.isNumber(options.domain.high) ? options.domain.high : sector.range.low + 2 * (Math.abs(value - (sector.range.low)));
					}
				}

				return d3.scale.linear()
					.clamp(true)
					.range([0, sector.width])
					.domain(domain);
			};
		}
	};
};
