'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.common', [
	require('angular-translate'),
]);

ngModule.filter('capitalize', require('./capitalize-filter'));
ngModule.filter('codeableConcept', require('./codeable-concept-filter'));
ngModule.filter('semicolon', require('./semicolon-filter'));
ngModule.filter('optional', require('./optional-filter'));
ngModule.filter('optionalNumber', require('./optional-number-filter'));
ngModule.filter('referenceRangeMeaning', require('./reference-range-meaning-filter'));
ngModule.filter('referenceRangeMeaningColorCode', require('./reference-range-meaning-color-code-filter'));
ngModule.filter('customFormatDate', require('./custom-format-date-filter'));
ngModule.filter('patientFullName', require('./patient-full-name-filter'));
ngModule.filter('patientAgeAtReportDate', require('./patient-age-at-report-filter'));
ngModule.filter('toStatusKey', require('./to-status-key-filter'));

module.exports = ngModule.name;
