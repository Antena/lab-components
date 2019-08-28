'use strict';

/**
 * @ngdoc service
 * @name lab-components.common.service:MathUtilService
 * @kind function
 *
 * @description
 * Provides conversion utilities related numeric values.
 *
 */

// @ngInject
module.exports = function() {

	// workarounds problem with js' toFixed():
	// toFixed --> rounds .5 down
	// this    --> rounds .5 up
	function toFixedDecimals(value, decimals) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	}

	return {

		/**
		 * @ngdoc function
		 * @name toFixedDecimals
		 * @methodOf lab-components.common.service:MathUtilService
		 * @description
		 *
		 * Fixes a number to the given amount of decimals, performing rounding when necessary:
		 * - 0,1,2,3,4 are rounded down
		 * - 5,6,7,8,9 are rounded up
		 *
		 * @param {Number} value The number to transform
		 * @param {Number} decimals The desired amount of decimals the result should have
		 *
		 * @returns {Number} The rounded number.
		 *
		 */
		toFixedDecimals: toFixedDecimals
	};
};
