'use strict';

(function() {
	// Branches Controller Spec
	describe('Branches Controller Tests', function() {
		// Initialize global variables
		var BranchesController,
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

			// Initialize the Branches controller.
			BranchesController = $controller('BranchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Branch object fetched from XHR', inject(function(Branches) {
			// Create sample Branch using the Branches service
			var sampleBranch = new Branches({
				name: 'New Branch'
			});

			// Create a sample Branches array that includes the new Branch
			var sampleBranches = [sampleBranch];

			// Set GET response
			$httpBackend.expectGET('branches').respond(sampleBranches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.branches).toEqualData(sampleBranches);
		}));

		it('$scope.findOne() should create an array with one Branch object fetched from XHR using a branchId URL parameter', inject(function(Branches) {
			// Define a sample Branch object
			var sampleBranch = new Branches({
				name: 'New Branch'
			});

			// Set the URL parameter
			$stateParams.branchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/branches\/([0-9a-fA-F]{24})$/).respond(sampleBranch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.branch).toEqualData(sampleBranch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Branches) {
			// Create a sample Branch object
			var sampleBranchPostData = new Branches({
				name: 'New Branch'
			});

			// Create a sample Branch response
			var sampleBranchResponse = new Branches({
				_id: '525cf20451979dea2c000001',
				name: 'New Branch'
			});

			// Fixture mock form input values
			scope.name = 'New Branch';

			// Set POST response
			$httpBackend.expectPOST('branches', sampleBranchPostData).respond(sampleBranchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Branch was created
			expect($location.path()).toBe('/branches/' + sampleBranchResponse._id);
		}));

		it('$scope.update() should update a valid Branch', inject(function(Branches) {
			// Define a sample Branch put data
			var sampleBranchPutData = new Branches({
				_id: '525cf20451979dea2c000001',
				name: 'New Branch'
			});

			// Mock Branch in scope
			scope.branch = sampleBranchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/branches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/branches/' + sampleBranchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid branchId and remove the Branch from the scope', inject(function(Branches) {
			// Create new Branch object
			var sampleBranch = new Branches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Branches array and include the Branch
			scope.branches = [sampleBranch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/branches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBranch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.branches.length).toBe(0);
		}));
	});
}());