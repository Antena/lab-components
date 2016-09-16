'use strict';

// @ngInject
module.exports = function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

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
		.state('lab-diagnostic-report-compact-male', {
			url: '/lab-diagnostic-report-compact-male',
			templateUrl: 'components/lab-diagnostic-report-compact-male.html',
			controller: 'DemoController'
		})
		.state('lab-diagnostic-report-compact-female', {
			url: '/lab-diagnostic-report-compact-female',
			templateUrl: 'components/lab-diagnostic-report-compact-female.html',
			controller: 'DemoController'
		})
		.state('lab-diagnostic-report-compact-history', {
			url: '/lab-diagnostic-report-compact-history',
			templateUrl: 'components/lab-diagnostic-report-compact-history.html',
			controller: 'DemoController'
		})
		.state('value-within-range-graph', {
			url: '/value-within-range-graph',
			templateUrl: 'components/value-within-range-graph.html',
			controller: 'DemoController'
		})
		.state('value-within-multiple-ranges-graph', {
			url: '/value-within-multiple-ranges-graph',
			templateUrl: 'components/value-within-multiple-ranges-graph.html',
			controller: 'DemoController'
		})
		.state('value-within-range-card', {
			url: '/value-within-range',
			templateUrl: 'components/value-within-range-card.html',
			controller: 'DemoController'
		})
		.state('lab-observation-multirange-graph', {
			url: '/lab-observation-multirange-graphe',
			templateUrl: 'components/lab-observation-multirange-graph.html',
			controller: 'DemoController'
		})
		.state('observation-history-graph', {
			url: '/observation-history-graph',
			templateUrl: 'components/observation-history-graph.html',
			controller: 'DemoController'
		})
		.state('lab-history-sparkline-graph', {
			url: '/lab-history-sparkline-graph',
			templateUrl: 'components/lab-history-sparkline-graph.html',
			controller: 'DemoController'
		})
};
