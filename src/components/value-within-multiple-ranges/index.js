'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.components.value-within-multiple-ranges', [
	require('../../common/index.js')
]);

ngModule.directive('valueWithinMultipleRangesGraph', require('./value-within-multiple-ranges-graph-directive'));

module.exports = ngModule.name;
