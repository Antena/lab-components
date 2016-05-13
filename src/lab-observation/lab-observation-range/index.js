'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observations.lab-observation-range', [
	require('./value-within-range/index.js')
]);

ngModule.controller('LabObservationRangeController', require('./lab-observation-range-controller'));
ngModule.directive('labObservationRangeCard', require('./lab-observation-range-card/lab-observation-range-card-directive'));
ngModule.directive('labObservationRangeGraph', require('./lab-observation-range-graph/lab-observation-range-graph-directive'));

module.exports = ngModule.name;
