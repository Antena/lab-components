'use strict';

require("./_history-graph.scss");

var d3 = require('d3');

// @ngInject
module.exports = function () {

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	return {
		scope: {
			config: '=',
			data: '='
		},
		templateUrl: require('./history-graph.html'),
		restrict: 'A',
		link: function ($scope, element) {
			// Default config
			var defaults = {
				margin: {top: 10, right: 10, bottom: 20, left: 30},
				dateFormat: '%d-%b-%y'
			};

			// Parse config
			var config = {
				margin: defaults.margin,
				dateFormat: $scope.config.dateFormat || defaults.dateFormat,
				dateFrom: $scope.config.dateFrom,
				dateTo: $scope.config.dateTo,
				yDomain: [
					$scope.config.yDomain && !isNaN($scope.config.yDomain.from) ? $scope.config.yDomain.from : null,
					$scope.config.yDomain && !isNaN($scope.config.yDomain.to) ? $scope.config.yDomain.to : null
				],
				metricName: $scope.config.metricName,
				metricUnit: $scope.config.metricUnit
			};

			// Date parser
			var formatDate = d3.time.format(config.dateFormat);

			// Process data
			var data = [];
			for (var i = 0; i < $scope.data.length; i++) {
				data.push({
					date: formatDate.parse($scope.data[i].date),
					value: $scope.data[i].value
				})
			}

			// Dimensions
			var width = element[0].offsetWidth - config.margin.left - config.margin.right,
				height = element[0].offsetHeight - config.margin.top - config.margin.bottom;

			// Scales
			var xDomain = d3.extent(data, function (d) { return d.date; });
			var x = d3.time.scale()
				.domain([config.dateFrom || xDomain[0], config.dateTo || xDomain[1]])
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

			// Line function
			var line = d3.svg.line()
				.x(function (d) { return x(d.date); })
				.y(function (d) { return y(d.value); });

			// SVG
			var svg = d3.select(element.find('.graph')[0]).append("svg")
				.attr("width", width + config.margin.left + config.margin.right)
				.attr("height", height + config.margin.top + config.margin.bottom)
				.append("g")
				.attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

			// x-Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")");

			// y-Axis
			var yAxisGroup = svg.append("g")
				.attr("class", "y axis");

			// Line
			svg.append("path")
				.attr("class", "line");

			// Data points
			svg.selectAll(".dot")
				.data(data)
				.enter().append('circle')
				.attr("class", "dot")
				.attr("r", 3.5);

			/**
			 * Draws all dynamic elements of the graph.
			 */
			var draw = function () {
				// New dimensions
				var width = element[0].offsetWidth - config.margin.left - config.margin.right,
					height = element[0].offsetHeight - config.margin.top - config.margin.bottom;

				// Update scale ranges
				x.range([0, width]);
				y.range([height, 0]);

				// Redraw axes
				svg.select('.x.axis')
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				svg.select('.y.axis')
					.call(yAxis);

				// Redraw the line
				svg.select('.line')
					.attr("d", line(data));

				// Redraw dots
				svg.selectAll(".dot")
					.attr("cx", function(d) { return x(d.date); })
					.attr("cy", function(d) { return y(d.value); });
			};

			// Initialize graph
			setTimeout(draw, 0);

			// Listen on window resize
			d3.select(window).on('resize.' + $scope.$id, draw);
		}
	};
};
