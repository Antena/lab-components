'use strict';

var angular = require('angular');
var ngModule = angular.module('lab-components.config', []);

ngModule.value('EXTENSION_SYSTEM', {
	'PRECISION': 'http://www.wellbin.co/precision',
	'DOMAIN': 'http://www.wellbin.co/domain'
});

module.exports = ngModule.name;
