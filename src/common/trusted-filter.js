'use strict';

// @ngInject
module.exports = function ($sce) {
	return function (text) {
		console.log("text = ", text);	//TODO (denise) remove log
		return $sce.trustAsHtml(text);
	};
};
