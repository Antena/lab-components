'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components', [
	'pascalprecht.translate',
	require('lab-diagnostic-report/index.js')
]);

ngModule.config(function ($translateProvider) {
	$translateProvider
		.translations('es', require('./spanish.json'))
		.preferredLanguage('es')
		.useSanitizeValueStrategy('sanitizeParameters');
});

module.exports = ngModule.name;
