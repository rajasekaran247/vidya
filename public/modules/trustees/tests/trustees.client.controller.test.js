'use strict';

(function() {
	// Trustees Controller Spec
	describe('Trustees Controller Tests', function() {
		// Initialize global variables
		var TrusteesController,
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

			// Initialize the Trustees controller.
			TrusteesController = $controller('TrusteesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trustee object fetched from XHR', inject(function(Trustees) {
			// Create sample Trustee using the Trustees service
			var sampleTrustee = new Trustees({
				name: 'New Trustee'
			});

			// Create a sample Trustees array that includes the new Trustee
			var sampleTrustees = [sampleTrustee];

			// Set GET response
			$httpBackend.expectGET('trustees').respond(sampleTrustees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trustees).toEqualData(sampleTrustees);
		}));

		it('$scope.findOne() should create an array with one Trustee object fetched from XHR using a trusteeId URL parameter', inject(function(Trustees) {
			// Define a sample Trustee object
			var sampleTrustee = new Trustees({
				name: 'New Trustee'
			});

			// Set the URL parameter
			$stateParams.trusteeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trustees\/([0-9a-fA-F]{24})$/).respond(sampleTrustee);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trustee).toEqualData(sampleTrustee);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trustees) {
			// Create a sample Trustee object
			var sampleTrusteePostData = new Trustees({
				name: 'New Trustee'
			});

			// Create a sample Trustee response
			var sampleTrusteeResponse = new Trustees({
				_id: '525cf20451979dea2c000001',
				name: 'New Trustee'
			});

			// Fixture mock form input values
			scope.name = 'New Trustee';

			// Set POST response
			$httpBackend.expectPOST('trustees', sampleTrusteePostData).respond(sampleTrusteeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trustee was created
			expect($location.path()).toBe('/trustees/' + sampleTrusteeResponse._id);
		}));

		it('$scope.update() should update a valid Trustee', inject(function(Trustees) {
			// Define a sample Trustee put data
			var sampleTrusteePutData = new Trustees({
				_id: '525cf20451979dea2c000001',
				name: 'New Trustee'
			});

			// Mock Trustee in scope
			scope.trustee = sampleTrusteePutData;

			// Set PUT response
			$httpBackend.expectPUT(/trustees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trustees/' + sampleTrusteePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trusteeId and remove the Trustee from the scope', inject(function(Trustees) {
			// Create new Trustee object
			var sampleTrustee = new Trustees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trustees array and include the Trustee
			scope.trustees = [sampleTrustee];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trustees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrustee);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trustees.length).toBe(0);
		}));
	});
}());