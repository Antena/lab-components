'use strict';

/**
 * @ngdoc directive
 * @name lab-components.common.directive:isolateScrollingWhen
 * @restrict A
 * @scope
 *
 * @description
 *
 * Isolates the scrolling event within this directive's element on a given condition.
 * This can be used to avoid scroll events from reaching the $document.
 *
 * @element ANY
 *
 * @param {String|Function} isolateScrollingWhen Angular expression to watch for. When this expression evaluates
 * to truthy, the scroll event will be isolated within this directive's element. When it evaluates to falsy,
 * the default event bubbling is restored.
 *
 */


// @ngInject
module.exports = function($timeout, AngularUtilities) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			var fallbackBehaviour = function (e) {
				if (e.detail > 0 && this.clientHeight + this.scrollTop == this.scrollHeight) {
					this.scrollTop = this.scrollHeight - this.clientHeight;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
				else if (e.detail < 0 && this.scrollTop <= 0) {
					this.scrollTop = 0;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			};

			var mainBehaviour = function (e) {
				if (e.originalEvent.deltaY > 0 && this.clientHeight + this.scrollTop >= this.scrollHeight) {
					this.scrollTop = this.scrollHeight - this.clientHeight;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
				else if (e.originalEvent.deltaY < 0 && this.scrollTop <= 0) {
					this.scrollTop = 0;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}

				return true;
			};

			AngularUtilities.watchIndependently(scope, attrs.isolateScrollingWhen, function(value) {
				if (value) {
					$timeout(function() {
						element.bind('mousewheel', mainBehaviour);
						element.bind('DOMMouseScroll', fallbackBehaviour); 	//IE
					}, 0, false);
				} else {
					element.unbind('mousewheel', mainBehaviour);
					element.unbind('DOMMouseScroll', fallbackBehaviour);
				}
			});
		}
	};
};
