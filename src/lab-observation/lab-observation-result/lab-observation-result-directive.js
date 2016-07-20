'use strict';

require("./_lab-observation-result.scss");

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '=',
			options: '='
		},
		templateUrl: require('./lab-observation-result.html'),
		link: function($scope) {
			$scope.isValueStringHtml = function(observation) {
				return observation && observation.valueString && observation.valueString.toLowerCase().indexOf("<html>") !== -1;
			};
		}
	};
};
