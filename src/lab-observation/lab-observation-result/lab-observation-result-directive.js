'use strict';

require("./_lab-observation-result.scss");

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '='
		},
		templateUrl: require('./lab-observation-result.html'),
		link: function() {
			
		}
	};
};
