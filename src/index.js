'use strict';

// assign window.jQuery so that angular uses jquery
window.$ = window.jQuery = window.jquery = require('jquery');
var angular = require('angular');

require("./main.scss");

var ngModule = angular.module('lab-components', [
	require('angular-translate'),
	require('./common/index'),
	require('./mappings/index'),
	require('./components/index'),
	require('./lab-diagnostic-report/index'),
	require('angular-fhir-utils')
]);

//@ngInject
ngModule.config(function($translateProvider, $compileProvider) {
	$translateProvider
		.translations('es', require('./spanish.json'))
		.preferredLanguage('es')
		.useSanitizeValueStrategy('sanitizeParameters');

	$compileProvider.debugInfoEnabled(false);
});

ngModule.service('FhirReferenceRangeConverterService', require('./fhir-reference-range-converter-service'));

module.exports = ngModule.name;
