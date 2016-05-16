'use strict';

// @ngInject
module.exports = function(RestService, API_PATH) {

	return {
		getHistory: function(displayCode, cb) {
			RestService.FIND(API_PATH + '/observation?name=' + displayCode, null, null, function(err, data) {
				return cb(data.results);
			});
		}
	};
};
