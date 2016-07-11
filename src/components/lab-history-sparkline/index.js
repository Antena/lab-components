'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-history-sparkline', [
]);

ngModule.controller('LabHistorySparklineController', require('./lab-history-sparkline-controller'));
ngModule.directive('labHistorySparkline', require('./lab-history-sparkline-directive'));

module.exports = ngModule.name;
