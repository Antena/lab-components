'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:optionalNumber
 * @kind function
 *
 * @description
 *   Given a number or a string representation of a number, returns it's value or `'-'` if it's not a number.
 *
 * @param {Number|String} input Any number or a string representation of a number.
 *
 * @returns {String} The transformed string.
 */

var _ = require('underscore');

// @ngInject
module.exports = function() {
	return function(input) {
		return _.isNumber(input) ? input : '-';
	};
};
