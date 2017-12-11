'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.directive:labObservation
 * @restrict AE
 * @scope
 *
 * @description
 * Visual representation of a FHIR Observation. The information is layed out as:
 * - Header: displays the title (observation's display) + method + actions (configurable)
 * - Footer: currently only holds notes (observation's comments)
 * - Body: where the main content is displayed. Contents will greatly vary depending on value type and
 * configuration provided, but roughly, these are the sections that will be rendered:
 * - Numeric value (valueQuantity):
 *   * Result card (comparator + value + units) stylized to highlight the numeric value.
 *   * History sparkline
 *   * Multirange graph: shows the color-coded ranges, and points in which of these the value falls.
 *   * Optional/configurable actions: empty by default, these actions can be configured, and can optionally transclude
 *   content inside this section (below the aforementioned four columns).
 *
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Array} actions A list of actions
 * @param {Array} headerActions A list of toggle actions to be displayed in the header of this component.
 * @param {Boolean=} [viewOnly=false] Indicates wether actions should be disabled.
 * @param {Boolean=} [hideTitle=false] Indicates wether hide the observation display (title of this card).
 * @param {Boolean=} [compactMode=false] Indicates wether to condense the observation content.
 * @param {Boolean=} [multiRangeMode=false] Indicates wether to display range graphs as multirange or single range.
 * @param {Number=} [patientAgeInYears] The patient age in years (decimal). If available, it will be used to pick only the referenceRanges that are appropriate for the given gender.
 * @param {String=} [patientGender] A string representaiton of the patient gender ({@link http://hl7.org/fhir/ValueSet/administrative-gender valid values}). If available, it will be used to pick only the referenceRanges that are appropriate for the given gender.
 * @param {Function(method)=} [shouldShowMethod] A function which calculates wheather or not the method for this observation should be shown.
 *
 *
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
				observation: { "resourceType": "Observation", "id": "5", "code": { "coding": [ { "display": "T4 - TIROXINA TOTAL" } ] }, "valueQuantity": { "value": 7.8, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "mg/dL" }, "comments": "-", "status": "final", "method": { "text": "Electroquimioluminiscencia" }, "subject": { "reference": "Patient/1" }, "performer": [ { "reference": "Organization/3" } ], "interpretation": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] }, "referenceRange": [ { "low": { "value": 4.6, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "high": { "value": 12, "units": "µg/dl", "system": "http://unitsofmeasure.org", "code": "µg/dl" }, "meaning": { "coding": [ { "system": "http://hl7.org/fhir/v2/0078", "code": "N" } ] } } ] },
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
				if (newValue) {
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

require("./_lab-observation.scss");
var _ = require('underscore');

// @ngInject
module.exports = function(FhirRangeService, EXTENSION_SYSTEM) {

	return {
		scope: {
			observation: '=',
			actions: '=?',
			headerActions: '=?',
			viewOnly: '=?',
			hideTitle: '=?',
			compactMode: '=?',
			multiRangeMode: '=?',
			patientAgeInYears: '=?',
			patientGender: '=?',
			shouldShowMethod: '&',
			hovered: '=?hoveredState',
			options: '=?'
		},
		restrict: 'EA',
		transclude: true,
		templateUrl: require('./lab-observation.html'),
		link: function($scope, $element, attrs) {
			$scope.options = $scope.options || {};

			$scope.onActionHover = function(obs) {
				$scope.hovered = obs.id;
			};

			$scope.onActionLeave = function() {
				$scope.hovered = null;
			};

			$scope.onActionClick = function(action, observation, $event) {
				if (_.isFunction(action.click)) {
					action.click(observation, action);
				}
				$scope.onActionLeave();
			};

			$scope.isValueHtml = function(value) {
				return value && value.toLowerCase().indexOf("<html>") !== -1;
			};

			$scope.$watch('observation', function(observation) {
				var precisionExtension = EXTENSION_SYSTEM.PRECISION ? _.findWhere(observation.extension, { url: EXTENSION_SYSTEM.PRECISION}) : null;

				if (precisionExtension) {
					var precision = precisionExtension.valueInteger;
					$scope.options.precision = precision;

				}

				if ($scope.patientAgeInYears || $scope.patientGender) {
					if ($scope.observation.referenceRange && $scope.observation.referenceRange.length) {
						$scope.observation.referenceRange = FhirRangeService.filterRanges($scope.observation.referenceRange, $scope.patientAgeInYears, $scope.patientGender);
					}

					if ($scope.observation.history) {
						_.each($scope.observation.history, function(historicObs) {
							if (historicObs.referenceRange && historicObs.referenceRange.length) {
								historicObs.referenceRange = FhirRangeService.filterRanges(historicObs.referenceRange, $scope.patientAgeInYears, $scope.patientGender);
							}
						});
					}
				}
			});

			var hasRange = $scope.observation.referenceRange && $scope.observation.referenceRange.length > 0;
			$scope.canShowRangeGraph = hasRange && !!$scope.observation.valueQuantity && ( $scope.multiRangeMode || (!!$scope.observation.referenceRange[0].low && !!$scope.observation.referenceRange[0].high) );

			if (_.isUndefined(attrs.shouldShowMethod)) {
				$scope.doShowMethod = _.constant(true);
			} else {
				$scope.doShowMethod = function(method) {
					return $scope.shouldShowMethod({method: method});
				};
			}
		}
	};
};
