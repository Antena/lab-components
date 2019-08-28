'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.common', [
	require('angular-translate'),
	require('angular-animate'),
	require('angular-ui-bootstrap/src/popover/index-nocss'),
	require('angular-utilities')
]);

ngModule.filter('optional', require('./optional-filter'));
ngModule.filter('optionalNumber', require('./optional-number-filter'));
ngModule.filter('patientAgeAtReportDate', require('./patient-age-at-report-filter'));
ngModule.filter('toStatusKey', require('./to-status-key-filter'));

ngModule.directive('popoverOnDemand', require('./popover-on-demand-directive'));

ngModule.service('FhirReferenceRangeConverterService', require('./fhir-reference-range-converter-service'));
ngModule.service('MathUtilService', require('./math-util-service'));

module.exports = ngModule.name;
