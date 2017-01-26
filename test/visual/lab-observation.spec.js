'use strict';

var chai        = require('chai'),
	expect      = chai.expect,
	_			= require('underscore');

/*jshint expr: true*/
describe('lab-observation', function() {

	before(function() {
		browser.url('http://localhost:4000/lab-observation?contentOnly=true');
	});

	it('should maintain visual properties', function() {
		this.timeout(30000);
		var result1 = browser.checkDocument({ widths: 1024 });
		var passed1 = _.every(result1, function(comparison) {
			return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
		});
		expect(passed1, 'lab-observation full page screenshots changed').to.be.true;
	});
});

