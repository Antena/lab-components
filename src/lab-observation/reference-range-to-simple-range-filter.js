'use strict';

var _ = require('underscore');

module.exports = function() {

	// Hash function for two signed numbers.
	// Szudzik's elegant pairing for signed values [http://szudzik.com/ElegantPairing.pdf]
	// http://stackoverflow.com/a/13871379/6317595
	function elegantPairing(x, y) {
		var A = x >= 0 ? 2 * x : -2 * x - 1;
		var B = y >= 0 ? 2 * y : -2 * y - 1;
		var C = (A >= B ? A * A + A + B : A + B * B) / 2;
		return x < 0 && y < 0 || x >= 0 && y >= 0 ? C : -C - 1;
	}

	return _.memoize(function(input) {
		return {
			low: input.low.value,
			high: input.high.value
		};
	}, function(input) {
		return elegantPairing(input.low.value, input.high.value);
	});
};
