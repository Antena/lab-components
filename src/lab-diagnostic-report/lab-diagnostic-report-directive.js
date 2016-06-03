'use strict';

var _ = require('underscore');
var $ = require('jquery');

// @ngInject
module.exports = function($rootScope, $document, $filter) {

	return {
		scope: {
			observations: '=',
			diagnosticOrder: '=',
			status: '@',
			patient: '=',
			organization: '=',
			reportDate: '=',
			dateFormat: '@?',
			hideHeader: '=?',
			viewOnly: '=?'
		},
		restrict: 'EA',
		templateUrl: require('./lab-diagnostic-report.html'),
		bindToController: true,
		controllerAs: 'vm',
		controller: 'LabDiagnosticReportController',
		link: function($scope, $element) {

			$scope.vm.dateFormat = $scope.vm.dateFormat || "DD-MM-YYYY";

			var onChildActiveChange = function(active, $event, $element) {
				var parents = $($element).parents('.lab-tree-top-level');
				if (active) {
					$('.parent-active').removeClass('parent-active');
					parents.addClass('parent-active');
				} else {
					parents.removeClass('parent-active');
					$scope.initLabTree();
				}
			};

			$scope.initLabTree = function() {
				if (!$('.parent-active').length) {
					$('.lab-tree-top-level').first().addClass('parent-active');
				}
			};

			var unregisterDuScrollBecameActive = $rootScope.$on('duScrollspy:becameActive', _.partial(onChildActiveChange, true));
			var unregisterDuScrollBecameInactive = $rootScope.$on('duScrollspy:becameInactive', _.partial(onChildActiveChange, false));

			var onScroll = function(e) {

				var navigation = $('.navigation');
				var compensation = navigation.length ? navigation[0].offsetHeight : 0;	//TODO (denise) find a more generic way

				var targetScroll = $element.offset().top - compensation;
				var currentScroll = $document.scrollTop();

				if (currentScroll > targetScroll) {
					$element.addClass("fix-tree");
				} else {
					$element.removeClass("fix-tree");
				}

			};

			$document.on("scroll", onScroll);
			$scope.initLabTree();

			//cleanup
			$scope.$on('$destroy', function() {
				$document.off("scroll", onScroll);
				unregisterDuScrollBecameActive();
				unregisterDuScrollBecameInactive();
			});
		}
	};
};
