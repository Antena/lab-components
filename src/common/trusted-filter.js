'use strict';

// @ngInject
module.exports = function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
};
