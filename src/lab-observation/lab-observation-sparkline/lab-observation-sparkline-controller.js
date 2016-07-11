'use strict';

// @ngInject
module.exports = function($scope) {
	var observation = $scope.vm.observation;

	function extractValue(obs) {
		return {
			date: obs.issued.split('T')[0],
			value: obs.valueQuantity.value
		}
	}

	if (observation.valueQuantity && observation.issued) {
		var values = [];

		values.push(extractValue(observation));
		_.each(_.pluck(observation.related.reverse(), 'target'), function(obs) {
			values.push(extractValue(obs))
		});

		$scope.vm.values = values;
	}

};
