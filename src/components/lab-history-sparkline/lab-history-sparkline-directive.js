

module.exports = function () {
	return {
		restrict: 'EA',
		scope: {
			values: "="
		},
		templateUrl: require('./lab-history-sparkline.html'),
		bindToController: true,
		controllerAs: 'vm',
		controller: 'LabHistorySparklineController'
	}
};
