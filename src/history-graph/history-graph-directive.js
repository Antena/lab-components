'use strict';

var d3 = require('d3');

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

require("./_history-graph.scss");

// @ngInject
module.exports = function ($timeout) {

	return {
		scope: {
			config: '=?',
			data: '='
		},
		templateUrl: require('./history-graph.html'),
		restrict: 'A',
		controller: 'HistoryGraphController',
		controllerAs: '$ctrl',
		link: function ($scope, element, attrs, $ctrl) {

			// Default config
			var defaults = {
				margin: { top: 10, right: 10, bottom: 20, left: 30 },
				dateFormat: '%d-%b-%y'
			};

			// Parse config
			var config = {
				margin: defaults.margin,
				minWidth: 200,
				minHeight: 300,
				formatDate: d3.time.format(defaults.dateFormat)
			};

			// Process data
			var data = [];
			for (var i=0; i<$scope.data.length; i++) {
				data.push({
					date: config.formatDate.parse($scope.data[i].date),
					value: $scope.data[i].value
				})
			}

			var draw = function() {
				console.log(element[0].offsetWidth);        //TODO(gb): Remove trace!!!
			};

			var init = function () {
				var width = Math.max(element[0].offsetWidth, config.minWidth) - config.margin.left - config.margin.right,
					height = Math.max(element[0].offsetHeight, config.minHeight) - config.margin.top - config.margin.bottom;

				var x = d3.time.scale()
					.range([0, width]);

				var y = d3.scale.linear()
					.range([height, 0]);

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var line = d3.svg.line()
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.value); });

				var svg = d3.select(element.find('.graph')[0]).append("svg")
					.attr("width", width + config.margin.left + config.margin.right)
					.attr("height", height + config.margin.top + config.margin.bottom)
					.append("g")
					.attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

				x.domain(d3.extent(data, function(d) { return d.date; }));
				y.domain(d3.extent(data, function(d) { return d.value; }));

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Price ($)");

				svg.append("path")
					.datum(data)
					.attr("class", "line")
					.attr("d", line);
			};

			// Initialize graph
			setTimeout(init, 0);

			// Listen on window resize
			d3.select(window).on('resize', draw);

		}
	};
};
