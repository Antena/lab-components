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

	var AMBIGUOUS_RANGE_CLASSES = {
		INDETERMINATE: 'range-ambiguous-indeterminate',
		POSITIVE: 'range-ambiguous-positive',
		NEGATIVE: 'range-ambiguous-negative'
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
				codes: ['H', 'N'],
				classMap: {
					'H': MULTI_RANGE_CLASSES.DANGER,
					'N': MULTI_RANGE_CLASSES.GREAT
				}
			},
			{
				codes: ['L', 'N'],
				classMap: {
					'L': MULTI_RANGE_CLASSES.DANGER,
					'N': MULTI_RANGE_CLASSES.GREAT
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
				codes: ['N', 'LIM', 'H', 'HU'],
				classMap: {
					'N': MULTI_RANGE_CLASSES.GREAT,
					'LIM': MULTI_RANGE_CLASSES.SO_SO,
					'H': MULTI_RANGE_CLASSES.BAD,
					'HU': MULTI_RANGE_CLASSES.DANGER
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
				codes: ['N', 'NN', 'LIM', 'H', 'HU'],
				classMap: {
					'N': MULTI_RANGE_CLASSES.GREAT,
					'NN': MULTI_RANGE_CLASSES.GOOD,
					'LIM': MULTI_RANGE_CLASSES.SO_SO,
					'H': MULTI_RANGE_CLASSES.BAD,
					'HU': MULTI_RANGE_CLASSES.DANGER
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
				codes: ['N', 'H', 'HH'],
				classMap: {
					'N': MULTI_RANGE_CLASSES.GREAT,
					'H': MULTI_RANGE_CLASSES.BAD,
					'HH': MULTI_RANGE_CLASSES.DANGER
				}
			},
			{
				codes: ['NR', 'RR'],
				classMap: {
					'NR': AMBIGUOUS_RANGE_CLASSES.NEGATIVE,
					'RR': AMBIGUOUS_RANGE_CLASSES.POSITIVE
				}
			},
			{
				codes: ['NR', 'IND', 'RR'],
				classMap: {
					'NR': AMBIGUOUS_RANGE_CLASSES.NEGATIVE,
					'IND': AMBIGUOUS_RANGE_CLASSES.INDETERMINATE,
					'RR': AMBIGUOUS_RANGE_CLASSES.POSITIVE
				}
			},
			// {
			// 	observationCode: 'P.3023',
			// 	codes: ['NR', 'IND', 'RR'],
			// 	classMap: {
			// 		'NR': MULTI_RANGE_CLASSES.DANGER,
			// 		'IND': AMBIGUOUS_RANGE_CLASSES.INDETERMINATE,
			// 		'RR': MULTI_RANGE_CLASSES.GREAT
			// 	}
			// },
			{
				codes: ['NR', 'RR'],
				classMap: {
					'NR': AMBIGUOUS_RANGE_CLASSES.NEGATIVE,
					'RR': AMBIGUOUS_RANGE_CLASSES.POSITIVE
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

	this.setCodeScale2ClassNameMappings = function setCodeScale2ClassNameMappings(mappings, mergeWithDefaults) {
		this.codeScale2ClassNameMappings = filterAndMergeMappings(this.codeScale2ClassNameMappings, mappings, mergeWithDefaults);
	};

	this.getCodeScale2ClassNameMappings = function getCodeScale2ClassNameMappings() {
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

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#setCodeScale2ClassNameMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @param {Array} mappings The code scale mappings. Each object in this array must have the following format:
			 *
			 * ```js
			 * {
			 *
			 *      observationCode: '',	//optional, used for applying a mapping only for the given observation's ranges
			 * 		codes: ['C1', 'C2', 'C3'],
			 * 		classMap: [
			 *			'C1': 'range-great',
			 *			'C2': 'range-so-so',
			 *			'C3': 'range-danger'
			 * 		]
			 * }
			 * ```
			 * This reads as: "when there's an observation that has exactly 3 ranges which meaning codes are ['C1', 'C2', 'C3'], then map these codes to these classNames."
			 * ```js
			 * {
			 *
			 *      observationCode: 'abc',
			 * 		codes: ['C1', 'C2', 'C3'],
			 * 		classMap: [
			 *			'C1': 'range-good',
			 *			'C2': 'range-unknown',
			 *			'C3': 'range-bad'
			 * 		]
			 * }
			 * ```
			 * This reads as: "when there's an observation that has code 'abc', and exactly 3 ranges which meaning codes are ['C1', 'C2', 'C3'], then map these codes to these classNames."
			 *
			 * @param {Boolean=} [mergeWithDefaults=false] When true, extends the default mappings with the provided ones. Otherwise, it will override the default mappings.
			 *
			 */
			setCodeScale2ClassNameMappings: _.bind(function (mappings, mergeWithDefaults) {
				this.setCodeScale2ClassNameMappings(mappings, mergeWithDefaults);
			}, this),

			/**
			 * @ngdoc function
			 * @name lab-components.mappings.$fhirMappingsProvider#getCodeScale2ClassNameMappings
			 * @methodOf lab-components.mappings.$fhirMappingsProvider
			 *
			 * @description
			 *
			 *
			 * @returns {Array} The code scale mappings
			 */
			getCodeScale2ClassNameMappings: _.bind(function () {
				return this.getCodeScale2ClassNameMappings();
			}, this)
		};
	};
};
