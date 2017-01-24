'use strict';

var _ = require('underscore');
var moment = require('moment');

// @ngInject
module.exports = function($scope) {

	// Sort data
	$scope.data = _.sortBy($scope.data, function(datum) {
		return -new Date(datum.date).getTime();
	});

	// Compute ranges
	var ranges = [],
		ticks = [];
	if ($scope.data.length > 0) {
		_.each($scope.data[0].ranges, function(r) {
			ranges.push({
				code: r.code,
				values: [],
				clazz: r.clazz
			});
		});
		_.each($scope.data, function(datum) {
			var date = datum.date;
			_.each(datum.ranges, function(range) {
				var targetRange = _.find(ranges, function(r) {
					return r.code === range.code;
				});
				targetRange.values.push({
					date: date,
					low: range.low,
					high: range.high
				});
				ticks.push(range.low, range.high);
			});
		});
	}

	// Add virtual ranges
	if (ranges.length > 0) {
		_.each(ranges, function(range) {
			var last = _.clone(range.values[0]),
				first = _.clone(range.values[range.values.length - 1]);
			last.date = moment().endOf("day").toISOString();
			first.date = moment().subtract(10, 'years').toISOString();
			range.values.unshift(last);
			range.values.push(first);
		});
	}

	$scope.yAxisTicks = _.without(_.uniq(ticks), null);
	$scope.ranges = ranges;

	// Time controls
	$scope.parseTimeControls = function(controls) {
		var timeControls = [];
		_.each(controls.split(' '), function(control) {
			var days = control.split('d'),
				weeks = control.split('w'),
				months = control.split('m'),
				years = control.split('y'),
				to = moment().endOf("day");

			if (days.length === 2 && !isNaN(parseInt(days[0]))) {
				timeControls.push({
					id: control,
					label: control,
					ticks: { every: 1, interval: 'days'},
					from: to.clone().subtract(parseInt(days[0]), 'days').startOf('day').toDate(),
					to: to.toDate()
				});
			} else if (weeks.length === 2 && !isNaN(parseInt(weeks[0]))) {
				timeControls.push({
					id: control,
					label: control,
					ticks: { every: 1, interval: 'days'},
					from: to.clone().subtract(parseInt(weeks[0]), 'weeks').startOf('day').toDate(),
					to: to.toDate()
				});
			} else if (months.length === 2 && !isNaN(parseInt(months[0]))) {
				timeControls.push({
					id: control,
					label: control,
					ticks: { every: parseInt(months[0]) < 4 ? 8 : 1, interval: parseInt(months[0]) < 4 ? 'days' : 'months'},
					from: to.clone().subtract(parseInt(months[0]), 'months').startOf('day').toDate(),
					to: to.toDate()
				});
			} else if (years.length === 2 && !isNaN(parseInt(years[0]))) {
				timeControls.push({
					id: control,
					label: control,
					ticks: { every: 1, interval: 'months'},
					from: to.clone().subtract(parseInt(years[0]), 'years').startOf('day').toDate(),
					to: to.toDate()
				});
			}

		});

		$scope.timeControls = timeControls;
	};

	$scope.selectTimeControl = function(interval) {
		$scope.selectedControl = _.find($scope.timeControls, function(control) {
			return control.id === interval;
		});
	};
};
