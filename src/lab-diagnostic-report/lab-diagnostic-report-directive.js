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
			var SCROLL_DURATION = 1000,
				SCROLL_OFFSET = 50;

			var prevScrollTop = -1,
				currentlyScrolling = false;

			function autoScrollUpcomingTreeNodes($element, downwardScrolling) {
				var elementThatShouldBeVisible;

				var allUpcomingSiblings = downwardScrolling ? $element.nextAll() : $element.prevAll();
				var hasLotsOfSiblings = allUpcomingSiblings.length > 2;
				if (hasLotsOfSiblings) {
					elementThatShouldBeVisible = allUpcomingSiblings[2];
				} else {
					var groupParent = $($element).parents('.lab-tree-group');

					var upcoming = downwardScrolling ? groupParent.next() : groupParent.prev();
					var upcomingGroup = upcoming ? upcoming.find('.lab-tree-top-level') : null;
					if (upcomingGroup) {
						elementThatShouldBeVisible = downwardScrolling ? _.first(upcomingGroup) : _.last(upcomingGroup);
					} else if (allUpcomingSiblings.length) {
						elementThatShouldBeVisible = downwardScrolling ? _.last(allUpcomingSiblings) : _.first(allUpcomingSiblings);
					}
				}

				if (elementThatShouldBeVisible && !isScrolledIntoView(elementThatShouldBeVisible)) {
					var container = angular.element(document.getElementById('fixedTree'));
					var targetElement = angular.element(elementThatShouldBeVisible);

					currentlyScrolling = true;
					container.scrollTo(targetElement, SCROLL_OFFSET, SCROLL_DURATION).then(function() {
						currentlyScrolling = false;
					});
				}
			}

			var onChildActiveChange = function(active, $event, $element) {
				var parents = $($element).parents('.lab-tree-top-level');
				if (active) {
					$('.parent-active').removeClass('parent-active');
					parents.addClass('parent-active');

					var currentScrollTop = $document.scrollTop();
					var goingDown = currentScrollTop > prevScrollTop;
					prevScrollTop = currentScrollTop;

					if (!currentlyScrolling) {
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

			var originalBottom;

			function makeTreeFollowPrimaryContent() {
				var theTree = $('#fixedTree');
				var mainRect = $('.primary-content')[0].getBoundingClientRect();
				var secondRect = theTree[0].getBoundingClientRect();

				if (!originalBottom) {
					originalBottom = secondRect.bottom;
				}

				var surpassed = mainRect.bottom <= originalBottom;
				var diff = originalBottom - mainRect.bottom;

				theTree.css({
					top: surpassed ? (-diff) : 0,
					bottom: surpassed ? (diff) : 0
				});


				if (!surpassed) {
					originalBottom = undefined;
				}
			}

			var onScroll = function(e) {
				var reference = $('.primary-content');
				var compensation = reference.length ? reference[0].offsetTop : 0;
				var targetScroll = $element.offset().top + compensation - 20;	// 20 for padding
				var currentScroll = $document.scrollTop();
				var fixedTreeElem = document.getElementById('fixedTree');

				if (currentScroll > targetScroll) {
					$scope.treeIsFixed = true;
					if(!$element.hasClass("fix-tree")) {
						$element.addClass("fix-tree");

						//reset scroll position on tree expansion
						fixedTreeElem.scrollTop = 0;
					}

					makeTreeFollowPrimaryContent();
				} else {
					$scope.treeIsFixed = false;
					$element.removeClass("fix-tree");
					$(fixedTreeElem).css({ top: 'auto', bottom: 'auto' });
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
