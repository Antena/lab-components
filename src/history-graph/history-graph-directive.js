'use strict';

require("./_history-graph.scss");

var d3 = require('d3');

// @ngInject
module.exports = function () {

	/**
	 * Detemrines whether a value is a number.
	 *
	 * @param n: the value tu test
	 * @returns {boolean}
	 */
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/**
	 *
	 * @param interval
	 */
	var dateRangeFromTimeInterval = function (interval) {
		// Domain
		var now = new Date(),
			to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
			from = new Date(now.getFullYear(), now.getMonth()-parseInt(interval), now.getDate(), 0, 0, 0, 0);

		return {
			domain: [from, to]
		};
	};

	return {
		scope: {
			config: '=',
			data: '='
		},
		templateUrl: require('./history-graph.html'),
		controller: 'HistoryGraphController',
		restrict: 'A',
		link: function ($scope, element) {
			// Default config
			var defaults = {
				margin: {top: 10, right: 20, bottom: 20, left: 30},
				dateFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				timeInterval: '1m',
				interpolate: 'linear'
			};

			// Parse config
			var config = {
				margin: defaults.margin,
				dateFormat: $scope.config.dateFormat || defaults.dateFormat,
				yDomain: [
					$scope.config.yDomain && !isNaN($scope.config.yDomain.from) ? $scope.config.yDomain.from : null,
					$scope.config.yDomain && !isNaN($scope.config.yDomain.to) ? $scope.config.yDomain.to : null
				],
				timeInterval: $scope.config.timeInterval || defaults.timeInterval,
				ranges: $scope.config.ranges,
				interpolate: $scope.config.interpolate || defaults.interpolate
			};

			// Date parser
			var formatDate = d3.time.format(config.dateFormat);

			// Time interval
			var timeInterval = config.timeInterval;

			// Process data
			var data = [];
			for (var i = 0; i < $scope.data.length; i++) {
				data.push({
					date: formatDate.parse($scope.data[i].date),
					value: $scope.data[i].value
				})
			}

			// Dimensions
			var width = element.find('.chart')[0].offsetWidth - config.margin.left - config.margin.right,
				height = element.find('.chart')[0].offsetHeight - config.margin.top - config.margin.bottom;

			// Scales
			var xDomain = d3.extent(data, function (d) { return d.date; });
			var x = d3.time.scale()
				.domain([config.dateFrom || xDomain[0], config.dateTo || xDomain[1]])
				.nice(d3.time.month)
				.range([0, width]);

			var yDomain = d3.extent(data, function (d) { return d.value; });
			var y = d3.scale.linear()
				.domain([isNumber(config.yDomain[0]) ? config.yDomain[0] : yDomain[0], isNumber(config.yDomain[1]) ? config.yDomain[1] : yDomain[1] ])
				.range([height, 0]);

			// Axes
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");

			// Ranges
			var stack = d3.layout.stack()
				.offset("zero")
				.values(function(d) { return d.values; });

			var area = d3.svg.area()
				.x(function(d) { return x(formatDate.parse(d.date)); })
				.y0(function(d) { return d.low ? y(d.low) : height; })
				.y1(function(d) { return d.high ? y(d.high) : 0; });

			// Line function
			var line = d3.svg.line()
				.x(function (d) { return x(d.date); })
				.y(function (d) { return y(d.value); })
				.interpolate(config.interpolate);

			var zoom = d3.behavior.zoom()
				.x(x)
				.scaleExtent([1, 1])
				.on("zoom", pan);

			// SVG
			var svg = d3.select(element.find('.chart')[0]).append("svg")
				.attr("width", width + config.margin.left + config.margin.right)
				.attr("height", height + config.margin.top + config.margin.bottom)
				.append("g")
				.attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

			// x-Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")");

			// y-Axis
			svg.append("g")
				.attr("class", "y axis");

			// Ranges
			svg.selectAll("path")
				.data(stack($scope.ranges))
				.enter().append("path")
				.attr("class", function (d) {return 'range range-' + d.code; })
				.style("fill", function (d) { if (config.ranges && config.ranges[d.code]) { return config.ranges[d.code]; } });

			// Line
			svg.append("path")
				.attr("class", "line");

			// Data points
			svg.selectAll(".dot")
				.data(data)
				.enter().append('circle')
				.attr("class", "dot")
				.attr("r", 3.5);

			svg.append("rect")
				.attr("class", "pane")
				.attr("width", width)
				.attr("height", height)
				.call(zoom);

			/**
			 * Draws all dynamic elements of the chart.
			 */
			function draw() {
				// New dimensions
				var width = element.find('.chart')[0].offsetWidth - config.margin.left - config.margin.right,
					height = element.find('.chart')[0].offsetHeight - config.margin.top - config.margin.bottom;

				// x-scale
				var xScaleParameters = dateRangeFromTimeInterval(timeInterval);
				x
					.range([0, width])
					.domain(xScaleParameters.domain)
					.nice(d3.time.day);
				zoom.x(x);

				// y-scale
				y.range([height, 0]);

				// Redraw axes
				svg.select('.x.axis')
					.transition()
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				svg.select('.y.axis')
					.transition()
					.call(yAxis);

				svg.selectAll('.range')
					.transition()
					.attr("d", function(d) { return area(d.values); });

				// Redraw the line
				svg.select('.line')
					.transition()
					.attr("d", line(data));

				// Redraw dots
				svg.selectAll(".dot")
					.transition()
					.attr("cx", function(d) { return x(d.date); })
					.attr("cy", function(d) { return y(d.value); });
			}

			/**
			 * Redraws only elements affected by panning
			 */
			function pan() {
				// Limit pan
				if (zoom.translate()[0] < 0) {
					zoom.translate([0, zoom.translate()[1]])
				}
				svg.select(".x.axis").call(xAxis);
				svg.select('.line').attr("d", line(data));
				svg.selectAll(".dot").attr("cx", function(d) { return x(d.date); });
				svg.selectAll('.range').attr("d", function(d) { return area(d.values); });
			}

			// Initialize chart
			setTimeout(draw, 0);

			// Listen on window resize
			d3.select(window).on('resize.' + $scope.$id, draw);

			// Listen time controls click
			var options = element.parent().find('.time-controls .option');
			d3.select(element.parent().find('.time-controls .option[data-interval="' + timeInterval + '"]')[0])
				.classed('selected', true);
			d3.selectAll(options).on('click', function() {
				// Toggle option selection
				var option = d3.select(this);
				d3.selectAll(options).classed('selected', false);
				option.classed('selected', true);

				timeInterval = option.attr("data-interval");
				draw();
			});
		}
	};
};
