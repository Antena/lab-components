'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.directive:labObservation
 * @restrict AE
 * @scope
 *
 * @description
 *
 * TODO...
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Array} actions A list of actions
 * @param {Array} headerActions A list of toggle actions to be displayed in the header of this component.
 * @param {Boolean} [viewOnly=false] Indicates wether actions should be disabled.
 *
 *
 * @example
 <example module="lab-observation-example">
 <file name="index.html">

 <div ng-controller="ExampleController" class="example">

	<label>Observation Json:</label>
 	<textarea class="form-control" rows="5" ng-model="example.json"></textarea>

	 <lab-observation
		observation="example.observation"
		actions="example.actions"
		header-actions="example.headerActions">
		<p ng-if="example.observation.showContent" class="inner-content">Transcluded content goes here. Observation id: {{ example.observation.id }}</p>
	 </lab-observation>
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

 	.example .inner-content {
 		background-color: #FFFF66;
 	}

 </file>
 <file name="demo.js">

 angular.module('lab-observation-example', ['lab-components.lab-observation'])
 	.controller('ExampleController', ['$scope', function($scope) {
			$scope.example = {
				json: "",
				observation: { "resourceType": "Observation", "id": "5", "meta": { "versionId": "1", "lastUpdated": "2016-05-10T15:58:57.000+00:00" }, "extension": [ { "url": "http://www.cdrossi.com/relacion_prestacion_resultado_prestacion", "valueIdentifier": { "system": "http://www.cdrossi.com/pedido_prestacion", "value": "810-2547-4" } } ], "text": { "status": "empty", "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"/>" }, "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "identifier": [ { "system": "http://www.cdrossi.com.ar/resultados", "value": "810-2547-P.866-1" } ], "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "referenceRange": [ { "modifierExtension": [ { "url": "http://www.cdrossi.com.ar/validezrangoreferencia", "valuePeriod": { "start": "2013-01-01T00:00:00" } } ], "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ], "showHistory": 0 },
				actions: [
					{
						labelOn: "Ocultar Contenido",
						labelOff: "Mostrar Contenido",
						isToggle: true,
						click: function(observation) {
							observation.showContent = !observation.showContent;
						},
						check: function(observation) {
							return !!observation.valueQuantity;
						}
					}
				],
				headerActions: [
					{
						icon: "icon",
						activeAndHoveredLabel: "Dejar de monitorear",
						activeLabel: "Valor monitoreado",
						activeIcon: "icon-check",
						inactiveLabel: "Monitorear este valor",
						inactiveIcon: "icon-more",
						click: function(observation) {
							observation.monitored = !observation.monitored;
						},
						check: function(observation) {
							return !!observation.valueQuantity;
						},
						isActive: function(observation) {
							return !!observation.monitored;
						},
						showAsHovered: function(observation) {
							return false;
						}
					}
				]
			};

			$scope.example.json = angular.toJson($scope.example.observation);

			$scope.$watch('example.json', function(newValue) {
				if(newValue) {
					$scope.example.observation = angular.fromJson(newValue);
				}
			});
		}])
 	.config(['$translateProvider', function($translateProvider) {
			$translateProvider
				.translations('es', {
					  "LAB": {
							"METHOD": "Método",
							"STATUS": "Estado",
							"NOTE": "Nota",
							"MEANING": "Interpretación",
							"REPORT_STATUS": {
								  "REGISTERED": "Registrado",
								  "REGISTERED_DESCRIPTION": "El reporte fue registrado, pero no posee contenido aún",
								  "PARTIAL": "Parcial",
								  "PARTIAL_DESCRIPTION": "Los datos en este reporte pueden estar incompletos o pendientes de verificación",
								  "FINAL": "Final",
								  "FINAL_DESCRIPTION": "Completo y verificado por una autoridad pertinente",
								  "CORRECTED": "Corregido",
								  "CORRECTED_DESCRIPTION": "Nuevos datos fueron agregados luego de finalizado, pero ningún contenido pre-existente fue modificado. Nuevamente verificado",
								  "APPENDED": "Corregido",
								  "APPENDED_DESCRIPTION": "Nuevos datos fueron agregados luego de finalizado, pero ningún contenido pre-existente fue modificado. Nuevamente verificado",
								  "CANCELLED": "Cancelado",
								  "CANCELLED_DESCRIPTION": "El reporte no está disponible",
								  "ENTERED_IN_ERROR": "Con errores",
								  "ENTERED_IN_ERROR_DESCRIPTION": "El reporte fue retirado posterior a haber estado finalizado"
							},
							"REFERENCE_RANGE_MEANING": {
							  "HIGH": "Alto",
							  "REGULAR": "Normal",
							  "LOW": "Bajo"
							}
						}
				})
				.preferredLanguage('es')
				.useSanitizeValueStrategy('sanitizeParameters');
		}]);

 </file>
 </example>
 */

// @ngInject
module.exports = function() {

	return {
		scope: {
			observation: '=',
			actions: '=?',
			headerActions: '=?',
			viewOnly: '=?'
		},
		restrict: 'EA',
		transclude: true,
		templateUrl: require('./lab-observation.html')
	};
};
