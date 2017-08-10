'use strict';

var chai        = require('chai'),
	expect      = chai.expect,
	_			= require('underscore');

/*jshint expr: true*/
describe('value-within-multiple-ranges', function() {

	before(function() {
		browser.url('http://localhost:4000/value-within-multiple-ranges-graph?contentOnly=true&fullWidth=true');
	});

	it('should maintain visual properties', function() {
		var result1 = browser.checkElement('.demo-instance-container.multiple-ranges');
		var passed1 = _.every(result1, function(comparison) {
			return !!comparison.isExactSameImage || !!comparison.isWithinMisMatchTolerance;
		});
		expect(passed1, 'multiple-ranges screenshots changed').to.be.true;
	});
});

