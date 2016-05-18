'use strict';

var moment = require('moment');

// @ngInject
module.exports = function() {
	return function(input, format) {
		var date = moment(input);
		return date.isValid() ? date.format(format) : "Invalid date.";
	};
};
