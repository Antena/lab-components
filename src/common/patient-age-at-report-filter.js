'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:patientAgeAtReportDate
 * @kind function
 *
 * @description
 *   Calculates the age of a person at a specific moment, given a birth date and a reference date
 *
 * @param {String} birthDate A date string.
 * @param {String} referenceDate A date string.
 * @param {Boolean=} [pluralize=false] Indicates whether to add the pluralized age unit to the result string.
 * @returns {String} The age and unit in string format.
 *
 *
 * @example
 <example module="patient-age-at-report-example">
 <file name="index.html">
 <div>
	 <p>Born: <strong>1987-01-01</strong></p>
	 <p>Age at Y2K: <strong>{{ '1987-01-01' | patientAgeAtReportDate:'1999-12-31T11:59:59' }}</strong></p>
	 <p>Age at Y2K: <strong>{{ '1987-01-01' | patientAgeAtReportDate:'1999-12-31T11:59:59':true }}</strong></p>
	 <p>Age when Finland elected Mauno Koivisto: <strong>{{ '1987-01-01' | patientAgeAtReportDate:'1988-02-15T11:59:59':true }}</strong></p>
 </div>
 </file>
 <file name="demo.js">

 	angular.module('patient-age-at-report-example', ['lab-components.common'])
		 .config(['$translateProvider', function($translateProvider) {
			$translateProvider
				.translations('es', {
					  "UNITS": {
						"YEAR": "año",
						"YEARS": "años"
					  }
				})
				.preferredLanguage('es')
				.useSanitizeValueStrategy('sanitizeParameters');
		}]);

 </file>
 </example>
 *
 */

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
