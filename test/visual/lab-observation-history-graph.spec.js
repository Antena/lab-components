'use strict';

var chai        = require('chai'),
	expect      = chai.expect,
	_			= require('underscore');

/*jshint expr: true*/
describe('lab-observation-history-graph', function() {

	before(function() {
		browser.url('http://localhost:4000/history-graph?contentOnly=true&fullWidth=true');
	});

	it('should maintain visual properties for 1 year data', function() {
		var result1 = browser.checkElement('.demo-history-hemoglobina');
		var passed1 = _.every(result1, function(comparison) {
			return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
		});
		expect(passed1, 'demo-history-hemoglobina (1y) screenshots changed').to.be.true;

		var result2 = browser.checkElement('.demo-history-trigliceridemia');
		var passed2 = _.every(result2, function(comparison) {
			return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
		});
		expect(passed2, 'demo-history-trigliceridemia (1y) screenshots changed').to.be.true;
	});

	it('should maintain visual properties for 30 days data', function() {
		var result1 = browser.checkElement('.demo-history-trigliceridemia-no-data');
		var passed1 = _.every(result1, function(comparison) {
			return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
		});
		expect(passed1, 'demo-history-trigliceridemia (30d) screenshots changed').to.be.true;
	});

	// it('should maintain visual properties for 1 year data', function() {
	// 	var result = browser.checkElement('.demo-history-hemoglobina');
	// 	var passed = _.every(result, function(comparison) {
	// 		return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
	// 	});
	// 	expect(passed, 'demo-history-hemoglobina (1y) screenshots changed').to.be.true;
	// });
	//
	// it('should maintain visual properties for 1 month data', function() {
	// 	var result = browser.checkElement('.demo-history-hemoglobina');
	// 	var passed = _.every(result, function(comparison) {
	// 		return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
	// 	});
	// 	expect(passed, 'message').to.be.true;
	// });
});

