'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.lab-observation-multirange.directive:labObservationMultirangeGraph
 * @restrict AE
 * @scope
 *
 * @description
 *
 * Given a set of ranges, visually represents to which of these a value belongs. Ranges should contain a meaning property,
 * from which a semantic value will be derived, allowing for ranges to be color coded as a visual aid to interpret the
 * it's meaning, and the desirability of a value falling in each range.
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. If the value of the Observation is numeric, it takes the info from the observation and renders a {@link lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph valueWithinMultipleRangesGraph}. Otherwise, it displays the Observation's valueString. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Object} options An object with options
 *
 *
 * @example
 <example module="lab-observation-multirange-graph-example">
 <file name="index.html">

 <div ng-controller="ExampleController" class="example">

 	<label>Observation Json:</label>
 	<textarea class="form-control" rows="5" ng-model="example.json"></textarea>

	 <lab-observation-multirange-graph observation="example.observation" options="example.options">
	 </lab-observation-multirange-graph>
 </div>

 </file>
 <file name="styles.css">

	 .range-great {
		stroke: #70AB4E;
		fill: #70AB4E;
		color: #70AB4E;
	 }

	 .range-good {
		stroke: #DDC100;
		fill: #DDC100;
		color: #DDC100;
	 }

	 .range-so-so {
		stroke: #DD8B05;
		fill: #DD8B05;
		color: #DD8B05;
	 }

	 .range-bad {
		stroke: #C86403;
		fill: #C86403;
		color: #C86403;
	 }

	 .range-danger {
		stroke: #C10000;
		fill: #C10000;
		color: #C10000;
	 }

	 .range-catch-all {
		stroke: #747474;
		fill: #747474;
		color: #747474;
	 }

	.example textarea {
		width: 98%;
		margin-bottom: 40px;
	}

 </file>
 <file name="demo.js">

 angular.module('lab-observation-multirange-graph-example', ['lab-components.lab-observation.lab-observation-multirange'])
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			json: "",
			observation: { "resourceType": "Observation", "id": "5", "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "referenceRange": [ {  "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 },
			options: { "precision": 1 }
		};

		$scope.example.json = angular.toJson($scope.example.observation);

		$scope.$watch('example.json', function(newValue) {
			if(newValue) {
				$scope.example.observation = angular.fromJson(newValue);
			}
		});
	}]);

 </file>
 </example>
 */

require("./_lab-observation-multirange.scss");

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '=',
			options: '='
		},
		templateUrl: require('./lab-observation-multirange-graph.html'),
		bindToController: true,
		controllerAs: 'vm',
		controller: 'LabObservationMultirangeController',
		link: function($scope) {
			$scope.init();
		}
	};
};
