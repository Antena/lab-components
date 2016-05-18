'use strict';

// @ngInject
module.exports = function() {
	return function(input) {
		var output = '';
		switch (input.coding[0].code) {
			case 'H':
				output = 'LAB.REFERENCE_RANGE_MEANING.HIGH';
				break;
			case 'N':
				output = 'LAB.REFERENCE_RANGE_MEANING.REGULAR';
				break;
			case 'L':
				output = 'LAB.REFERENCE_RANGE_MEANING.LOW';
				break;
			default:
				output = input.display;
		}
		return output;
	};
};
