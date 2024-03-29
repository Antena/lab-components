'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation.lab-observation-multirange', [
	require('../../common/index'),
	require('../extensions/index'),
	require('../../components/index.js'),
	require('../../mappings/index.js')
]);

ngModule.controller('LabObservationMultirangeController', require('./lab-observation-multirange-controller'));
ngModule.directive('labObservationMultirangeGraph', require('./lab-observation-multirange-graph-directive'));

module.exports = ngModule.name;
