// Calculates the age given a birth date and a reference date
'use strict';

var moment = require('moment');

// @ngInject
module.exports = function($translate) {
	var translations;

	var actualFilter = function(birthDate, referenceDate, pluralize) {
		var result = birthDate ? moment(referenceDate || new Date()).diff(moment(birthDate), 'years') : null;
		if (birthDate && pluralize) {
			result += " " + (result === 1 ? translations['UNITS.YEAR'] : translations['UNITS.YEARS']);
		}
		return result;
	};

	filterStub.$stateful = true;
	function filterStub(birthDate, referenceDate, pluralize) {
		if (!translations) {
			$translate(['UNITS.YEARS', 'UNITS.YEAR']).then(function(result) {
				translations = result;
			});
			return "";
		} else {
			return actualFilter(birthDate, referenceDate, pluralize);
		}
	}

	return filterStub;
};
