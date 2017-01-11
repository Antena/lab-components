'use strict';

/**
 * @ngdoc filter
 * @name lab-components.mappings.filter:coding2ClassName
 * @kind function
 *
 * @description
 *
 * Given a {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Coding coding} object (i.e. observation's reference range meaning), returns a class name for color-coding it's code.
 * See https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html
 *
 * To override or extend default mappings, just call the set method of $fhirMappingsProvider on configuration phase.
 * For an example on how to do this, look at the demo code below or read the {@link lab-components.mappings.$fhirMappingsProvider $fhirMappingsProvider's documentation}.
 *
 * @param {Object} coding A {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Coding coding} object
 *
 * @returns {String} A class name to represent the meaning.
 *
 *
 *
 * @example
 <example module="meaning-color-example">
 <file name="index.html">
 <div ng-controller="ExampleController" class="example">

 <p>Interpretation: <span class="{{ example.observation.interpretation.coding[0] | coding2ClassName }}">{{ example.observation.interpretation.coding[0].code }}</span></p>
 <p>Reference range meaning: <span class="{{ example.observation.referenceRange[0].meaning.coding[0] | coding2ClassName }}">{{ example.observation.referenceRange[0].meaning.coding[0].code }}</span></p>
 <br>
 <label>Observation Json:</label>
 <textarea class="form-control" rows="5" ng-model="example.json"></textarea>

 </div>
 </file>
 <file name="styles.css">

 	.example .unhealthy {
		color: #C0334E;
	}
 	.example .healthy {
		color: #00b752;
	}

 	.example .configured-class {
		color: #7CB8FF;
 	}

 	.example textarea {
		width: 98%;
	}

 </file>
 <file name="demo.js">

 var exampleModule = angular.module('meaning-color-example', ['lab-components.mappings']);
 exampleModule.config(['fhirMappingsProvider', function($fhirMappingsProvider) {
	$fhirMappingsProvider.setCoding2ClassNameMappings({
		"https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html": {
			"recommended": 'configured-class'
		}
	}, true);
 }]);
 exampleModule
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			json: "",
			observation: {
				"resourceType": "Observation",
				"id": "5",
				"meta": {
					"versionId": "1",
					"lastUpdated": "2016-05-10T15:58:57.000+00:00"
				},
				"code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] },
				"valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" },
				"comments": "-",
				"status": "final",
				"method": { "text": "Electroquimioluminiscencia" },
				"identifier": [
					{
						"system": "http://www.cdrossi.com.ar/resultados",
						"value": "810-2547-P.866-1"
					}
				],
				"subject": { "reference": "Patient/1" },
				"performer": [ { "reference": "Organization/3" } ],
				"interpretation": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] },
				"referenceRange": [
					{
						"low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" },
						"high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" },
						"meaning": { "coding": [ { "system": "https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html", "code": "recommended" } ] }
					}
				]
			}
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
module.exports = ['fhirMappings', function($fhirMappingsProvider) {
	return function(coding) {
		var result = '';
		if (coding && coding.code) {
			var mappings = $fhirMappingsProvider.getCoding2ClassNameMappings();
			result = mappings[coding.system] && mappings[coding.system][coding.code] ? mappings[coding.system][coding.code] : '';
		}
		return result;
	};
}];
