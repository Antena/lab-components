'use strict';

var _ = require('underscore');
var lodash = require('lodash');

// @ngInject
module.exports = function() {
	function getReferencedId(reference) {
		var lastSlash = _.lastIndexOf(reference, '/');
		return lastSlash > -1 ? reference.substring(lastSlash + 1, reference.length) : null;
	}

	function resolveOrder(fhirBundleResources, orderReference) {
		var searchParams = {resourceType: "DiagnosticOrder"};
		if (orderReference) {
			searchParams.id = orderReference;
		}

		var order = lodash.cloneDeep(_.findWhere(fhirBundleResources, searchParams));

		order.orderer =  lodash.cloneDeep(_.findWhere(fhirBundleResources, {
			resourceType: "Practitioner",
			id: getReferencedId(order.orderer.reference)
		}));

		order.subject =  lodash.cloneDeep(_.findWhere(fhirBundleResources, {
			resourceType: "Patient",
			id: getReferencedId(order.subject.reference)
		}));

		return order;
	}

	return {
		resolveOrderAndReportReferences: function(fhirBundle) {

			var fhirBundleResources = _.pluck(fhirBundle.entry, 'resource');

			var observations = _.where(fhirBundleResources, { resourceType: "Observation"});

			/* Order */
			var order = resolveOrder(fhirBundleResources);

			/* Report */
			var report = lodash.cloneDeep(_.findWhere(fhirBundleResources, { resourceType: "DiagnosticReport"}));
			report.subject = _.findWhere(fhirBundleResources, { resourceType: "Patient", id: getReferencedId(report.subject.reference)});
			report.performer = _.findWhere(fhirBundleResources, { resourceType: "Organization", id: getReferencedId(report.performer.reference)});
			report.requestDetail = _.map(report.requestDetail, function(requestDetail) {
				return resolveOrder(fhirBundleResources, getReferencedId(requestDetail.reference));
			});
			report.result = _.map(report.result, function(observation) {
				return _.findWhere(fhirBundleResources, {resourceType: "Observation", id: observation.reference});
			});

			return {
				diagnosticOrder: order,
				diagnosticReport: report,
				observations: observations
			};
		}
	};
};
