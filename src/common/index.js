'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.common', []);

ngModule.filter('capitalize', require('./capitalize-filter'));
ngModule.filter('codeableConcept', require('./codeable-concept-filter'));
ngModule.filter('semicolon', require('./semicolon-filter'));
ngModule.filter('optional', require('./optional-filter'));
ngModule.filter('optionalNumber', require('./optional-number-filter'));
ngModule.filter('referenceRangeMeaning', require('./reference-range-meaning-filter'));

module.exports = ngModule.name;
