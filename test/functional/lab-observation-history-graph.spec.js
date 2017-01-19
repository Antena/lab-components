'use strict';

var chai        = require('chai'),
	expect      = chai.expect;

/*jshint expr: true*/
describe('lab-observation-history-graph', function() {

	var DEMO_1_SELECTOR = '.demo-history-hemoglobina';
	var DEMO_2_SELECTOR = '.demo-history-trigliceridemia';

	var NO_DATA_LABEL = 'No hay datos para este periodo';
	var CURRENT_VALUE_LABEL_SELECTOR = '.current-value-value';

	before(function() {
		browser.url('http://localhost:4000/history-graph?contentOnly=true');
	});

	it('should properly display last value', function() {
		expect(browser.getText(DEMO_1_SELECTOR + ' ' + CURRENT_VALUE_LABEL_SELECTOR)).to.be.equal('15.8');
	});

	it('should properly switch time frame', function() {
		browser.click(DEMO_1_SELECTOR + ' .time-controls .option-1m');
		expect(browser.getText(DEMO_1_SELECTOR + ' .no-data')).to.be.equal(NO_DATA_LABEL);
	});

	it('should properly pan time frame', function() {
		browser.moveToObject(DEMO_2_SELECTOR + ' ' + CURRENT_VALUE_LABEL_SELECTOR);
		browser.buttonDown();
		browser.moveTo(null, 500, 0);
		browser.buttonUp();

		expect(browser.getText(DEMO_2_SELECTOR + ' .no-data')).to.be.equal(NO_DATA_LABEL);
	});

	it('should draw all ranges, apply proper colors', function() {
		var rangeSelector = DEMO_2_SELECTOR + ' .chart .ranges';
		expect(browser.getCssProperty(rangeSelector + ' .range-N', 'fill').parsed.hex).to.be.equal('#43d186');
		expect(browser.getCssProperty(rangeSelector + ' .range-LIM', 'fill').parsed.hex).to.be.equal('#f4c540');
		expect(browser.getCssProperty(rangeSelector + ' .range-H', 'fill').value).to.be.equal('rgb(239,152,108)');
		expect(browser.getCssProperty(rangeSelector + ' .range-HU', 'fill').value).to.be.equal('rgb(237,111,98)');
	});
});
