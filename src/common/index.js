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
ngModule.filter('referenceRangeMeaning', require('./reference-range-meaning-filter'));
ngModule.filter('referenceRangeMeaningColorCode', require('./reference-range-meaning-color-code-filter'));
ngModule.filter('customFormatDate', require('./custom-format-date-filter'));
ngModule.filter('patientAgeAtReportDate', require('./patient-age-at-report-filter'));
ngModule.filter('toStatusKey', require('./to-status-key-filter'));

ngModule.directive('featurePreview', require('./feature-preview-directive'));

module.exports = ngModule.name;
