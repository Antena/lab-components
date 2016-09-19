'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function ($scope) {
	var data = [];
	_.each(_.filter($scope.observationList, function(obs) { return obs.resourceType == 'Observation' && !_.isEmpty(obs.valueQuantity) && !_.isEmpty(obs.issued) }), function(obs) {
		var datum = {};
		datum.date = obs.issued;
		datum.value = obs.valueQuantity.value;

		data.push(datum);
	});

	$scope.data = data;
};
