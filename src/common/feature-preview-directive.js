'use strict';

/**
 * @ngdoc directive
 * @name lab-components.common.directive:featurePreview
 * @restrict A
 * @scope
 *
 * @description
 *
 * Injects a popover on the host element, with the given configuration and trigger.
 * 
 * @element ANY
 * @param {Object} featurePreview The configuration object for the feature preview.
 * The object must have either a 'templateUrl' or a 'content' property which defines the content of the popover.
 *
 * For example:
 * * ```js
 * {
 * 	templateUrl: 'example.html',
 * 	title: 'Example title'
 * }
 * ```
 *
 * Other optional configurations are (defaults shown):
 * * ```js
 * {
 * 	title: '',
 * 	placement: 'left',
 * 	delay: 50
 * }
 * ```
 *
 * @param {Boolean} featurePreviewOpen An angular expression (which will be casted to boolean) 
 * 									   to determine if the popover should be open or closed.
 *
 *
 */


var _ = require('underscore');

// @ngInject
module.exports = function($compile) {

	var CONFIG_DEFAULTS = {
		title: '',
		placement: 'left',
		delay: 50
	};

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {

			var config = $scope.$eval(attrs.featurePreview);

			if (config && (!!config.templateUrl || !!config.content)) {

				var options = _.defaults({}, config, CONFIG_DEFAULTS);

				if (!!config.templateUrl) {
					$element.attr('uib-popover-template', '' + attrs.featurePreview + '.templateUrl');
				} else {
					$element.attr('uib-popover', config.content);
				}

				$element.attr('popover-title', options.title);
				$element.attr('popover-placement', options.placement);
				$element.attr('popover-popup-delay', options.delay);
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
