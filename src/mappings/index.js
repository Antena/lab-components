'use strict';

var angular = require('angular');

var ngModule = angular.module('lab-components.mappings', [ ]);

ngModule.provider('fhirMappings', require('./fhir-mappings-provider'));
ngModule.filter('coding2TranslationKey', require('./coding-2-translation-key-filter'));
ngModule.filter('coding2ClassName', require('./coding-2-class-name-filter'));


module.exports = ngModule.name;
