 'use strict';

var chai        = require('chai'),
	expect      = chai.expect,
	_	        = require('underscore');

/*jshint expr: true*/
describe('lab-observation-multirange-graph', function() {

	var DEMO_SELECTOR = '.observation-5665';

	before(function() {
		browser.url('http://localhost:4000/lab-observation-multirange-graphe?contentOnly=true');

		browser.waitForExist(DEMO_SELECTOR);
	});

	it('should use color overrides if configured via setCodeScale2ClassNameMappings', function() {
		var rangeSelector = DEMO_SELECTOR + ' .value-within-multiple-ranges-graph';

		var normalRangeColors = _.pluck(_.pluck(browser.getCssProperty(rangeSelector + ' .lc-range--N', 'fill'), 'parsed'), 'hex');
		expect(normalRangeColors.length).to.be.equal(3);
		var normalColor = _.uniq(normalRangeColors);
		expect(normalColor.length).to.be.equal(1);
		expect(_.first(normalColor)).to.be.equal('#43d186');

		var limRangeColors = _.pluck(_.pluck(browser.getCssProperty(rangeSelector + ' .lc-range--LIM', 'fill'), 'parsed'), 'hex');
		expect(limRangeColors.length).to.be.equal(6);
		var limColor = _.uniq(limRangeColors);
		expect(limColor.length).to.be.equal(1);
		expect(_.first(limColor)).to.be.equal('#b498ff');
	});
});
