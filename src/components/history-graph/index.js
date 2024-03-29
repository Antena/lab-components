'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.history-graph', []);

ngModule.controller('HistoryGraphController', require('./history-graph-controller'));
ngModule.directive('historyGraph', require('./history-graph-directive'));

module.exports = ngModule.name;
