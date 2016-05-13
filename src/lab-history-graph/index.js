'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-history-graph', []);

ngModule.controller('LabHistoryGraphController', require('./lab-history-graph-controller'));
ngModule.directive('labHistoryGraph', require('./lab-history-graph-directive'));

module.exports = ngModule.name;
