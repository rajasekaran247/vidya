'use strict';

(function() {
	// Management teams Controller Spec
	describe('Management teams Controller Tests', function() {
		// Initialize global variables
		var ManagementTeamsController,
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

			// Initialize the Management teams controller.
			ManagementTeamsController = $controller('ManagementTeamsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Management team object fetched from XHR', inject(function(ManagementTeams) {
			// Create sample Management team using the Management teams service
			var sampleManagementTeam = new ManagementTeams({
				name: 'New Management team'
			});

			// Create a sample Management teams array that includes the new Management team
			var sampleManagementTeams = [sampleManagementTeam];

			// Set GET response
			$httpBackend.expectGET('management-teams').respond(sampleManagementTeams);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.managementTeams).toEqualData(sampleManagementTeams);
		}));

		it('$scope.findOne() should create an array with one Management team object fetched from XHR using a managementTeamId URL parameter', inject(function(ManagementTeams) {
			// Define a sample Management team object
			var sampleManagementTeam = new ManagementTeams({
				name: 'New Management team'
			});

			// Set the URL parameter
			$stateParams.managementTeamId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/management-teams\/([0-9a-fA-F]{24})$/).respond(sampleManagementTeam);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.managementTeam).toEqualData(sampleManagementTeam);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ManagementTeams) {
			// Create a sample Management team object
			var sampleManagementTeamPostData = new ManagementTeams({
				name: 'New Management team'
			});

			// Create a sample Management team response
			var sampleManagementTeamResponse = new ManagementTeams({
				_id: '525cf20451979dea2c000001',
				name: 'New Management team'
			});

			// Fixture mock form input values
			scope.name = 'New Management team';

			// Set POST response
			$httpBackend.expectPOST('management-teams', sampleManagementTeamPostData).respond(sampleManagementTeamResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Management team was created
			expect($location.path()).toBe('/management-teams/' + sampleManagementTeamResponse._id);
		}));

		it('$scope.update() should update a valid Management team', inject(function(ManagementTeams) {
			// Define a sample Management team put data
			var sampleManagementTeamPutData = new ManagementTeams({
				_id: '525cf20451979dea2c000001',
				name: 'New Management team'
			});

			// Mock Management team in scope
			scope.managementTeam = sampleManagementTeamPutData;

			// Set PUT response
			$httpBackend.expectPUT(/management-teams\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/management-teams/' + sampleManagementTeamPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid managementTeamId and remove the Management team from the scope', inject(function(ManagementTeams) {
			// Create new Management team object
			var sampleManagementTeam = new ManagementTeams({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Management teams array and include the Management team
			scope.managementTeams = [sampleManagementTeam];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/management-teams\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManagementTeam);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.managementTeams.length).toBe(0);
		}));
	});
}());