'use strict';

var angular = require('angular');

var demoObservations = require('./observations.json').observations;
var demoGroupedObservations = require('./groupedObservations.json');

var app = angular.module('app', [
	require('../src/index.js')
]);

app.controller('DemoController', ['$scope', function($scope) {
	$scope.demo = {
		observations: JSON.parse(demoObservations),
		groupObservationByMID: function() {
			return JSON.parse(demoGroupedObservations);
		}
	};
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});

