'use strict';

/**
 * @ngdoc directive
 * @name lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph
 * @restrict AE
 * @scope
 *
 * @description
 *
 * //TODO (gb) add description
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
 *
 *
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
			var options = _.defaults({}, scope.options, {
				height: 70,
				padding: { left: 10, right: 10, top: 10, bottom: 10 },
				innerSpacing: 10,
				arrowWidth: 7,
				labelHeight: 25,
				rangeSeparator: 'a',
				lowerThanSymbol: '<',
				graterThanSymbol: '>',
				domain: {}
			});

			var svg, width;

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
				var rangeIndex = _.findIndex(ranges, function(sector) { return sector.x == range.x; }),
					isFirst = rangeIndex == 0,
					isLast = rangeIndex == ranges.length - 1;

				// Build scale
				var domain = [null, null];

				if (_.isNumber(range.low) || _.isNumber(options.domain.low)) {
					domain[0] = _.isNumber(options.domain.low) && isFirst ? options.domain.low : range.low;

				}

				if (_.isNumber(range.high) || _.isNumber(options.domain.high)) {
					domain[1] = _.isNumber(options.domain.high) && isLast ? options.domain.high : range.high;
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

				var scale = d3.scale.linear()
					.clamp(true)
					.range([0, range.width])
					.domain(domain);

				return scale(value);
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
				var sectors = _.map(scope.ranges, function (range, i) {
					range.x = options.padding.left + options.arrowWidth + i * (sectorWidth + options.innerSpacing);
					range.width = sectorWidth;
					range.height = options.height - options.padding.top - options.padding.bottom;
					range.rectHeight = range.height - options.labelHeight;
					return range;
				});

				// Sectors
				var sector = svg.selectAll('g.sector')
					.data(sectors)
					.enter().append('g')
					.classed('sector', true)
					.attr('transform', function (d) { return 'translate(' + d.x + ')'; });

				// Rectangles
				var rect = sector.append('g')
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

				// Value
				var target = svg.selectAll('g.target');

				target.append('path')
					.attr('d', d3.svg.symbol().type('triangle-up'))
					.attr('transform', function(d) {
						var x = scale(scope.value, d, sectors);
                        return 'translate(' + x + ',' + (d.rectHeight) + ')'
					});

				target.append('text')
					.attr('transform', function(d) {
						var x = scale(scope.value, d, sectors);
						return 'translate(' + x + ',' + (d.rectHeight) + ')'
					})
					.attr('dy', '20px')
					.attr('text-anchor', 'middle')
					.text(scope.value)

			}

		}
	}
};
