'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation.lab-observation-sparkline', [
	require('../../components/index.js')
]);

ngModule.controller('LabObservationSparklineController', require('./lab-observation-sparkline-controller'));
ngModule.directive('labObservationSparkline', require('./lab-observation-sparkline-directive'));

module.exports = ngModule.name;
