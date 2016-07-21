'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.lab-observation-result.directive:labObservationResult
 * @restrict AE
 * @scope
 *
 * @description
 *
 * //TODO (denise) add description
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. If the value of the Observation is numeric, it takes the info from the observation and renders a {@link lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph valueWithinMultipleRangesGraph}. Otherwise, it displays the Observation's valueString. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Object} options An object with options
 *
 *
 **/

require("./_lab-observation-result.scss");

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '=',
			options: '='
		},
		templateUrl: require('./lab-observation-result.html'),
		link: function($scope) {
			$scope.isValueStringHtml = function(observation) {
				return observation && observation.valueString && observation.valueString.toLowerCase().indexOf("<html>") !== -1;
			};
		}
	};
};
