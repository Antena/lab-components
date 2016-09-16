'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function ($scope) {
	// Prepare observations for history-graph directive
	$scope.config = {};
	$scope.values = $scope.observationList;
};
