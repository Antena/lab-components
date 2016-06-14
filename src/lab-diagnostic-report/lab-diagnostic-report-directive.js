'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-diagnostic-report.directive:labDiagnosticReport
 * @restrict AE
 * @scope
 *
 * @description
 *
 * //TODO (denise) add description
 *
 * @element ANY
 * @param {Array} observations The list of observations which belong to this diagnostic report.
 *
 * @param {Object} diagnosticOrder The diagnostic report which originated this report.
 *
 * @param {String} status //TODO (denise) add description
 *
 * @param {Object} patient //TODO (denise) add description
 *
 * @param {Object} organization //TODO (denise) add description
 *
 * @param {String} reportDate //TODO (denise) add description
 *
 * @param {String=} dateFormat //TODO (denise) add description
 *
 * @param {Boolean=} [hideHeader=false] Indicates whether to hide the header that contains report information.
 *
 * @param {Boolean=} [viewOnly=false] Indicates whether to disable all actions.
 *
 * @param {Boolean=} [deDupeTopLevelObservations=false] Indicates whether to hide observation titles if ab order items contain a subgke observation.
 *
 * @param {Boolean=} [compactMode=false] Indicates wether to condense the observation content.
 *
 *
 */

var _ = require('underscore');
var $ = require('jquery');

// @ngInject
module.exports = function($rootScope, $document) {

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
			viewOnly: '=?',
			compactMode: '=?',
			deDupeTopLevelObservations: '=?'
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
