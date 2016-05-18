'use strict';

String.prototype.replaceAll = function(str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

// @ngInject
module.exports = function() {

	return function(input, suffix) {
		var statusKey = input.toUpperCase().replaceAll(" ", "_");
		return 'LAB.REPORT_STATUS.' + statusKey + (suffix ? suffix : '');
	};
};
