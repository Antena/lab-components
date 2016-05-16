'use strict';

// @ngInject
module.exports = function() {
	return function(code) {
		var filterOut = code ? (code.text || code.coding[0].display) : null;
		return filterOut;
	};
};
