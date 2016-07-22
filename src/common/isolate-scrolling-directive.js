'use strict';

/**
 * @ngdoc directive
 * @name lab-components.common.directive:isolateScrolling
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
module.exports = function() {
	return {
		restrict: 'A',
		link: function (scope, element) {
			element.bind('DOMMouseScroll', function (e) {
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
			});
			element.bind('mousewheel', function (e) {
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
			});
		}
	};
};
