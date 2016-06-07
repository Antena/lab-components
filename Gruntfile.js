'use strict';

module.exports = function(grunt) {

	// Define the configuration for all the tasks
	grunt.initConfig({

		ngdocs: {
			options: {
				dest: 'docs',
				scripts: ['dist/bundle.js'],
				html5Mode: false,
				editExample: false
			},
			api: {
				src: ['src/**/*.js'],
				title: 'API Documentation'
			}
		}
	});

	grunt.loadNpmTasks('grunt-ngdocs');
};
