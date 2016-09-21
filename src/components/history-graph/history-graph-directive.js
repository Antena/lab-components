'use strict';

require("./_history-graph.scss");

var d3 = require('d3');
var _ = require('underscore');

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

	// Time scale localization
	var SPANISH = d3.locale({
		"decimal": ",",
		"thousands": ".",
		"grouping": [3],
		"currency": ["$", ""],
		"dateTime": "%a %b %e %X %Y",
		"date": "%d/%m/%Y",
		"time": "%H:%M:%S",
		"periods": ["AM", "PM"],
		"days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"],
		"shortDays": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
		"months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		"shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
	});
	var customTimeFormat = SPANISH.timeFormat.multi([
		[".%L", function(d) { return d.getMilliseconds(); }],
		[":%S", function(d) { return d.getSeconds(); }],
		["%I:%M", function(d) { return d.getMinutes(); }],
		["%I %p", function(d) { return d.getHours(); }],
		["%d", function(d) { return d.getDate() != 1 }],
		["%b", function(d) { return d.getMonth(); }],
		["%Y", function() { return true; }]
	]);

	return {
		scope: {
			config: '=',
			data: '='
		},
		templateUrl: require('./history-graph.html'),
		controller: 'HistoryGraphController',
		controllerAs: '$ctrl',
		restrict: 'A',
		link: function ($scope, element) {

			// Default config
			var defaults = {
				margin: {top: 10, right: 1, bottom: 20, left: 30},
				dateFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				timeControls: '1m 3m 6m 1y',
				timeInterval: '1m',
				interpolate: 'linear',
				minAmplitude: 10,
				yDomainPadding: { top: 0.1, bottom: 0.1 }
			};

			var options = !!$scope.config ? _.defaults({}, $scope.config, defaults) : defaults;

			// Parse config
			var config = {
				margin: defaults.margin,
				dateFormat: options.dateFormat,
				yDomain: [
					options.yDomain && !isNaN(options.yDomain.from) ? options.yDomain.from : null,
					options.yDomain && !isNaN(options.yDomain.to) ? options.yDomain.to : null
				],
				timeControls: options.timeControls,
				timeInterval: options.timeInterval,
				ranges: options.ranges,
				interpolate: options.interpolate,
				minAmplitude: options.minAmplitude,
				yDomainPadding: defaults.yDomainPadding
			};

			// Date parser
			var formatDate = d3.time.format(config.dateFormat);

			// Time interval
			var timeInterval = null;
			$scope.parseTimeControls(config.timeControls);
			$scope.selectTimeControl(config.timeInterval);

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

			// X scale
			var xDomain = d3.extent(data, function (d) { return d.date; });
			var x = d3.time.scale()
				.domain([config.dateFrom || xDomain[0], config.dateTo || xDomain[1]])
				.range([0, width]);

			// Y scale
			var yDomain = d3.extent(data, function (d) { return d.value; });
			if ($scope.ranges.length > 0) {
				var lowerLimit = d3.min($scope.ranges[0].values, function (d) { return d.high }),
					higherLimit = d3.max($scope.ranges[$scope.ranges.length-1].values, function (d) { return d.low });
				yDomain = [Math.min(yDomain[0], lowerLimit), Math.max(yDomain[1], higherLimit)];
			}
			var amplitude = Math.max(yDomain[1] - yDomain[0], config.minAmplitude);
			yDomain = [yDomain[0] - (amplitude * config.yDomainPadding.bottom), yDomain[1] + (amplitude * config.yDomainPadding.top)];
			yDomain = [isNumber(config.yDomain[0]) ? config.yDomain[0] : yDomain[0], isNumber(config.yDomain[1]) ? config.yDomain[1] : yDomain[1]];

			var y = d3.scale.linear()
				.domain(yDomain)
				.range([height, 0]);

			// Axes
			var xAxis = d3.svg.axis()
				.scale(x)
				.tickFormat(customTimeFormat)
				.orient("bottom");

			var yAxisTicks = [].concat($scope.yAxisTicks);
			yAxisTicks.push(yDomain[0]);
			yAxisTicks.push(yDomain[1]);

			var yAxis = d3.svg.axis()
				.scale(y)
				.tickValues(yAxisTicks)
				.orient("left");

			// Ranges
			var stack = d3.layout.stack()
				.offset("zero")
				.values(function(d) { return d.values; });

			var area = d3.svg.area()
				.interpolate('step')
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

			// Pan pane
			svg.append("rect")
				.attr("class", "pane")
				.attr("width", width)
				.attr("height", height)
				.call(zoom);

			svg.append("rect")
				.attr("class", "yaxis-mask")
				.attr("width", config.margin.left)
				.attr("x", -config.margin.left)
				.attr("height", height);

			// x-Axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")");

			// y-Axis
			svg.append("g")
				.attr("class", "y axis");

			/**
			 * Draws all dynamic elements of the chart.
			 */
			function draw() {
				// New dimensions
				var width = element.find('.chart')[0].offsetWidth - config.margin.left - config.margin.right,
					height = element.find('.chart')[0].offsetHeight - config.margin.top - config.margin.bottom;

				// X scale
				x.range([0, width]).domain([timeInterval.from, timeInterval.to]).nice(d3.time.day);
				zoom.x(x);

				// Y scale
				y.range([height, 0]);

				// Redraw axes
				svg.select('.x.axis')
					.transition()
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
				svg.select('.y.axis')
					.transition()
					.call(yAxis);

				// Redraw ranges
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
				if (zoom.translate()[0] < 0) { zoom.translate([0, zoom.translate()[1]]) }
				svg.select(".x.axis").call(xAxis);
				svg.select('.line').attr("d", line(data));
				svg.selectAll(".dot").attr("cx", function(d) { return x(d.date); });
				svg.selectAll('.range').attr("d", function(d) { return area(d.values); });
			}

			// Initialize chart
			setTimeout(draw, 0);

			// Listen on window resize
			d3.select(window).on('resize.' + $scope.$id, draw);

			// Watch for a change in the time controls
			$scope.$watch('selectedControl', function (control) {
				timeInterval = { from: control.from, to: control.to };
				draw();
			});

		}
	};
};
