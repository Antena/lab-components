'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation', [
	require('../common/index.js'),
	require('angular-fhir-utils'),
	require('./lab-observation-range/index.js'),
	require('./lab-observation-multirange/index.js'),
	require('./lab-observation-result/index.js'),
	require('./lab-observation-sparkline/index')
]);

ngModule.directive('labObservation', require('./lab-observation-directive'));

module.exports = ngModule.name;
