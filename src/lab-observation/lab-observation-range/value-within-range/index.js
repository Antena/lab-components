'use strict';

var angular = require('angular');
var ngModule = angular.module('common.value-within-range', []);

ngModule.directive('valueWithinRangeCard', require('./value-within-range-card-directive'));
ngModule.directive('valueWithinRangeGraph', require('./value-within-range-graph-directive'));

module.exports = ngModule.name;
