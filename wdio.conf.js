'use strict';

var path = require('path');
var VisualRegressionCompare = require('wdio-visual-regression-service/compare');
var app;

function getScreenshotName(basePath) {
	return function(context) {
		var elem = context.type === 'element' ? context.meta.element.replace(/[^_A-Za-z0-9-]/g, '') : context.type;
		var testName = context.test.title.replace(/[^_A-Za-z0-9-]/g, '_');
		var browserVersion = 60; //parseInt(context.browser.version, 10);
		var browserName = context.browser.name;
		return path.join(basePath, context.test.parent + '/' + testName + "--" + elem + "_" + browserName + "_v" + browserVersion + "_" + context.meta.width + ".png");
	};
}

exports.config = {
	host: '0.0.0.0',
	port: 4444,
	path: '/wd/hub',

	//
	// ==================
	// Test Files
	// ==================
	specs: [
		'test/functional/**',
		'test/visual/**'
	],

	//
	// ============
	// Capabilities
	// ============
	maxInstances: 10,

	capabilities: [
		{
			browserName: 'chrome'
		}
		// ,{
		// 	browserName: 'firefox'
		// }
		// ,{
		// 	browserName: 'phantomjs'
		// }
	],

	// ===================
	// Test Configurations
	// ===================
	sync: true,
	//
	// Level of logging verbosity: silent | verbose | command | data | result | error
	logLevel: 'silent',
	//
	// Enables colors for log output.
	coloredLogs: true,

	// Saves a screenshot to a given path if a command fails.
	screenshotPath: './test/result/',

	baseUrl: 'http://localhost:4000',

	bail: 0,

	waitforTimeout: 5000,

	visualRegression: {
		compare: new VisualRegressionCompare.LocalCompare({
			referenceName: getScreenshotName(path.join(process.cwd(), './test/visual/screenshots/reference')),
			screenshotName: getScreenshotName(path.join(process.cwd(), './test/visual/screenshots/current')),
			diffName: getScreenshotName(path.join(process.cwd(), './test/visual/screenshots/diff')),
			misMatchTolerance: 5
		}),
		viewportChangePause: 300,
		widths: [320, 640, 1024],
		orientations: ['landscape']
	},

	framework: 'mocha',
	mochaOpts: {
		ui: 'bdd',
		timeout: 21000
	},

	reporters: ['dot', 'spec'],

	services: ['selenium-standalone', 'visual-regression'],

	// =====
	// Hooks
	// =====

	// Gets executed once before all workers get launched.
	onPrepare: function (config, capabilities) {
		app = require('./server');
	},

	onComplete: function (exitCode) {
		app.close();
	}
};
