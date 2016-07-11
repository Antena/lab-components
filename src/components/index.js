'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.components', [
	require('./value-within-range/index.js'),
	require('./value-within-multiple-ranges/index.js'),
	require('./lab-history/index.js')
]);

module.exports = ngModule.name;
