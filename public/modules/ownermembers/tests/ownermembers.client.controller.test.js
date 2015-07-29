'use strict';

(function() {
	// Ownermembers Controller Spec
	describe('Ownermembers Controller Tests', function() {
		// Initialize global variables
		var OwnermembersController,
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

			// Initialize the Ownermembers controller.
			OwnermembersController = $controller('OwnermembersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ownermember object fetched from XHR', inject(function(Ownermembers) {
			// Create sample Ownermember using the Ownermembers service
			var sampleOwnermember = new Ownermembers({
				name: 'New Ownermember'
			});

			// Create a sample Ownermembers array that includes the new Ownermember
			var sampleOwnermembers = [sampleOwnermember];

			// Set GET response
			$httpBackend.expectGET('ownermembers').respond(sampleOwnermembers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ownermembers).toEqualData(sampleOwnermembers);
		}));

		it('$scope.findOne() should create an array with one Ownermember object fetched from XHR using a ownermemberId URL parameter', inject(function(Ownermembers) {
			// Define a sample Ownermember object
			var sampleOwnermember = new Ownermembers({
				name: 'New Ownermember'
			});

			// Set the URL parameter
			$stateParams.ownermemberId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ownermembers\/([0-9a-fA-F]{24})$/).respond(sampleOwnermember);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ownermember).toEqualData(sampleOwnermember);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ownermembers) {
			// Create a sample Ownermember object
			var sampleOwnermemberPostData = new Ownermembers({
				name: 'New Ownermember'
			});

			// Create a sample Ownermember response
			var sampleOwnermemberResponse = new Ownermembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Ownermember'
			});

			// Fixture mock form input values
			scope.name = 'New Ownermember';

			// Set POST response
			$httpBackend.expectPOST('ownermembers', sampleOwnermemberPostData).respond(sampleOwnermemberResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ownermember was created
			expect($location.path()).toBe('/ownermembers/' + sampleOwnermemberResponse._id);
		}));

		it('$scope.update() should update a valid Ownermember', inject(function(Ownermembers) {
			// Define a sample Ownermember put data
			var sampleOwnermemberPutData = new Ownermembers({
				_id: '525cf20451979dea2c000001',
				name: 'New Ownermember'
			});

			// Mock Ownermember in scope
			scope.ownermember = sampleOwnermemberPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ownermembers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ownermembers/' + sampleOwnermemberPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ownermemberId and remove the Ownermember from the scope', inject(function(Ownermembers) {
			// Create new Ownermember object
			var sampleOwnermember = new Ownermembers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ownermembers array and include the Ownermember
			scope.ownermembers = [sampleOwnermember];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ownermembers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOwnermember);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ownermembers.length).toBe(0);
		}));
	});
}());