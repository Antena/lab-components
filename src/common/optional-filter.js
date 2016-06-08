'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:optional
 * @kind function
 *
 * @description
 *   Given a string, returns it's value or `'-'` if it's undefined.
 *
 * @param {String} input Any string.
 * 
 * @returns {String} The transformed string.
 */

// @ngInject
module.exports = function() {
	return function(input) {
		return input || '-';
	};
};
