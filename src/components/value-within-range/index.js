'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.components.value-within-range', [
	require('../../common/index.js')
]);

ngModule.directive('valueWithinRangeCard', require('./value-within-range-card-directive'));
ngModule.directive('valueWithinRangeGraph', require('./value-within-range-graph-directive'));

module.exports = ngModule.name;
