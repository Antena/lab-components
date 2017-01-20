'use strict';
// jscs:disable requireBlocksOnNewline

/**
 * @ngdoc directive
 * @name lab-components.components.sparkline.directive:sparkline
 * @restrict AE
 * @scope
 *
 * @description
 * //TODO(gb): add description
 *
 * @element ANY
 * @param {Array} values An array of objects of form { date: String, value: Number } where date is a formatted string date.
 * @param {Object=} [options] An object iwth options to override:
 * Defaults:
 * ```js
 * {
 *		width: 100,
 *		height: 25,
 *		padding: { left: 5, right: 5, bottom: 5, top: 5 },
 *		circleRadius: 2,
 *		defaultDateHistory: 1000 * 60 * 60 * 24 * 30 * 6,
 *		dateFormat: '%Y-%m-%d'
 * }
 * ```
 *
 * @example
 <example module="sparkline-example">
 	<file name="index.html">
 		<div ng-controller="ExampleController" class="example">
			 <sparkline
 				values="example.values"
 				options="example.options">
			 </sparkline>
 		</div>
 	</file>

 	<file name="demo.js">
 		angular.module('sparkline-example', ['lab-components.components.sparkline'])
 			.controller('ExampleController', ['$scope', function($scope) {
				$scope.example = {
					values: [
						{ date: "2016-06-29", value: 55 },
						{ date: "2016-06-21", value: 60 },
						{ date: "2016-06-02", value: 63 },
						{ date: "2016-05-03", value: 52 },
						{ date: "2016-04-03", value: 51 },
						{ date: "2016-03-03", value: 50 },
						{ date: "2016-01-10", value: 48 },
						{ date: "2015-01-10", value: 55 },
						{ date: "2014-01-10", value: 58 }
					],
					options: { }
				};

				$scope.example.json = angular.toJson($scope.example.values);

				$scope.$watch('example.json', function(newValue) {
					if (newValue) {
						$scope.example.observation = angular.fromJson(newValue);
					}
				});
			}]
 		);

 	</file>
 </example>
 */

var d3 = require('d3');
var _ = require('underscore');

require('./_sparkline.scss');

// @ngInject
module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			data: '=values',
			options: '=?'
		},
		link: function(scope, elem) {
			// Options
			var options = _.defaults({}, scope.options, {
				width: 100,
				height: 25,
				padding: { left: 5, right: 5, bottom: 5, top: 5 },
				circleRadius: 2,
				defaultDateHistory: 1000 * 60 * 60 * 24 * 30 * 6,	// 6 months
				dateFormat: '%Y-%m-%d'
			});

			// var width = options.width - options.padding.left - options.padding.right,
			// 	height = options.height - options.padding.top - options.padding.bottom;

			var svg = d3.select(elem[0]).append('svg')
				.attr('class', 'sparkline-graph')
				.attr('width', options.width)
				.attr('height', options.height);

			var x = d3.scale.linear().range([options.padding.left, options.width - options.padding.right]);
			var y = d3.scale.linear().range([options.height - options.padding.bottom, options.padding.top]);

			var parseDate = d3.time.format(options.dateFormat).parse;

			var line = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.value); });

			function sparkline(data) {
				data.forEach(function(d) {
					d.date = parseDate(d.date);
					d.value = +d.value;
				});

				x.domain(d3.extent(data, function(d) { return d.date; }));
				y.domain(d3.extent(data, function(d) { return d.value; }));

				// Fix scale domains (if necessary)
				if (x.domain()[0] === x.domain()[1]) {
					x.domain([x.domain()[0] - options.defaultDateHistory, x.domain()[1]]);
				}
				if (y.domain()[0] === y.domain()[1]) {
					y.domain([0, 2 * y.domain()[0]]);
				}

				// Sparkline
				svg.append('path')
					.datum(data)
					.attr('class', 'sparkline')
					.attr('d', line);

				// Current value
				svg.append('circle')
					.datum(data[0])
					.attr('class', 'current')
					.attr('r', options.circleRadius)
					.attr('cx', function(d) { return x(d.date); })
					.attr('cy', function(d) { return y(d.value); });

			}

			sparkline(scope.data);
		}
	};
};
