'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation.lab-observation-multirange', [
	require('../../components/index.js')
]);

ngModule.controller('LabObservationMultirangeController', require('./lab-observation-multirange-controller'));
ngModule.directive('labObservationMultirangeGraph', require('./lab-observation-multirange-graph-directive'));

module.exports = ngModule.name;
