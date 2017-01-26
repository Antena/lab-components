'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation-history-graph', [
	require('../../common/index'),
	require('../extensions/index'),
	require('../../components/history-graph')
]);

ngModule.controller('LabObservationHistoryGraphController', require('./lab-observation-history-graph-controller'));
ngModule.directive('labObservationHistoryGraph', require('./lab-observation-history-graph-directive'));

module.exports = ngModule.name;
