'use strict';

/**
 * @ngdoc overview
 * @name lab-components
 *
 * @description
 * <h1>Lab Components</h1>
 * `lab-components` is a collection of angular components and utilities for visualizing {@link https://www.hl7.org/fhir/2015MAY/ FHIR} structures.
 * Uses angular v1, bootstrap sass (customized via variable overrides), angular-ui-bootstrap.
 *
 * <h2>Using lab-components</h2>
 *
 * <h3>Demo</h3>
 * To run the demo, simply run `npm run start` and open http://localhost:4000/
 *
 * <h3>Including in your project</h3>
 * <h4>Bundling with your code</h4>
 * Simply require and add as a dependency in you angular module:
 * ```js
 *   var ngModule = angular.module('demo', [
	 	'some-dependency',
	 	require('lab-components')
	 ]);
 * ```
 * Same applies if you are only interested in a particular sub-module.
 * Every module defined in this project exports it's name, so you don't need to hardcode the dependency name. Furthermore,
 * every module requires every dependency it needs (no module depends on a parent module or implicitly on what a parent module requires),
 * so you'll get every dependency needed.
 *
 * <h5>Requirements (dev dependencies)</h5>
 * This project is built with webpack. If you are bundling with your project's own webpack config, you'll need to provide
 * the following pre-loaders/loaders:
 *
 * For templates:
 * - {@link https://github.com/Antena/absolut-loader absolut-loader}: a pre-loader for bundling templates that are required from within angular code
 * - {@link https://github.com/webpack/html-loader html-loader}: allows bundling html files
 * - {@link https://github.com/WearyMonkey/ngtemplate-loader ngtemplate-loader}: a loader for registering required htmls in angular's templateCache
 *
 * For configuration:
 * - {@link https://github.com/webpack/json-loader json-loader}: a loader for json files, used mostly to load configuration
 *
 * For styling:
 * - {@link https://github.com/webpack/css-loader css-loader}: allows bundling css files
 * - {@link https://github.com/jtangelder/sass-loader sass-loader}: allows bundling sass files
 * - {@link https://github.com/webpack/style-loader style-loader}
 * - {@link https://github.com/webpack/url-loader url-loader}: for image urls
 * - {@link https://github.com/webpack/extract-text-webpack-plugin extract-text-webpack-plugin}: allows to extract sass code (that was required from within js code) to a separate css file.
 *
 * If you need to build with a different bundler (i.e. browserify), you'll need to provide plugins that cover these use cases.
 *
 * <h4>Using a bundled version</h4>
 * This module does not distribute a bundled version, since it's highly discouraged to use already bundled dependencies
 * in your project. This could lead to having duplicate modules loaded (i.e. if both your project and lab-components
 * depend on the same package/module, but require different versions).
 * That being said, if you absolutely must, then you can run `npm run build` and you'll get bundled files (`main.js` and
 * `main.css`)in the `dist` directory .
 *
 * <h3>Internationalization</h3>
 * All strings that appear on these components are internationalized using {@link https://github.com/angular-translate/angular-translate angular-translate}.
 * At the moment, only spanish translations are supported.
 * To provide another language, or override spanish translations, all you need to do is set these in the configuration phase:
 *
 * ```js
 * ngModule.config(function($translateProvider, $compileProvider) {
	$translateProvider
		.translations('es', require('./spanish.json'))
		.preferredLanguage('es')
		.useSanitizeValueStrategy('sanitizeParameters');

	$compileProvider.debugInfoEnabled(false);
   });
 * ```
 *
 */

// assign window.jQuery so that angular uses jquery
window.$ = window.jQuery = window.jquery = require('jquery');
var angular = require('angular');

require("./main.scss");

var ngModule = angular.module('lab-components', [
	require('angular-translate'),
	require('./common/index'),
	require('./mappings/index'),
	require('./components/index'),
	require('./lab-observation/index'),
	require('angular-fhir-utils')
]);

//@ngInject
ngModule.config(function($translateProvider, $compileProvider) {
	$translateProvider
		.translations('es', require('./spanish.json'))
		.preferredLanguage('es')
		.useSanitizeValueStrategy('sanitizeParameters');

	$compileProvider.debugInfoEnabled(false);
});

module.exports = ngModule.name;
