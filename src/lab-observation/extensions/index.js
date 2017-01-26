'use strict';

/**
 * @ngdoc overview
 * @name lab-components.lab-observation.extensions
 *
 * @description
 * This module contains all extension-related values for observations.
 *
 */

var angular = require('angular');
var ngModule = angular.module('lab-components.lab-observation.extensions', []);

/**
 * @ngdoc object
 * @name lab-components.lab-observation.extensions.object:EXTENSION_SYSTEM
 * @description
 * Constant (enum-like) object that holds all system values for custom extensions supported by lab-components
 * Currently supported extensions:
 * - PRECISION [Integer]:
 *  Applies specified precision to doubles in observation valueQuantity and values in ranges
 * - DOMAIN [Object]:
 *  By defining a valueRange, you can set limits to open-ended ranges.
 *  i.e. if the first range (first as in the one with smallest values for low/high) a range has a 'high' property, but not low,
 *  then the domain.low would be used instead.
 *
 */
ngModule.value('EXTENSION_SYSTEM', {
	'PRECISION': 'http://www.wellbin.co/precision',
	'DOMAIN': 'http://www.wellbin.co/domain'
});

module.exports = ngModule.name;
