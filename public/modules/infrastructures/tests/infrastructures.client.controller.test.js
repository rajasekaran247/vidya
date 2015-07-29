'use strict';

(function() {
	// Infrastructures Controller Spec
	describe('Infrastructures Controller Tests', function() {
		// Initialize global variables
		var InfrastructuresController,
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

			// Initialize the Infrastructures controller.
			InfrastructuresController = $controller('InfrastructuresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Infrastructure object fetched from XHR', inject(function(Infrastructures) {
			// Create sample Infrastructure using the Infrastructures service
			var sampleInfrastructure = new Infrastructures({
				name: 'New Infrastructure'
			});

			// Create a sample Infrastructures array that includes the new Infrastructure
			var sampleInfrastructures = [sampleInfrastructure];

			// Set GET response
			$httpBackend.expectGET('infrastructures').respond(sampleInfrastructures);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.infrastructures).toEqualData(sampleInfrastructures);
		}));

		it('$scope.findOne() should create an array with one Infrastructure object fetched from XHR using a infrastructureId URL parameter', inject(function(Infrastructures) {
			// Define a sample Infrastructure object
			var sampleInfrastructure = new Infrastructures({
				name: 'New Infrastructure'
			});

			// Set the URL parameter
			$stateParams.infrastructureId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/infrastructures\/([0-9a-fA-F]{24})$/).respond(sampleInfrastructure);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.infrastructure).toEqualData(sampleInfrastructure);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Infrastructures) {
			// Create a sample Infrastructure object
			var sampleInfrastructurePostData = new Infrastructures({
				name: 'New Infrastructure'
			});

			// Create a sample Infrastructure response
			var sampleInfrastructureResponse = new Infrastructures({
				_id: '525cf20451979dea2c000001',
				name: 'New Infrastructure'
			});

			// Fixture mock form input values
			scope.name = 'New Infrastructure';

			// Set POST response
			$httpBackend.expectPOST('infrastructures', sampleInfrastructurePostData).respond(sampleInfrastructureResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Infrastructure was created
			expect($location.path()).toBe('/infrastructures/' + sampleInfrastructureResponse._id);
		}));

		it('$scope.update() should update a valid Infrastructure', inject(function(Infrastructures) {
			// Define a sample Infrastructure put data
			var sampleInfrastructurePutData = new Infrastructures({
				_id: '525cf20451979dea2c000001',
				name: 'New Infrastructure'
			});

			// Mock Infrastructure in scope
			scope.infrastructure = sampleInfrastructurePutData;

			// Set PUT response
			$httpBackend.expectPUT(/infrastructures\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/infrastructures/' + sampleInfrastructurePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid infrastructureId and remove the Infrastructure from the scope', inject(function(Infrastructures) {
			// Create new Infrastructure object
			var sampleInfrastructure = new Infrastructures({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Infrastructures array and include the Infrastructure
			scope.infrastructures = [sampleInfrastructure];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/infrastructures\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInfrastructure);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.infrastructures.length).toBe(0);
		}));
	});
}());