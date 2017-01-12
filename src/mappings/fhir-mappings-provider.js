'use strict';

/**
 * @ngdoc object
 * @name lab-components.mappings.$fhirMappingsProvider
 *
 * @description
 *
 * Provider for system/code to className and to translation keys mappings. This provider contains some defaults, which can be overwritten or
 * extended in the configuration phase:
 *
 * ```js
 *
 * 	$fhirMappingsProvider.setReferenceRangeColorCodeMappings({
		"https://www.hl7.org/fhir/2015MAY/valueset-referencerange-meaning.html": {
			"recommended": 'configured-class'
		}
	}, true);
 *
 * ```
 *
 * A live example can be found in {@link lab-components.mappings.filter:coding2ClassName coding2ClassName's documentation}.
 *
 */

var _ = require('underscore');

// @ngInject
module.exports = function FhirMappingsProvider() {

	var MULTI_RANGE_CLASSES = {
		GREAT: 'range-great',
		GOOD: 'range-good',
		SO_SO: 'range-so-so',
		BAD: 'range-bad',
		DANGER: 'range-danger'
	};

	var UNKNOWN_RANGE_CLASSES = {
		UNKNOWN_7: 'range-unknown-7',
		UNKNOWN_6: 'range-unknown-6',
		UNKNOWN_5: 'range-unknown-5',
		UNKNOWN_4: 'range-unknown-4',
		UNKNOWN_3: 'range-unknown-3',
		UNKNOWN_2: 'range-unknown-2',
		UNKNOWN_1: 'range-unknown-1'
	};

	var DEFAULTS = {
		coding2ClassNameMappings: {
			"http://hl7.org/fhir/v2/0078": {
				'H': 'unhealthy',
				'HH': 'unhealthy',
				'HU': 'unhealthy',
				'L': 'unhealthy',
				'LL': 'unhealthy',
				'N': 'healthy',
				'RR': 'unknown',
				'NR': 'unknown',
				'IND': 'unknown'
			},
			"http://www.cdrossi.com/0078": { 	//TODO (denise) change system URL for: http://www.wellbin.co/fhir/v2/0078
				'LIM': 'almost-healthy',
				'NN': 'almost-healthy'
			},
			"http://www.wellbin.co/fhir/v2/0078": {
				"DEFICIT": "unhealthy",
				"INSUFFICIENT": "unhealthy",
				"SUFFICIENT": "healthy",
				"TOXIC": "unhealthy"
			}
		},
		codeScale2ClassNameMappings: [
			{
				codes: ['H', 'N', 'L'],
				classMap: {
					'H': MULTI_RANGE_CLASSES.DANGER,
					'N': MULTI_RANGE_CLASSES.GREAT,
					'L': MULTI_RANGE_CLASSES.DANGER
				}
			},
			{
				codes: ['H', 'N', 'LIM'],
				classMap: {
					'H': MULTI_RANGE_CLASSES.DANGER,
					'N': MULTI_RANGE_CLASSES.GREAT,
					'LIM': MULTI_RANGE_CLASSES.SO_SO
				}
			},
			{
				codes: ['N', 'LIM', 'H', 'HH'],
				classMap: {
					'N': MULTI_RANGE_CLASSES.GREAT,
					'LIM': MULTI_RANGE_CLASSES.SO_SO,
					'H': MULTI_RANGE_CLASSES.BAD,
					'HH': MULTI_RANGE_CLASSES.DANGER
				}
			},
			{
				codes: ['N', 'NN', 'LIM', 'H', 'HH'],
				classMap: {
					'N': MULTI_RANGE_CLASSES.GREAT,
					'NN': MULTI_RANGE_CLASSES.GOOD,
					'LIM': MULTI_RANGE_CLASSES.SO_SO,
					'H': MULTI_RANGE_CLASSES.BAD,
					'HH': MULTI_RANGE_CLASSES.DANGER
				}
			},
			{
				codes: ['H', 'N', 'L'],
				classMap: {
					'H': MULTI_RANGE_CLASSES.DANGER,
					'N': MULTI_RANGE_CLASSES.GREAT,
					'L': MULTI_RANGE_CLASSES.DANGER
				}
			},
			{
				codes: ['NR', 'RR'],
				classMap: {
					'NR': UNKNOWN_RANGE_CLASSES.UNKNOWN_7,
					'RR': UNKNOWN_RANGE_CLASSES.UNKNOWN_3
				}
			}
		],
		coding2TranslationKeyMappings: {
			"http://hl7.org/fhir/v2/0078": {
				'H': 'LAB.REFERENCE_RANGE_MEANING.HIGH',
				'HH': 'LAB.REFERENCE_RANGE_MEANING.CRITICALLY_HIGH',
				'HU': 'LAB.REFERENCE_RANGE_MEANING.VERY_HIGH',
				'L': 'LAB.REFERENCE_RANGE_MEANING.LOW',
				'LL': 'LAB.REFERENCE_RANGE_MEANING.CRITICALLY_LOW',
				'N': 'LAB.REFERENCE_RANGE_MEANING.REGULAR',
				'RR': 'LAB.REFERENCE_RANGE_MEANING.REACTIVE',
				'NR': 'LAB.REFERENCE_RANGE_MEANING.NON_REACTIVE',
				'IND': 'LAB.REFERENCE_RANGE_MEANING.INDETERMINATE'
			},
			"http://www.cdrossi.com/0078": { 	//TODO (denise) move to system http://www.wellbin.co/fhir/v2/0078
				'LIM': 'LAB.REFERENCE_RANGE_MEANING.LIMIT',
				'NN': 'LAB.REFERENCE_RANGE_MEANING.NEAR_NORMAL'
			},
			"http://www.wellbin.co/fhir/v2/0078": {
				"DEFICIT": "LAB.REFERENCE_RANGE_MEANING.DEFICIT",
				"INSUFFICIENT": "LAB.REFERENCE_RANGE_MEANING.INSUFFICIENT",
				"SUFFICIENT": "LAB.REFERENCE_RANGE_MEANING.SUFFICIENT",
				"TOXIC": "LAB.REFERENCE_RANGE_MEANING.TOXIC"
			}
		}
	};

	this.coding2ClassNameMappings = DEFAULTS.coding2ClassNameMappings;
	this.coding2TranslationKeyMappings = DEFAULTS.coding2TranslationKeyMappings;
	this.codeScale2ClassNameMappings = DEFAULTS.codeScale2ClassNameMappings;
	this.codeScaleClasses = DEFAULTS.SCALE_10_POINT_CLASSES;

	function filterAndMergeMappings(defaults, mappings, mergeWithDefaults) {
		var result = {};
		if (mappings && _.isObject(mappings)) {
			var filteredMappingKeys = _.filter(_.keys(mappings), function (system) {
				var systemMap = mappings[system];
				var valid = _.isObject(systemMap) && _.every(_.values(systemMap), function (className) {
						return _.isString(className);
					});
				return valid ? system : null;
			});

			var filteredMappings = _.pick(mappings, _.compact(filteredMappingKeys));

			result = mergeWithDefaults ? _.extend({}, defaults, filteredMappings) : filteredMappings;
		}
		return result;
	}

	this.setCoding2ClassNameMappings = function setCoding2ClassNameMappings(mappings, mergeWithDefaults) {
		this.coding2ClassNameMappings = filterAndMergeMappings(this.coding2ClassNameMappings, mappings, mergeWithDefaults);
	};

	this.getCoding2ClassNameMappings = function getCoding2ClassNameMappings() {
		return this.coding2ClassNameMappings;
	};

	this.setCoding2TranslationKeyMappings = function setCoding2TranslationKeyMappings(mappings, mergeWithDefaults) {
		this.coding2TranslationKeyMappings = filterAndMergeMappings(this.coding2TranslationKeyMappings, mappings, mergeWithDefaults);
	};

	this.getCoding2TranslationKeyMappings = function getCoding2TranslationKeyMappings() {
		return this.coding2TranslationKeyMappings;
	};

	this.getScaleRangeClasses = function getScaleRangeClasses() {
		return this.codeScale2ClassNameMappings;
	};


	this.$get = function fhirMappingsFactory() {

		return {

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#setCoding2ClassNameMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @param {Object} mappings The code mappings, which must have the following format:
			 *
			 * ```js
			 * {
			 * 		'system1': {
			 * 			'code1': 'className1',
			 * 			'code2': 'className2'
			 * 		},
			 * 		'system2': {
			 * 			'codeA': 'classNameA',
			 * 			'codeB': 'classNameB'
			 * 		}
			 * }
			 * ```
			 * @param {Boolean=} [mergeWithDefaults=false] When true, extends the default mappings with the provided ones. Otherwise, it will override the default mappings.
			 *
			 */
			setCoding2ClassNameMappings: _.bind(function (mappings, mergeWithDefaults) {
					this.setCoding2ClassNameMappings(mappings, mergeWithDefaults);
				}, this),

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#getCoding2ClassNameMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @returns {Object} The code mappings
			 */
			getCoding2ClassNameMappings: _.bind(function () {
				return this.getCoding2ClassNameMappings();
			}, this),

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#setCoding2TranslationKeyMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @param {Object} mappings The code mappings, which must have the following format:
			 *
			 * ```js
			 * {
			 * 		'system1': {
			 * 			'code1': 'Some label',
			 * 			'code2': 'Another label'
			 * 		}
			 * }
			 * ```
			 * @param {Boolean=} [mergeWithDefaults=false] When true, extends the default mappings with the provided ones. Otherwise, it will override the default mappings.
			 *
			 */
			setCoding2TranslationKeyMappings: _.bind(function (mappings, mergeWithDefaults) {
				this.setCoding2TranslationKeyMappings(mappings, mergeWithDefaults);
			}, this),

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#getCoding2TranslationKeyMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @returns {Object} The code mappings
			 */
			getCoding2TranslationKeyMappings: _.bind(function () {
				return this.getCoding2TranslationKeyMappings();
			}, this),

			getScaleRangeClasses: _.bind(function () {
				return this.getScaleRangeClasses();
			}, this)
		};
	};
};
