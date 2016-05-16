'use strict';

var d3 = require('d3');
var $ = require('jquery');

// @ngInject
module.exports = function() {
	return {
		scope: {
			observationList: '=',
			dateFormat: '=?'
		},
		templateUrl: require('./lab-history-graph.html'),
		restrict: 'E',
		controller: 'LabHistoryGraphController',
		link: function($scope, element, attrs, LabGraph) {
			if ($scope.observationList.length) {

				/** Map observations to simpler objects, and transform dates **/
				var dateFormat = $scope.dateFormat || 'DD-MM-YYYY';	//TODO (denise) check if this format isn't overriden later on
				var data = LabGraph.simplifyObservations($scope.observationList, dateFormat);

				/** Lab Graph Init **/
				var margin = {top: 30, right: 10, bottom: 30, left: 30};
				var width = 530 - margin.left - margin.right;
				var height = 270 - margin.top - margin.bottom;
				var UNIT = (data[0].unit) ? data[0].unit : "";
				var graphElem = element.find('.graph')[0];

				/** Dates **/

				var parseDate = d3.time.format("%d-%m-%Y").parse;
				var formatDate = d3.time.format("%d-%m-%Y");

				/** Axis **/

				var genericValueRange = [0, d3.max(data, function (d) {
					return (d.value > d.highValue) ? d.value : d.highValue;
				})];

				var x = d3.time.scale().range([0, width]);
				var y = d3.scale.linear().range([height, 0]);

				var xAxis = d3.svg.axis().scale(x)
					.orient("bottom")
					.ticks(5)
					.tickFormat(d3.time.format("%b %d"));

				var yAxis = d3.svg.axis()
					.scale(y)
					.tickSize(width + margin.right)
					.ticks(5)
					.tickFormat(function (d) {
						return d === y.domain()[1] ? d + " " + UNIT : d;
					})
					.orient("right");


				$scope.dimensions = {
					margin: margin,
					width: width,
					height: height,
					y: y,
					x: x,
					yAxis: yAxis,
					xAxis: xAxis
				};

				/** Shapes **/

				// var tooltip = d3.select(graphElem).append("div")
				// 	.attr("class", "tooltip")
				// 	.style("opacity", 0);

				var line = d3.svg.line()
					.x(function (d) {
						return x(d.date);
					})
					.y(function (d) {
						return y(d.value);
					})
					.interpolate("lineal");

				/** Lab Graph **/

				var svg = d3.select(graphElem)
					.append("svg")
					.attr("width", $scope.dimensions.width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("class", "lab-graph")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var labGraph = svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + 0 + ")")
					.attr("class", "lab-graph");

				data.forEach(function (d) {
					d.date = parseDate(d.date);
					d.value = +d.value;
				});

				var dateExtent = d3.extent(data, function (d) {
					return d.date;
				});

				x.domain([d3.time.day.offset(dateExtent[0], -1), d3.time.day.offset(dateExtent[1], 1)]);
				y.domain(genericValueRange);

				labGraph.selectAll("healthyRange")
					.data(LabGraph.calculateRectangles(data))
					.enter().append("rect")
					.attr("x", function (d) {
						return d.x;
					})
					.attr("y", function (d) {
						return d.y;
					})
					.attr("width", function (d) {
						return d.width;
					})
					.attr("height", function (d) {
						return d.height;
					})
					.attr("class", "healthyRange");

				labGraph.append("g")
					.attr("class", "y axis")
					.attr("transform", "translate( " + (-margin.left) + ",0)")
					.call(yAxis)
					.call(function (g) {
						g.selectAll("text")
							.attr("x", 4)
							.attr("dy", -4);
					});

				labGraph.append("path")
					.attr("d", line(data))
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("fill", "none")
					.attr("class", "line-graph");

				labGraph.selectAll("lines")
					.data(data)
					.enter().append("line")
					.attr("stroke-width", "1px")
					.attr("stroke", "black")
					.attr("x1", function (d) {
						return x(d.date);
					})
					.attr("x2", function (d) {
						return x(d.date);
					})
					.attr("y1", height)
					.attr("y2", 0)
					.attr("stroke-width", "1px")
					.attr("stroke", "black")
					.attr("class", "underunder");

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate( " + margin.left + "," + height + ")")
					.call(xAxis);

				labGraph.selectAll("dot")
					.data(data)
					.enter().append("circle")
					.attr("class", function (d) {
						return (d.value > d.highValue || d.value < d.lowValue) ? "dot out-of-range" : "dot in-range";
					})
					.attr("r", 3.5)
					.attr("cx", function (d) {
						return x(d.date);
					})
					.attr("cy", function (d) {
						return y(d.value);
					})
					.on("mouseover", function (d) {
						console.log('Value:' + d.value + ', Pos Y: ' + y(d.value));
						var tooltip = $(this).parents('.graph').find('.tooltip');
						var tooltipClass = (d.value < d.lowValue || d.value > d.highValue ) ? "tooltip out-of-range" : "tooltip";

						tooltip.css('opacity', '0.9').addClass(tooltipClass);

						tooltip.html("<strong>" + d.value + " " + d.unit + "</strong><br>" + formatDate(d.date))
							.css("left", (x(d.date) + 23) + "px")
							.css("top", (y(d.value) + 48) + "px");

					})
					.on("mouseout", function (d) {
						var tooltip = $(this).parents('.graph').find('.tooltip');
						tooltip.css("opacity", 0);
					});

				labGraph.selectAll("text")
					.data(data)
					.enter().append("text")
					.attr("x", function (d) {
						return x(d.date);
					})
					.attr("y", function (d) {
						return y(d.value);
					})
					.text(function (d) {
						return d.value;
					})
					.attr("class", "valueTooltip");

				d3.selectAll('circle')
					.transition()
					.duration(300)
					.ease('quad-out')
					.attr('r', function (d) {
						return 5;
					});
			}

		}
	};
};
