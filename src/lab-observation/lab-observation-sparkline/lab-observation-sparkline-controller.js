'use strict';

var _ = require('underscore');

// @ngInject
module.exports = function($scope) {
	var observation = $scope.vm.observation;

	function extractValue(obs) {
		return {
			date: obs.issued.split('T')[0],
			value: obs.valueQuantity.value
		};
	}

	if (observation.valueQuantity && observation.issued) {
		var values = [];

		values.push(extractValue(observation));

		var obsList = _.pluck(_.union([], observation.related), 'target');

		var sorted = _.sortBy(obsList,
			function(item) {
				return -new Date(item.issued).getTime();
			});

		_.each(sorted, function(obs) {
			if (obs.valueQuantity && obs.issued) {
				values.push(extractValue(obs));
			}
		});

		$scope.vm.values = values;

		$scope.vm.options = { width: 90 };	//TODO make sparkline adjust to available width (100%)
	}

};
