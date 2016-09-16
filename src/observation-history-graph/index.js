'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.observation-history-graph', []);

ngModule.controller('ObservationHistoryGraphController', require('./observation-history-graph-controller'));
ngModule.directive('observationHistoryGraph', require('./observation-history-graph-directive'));

module.exports = ngModule.name;
