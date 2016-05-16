'use strict';

// @ngInject
module.exports = function() {
	return function (input) {
		return input || '-';
	};
};
