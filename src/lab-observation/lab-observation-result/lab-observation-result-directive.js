'use strict';

/**
 * @ngdoc directive
 * @name lab-components.lab-observation.lab-observation-result.directive:labObservationResult
 * @restrict AE
 * @scope
 *
 * @description
 *
 * Renders the observation value as text.
 * If it's a valueQuantity, then the format is [comparator][VALUE][unit] (supports html entities for comparator strings).
 * If it's a valueString, it just renders the valueString.
 * If it's a valueString, and the string value is detected to be html, it will render it inside an iframe.
 *
 * @element ANY
 * @param {Object} observation A fhir observation object to display. If the value of the Observation is numeric, it takes the info from the observation and renders a {@link lab-components.components.value-within-multiple-ranges.directive:valueWithinMultipleRangesGraph valueWithinMultipleRangesGraph}. Otherwise, it displays the Observation's valueString. See https://www.hl7.org/fhir/2015MAY/observation.html
 * @param {Object} options An object with options
 *
 * @example
 <example module="lab-observation-result-example">
 <file name="index.html">

 <div ng-controller="ExampleController" class="example">
	 <form name="exampleForm" class="form-inline" novalidate>
		 <div class="row demo-row">
 			<h3 class="title">valueQuantity (with html entity comparator)</h3>
 			<div lab-observation-result observation="numericObsWithHtmlComparator" options="options"></div>
 		 </div>
  		 <div class="row demo-row">
 			<h3 class="title">valueQuantity (with string comparator)</h3>
 			<div lab-observation-result observation="numericObsWithStringComparator" options="options"></div>
		 </div>
		 <div class="row demo-row">
		 	<h3 class="title">valueQuantity (no comparator)</h3>
		 	<div lab-observation-result observation="numericObsNoComparator" options="options"></div>
		 </div>
		 <div class="row demo-row">
 			<h3 class="title">valueString (with actual string value)</h3>
			<div lab-observation-result observation="stringObsWithStringValue"></div>
		 </div>
		 <div class="row demo-row">
			 <h3 class="title">valueString (with html string value)</h3>
			 <div lab-observation-result observation="stringObsWithHtmlValue"></div>
		 </div>
	 </form>
 </div>

 </file>
 <file name="styles.css">

		 .example .demo-row {
			margin: 10px;
			padding: 10px;
			border: 1px dashed orange;
		}

 		.example .demo-row .title {
			text-align: center;
    		color: #e18c1c;
			font-family: monospace;
		}

 </file>

 <file name="demo.js">

 	angular.module('lab-observation-result-example', ['lab-components.lab-observation.lab-observation-result'])
 			.controller('ExampleController', ['$scope', function($scope) {

 					$scope.numericObsWithHtmlComparator = {
						"resourceType": "Observation",
						"valueQuantity": {
						  "value": 20,
						  "comparator": "&lt;",
						  "units": "U",
						  "system": "http://unitsofmeasure.org",
						  "code": "U"
						}
					  };

 					$scope.numericObsWithStringComparator = {
						"resourceType": "Observation",
						"valueQuantity": {
						  "value": 20,
						  "comparator": ">",
						  "units": "U",
						  "system": "http://unitsofmeasure.org",
						  "code": "U"
						}
					  };

					  $scope.numericObsNoComparator = {
						"resourceType": "Observation",
						"valueQuantity": {
						  "value": 20,
						  "units": "U",
						  "system": "http://unitsofmeasure.org",
						  "code": "U"
						}
					  };

 					$scope.stringObsWithStringValue = {
						"resourceType": "Observation",
						"valueString": "Positivo"
					};

					$scope.stringObsWithHtmlValue = {
						"resourceType": "Observation",
						"valueString": "<HTML><HEAD><TITLE></TITLE></HEAD><BODY><TABLE COLS=1><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=696><B>Antibiograma</B></TD></TR></TABLE><TABLE COLS=2><TR><TD WIDTH=400></TD><TD WIDTH=448></TD></TR><TR><TD WIDTH=400><B> - Método:</B></TD><TD WIDTH=448><B>DIFUSION</B></TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Ciprofloxacina</TD><TD WIDTH=448><DIV><B>Sensible</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Nitrofurantoina</TD><TD WIDTH=448><DIV><B>Sensible</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Ampicilina</TD><TD WIDTH=448><DIV><B>Resistente</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Cefalotina</TD><TD WIDTH=448><DIV><B>Resistente</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Ampicilina/sulbactam</TD><TD WIDTH=448><DIV><B>Resistente</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Cefuroxima</TD><TD WIDTH=448><DIV><B>Sensible</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Trimetoprima/sulfametoxazol</TD><TD WIDTH=448><DIV><B>Sensible</B></DIV> </TD></TR><TR ALIGN=LEFT VALIGN=TOP><TD WIDTH=400>Cefazolina</TD><TD WIDTH=448><DIV><B>Resistente</B></DIV> </TD></TR></TABLE>               \n          </BODY> </HTML>"
					};

 					$scope.options = {
 						precision: 0
 					};

				}]);

 </file>
 </example>
 *
 **/

require("./_lab-observation-result.scss");

var _ = require('underscore');

// @ngInject
module.exports = function($sce, EXTENSION_SYSTEM) {

	return {
		restrict: 'EA',
		scope: {
			observation: '=',
			options: '='
		},
		templateUrl: require('./lab-observation-result.html'),
		link: function($scope) {
			$scope.precision = 0;

			if (!!$scope.observation.valueQuantity && !!$scope.observation.valueQuantity.comparator) {
				$scope.comparator = $sce.trustAsHtml($scope.observation.valueQuantity.comparator + '&nbsp;');
			}

			$scope.isValueStringHtml = function(observation) {
				return observation && observation.valueString && observation.valueString.toLowerCase().indexOf("<html>") !== -1;
			};

			$scope.$watch('observation', function(observation) {
				var precisionExtension = EXTENSION_SYSTEM.PRECISION ? _.findWhere(observation.extension, {url: EXTENSION_SYSTEM.PRECISION}) : null;

				if (precisionExtension) {
					$scope.precision = precisionExtension.valueInteger;
				}
			});
		}
	};
};
