'use strict';

require("./_history-graph.scss");

var d3 = require('d3');

// @ngInject
module.exports = function () {
	return {
		scope: {
			config: '=?',
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
				formatDate: d3.time.format(defaults.dateFormat)
			};

			// Process data
			var data = [];
			for (var i = 0; i < $scope.data.length; i++) {
				data.push({
					date: config.formatDate.parse($scope.data[i].date),
					value: $scope.data[i].value
				})
			}

			// Dimensions
			var width = element[0].offsetWidth - config.margin.left - config.margin.right,
				height = element[0].offsetHeight - config.margin.top - config.margin.bottom;

			// Scales
			var x = d3.time.scale()
				.domain(d3.extent(data, function (d) {
					return d.date;
				}))
				.range([0, width]);

			var y = d3.scale.linear()
				.domain(d3.extent(data, function (d) {
					return d.value;
				}))
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
				.x(function (d) {
					return x(d.date);
				})
				.y(function (d) {
					return y(d.value);
				});

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
			svg.append("g")
				.attr("class", "y axis")
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Price ($)");

			// Line
			svg.append("path")
				.datum(data)
				.attr("class", "line");

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

				// Re draw the line
				svg.select('.line')
					.attr("d", line);
			};

			// Initialize graph
			setTimeout(draw, 0);

			// Listen on window resize
			d3.select(window).on('resize.' + $scope.$id, draw);

		}
	};
};
