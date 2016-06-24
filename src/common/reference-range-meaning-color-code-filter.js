'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:referenceRangeMeaningColorCode
 * @kind function
 *
 * @description
 *
 * Given a observation's reference range meaning and returns a class name for color-coding it's code.
 * See https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html
 *
 * @param {Object} code An Observation's referenceRange meaning. See https://www.hl7.org/fhir/2015MAY/datatypes.html#CodeableConcept
 *
 * @returns {String} A class name to represent the meaning.
 *
 *
 *
 * @example
 <example module="meaning-color-example">
 <file name="index.html">
 <div ng-controller="ExampleController" class="example">

 <label>Observation Json:</label>
 <textarea class="form-control" rows="5" ng-model="example.json"></textarea>

 <p class="{{ example.observation.interpretation | referenceRangeMeaningColorCode }}">{{ example.observation.interpretation.coding[0].code }}</p>

 </div>
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

 angular.module('meaning-color-example', ['lab-components.common'])
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			json: "",
			observation: { "resourceType": "Observation", "id": "5", "meta": { "versionId": "1", "lastUpdated": "2016-05-10T15:58:57.000+00:00" }, "extension": [ { "url": "http://www.cdrossi.com/relacion_prestacion_resultado_prestacion", "valueIdentifier": { "system": "http://www.cdrossi.com/pedido_prestacion", "value": "810-2547-4" } } ], "text": { "status": "empty", "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"/>" }, "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "identifier": [ { "system": "http://www.cdrossi.com.ar/resultados", "value": "810-2547-P.866-1" } ], "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "interpretation": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] }, "referenceRange": [ { "modifierExtension": [ { "url": "http://www.cdrossi.com.ar/validezrangoreferencia", "valuePeriod": { "start": "2013-01-01T00:00:00" } } ], "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 }
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
 *
 */

// @ngInject
module.exports = function() {
	return function(code) {
		var output = '';
		if (code && code.coding && code.coding.length) {
			switch (code.coding[0].code) {
				case 'H':
					output = 'unhealthy';
					break;
				case 'N':
					output = 'healthy';
					break;
				case 'L':
					output = 'unhealthy';
					break;
				default:
					output = '';
			}
		}
		return output;
	};
};
