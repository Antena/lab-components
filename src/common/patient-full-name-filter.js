'use strict';

// @ngInject
module.exports = function() {

	function buildFullName(patientName) {
		return patientName.given + ' ' + patientName.family;
	}

	return function (patient) {
		return patient && patient.name.length ? buildFullName(patient.name[0]) : null;
	}
};
