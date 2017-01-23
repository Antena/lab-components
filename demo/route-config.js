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
		.state('popover-on-demand', {
			url: '/popover-on-demand',
			templateUrl: 'components/popover-on-demand.html',
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
		.state('history-graph', {
			url: '/history-graph',
			templateUrl: 'components/history-graph.html',
			controller: 'DemoController'
		})
		.state('lab-history-sparkline-graph', {
			url: '/lab-history-sparkline-graph',
			templateUrl: 'components/lab-history-sparkline-graph.html',
			controller: 'DemoController'
		})
		.state('lab-observation', {
			url: '/lab-observation',
			templateUrl: 'components/lab-observation.html',
			controller: 'DemoController'
		});
};
