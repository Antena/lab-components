'use strict';

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
