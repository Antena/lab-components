'use strict';

'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:patientFullName
 * @kind function
 *
 * @description
 *   Joins the first and last names of a patient separated by a space.
 *
 * @param {Object} patient An object representing a FHIR patient. See: https://www.hl7.org/fhir/2015MAY/patient.html
 * @returns {String} A string with the full name of the patient.
 *
 *
 * @example
 <example module="patient-full-name-example">
 <file name="index.html">
 <div ng-controller="ExampleController">
 	<p>Patient: <strong>{{ patient | patientFullName }}</strong></p>
 </div>
 </file>
 <file name="demo.js">

 angular.module('patient-full-name-example', ['lab-components.common'])
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.patient = {
			name: [
				{
					family: [ "van de Heuvel" ],
					given: [ "Pieter" ]
				}
			]
		};
	}]);

 </file>
 </example>
 *
 */

// @ngInject
module.exports = function() {

	function buildFullName(patientName) {
		return patientName.given + ' ' + patientName.family;
	}

	return function(patient) {
		return patient && patient.name.length ? buildFullName(patient.name[0]) : null;
	};
};
