var angular = require('angular');

var demoObservations = require('./demo/observations.json');
var demoGroupedObservations = require('./demo/groupedObservations.json');

var app = angular.module('app', [
	require('./src/index.js')
]);

app.controller('DemoController', ['$scope', function ($scope) {
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

