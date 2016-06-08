'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:customFormatDate
 * @kind function
 *
 * @description
 *   Given a date or a string representation of a date, returns the date formatted according to the given format, or `"Invalid date."` if it's not a valid date.
 *
 * @param {Date|String} input Any date or a string representation of a date.
 *
 * @param {String} format A valid date format string.
 *
 * @returns {String} The formatted date.
 */

var moment = require('moment');

// @ngInject
module.exports = function() {
	return function(input, format) {
		var date = moment(input);
		return date.isValid() ? date.format(format) : "Invalid date.";
	};
};
