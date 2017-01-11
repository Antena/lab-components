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

