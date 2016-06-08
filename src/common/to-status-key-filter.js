'use strict';

/**
 * @ngdoc filter
 * @name lab-components.common.filter:toStatusKey
 * @kind function
 *
 * @description
 *
 * Given a diagnostic report status, returns a key for translating it.
 *
 * @param {String} code A DiagnosticReportStatus code. See https://www.hl7.org/fhir/2015MAY/diagnostic-report-status.html
 * <div class="alert alert-info">
 * **Note:** by appending the suffix `"_description"` to the code, you get translations for the definition of each status.
 * </div>
 *
 * @returns {String} The translation key.
 *
 *
 *
 * @example
 <example module="status-key-example">
 <file name="index.html">
 <p>Partial: <strong>{{ 'partial' | toStatusKey }}</strong></p>
 <p>Partial (translated): <strong>{{ 'partial' | toStatusKey | translate }}</strong></p>
 <p>Partial (translated description): <strong>{{ 'partial_description' | toStatusKey | translate }}</strong></p>
 </file>
 <file name="demo.js">

 angular.module('status-key-example', ['lab-components.common'])
 .config(['$translateProvider', function($translateProvider) {
			$translateProvider
				.translations('es', {
					  LAB: {
						REPORT_STATUS: {
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
						}
					}
				})
				.preferredLanguage('es')
				.useSanitizeValueStrategy('sanitizeParameters');
		}]);

 </file>
 </example>
 *
 */

String.prototype.replaceAll = function(str1, str2, ignore) {
	var replaceWith = (typeof(str2) === "string") ? str2.replace(/\$/g, "$$$$") : str2;
	var re = /([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\\<\>\-\&])/g;
	var regex = new RegExp(str1.replace(re, "\\$&"), (ignore?"gi":"g"));
	return this.replace(regex, replaceWith);
};

// @ngInject
module.exports = function() {

	return function(code, suffix) {
		var statusKey = code.toUpperCase().replaceAll(" ", "_");
		return 'LAB.REPORT_STATUS.' + statusKey + (suffix ? suffix : '');
	};
};
