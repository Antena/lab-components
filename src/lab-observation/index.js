'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation', [
	require('./lab-observation-range/index.js')
]);

ngModule.filter('referenceRangeToSimpleRange', require('./reference-range-to-simple-range-filter'));
ngModule.directive('labObservation', require('./lab-observation-directive'));

module.exports = ngModule.name;
