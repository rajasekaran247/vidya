'use strict';

(function() {
	// Class rooms Controller Spec
	describe('Class rooms Controller Tests', function() {
		// Initialize global variables
		var ClassRoomsController,
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

			// Initialize the Class rooms controller.
			ClassRoomsController = $controller('ClassRoomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Class room object fetched from XHR', inject(function(ClassRooms) {
			// Create sample Class room using the Class rooms service
			var sampleClassRoom = new ClassRooms({
				name: 'New Class room'
			});

			// Create a sample Class rooms array that includes the new Class room
			var sampleClassRooms = [sampleClassRoom];

			// Set GET response
			$httpBackend.expectGET('class-rooms').respond(sampleClassRooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.classRooms).toEqualData(sampleClassRooms);
		}));

		it('$scope.findOne() should create an array with one Class room object fetched from XHR using a classRoomId URL parameter', inject(function(ClassRooms) {
			// Define a sample Class room object
			var sampleClassRoom = new ClassRooms({
				name: 'New Class room'
			});

			// Set the URL parameter
			$stateParams.classRoomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/class-rooms\/([0-9a-fA-F]{24})$/).respond(sampleClassRoom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.classRoom).toEqualData(sampleClassRoom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ClassRooms) {
			// Create a sample Class room object
			var sampleClassRoomPostData = new ClassRooms({
				name: 'New Class room'
			});

			// Create a sample Class room response
			var sampleClassRoomResponse = new ClassRooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Class room'
			});

			// Fixture mock form input values
			scope.name = 'New Class room';

			// Set POST response
			$httpBackend.expectPOST('class-rooms', sampleClassRoomPostData).respond(sampleClassRoomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Class room was created
			expect($location.path()).toBe('/class-rooms/' + sampleClassRoomResponse._id);
		}));

		it('$scope.update() should update a valid Class room', inject(function(ClassRooms) {
			// Define a sample Class room put data
			var sampleClassRoomPutData = new ClassRooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Class room'
			});

			// Mock Class room in scope
			scope.classRoom = sampleClassRoomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/class-rooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/class-rooms/' + sampleClassRoomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid classRoomId and remove the Class room from the scope', inject(function(ClassRooms) {
			// Create new Class room object
			var sampleClassRoom = new ClassRooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Class rooms array and include the Class room
			scope.classRooms = [sampleClassRoom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/class-rooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClassRoom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.classRooms.length).toBe(0);
		}));
	});
}());