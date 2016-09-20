var _ = require('underscore');
var moment = require('moment');

// @ngInject
module.exports = function ($scope) {

	// Compute ranges
	var ranges = [];
	_.each($scope.data[0].ranges, function (r) {
		ranges.push({
			code: r.code,
			values: []
		})
	});
	_.each($scope.data, function (datum) {
		var date = datum.date;
		_.each(datum.ranges, function (range) {
			var targetRange = _.find(ranges, function (r) { return r.code == range.code });
			targetRange.values.push({
				date: date,
				low: range.low,
				high: range.high
			})
		})
	});
	$scope.ranges = ranges;

	// Time controls
	$scope.timeControls = function (controls) {
		var timeControls = [];
		_.each(controls.split(' '), function(control) {
			var days = control.split('d'),
				weeks = control.split('w'),
				months = control.split('m'),
				years = control.split('y'),
				to = moment().endOf("day");

			if (days.length == 2 && !isNaN(parseInt(days[0]))) {
				timeControls.push({
					id: control,
					label: control,
					from: to.clone().subtract(parseInt(days[0]), 'days').startOf('day').toDate(),
					to: to.toDate()
				})
			} else if (weeks.length == 2 && !isNaN(parseInt(weeks[0]))) {
				timeControls.push({
					id: control,
					label: control,
					from: to.clone().subtract(parseInt(weeks[0]), 'weeks').startOf('day').toDate(),
					to: to.toDate()
				})
			} else if (months.length == 2 && !isNaN(parseInt(months[0]))) {
				timeControls.push({
					id: control,
					label: control,
					from: to.clone().subtract(parseInt(months[0]), 'months').startOf('day').toDate(),
					to: to.toDate()
				})
			} else if (years.length == 2 && !isNaN(parseInt(years[0]))) {
				timeControls.push({
					id: control,
					label: control,
					from: to.clone().subtract(parseInt(years[0]), 'years').startOf('day').toDate(),
					to: to.toDate()
				})
			}

		});

		$scope.timeControls = timeControls;
	};

	$scope.selectTimeControl = function (interval) {
		$scope.selectedControl = _.find($scope.timeControls, function (control) {
			return control.id === interval;
		});
	}
};