'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation', [
	require('../common/index.js'),
	require('./lab-observation-range/index.js'),
	require('./lab-observation-multirange/index.js'),
	require('../lab-history-sparkline/index'),
	require('./lab-observation-result/index.js')
]);

ngModule.controller('LabObservationController', require('./lab-observation-controller'));
ngModule.directive('labObservation', require('./lab-observation-directive'));

module.exports = ngModule.name;
