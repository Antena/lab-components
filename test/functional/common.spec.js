'use strict';

var chai        = require('chai'),
	expect      = chai.expect;

/*jshint expr: true*/
describe('common', function() {
	describe('popover-on-demand', function() {
		var ELEMENT_WRAPPER_SELECTOR = '.demo-popover-trigger';
		var EXTERNAL_TRIGGER_SELECTOR = '.demo-popover-external-trigger';
		var POPOVER_CONTENT_SELECTOR = '.demo-popover-content';

		before(function() {
			browser.url('http://localhost:4000/popover-on-demand?contentOnly=true');
		});

		it('should open popover when clicking on trigger', function() {
			var firstPopover = POPOVER_CONTENT_SELECTOR + '-1';

			browser.click(ELEMENT_WRAPPER_SELECTOR);
			browser.pause(50 + 20);	//popover delay + buffer
			expect(browser.isVisible(firstPopover), 'Popover content should be visible after clicking on trigger element').to.be.true;
			expect(browser.getText(firstPopover + ' .demo-popover-content-heading')).to.be.equal("Cheese Ipsum");
		});

		it('should open/close popover when clicking on external trigger', function() {
			var secondPopover = POPOVER_CONTENT_SELECTOR + '-2';

			browser.click(EXTERNAL_TRIGGER_SELECTOR);
			browser.pause(50 + 20);	//popover delay + buffer
			expect(browser.isVisible(secondPopover), 'Popover content should be visible after clicking on external trigger').to.be.true;
			expect(browser.getText(secondPopover + ' .demo-popover-content-heading')).to.be.equal("Cat Ipsum");
		});
	});
});
