'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:patientEmail
 * @kind function
 *
 * @description
 *   //TODO (denise)
 *
 * @param {Object} patient An object representing a FHIR patient. See: https://www.hl7.org/fhir/2015MAY/patient.html
 * @returns {String} A string with the email of the patient.
 *
 *
 * @example
 <example module="patient-email-example">
 <file name="index.html">
 <div ng-controller="ExampleController">
 <p>Patient: <strong>{{ patient | patientEmail }}</strong></p>
 </div>
 </file>
 <file name="demo.js">

 angular.module('patient-email-example', ['lab-components.common'])
 .controller('ExampleController', ['$scope', function($scope) {
		$scope.patient = {
			name: [
				{
					family: [ "van de Heuvel" ],
					given: [ "Pieter" ]
				}
			],
			telecom: [
			{
			 	system: "email",
			 	value: "MTORRES@CDROSSI.COM"
			 }
		  ]
		};
	}]);

 </file>
 </example>
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function() {

	function getEmail(patient) {
		var emailTelecom = _.findWhere(patient.telecom, {system: 'email'});
		return emailTelecom ? emailTelecom.value : null;
	}

	return function(patient) {
		return patient && patient.telecom && patient.telecom.length ? getEmail(patient) : null;
	};
};
