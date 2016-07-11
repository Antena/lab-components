module.exports = function() {
	return {
		restrict: 'EA',
		scope: {
			values: "="
		},
		link: function (scope, elem) {
			// console.log("scope.values =", JSON.stringify(scope.values, null, 2));     //TODO(gb): Remove trace!!!
		}
	}
};
