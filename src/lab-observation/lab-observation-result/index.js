'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation.lab-observation-result', [
	require('../../components/index.js')
]);

ngModule.directive('labObservationResult', require('./lab-observation-result-directive'));

module.exports = ngModule.name;
