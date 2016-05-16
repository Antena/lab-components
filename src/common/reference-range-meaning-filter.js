'use strict';

// @ngInject
module.exports = function() {
	return function(input) {
		var output = '';
		switch (input.coding.code) {
			case 'H':
				output = 'STUDY.REFERENCE_RANGE_MEANING.HIGH';
				break;
			case 'N':
				output = 'STUDY.REFERENCE_RANGE_MEANING.REGULAR';
				break;
			case 'L':
				output = 'STUDY.REFERENCE_RANGE_MEANING.LOW';
				break;
			default:
				output = input.display;
		}
		return output;
	};
};
