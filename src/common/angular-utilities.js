'use strict';

// @ngInject
module.exports = function($parse) {

	var FAKE_CONSTANT = {};

	return {
		/*
		 * Watches for an expression and calls the provided handler when the value changes,
		 * but without triggering a new digest cycle.
		 * This should only be used for operations that should not trigger other watchers.
		 */
		watchNonIntrusive: function watchNonIntrusive(scope, watchExpression, handler) {
			// use a constant for invoking the handler the first time (with value === oldValue).
			var last = FAKE_CONSTANT,
				// pre-parse the expression for better performance
				expr = $parse(watchExpression);

			return scope.$watch(function() {
				var value = expr(scope);

				if (value !== last) {
					handler(value, (last === FAKE_CONSTANT) ? value : last, scope);
					last = value;
				}
				// always return undefined
			});
		}
	};
};
