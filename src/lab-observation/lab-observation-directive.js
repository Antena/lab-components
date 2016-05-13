'use strict';

// @ngInject
module.exports = function () {

	return {
		scope: {
			observation: '=',
			actions: '=?',
			headerActions: '=?',
			viewOnly: '=?'
		},
		restrict: 'EA',
		transclude: true,
		templateUrl: require('./lab-observation.html')
	};
};