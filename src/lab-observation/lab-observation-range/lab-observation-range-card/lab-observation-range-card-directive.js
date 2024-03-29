'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.lab-observation-range.directive:labObservationRangeCard
 * @restrict AE
 * @scope
 *
 * @description
 *
 * Stylized text representation of the value, units and range of an observation.
 * Visual representation varies according to the type of value.
 * For numeric values (valueQuantity), a {@link lab-components.components.value-within-range.directive:valueWithinRangeCard valueWithinRangeCard} is used,
 * whereas for string values (valueString) the text is displayed in a similar manner (similar style and color code).
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. If the value of the Observation is numeric, it takes the info from the observation and renders a {@link lab-components.components.value-within-range.directive:valueWithinRangeCard valueWithinRangeCard}. Otherwise, it displays the Observation's valueString. See https://www.hl7.org/fhir/2015MAY/observation.html
 *
 *
 * @example
 <example module="lab-observation-range-card-example">
 <file name="index.html">

 <div ng-controller="ExampleController" class="example">

 	<label>Observation Json:</label>
 	<textarea class="form-control" rows="5" ng-model="example.json"></textarea>

 	<lab-observation-range-card observation="example.observation">
 	</lab-observation-range-card>
 </div>

 </file>
 <file name="main.css">

	.value-within-range-card p,
	.value-within-range-card p {
		padding: 0;
		line-height: 1;
	}

	.value-within-range-card .reference-range,
	.value-within-range-card .reference-range {
		padding: 4px 0;
	}

	.value-within-range-card .reference-range .reference,
	.value-within-range-card .reference-range .reference {
		font-size: 12px;
		vertical-align: text-top;
	}

	.value-within-range-card .reference-range .reference-type,
	.value-within-range-card .reference-range .reference-type {
		text-align: left;
		color: #CCC;
	}

	.value-within-range-card .reference-range .value,
	.value-within-range-card .reference-range .value {
		text-align: right;
	}

	.value-within-range-card .main-value,
	.value-within-range-card .main-value {
		font-size: 36px !important;
		line-height: 36px;
	}

	.value-within-range-card .unit,
	.value-within-range-card .unit {
		margin-top: 0;
		font-size: 12px;
	}

	.value-within-range-card {
		min-height: 80px;
	}

	.left {
		float: left;
		display: block;
		margin-right: 10px;
	}
 </file>
 <file name="styles.css">

 	.example .unhealthy {
		color: #C0334E;
	}
 	.example .healthy {
		color: #00b752;
	}

 	.example textarea {
 		width: 98%;
 	}

 </file>
 <file name="demo.js">

 	angular.module('lab-observation-range-card-example', ['lab-components.lab-observation.lab-observation-range'])
 		.controller('ExampleController', ['$scope', function($scope) {
			$scope.example = {
				json: "",
				observation: { "resourceType": "Observation", "id": "5", "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "referenceRange": [ {  "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 }
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

require("./_lab-observation-range-card.scss");

// @ngInject
module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			observation: '='
		},
		templateUrl: require('./lab-observation-range-card.html'),
		controller: 'LabObservationRangeController'
	};
};
