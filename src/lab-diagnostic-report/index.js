'use strict';

var angular = require('angular');
require('angular-scroll');

var ngModule = angular.module('lab-components.lab-diagnostic-report', [
	'duScroll',
	require('../common/index.js'),
	require('angular-fhir-utils'),
	require('../lab-observation/lab-observation-history-graph/index.js'),
	require('../lab-observation/index.js')
]);

//avoids jumping when scroll targets (i.e. observations) are far apart in the page (i.e. big margin in between)
ngModule.value('duScrollGreedy', true);

ngModule.controller('LabDiagnosticReportController', require('./lab-diagnostic-report-controller'));
ngModule.directive('labDiagnosticReport', require('./lab-diagnostic-report-directive'));

module.exports = ngModule.name;
