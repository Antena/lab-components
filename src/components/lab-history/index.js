'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.components.sparkline', [
	require('../../common/index.js')
]);

ngModule.directive('sparkline', require('./sparkline-directive'));

module.exports = ngModule.name;
