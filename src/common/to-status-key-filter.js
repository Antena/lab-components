'use strict';

String.prototype.replaceAll = function(str1, str2, ignore) {
	var replaceWith = (typeof(str2) === "string") ? str2.replace(/\$/g, "$$$$") : str2;
	var re = /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\\<\>\-\&])/g;
	var regex = new RegExp(str1.replace(re, "\\$&"), (ignore?"gi":"g"));
	return this.replace(regex, replaceWith);
};

// @ngInject
module.exports = function() {

	return function(input, suffix) {
		var statusKey = input.toUpperCase().replaceAll(" ", "_");
		return 'LAB.REPORT_STATUS.' + statusKey + (suffix ? suffix : '');
	};
};
