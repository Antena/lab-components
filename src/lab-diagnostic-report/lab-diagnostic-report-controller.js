'use strict';

/**
 * @ngdoc controller
 * @name lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
 *
 * @description
 * `LabDiagnosticReportController` provides some utilitary functions for mapping report observations to order items, and grouping observations.
 *
 * Each instance of {@link lab-components.lab-diagnostic-report.directive:labDiagnosticReport labDiagnosticReport} directive creates an instance of this controller.
 *
 */

var _ = require('underscore');
var moment = require('moment');

// @ngInject
module.exports = function($scope, $filter) {

	$scope.$watch('vm.observations', function(observations) {

		if ($scope.vm.patient) {
			$scope.vm.patientAgeInYearsAtMomentOfReport = moment($scope.vm.reportDate || new Date()).diff(moment($scope.vm.patient.birthDate), 'years', true);
			$scope.vm.patientGender = $scope.vm.patient.gender;
		}

		_.each(observations, function(obs) {
			obs.doesChildMethodMatch = function(method) {
				return !obs.method || !method || (obs.method.text !== method.text);
			};
		});

		$scope.vm.groupedObservations = _.groupBy(observations, function(obs) {
			return obs.extension && obs.extension[0].valueIdentifier ? obs.extension[0].valueIdentifier.value : obs.id;
		});
	});

	$scope.$watch('vm.patient', function(patient) {

		if (patient) {
			$scope.vm.patientEmail = $filter('patientEmail')(patient);
		}
	});

	/**
	 * @ngdoc function
	 * @name isTopLevel
	 * @methodOf lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
	 * @description
	 *
	 * //TODO (denise) add description
	 *
	 * @param {Object} orderItemCode The code (identifier) of a diagnostic order item (`diagnosticOrder.item[x].code.extension[0].valueIdentifier.value`). See https://www.hl7.org/fhir/2015MAY/diagnosticorder.html.
	 *
	 * @param {Array} observationsPerOrderItem A list of observations grouped by groupId.
	 *
	 * @returns {Boolean} `true` if the group contains only one observation.
	 *
	 */
	$scope.isTopLevel = function(observation) {
		return !observation.related || observation.related.length === 1;
	};

	//TODO (denise) check if still used here
	$scope.getObservationValueDisclosure = function(observation) {
		var result;
		if (observation.valueQuantity) {
			var valueKey = observation.valueQuantity;
			var value = valueKey.value,
				unit = valueKey.unit ? valueKey.unit : "",
				code = !observation.referenceRange[0].meaning ? "" :
				" (" + observation.referenceRange[0].meaning.coding[0].code + ")";

			result = value + " " + unit + code;
		} else if (observation.valueString) {
			result = observation.valueString;
		} else {
			result = "-";
		}
		return result;
	};

	//TODO (denise) de-dupe (lab-observation-range-controller.js)
	$scope.valueStringMatchesReference = function(observation) {
		return observation.valueString === observation.referenceRange[0].text || observation.referenceRange[0].text === '.' || _.isUndefined(observation.referenceRange[0].text);
	};

	$scope.showNext = function(list, current, index) {
		var next = list[index+1];
		var result = !current.added && !!next && !!current.valueString && !!next.valueString;
		if(result) {
			next.added = true;
		}
		return result;
	};

	// Helper function to avoid complex ng-if in the template (uses the same code to show 1 or N Observations)
	$scope.getObservationList = function(observation) {
		var result;
		if(observation.related) {
			result = _.where(observation.related, {type: 'has-member'});
			result = _.pluck(result, 'target');
		}

		if(!result || result.length < 1) {
			result = [observation];
		}

		return result;
	};

	/**
	 * @ngdoc function
	 * @name getObservationDisplay
	 * @methodOf lab-components.lab-diagnostic-report.controller:LabDiagnosticReportController
	 * @description
	 *
	 * Returns an Observation display. The display property structure varies depending on if the observation has members (it's a group) or not.
	 *
	 * @param {Object} observation The FHIR observation to extract the display from.
	 *
	 * @returns {String} The observation display.
	 *
	 */
	$scope.getObservationDisplay = function(observation) {
		return observation.display ? observation.display : observation.code.coding[0].display;
	};
};
