'use strict';

var angular = require('angular');
var _ = require('underscore');
require('uiRouter');

var observationHistory = require('./observation-history.json');

/* Demo App initialization */
var app = angular.module('app', [
	'ui.router',
	require('../src/index.js')
]);

app.config(require('./route-config'));

app.service('LabObservationService', function() {
	return {
		getHistory: function(observationId, cb) {
			var history;

			var historyForObservation = observationHistory[observationId];
			if (historyForObservation) {
				history = historyForObservation;
			} else {
				history = _.sample(observationHistory.samples);
			}

			cb(history);
		}
	};
});


// @ngInject
app.config(function(fhirMappingsProvider) {
	fhirMappingsProvider.setCodeScale2ClassNameMappings([
		{
			codes: ['LIKE', 'DISLIKE'],
			classMap: {
				'LIKE': 'range-unknown-6',
				'DISLIKE': 'range-unknown-2'
			}
		}
	], true);
});

app.controller('DemoController', require('./demo-controller'));

// angular.element(document).ready(function() {
// 	angular.bootstrap(document, ['app']);
// });

