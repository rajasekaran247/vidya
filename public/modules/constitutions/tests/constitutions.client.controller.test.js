'use strict';

(function() {
	// Constitutions Controller Spec
	describe('Constitutions Controller Tests', function() {
		// Initialize global variables
		var ConstitutionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Constitutions controller.
			ConstitutionsController = $controller('ConstitutionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Constitution object fetched from XHR', inject(function(Constitutions) {
			// Create sample Constitution using the Constitutions service
			var sampleConstitution = new Constitutions({
				name: 'New Constitution'
			});

			// Create a sample Constitutions array that includes the new Constitution
			var sampleConstitutions = [sampleConstitution];

			// Set GET response
			$httpBackend.expectGET('constitutions').respond(sampleConstitutions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.constitutions).toEqualData(sampleConstitutions);
		}));

		it('$scope.findOne() should create an array with one Constitution object fetched from XHR using a constitutionId URL parameter', inject(function(Constitutions) {
			// Define a sample Constitution object
			var sampleConstitution = new Constitutions({
				name: 'New Constitution'
			});

			// Set the URL parameter
			$stateParams.constitutionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/constitutions\/([0-9a-fA-F]{24})$/).respond(sampleConstitution);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.constitution).toEqualData(sampleConstitution);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Constitutions) {
			// Create a sample Constitution object
			var sampleConstitutionPostData = new Constitutions({
				name: 'New Constitution'
			});

			// Create a sample Constitution response
			var sampleConstitutionResponse = new Constitutions({
				_id: '525cf20451979dea2c000001',
				name: 'New Constitution'
			});

			// Fixture mock form input values
			scope.name = 'New Constitution';

			// Set POST response
			$httpBackend.expectPOST('constitutions', sampleConstitutionPostData).respond(sampleConstitutionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Constitution was created
			expect($location.path()).toBe('/constitutions/' + sampleConstitutionResponse._id);
		}));

		it('$scope.update() should update a valid Constitution', inject(function(Constitutions) {
			// Define a sample Constitution put data
			var sampleConstitutionPutData = new Constitutions({
				_id: '525cf20451979dea2c000001',
				name: 'New Constitution'
			});

			// Mock Constitution in scope
			scope.constitution = sampleConstitutionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/constitutions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/constitutions/' + sampleConstitutionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid constitutionId and remove the Constitution from the scope', inject(function(Constitutions) {
			// Create new Constitution object
			var sampleConstitution = new Constitutions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Constitutions array and include the Constitution
			scope.constitutions = [sampleConstitution];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/constitutions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConstitution);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.constitutions.length).toBe(0);
		}));
	});
}());