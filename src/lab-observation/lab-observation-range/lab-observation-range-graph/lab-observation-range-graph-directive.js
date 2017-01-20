'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.lab-observation-range.directive:labObservationRangeGraph
 * @restrict AE
 * @scope
 *
 * @description
 *
 * Graphic representation of the value, units and range of an observation.
 * Visual representation varies according to the type of value.
 * For numeric values (valueQuantity), a {@link lab-components.components.value-within-range.directive:valueWithinRangeGraph valueWithinRangeGraph} is used,
 * whereas for string values (valueString) the text is displayed in a similar manner (similar style and color code).
 * Additionally, if a string value is deteceted to be an html string, an iframe will be used for rendering this value.
 *
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. If the value of the Observation is numeric, it takes the info from the observation and renders a {@link lab-components.components.value-within-range.directive:valueWithinRangeGraph valueWithinRangeGraph}. Otherwise, it displays the Observation's valueString. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Object} options An object with options
 *
 *
 * @example
 <example module="lab-observation-range-graph-example">
 <file name="index.html">

 <div ng-controller="ExampleController" class="example">

 	<label>Observation Json:</label>
 	<textarea class="form-control" rows="5" ng-model="example.json"></textarea>

	 <lab-observation-range-graph observation="example.observation" options="example.options">
	 </lab-observation-range-graph>
 </div>

 </file>
 <file name="main.css">

	.example .value-within-range-graph .unhealthy {
		stroke: #C0334E;
		fill: #C0334E;
		color: #C0334E;
	}
	.example .value-within-range-graph .healthy {
		stroke: #00b752;
		fill: #00b752;
		color: #00b752;
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

 angular.module('lab-observation-range-graph-example', ['lab-components.lab-observation.lab-observation-range'])
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			json: "",
			observation: { "resourceType": "Observation", "id": "5", "meta": { "versionId": "1", "lastUpdated": "2016-05-10T15:58:57.000+00:00" }, "extension": [ { "url": "http://www.cdrossi.com/relacion_prestacion_resultado_prestacion", "valueIdentifier": { "system": "http://www.cdrossi.com/pedido_prestacion", "value": "810-2547-4" } } ], "text": { "status": "empty", "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"/>" }, "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "identifier": [ { "system": "http://www.cdrossi.com.ar/resultados", "value": "810-2547-P.866-1" } ], "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "referenceRange": [ { "modifierExtension": [ { "url": "http://www.cdrossi.com.ar/validezrangoreferencia", "valuePeriod": { "start": "2013-01-01T00:00:00" } } ], "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 },
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

require("./_lab-observation-range-graph.scss");

// @ngInject
module.exports = function() {

	return {
		restrict: 'EA',
		scope: {
			observation: '=',
			options: '='
		},
		templateUrl: require('./lab-observation-range-graph.html'),
		controller: 'LabObservationRangeController'
	};
};
