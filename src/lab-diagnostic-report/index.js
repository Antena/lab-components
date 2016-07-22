'use strict';

var angular = require('angular');
require('angular-scroll');

var ngModule = angular.module('lab-components.lab-diagnostic-report', [
	'duScroll',
	require('../common/index.js'),
	require('../lab-history-graph/index.js'),
	require('../lab-observation/index.js')
]);

ngModule.value('duScrollGreedy', true);

ngModule.controller('LabDiagnosticReportController', require('./lab-diagnostic-report-controller'));
ngModule.directive('labDiagnosticReport', require('./lab-diagnostic-report-directive'));

module.exports = ngModule.name;
