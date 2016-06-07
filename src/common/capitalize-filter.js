'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:capitalize
 * @kind function
 *
 * @description
 *   Allows you to make capital the first letter of words in a given string. Defaults to just transforming
 *   the first word, but can be configured to transform all words.
 *
 * @param {String} input Any string.
 * @param {Boolean} [all=false] Indicates whether to transform all words in the given string.
 * @returns {String} The transformed string.
 *
 *
 * @example
 <example module="lab-components.common">
 <file name="index.html">
 <p>Capitalize with default options:
 <strong>{{ 'The quick brown fox jumps over the lazy dog' | capitalize }}</strong>
 </p>
 <p>Capitalize with all=true:
 <strong>{{ 'The quick brown fox jumps over the lazy dog' | capitalize:true }}</strong>
 </p>
 </file>
 </example>
 *
 */

// @ngInject
module.exports = function() {

	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}) : '';
	};
};
