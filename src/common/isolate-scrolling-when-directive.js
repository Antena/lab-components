'use strict';

/**
 * @ngdoc directive
 * @name lab-components.common.directive:isolateScrollingWhen
 * @restrict A
 * @scope
 *
 * @description
 *
 * //TODO (denise) add description
 *
 * @element ANY
 *
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
						element.bind('DOMMouseScroll', fallbackBehaviour);
						element.bind('mousewheel', mainBehaviour);
					}, 0, false);
				} else {
					element.unbind('DOMMouseScroll', fallbackBehaviour);
					element.unbind('mousewheel', mainBehaviour);
				}
			});
		}
	};
};
