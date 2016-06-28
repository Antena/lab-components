'use strict';

/**
 * @ngdoc controller
 * @name lab-components.lab-observation.controller:LabObservationController
 *
 * @description
 * `LabObservationController` provides some utilitary functions for filtering out observation referenceRanges which are not relevant for the given patient data.
 *
 * Each instance of {@link lab-components.lab-observation.directive:labObservation labObservation} directive creates an instance of this controller.
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function($scope) {

	//TODO (denise) move this to a helper (generic) service
	var operators = {
		'<': function(a, b) { return a < b },
		'<=': function(a, b) { return a <= b },
		'>=': function(a, b) { return a >= b },
		'>': function(a, b) { return a > b },
		'==': function(a, b) { return a == b },
		'===': function(a, b) { return a === b }
	};

	/**
	 * @ngdoc function
	 * @name valueToYears
	 * @methodOf lab-components.lab-observation.controller:LabObservationController
	 * @description
	 *
	 * Converts an age quantity in any of these units to years: months (code 'mo'), months (code 'd'), months (code 'wk'). For more info see {@link http://download.hl7.de/documents/ucum/ucumdata.html full list of UCUM codes}.
	 *
	 * @param {Object} ageQuantity An age {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Range FHIR Quantity} to convert. See {@link https://www.hl7.org/fhir/2015MAY/observation-definitions.html#Observation.referenceRange.age Observation.referenceRange.age} for more info.
	 *
	 * @returns {Number} The quantity value transformed to years.
	 *
	 */
	function valueToYears(ageQuantity) {
		var result;
		if (ageQuantity.code === 'mo') {
			result = ageQuantity.code / 12;
		} else if (ageQuantity.code === 'd') {
			result = ageQuantity.code / 365;
		} else if (ageQuantity.code === 'wk') {
			result = ageQuantity.code * 7 / 365;
		}
		return result;
	}

	/**
	 * @ngdoc function
	 * @name withinRange
	 * @methodOf lab-components.lab-observation.controller:LabObservationController
	 * @description
	 *
	 * Checks whether or not a range is appropriate given the patient's age. Supports all standard {@link https://www.hl7.org/fhir/2015MAY/quantity-comparator.html quantity comparators} plus `equals` ('==', '===').
	 *
	 * @param {Object} range A {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Range FHIR Range} to inspect.
	 * @param {Number} patientAgeInYearsAtMomentOfReport The age of the patient at the moment the DiagnosticReport was generated, in years (decimal number).
	 *
	 * @returns {Boolean} Returns true if this range is appropriate for the given patient's age.
	 *
	 */
	function withinRange (range, patientAgeInYearsAtMomentOfReport) {

		var lowOK = true;
		var highOK = true;

		if (range.low) {
			var op = range.low.comparator || '===';
			var rangeLowValueInYears = range.low.value;
			if(range.low.code !== 'a') {
				rangeLowValueInYears = valueToYears(range.low);
			}
			lowOK = operators[op](patientAgeInYearsAtMomentOfReport, rangeLowValueInYears);
		}

		if (range.high) {
			var op = range.high.comparator || '===';
			var rangeHighValueInYears = range.high.value;
			if(range.high.code !== 'a') {
				rangeHighValueInYears = valueToYears(range.high);
			}
			highOK = operators[op](patientAgeInYearsAtMomentOfReport, rangeHighValueInYears);
		}

		return lowOK && highOK;
	}

	/**
	 * @ngdoc function
	 * @name filterRanges
	 * @methodOf lab-components.lab-observation.controller:LabObservationController
	 * @description
	 *
	 * Filters ranges that are age or gender specific, given the patient data.
	 *
	 * @param {Array} range A list of {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Range FHIR ranges} to filter.
	 * @param {Number} patientAgeInYearsAtMomentOfReport The age of the patient at the moment the DiagnosticReport was generated, in years (decimal number). If available, ranges that are age-specific will be filtered accordingly.
	 * @param {String} patientGender A string representaiton of the patient gender ({@link http://hl7.org/fhir/ValueSet/administrative-gender valid values}). If available, ranges that are gender-specific will be filtered accordingly.
	 *
	 * @returns {Array} The list of ranges that apply given the patient's age.
	 *
	 */
	this.filterRanges = function(referenceRanges, patientAgeInYears, patientGender) {
		return _.filter(referenceRanges, function (range) {
			var genderConditioned = _.findWhere(range.modifierExtension, { url: "http://hl7.org/fhir/ValueSet/administrative-gender" });
			var appliesGenderWise = !genderConditioned || genderConditioned.valueCode === patientGender;
			var appliesAgeWise = !range.age || !patientAgeInYears || withinRange(range.age, patientAgeInYears);

			return appliesGenderWise && appliesAgeWise;
		})
	};
};
