var d3 = require('d3');
var _ = require('underscore');
var angular = require('angular');

// @ngInject
module.exports = function() {

	var rangeText = function(range) {
		if (_.isNumber(range.low) && _.isNumber(range.high)) {
			return range.low + " to " + range.high;
		} else if (_.isNumber(range.low) && !_.isNumber(range.high)) {
			return ">" + range.low;
		} else if (_.isNumber(range.high) && !_.isNumber(range.low)) {
			return "<" + range.high;
		} else {
			return "";
		}
	};

	return {
		restrict: 'EA',
		scope: {
			value: '=',
			unit: '=?',
			ranges: '=',
			options: '='
		},
		link: function (scope, elem) {
			var options = _.defaults({}, scope.options, {
				width: 0,
				height: 80,
				padding: { left: 10, right: 10, top: 10 },
				innerSpacing: 10,
				arrowWidth: 20,
				labelHeight: 25
			});

			var svg;

			setTimeout(function() {
				options.width = angular.element(elem.parent()[0]).width();
				init();
			}, 0);

			function init() {
				svg = d3.select(elem[0]).append('svg')
					.attr('width', options.width)
					.attr('height', options.height);

				// Pre-process ranges
				var sectorWidth = (options.width - options.padding.left - options.padding.right - (2 * options.arrowWidth) - ((scope.ranges.length - 1) * options.innerSpacing)) / scope.ranges.length;
				var sectors = _.map(scope.ranges, function (range, i) {
					range.x = options.padding.left + options.arrowWidth + i * (sectorWidth + options.innerSpacing);
					range.width = sectorWidth;
					range.height = options.height - options.padding.top;
					range.rectHeight = range.height - options.labelHeight;
					return range;
				});

				scale = d3.scale.linear()
					.range([options.padding.left, options.width - options.padding.right]);


				// Sectors
				var sector = svg.selectAll('g.sector')
					.data(sectors)
					.enter().append('g')
					.classed('sector', true)
					.attr('transform', function (d) { return 'translate(' + d.x + ')'; });

				// Rectangles
				var rect = sector.append('g')
					.attr('transform', 'translate(0, ' + options.labelHeight + ')');
				rect.append('rect')
					.attr('width', function(d) { return d.width })
					.attr('height', function(d) { return d.rectHeight })
					.classed('range-danger', function (d) { return d.class == 'range-danger' })
					.classed('range-bad', function (d) { return d.class == 'range-bad' })
					.classed('range-so-so', function (d) { return d.class == 'range-so-so' })
					.classed('range-good', function (d) { return d.class == 'range-good' })
					.classed('range-great', function (d) { return d.class == 'range-great' });

				// Range text
				rect.append('text')
					.attr('x', function(d) { return d.width / 2 } )
					.attr('y', function (d) { return d.rectHeight / 2 })
					.attr('dy', '0.375em')
					.attr('text-anchor', 'middle')
					.text(function(d) { return rangeText(d) });

				// Range label
				sector.append('text')
					.attr('text-anchor', 'start')
					.attr('dy', '1em')
					.text(function(d) { return d.label })

				// Arrows
				rect.append('path')
					.attr('d', function (d) {
						return '' +
							'M' + '0' + ' ' + '0' + ' ' +
							'L' + (-options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + '0' + ' ' + d.rectHeight;
					})
					.style('visibility', function (d, i) { return i == 0 ? 'visible': 'hidden' } )
					.classed('range-danger', function (d) { return d.class == 'range-danger' })
					.classed('range-bad', function (d) { return d.class == 'range-bad' })
					.classed('range-so-so', function (d) { return d.class == 'range-so-so' })
					.classed('range-good', function (d) { return d.class == 'range-good' })
					.classed('range-great', function (d) { return d.class == 'range-great' });
				rect.append('path')
					.attr('d', function (d) {
						return '' +
							'M' + d.width + ' ' + '0' + ' ' +
							'L' + (d.width + options.arrowWidth) + ' ' + (d.rectHeight / 2) + ' ' +
							'L' + d.width + ' ' + d.rectHeight;
					})
					.style('visibility', function (d, i) { return i == (sectors.length - 1) ? 'visible': 'hidden' } )
					.classed('range-danger', function (d) { return d.class == 'range-danger' })
					.classed('range-bad', function (d) { return d.class == 'range-bad' })
					.classed('range-so-so', function (d) { return d.class == 'range-so-so' })
					.classed('range-good', function (d) { return d.class == 'range-good' })
					.classed('range-great', function (d) { return d.class == 'range-great' });
			}

		}
	}
};
