'use strict';

/**
 * @ngdoc service
 * @name lab-components.service:FhirBundleService
 * @kind function
 *
 * @description
 * Given a valid FHIR bundle, embeds referenced resources.
 *
 * <div class="alert alert-warning">
 * **Note:** this service only supports a few types of FHIR resources for the moment.
 *
 * List of supported resource types:
 * <ul>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/diagnosticorder.html">DiagnosticOrder</a></li>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/practitioner.html">Practitioner</a></li>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/patient.html">Patient</a></li>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/organization.html">Organization</a></li>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/diagnosticreport.html">DiagnosticReport</a></li>
 *     <li><a href="https://www.hl7.org/fhir/2015MAY/observation.html">Observation</a></li>
 * </ul>
 * </div>
 *
 * See the individual methods for more information and examples.
 *
 */

var _ = require('underscore');
var lodash = require('lodash');

// @ngInject
module.exports = function() {
	function getReferencedId(reference) {
		var lastSlash = _.lastIndexOf(reference, '/');
		return lastSlash > -1 ? reference.substring(lastSlash + 1, reference.length) : null;
	}

	function resolveFromOrder(order, fhirBundleResources) {
		order.orderer = lodash.cloneDeep(_.findWhere(fhirBundleResources, {
			resourceType: "Practitioner",
			id: getReferencedId(order.orderer.reference)
		}));

		order.subject = lodash.cloneDeep(_.findWhere(fhirBundleResources, {
			resourceType: "Patient",
			id: getReferencedId(order.subject.reference)
		}));

		return order;
	}

	function resolveOrder(fhirBundleResources, orderReference) {
		var searchParams = {resourceType: "DiagnosticOrder"};
		if (orderReference) {
			searchParams.id = orderReference;
		}

		var order = lodash.cloneDeep(_.findWhere(fhirBundleResources, searchParams));

		return resolveFromOrder(order, fhirBundleResources);
	}

	return {

		/**
		 * @ngdoc function
		 * @name resolveOrderAndReportReferences
		 * @methodOf lab-components.service:FhirBundleService
		 * @description
		 *
		 * Takes a FHIR bundle, and resolves all references starting from a `DiagnosticOrder`. If a orderValueIdentifier is provided,
		 * that `DiagnosticOrder` will be used. Otherwise, the first DiagnosticOrder in the bundle will be chosen.
		 *
		 * @param {Object} fhirBundle A valid FHIR bundle.
		 * @param {String=} orderValueIdentifier The order identifier value from which all resolutions begin (`order.identifier[0].value`)
		 *
		 * @returns {Object} The resolved bundle, with the following structure:
		 * ```js
		 * {
		 *   // each of these contains all embedded resources (orderer, subject, etc)
		 *   diagnosticOrder: order,
		 *   diagnosticReport: report,
		 *   observations: report.result
		 * };
		 * ```
		 *
		 * @example
		 *
		 * ```js
		 *  var fhirBundle = require('./full-study-bundle.json');
		 *
		 *  var resolvedBundleForFirstOrder = FhirBundleService.resolveOrderAndReportReferences(fhirBundle);
		 *  var resolvedBundleForSpecificOrder = FhirBundleService.resolveOrderAndReportReferences(fhirBundle, "810-2547");
		 * ```
		 */
		resolveOrderAndReportReferences: function(fhirBundle, orderValueIdentifier) {

			var fhirBundleResources = _.pluck(fhirBundle.entry, 'resource');

			/* Order */
			var order;
			if(!orderValueIdentifier) {
				// use the first one if no orderValueIdentifier provided
				order = resolveOrder(fhirBundleResources);
			} else {
				var orders = _.where(fhirBundleResources, { resourceType: "DiagnosticOrder" });
				var rawOrder =_.find(orders, function(o) {
					return o.identifier[0].value === orderValueIdentifier;
				});
				order = resolveFromOrder(rawOrder, fhirBundleResources);
			}

			var reports = _.where(fhirBundleResources, { resourceType: "DiagnosticReport"});
			var orderId = "DiagnosticOrder/" + order.id;

			/* Report */
			var rawReport =_.find(reports, function(r) {
				return r.requestDetail[0].reference === orderId;
			});
			var report = lodash.cloneDeep(rawReport);
			report.subject = _.findWhere(fhirBundleResources, { resourceType: "Patient", id: getReferencedId(report.subject.reference)});
			report.performer = _.findWhere(fhirBundleResources, { resourceType: "Organization", id: getReferencedId(report.performer.reference)});
			report.requestDetail = _.map(report.requestDetail, function(requestDetail) {
				return resolveOrder(fhirBundleResources, getReferencedId(requestDetail.reference));
			});
			report.result = _.map(report.result, function(observation) {
				return _.findWhere(fhirBundleResources, {resourceType: "Observation", id: getReferencedId(observation.reference)});
			});

			return {
				diagnosticOrder: order,
				diagnosticReport: report,
				observations: report.result
			};
		}
	};
};
