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
var Slideout = require('slideout');

require("./_lab-diagnostic-report.scss");

// @ngInject
module.exports = function($rootScope, $document, $timeout) {

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
				initialTreeBottomPosition,
				currentlyScrolling = false,
				unregisterDuScrollBecameActive,
				unregisterDuScrollBecameInactive;

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

				// var fixedTreeElem = document.getElementById('fixedTree');

				if (active) {
					$('.parent-active').removeClass('parent-active');
					parents.addClass('parent-active');

					if (!$scope.isMobile()) {
						var currentScrollTop = $document.scrollTop();
						var goingDown = currentScrollTop > prevScrollTop;
						prevScrollTop = currentScrollTop;

						if (!currentlyScrolling) {
							autoScrollUpcomingTreeNodes($element, goingDown);
						}
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

			function makeTreeFollowPrimaryContent() {
				var theTree = $('#fixedTree');
				var mainRect = $('.primary-content')[0].getBoundingClientRect();
				var secondRect = theTree[0].getBoundingClientRect();

				if (!initialTreeBottomPosition) {
					initialTreeBottomPosition = secondRect.bottom;
				}

				var surpassed = mainRect.bottom <= initialTreeBottomPosition;
				var diff = initialTreeBottomPosition - mainRect.bottom;

				theTree.css({
					top: surpassed ? (-diff) : 0,
					bottom: surpassed ? (diff) : 0
				});


				if (!surpassed) {
					initialTreeBottomPosition = undefined;
				}
			}

			var onScroll = function(e) {

				if (!$scope.isMobile()) {
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
				}
			};

			function registerDuScrollListeners() {
				unregisterDuScrollBecameActive = $rootScope.$on('duScrollspy:becameActive', _.partial(onChildActiveChange, true));
				unregisterDuScrollBecameInactive = $rootScope.$on('duScrollspy:becameInactive', _.partial(onChildActiveChange, false));
			}

			function unregisterDuScrollListeners() {
				unregisterDuScrollBecameActive();
				unregisterDuScrollBecameInactive();
			}

			$scope.initLabTree = function() {
				if (!$('.parent-active').length) {
					$('.lab-tree-top-level').first().addClass('parent-active');
				}
			};

			$scope.onManualNavigation = function(obsId) {
				unregisterDuScrollListeners();

				var targetElement = angular.element($('#' + obsId));
				$document.scrollToElementAnimated(targetElement, 100, SCROLL_DURATION).then(function() { });

				$timeout(function() {
					registerDuScrollListeners();
				}, SCROLL_DURATION + 100, false);
			};

			// init
			$scope.vm.dateFormat = $scope.vm.dateFormat || "DD-MM-YYYY";

			$document.on("scroll", onScroll);

			registerDuScrollListeners();
			$scope.initLabTree();



			$scope.isMobile = function() {

				var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

				// var check = false;
				// (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');
				// return check;

				var isMobile = w < 768;
				console.log("isMobile = ", isMobile);	//TODO (denise) remove log
				return isMobile;
			};


			if ($scope.isMobile()) {
				$timeout(function() {
					var content = $('.lab-content-wrapper')[0];
					var index = $('.mobile-index')[0];

					$scope.slideout = new Slideout({
						'panel': content,
						'menu': index,
						'padding': 280,
						'tolerance': 70
					});
				}, 0, false);
			}


			//cleanup
			$scope.$on('$destroy', function() {
				$document.off("scroll", onScroll);
				unregisterDuScrollListeners();
			});
		}
	};
};
