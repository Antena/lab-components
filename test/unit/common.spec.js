'use strict';

/*jshint expr: true*/
describe('lab-components.common', function() {

	// Define global references for injections.
	var _$filter_;
	var FhirReferenceRangeConverter;

	beforeEach(angular.mock.module('lab-components.common'));

	beforeEach(angular.mock.inject(function($filter, FhirReferenceRangeConverterService) {

		_$filter_ = $filter;
		FhirReferenceRangeConverter = FhirReferenceRangeConverterService;

	}));

	describe('patientAgeAtReportDate', function() {
		xit("should properly calculate age", function() {
			var birthDate = '1987-01-01';

			expect(_$filter_('patientAgeAtReportDate')(birthDate, '1999-12-31T11:59:59')).to.be.equal('12');
			expect(_$filter_('patientAgeAtReportDate')(birthDate, '1999-12-31T11:59:59', true)).to.be.equal('12 años');
			expect(_$filter_('patientAgeAtReportDate')(birthDate, '1988-02-15T11:59:59', true)).to.be.equal('1 año');
		});
	});

	describe('FhirReferenceRangeConverter', function() {

		it("should properly add adjacent ranges", function() {
			var obs = {
				"valueQuantity": {
					"value": 20,
					"units": "ng/mL",
					"system": "http://unitsofmeasure.org",
					"code": "mg/dL"
				},
				"referenceRange": [
					{
						"low": {
							"value": 50,
							"units": "ng/mL",
							"system": "http://unitsofmeasure.org",
							"code": "ng/mL"
						},
						"high": {
							"value": 120,
							"units": "ng/mL",
							"system": "http://unitsofmeasure.org",
							"code": "ng/mL"
						},
						"meaning": {
							"coding": [
								{
									"system": "http://hl7.org/fhir/v2/0078",
									"code": "N"
								}
							]
						}
					}
				]
			};

			var generatedRanges = FhirReferenceRangeConverter.convertToMultipleRanges(obs);

			expect(generatedRanges).to.have.length(3);

			var lowRange = generatedRanges[0];
			expect(lowRange.low).to.not.exist;
			expect(lowRange.high).to.exist;
			expect(lowRange.high.value).to.be.equal(49);
			expect(lowRange.meaning.coding[0].code).to.be.equal('L');

			// var highRange = generatedRanges[2];
			// expect(highRange.high).to.not.exist;
			// expect(highRange.low).to.exist;
			// expect(highRange.low.value).to.be.equal(121);
			// expect(highRange.meaning.coding[0].code).to.be.equal('H');

		});

		it("should properly add adjacent ranges with proper precision", function() {
			var obs = {
				"valueQuantity": {
					"value": 7.2,
					"units": "ng/mL",
					"system": "http://unitsofmeasure.org",
					"code": "mg/dL"
				},
				"referenceRange": [
					{
						"low": {
							"value": 5,
							"units": "ng/mL",
							"system": "http://unitsofmeasure.org",
							"code": "ng/mL"
						},
						"high": {
							"value": 10,
							"units": "ng/mL",
							"system": "http://unitsofmeasure.org",
							"code": "ng/mL"
						},
						"meaning": {
							"coding": [
								{
									"system": "http://hl7.org/fhir/v2/0078",
									"code": "N"
								}
							]
						}
					}
				]
			};

			var generatedRanges = FhirReferenceRangeConverter.convertToMultipleRanges(obs);

			expect(generatedRanges).to.have.length(3);

			var lowRange = generatedRanges[0];
			expect(lowRange.low).to.not.exist;
			expect(lowRange.high).to.exist;
			expect(lowRange.high.value).to.be.equal(4.9);
			expect(lowRange.meaning.coding[0].code).to.be.equal('L');

			// var highRange = generatedRanges[2];
			// expect(highRange.high).to.not.exist;
			// expect(highRange.low).to.exist;
			// expect(highRange.low.value).to.be.equal(10.1);
			// expect(highRange.meaning.coding[0].code).to.be.equal('H');

		});
	});
});

