'use strict';

// @ngInject
module.exports = function($scope) {
	//TODO(gb): process observation to extract values
	var observation = $scope.vm.observation;

	$scope.vm.values = [
		{ date: "2016-06-29", value: 55 },
		{ date: "2016-06-21", value: 60 },
		{ date: "2016-06-02", value: 63 },
		{ date: "2016-05-03", value: 52 },
		{ date: "2016-04-03", value: 51 },
		{ date: "2016-03-03", value: 50 },
		{ date: "2016-01-10", value: 48 },
		{ date: "2015-01-10", value: 55 },
		{ date: "2014-01-10", value: 58 }
	];
};
