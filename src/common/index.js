'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.common', [
	require('angular-translate'),
	require('angular-animate'),
	require('angular-ui-bootstrap'),
	require('angular-utilities')
]);

ngModule.filter('optional', require('./optional-filter'));
ngModule.filter('optionalNumber', require('./optional-number-filter'));
ngModule.filter('patientAgeAtReportDate', require('./patient-age-at-report-filter'));
ngModule.filter('toStatusKey', require('./to-status-key-filter'));

ngModule.directive('actionPreview', require('./action-preview-directive'));

ngModule.service('FhirReferenceRangeConverterService', require('./fhir-reference-range-converter-service'));

module.exports = ngModule.name;
