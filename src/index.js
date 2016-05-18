'use strict';

var angular = require('angular');

var ngModule = angular.module('lab-components', [
	require('angular-translate'),
	require('common/index.js'),
	require('lab-diagnostic-report/index.js')
]);

ngModule.config(function($translateProvider) {
	$translateProvider
		.translations('es', require('./spanish.json'))
		.preferredLanguage('es')
		.useSanitizeValueStrategy('sanitizeParameters');
});

ngModule.config(function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
});

ngModule.service('FhirBundleService', require('./fhir-bundle-service'));

module.exports = ngModule.name;
