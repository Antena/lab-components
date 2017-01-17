'use strict';

module.exports = function(grunt) {

	// Define the configuration for all the tasks
	grunt.initConfig({

		ngdocs: {
			options: {
				dest: 'docs',
				scripts: [
					'dist/main.js',
					'node_modules/angular-animate/angular-animate.min.js'
				],
				styles: [
					'dist/main.css',
					'demo/demo.css',
					'demo/api.css'
				],
				html5Mode: false,
				startPage: '/api/lab-components',
				editExample: false
			},
			api: {
				src: ['src/**/*.js'],
				title: 'API Documentation'
			}
		},
		clean: {
			ngdocs: ['partials/', 'js/', 'font/', 'css/']
		}
	});

	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('docs', [
		'ngdocs',
		'clean:ngdocs'
	]);
};
