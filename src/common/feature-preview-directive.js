'use strict';

// @ngInject
module.exports = function($compile) {
	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {

			var config = $scope.$eval(attrs.featurePreview);

			if (config) {
				$element.attr('uib-popover-template', '' + attrs.featurePreview + '.templateUrl');
				$element.attr('popover-title', config.title);
				$element.attr('popover-placement', 'left');
				$element.attr('popover-popup-delay', 50);
				$element.attr('popover-is-open', '!!' + attrs.featurePreviewOpen);
				$element.attr('popover-enable', '!!' + attrs.featurePreview + ' && !!' + attrs.featurePreviewOpen);
				$element.attr('popover-append-to-body', 'true');
				$element.attr('popover-trigger', 'none');

				$element.removeAttr('feature-preview');
				$element.removeAttr('feature-preview-open');

				var $e = $compile($element[0].outerHTML)($scope);
				$element.replaceWith($e);
			}
		}
	};
};
