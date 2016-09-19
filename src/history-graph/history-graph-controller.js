var _ = require('underscore');

// @ngInject
module.exports = function ($scope) {
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
};
