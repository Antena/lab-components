'use strict';

// @ngInject
module.exports = function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('demo', {
			url: '/',
			templateUrl: 'demo.html',
			controller: 'DemoController'
		})
		.state('lab-diagnostic-report', {
			url: '/lab-diagnostic-report',
			templateUrl: 'components/lab-diagnostic-report.html',
			controller: 'DemoController'
		})
		.state('value-within-range-graph', {
			url: '/value-within-range-graph',
			templateUrl: 'components/value-within-range-graph.html',
			controller: 'DemoController'
		})
		.state('value-within-range-card', {
			url: '/value-within-range',
			templateUrl: 'components/value-within-range-card.html',
			controller: 'DemoController'
		})
		.state('lab-history-graph', {
			url: '/lab-history-graph',
			templateUrl: 'components/lab-history-graph.html',
			controller: 'DemoController'
		});
};
