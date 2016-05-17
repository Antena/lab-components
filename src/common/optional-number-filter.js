'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function() {
	return function(input) {
		return _.isNumber(input) ? input : '-';
	};
};
