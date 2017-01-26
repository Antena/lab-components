'use strict';

/**
 * @ngdoc filter
 * @name lab-components.mappings.filter:coding2TranslationKey
 * @kind function
 *
 * @description
 *
 * Given a {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Coding coding} object (i.e. observation's reference range meaning) and returns a key for translating it's code.
 * For some examples of posible codes, see
 * http://hl7.org/fhir/v2/0078/index.html
 * https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html
 *
 *
 * @param {Object} coding A {@link https://www.hl7.org/fhir/2015MAY/datatypes.html#Coding coding} object
 *
 * @returns {String} The translation key.
 *
 *
 *
 * @example
 <example module="meaning-example">
 <file name="index.html">
 <div ng-controller="ExampleController" class="example">

 <label>Observation Json:</label>
 <textarea class="form-control" rows="5" ng-model="example.json"></textarea>

 <p>{{example.observation.interpretation.coding[0].code}}: <strong>{{ example.observation.interpretation.coding[0] | coding2TranslationKey }}</strong></p>
 <p>{{example.observation.interpretation.coding[0].code}} (translated): <strong>{{ example.observation.interpretation.coding[0] | coding2TranslationKey | translate }}</strong></p>

 </div>
 </file>
 <file name="demo.js">

 angular.module('meaning-example', ['lab-components.common'])
 	.config(['$translateProvider', function($translateProvider) {
			$translateProvider
				.translations('es', {
					  LAB: {
						"REFERENCE_RANGE_MEANING": {
						  "HIGH": "Alto",
						  "REGULAR": "Normal",
						  "LOW": "Bajo"
						}
					}
				})
				.preferredLanguage('es')
				.useSanitizeValueStrategy('sanitizeParameters');
		}])
 	.controller('ExampleController', ['$scope', function($scope) {
		$scope.example = {
			json: "",
			observation: { "resourceType": "Observation", "id": "5", "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "interpretation": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] }, "referenceRange": [ {  "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 }
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
			var mappings = $fhirMappingsProvider.getCoding2TranslationKeyMappings();
			result = mappings[coding.system] && mappings[coding.system][coding.code] ? mappings[coding.system][coding.code] : '';
		}
		return result;
	};
}];

