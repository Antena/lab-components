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
var angular = require('angular');

require("./_lab-diagnostic-report.scss");

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
			deDupeTopLevelObservations: '=?',
			displayObservationsWithMultipleRanges: '=?'
		},
		restrict: 'EA',
		templateUrl: require('./lab-diagnostic-report.html'),
		bindToController: true,
		controllerAs: 'vm',
		controller: 'LabDiagnosticReportController',
		link: function($scope, $element) {
			var lastScrollTop = -1;

			function autoScrollUpcomingTreeNodes($element, downward) {
				var makeSureItsVisible;

				var allUpcomingSiblings = downward ? $element.nextAll() : $element.prevAll();
				var hasLotsOfSiblings = allUpcomingSiblings.length > 2;
				if (hasLotsOfSiblings) {
					makeSureItsVisible = allUpcomingSiblings[2];
				} else {
					var groupParent = $($element).parents('.lab-tree-group');

					var upcoming = downward ? groupParent.next() : groupParent.prev();
					var upcomingGroup = upcoming ? upcoming.find('.lab-tree-top-level') : null;
					if (upcomingGroup) {
						makeSureItsVisible = downward ? _.first(upcomingGroup) : _.last(upcomingGroup);
					} else if (allUpcomingSiblings.length) {
						makeSureItsVisible = downward ? _.last(allUpcomingSiblings) : _.first(allUpcomingSiblings);
					}
				}

				if (makeSureItsVisible && !isScrolledIntoView(makeSureItsVisible)) {
					var container = angular.element(document.getElementById('fixedTree'));
					var targetElement = angular.element(makeSureItsVisible);

					$scope.scrolling = true;
					container.scrollTo(targetElement, 50, 1000).then(function() {
						$scope.scrolling = false;
					});
				}
			}

			var onChildActiveChange = function(active, $event, $element) {
				console.log("$element = ", $element);	//TODO (denise) remove log

				var parents = $($element).parents('.lab-tree-top-level');
				if (active) {
					$('.parent-active').removeClass('parent-active');
					parents.addClass('parent-active');

					var currentScrollTop = $document.scrollTop();
					var goingDown = currentScrollTop > lastScrollTop;
					lastScrollTop = currentScrollTop;

					if (!$scope.scrolling) {
						autoScrollUpcomingTreeNodes($element, goingDown);
					}

				} else {
					parents.removeClass('parent-active');
					$scope.initLabTree();
				}
			};

			function isScrolledIntoView(elem) {
				var container = $('#fixedTree');
				var containerTop = container.scrollTop();
				var containerBottom = containerTop + container.height();

				var elemTop = elem.offsetTop;
				var elemBottom = elemTop + $(elem).height();

				return (containerTop < elemTop) && (containerBottom > elemBottom);
			}

			var onScroll = function(e) {
				var reference = $('.primary-content');
				var compensation = reference.length ? reference[0].offsetTop : 0;	//TODO (denise) find a more generic way
				var targetScroll = $element.offset().top + compensation - 20;
				var currentScroll = $document.scrollTop();

				if (currentScroll > targetScroll) {
					$element.addClass("fix-tree");
					$element.scrollTop = 0;
				} else {
					$element.removeClass("fix-tree");
				}

			};

			var unregisterDuScrollBecameActive = $rootScope.$on('duScrollspy:becameActive', _.partial(onChildActiveChange, true));
			var unregisterDuScrollBecameInactive = $rootScope.$on('duScrollspy:becameInactive', _.partial(onChildActiveChange, false));

			$scope.initLabTree = function() {
				if (!$('.parent-active').length) {
					$('.lab-tree-top-level').first().addClass('parent-active');
				}
			};

			// init
			$scope.vm.dateFormat = $scope.vm.dateFormat || "DD-MM-YYYY";

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
