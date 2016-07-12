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
		_.each(_.pluck(_.union([], observation.related).reverse(), 'target'), function(obs) {
			if (obs.valueQuantity && obs.issued) {
				values.push(extractValue(obs))
			}
		});

		$scope.vm.values = values;
	}

};
