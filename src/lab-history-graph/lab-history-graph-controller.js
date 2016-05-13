'use strict';

var moment = require('moment');

// @ngInject
module.exports = function ($scope) {

	this.simplifyObservations = function (observations, dateFormat) {

		return _.map(observations, function (observation) {
			return {
				'value': observation.valueQuantity.value,
				'lowValue': observation.referenceRange[0].low.value,
				'highValue': observation.referenceRange[0].high.value,
				'date': moment(observation.creationDate).format(dateFormat),
				'unit': observation.valueQuantity.unit
			};
		})
	};
	
	function calculateDottedLines(data) {
		var dottedLines = [];
		for (var i = 0; i < data.length; i++) {
			if (i < data.length - 1) {
				var currValue = $scope.dimensions.x(data[i].date);
				var nextValue = $scope.dimensions.x(data[i+1].date);
				var dottedline = { x: ( (nextValue - currValue) / 2 ) + currValue };
				dottedLines.push(dottedline);
			}
		}
		return dottedLines;
	}

	this.calculateRectangles = function(data) {
		var rectangles = [];
		var xRectangles = calculateDottedLines(data);
		xRectangles.unshift({x:0});

		for (var i = 0; i < data.length; i++) {
			if (i < data.length) {
				var widthRectangle;

				if (i === (data.length - 1) ) {
					widthRectangle = $scope.dimensions.width;
				} else {
					widthRectangle = xRectangles[i + 1].x - xRectangles[i].x
				}

				var rectangle = {
					x: xRectangles[i].x,
					y: $scope.dimensions.y(data[i].highValue),
					width: widthRectangle,
					height: - ($scope.dimensions.y(data[i].highValue) - $scope.dimensions.y(data[i].lowValue))
				};

				rectangles.push(rectangle);
			}
		}
		return rectangles;
	};

};