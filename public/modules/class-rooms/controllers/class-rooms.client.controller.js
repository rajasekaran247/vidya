'use strict';

// ClassRoom controller
angular.module('class-rooms').controller('ClassRoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ClassRooms',
	function($scope, $stateParams, $location, Authentication, ClassRooms) {
		$scope.authentication = Authentication;

		// Create new ClassRoom
		$scope.create = function() {
			// Create new ClassRoom object
			var classroom = new ClassRooms ({
        
        capacity: this.capacity,
        
        institutionAssignedTo: this.institutionAssignedTo,
        
        institutionAssignedSince: this.institutionAssignedSince,
              
        created: Date.now
  
			});

			// Redirect after save
			classroom.$save(function(response) {
				$location.path('class-rooms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing ClassRoom
		$scope.remove = function(classroom) {
			if ( classroom ) { 
				classroom.$remove();

				for (var i in $scope.ClassRooms) {
					if ($scope.classrooms [i] === classroom) {
						$scope.classrooms.splice(i, 1);
					}
				}
			} else {
				$scope.classroom.$remove(function() {
					$location.path('class-rooms');
				});
			}
		};

		// Update existing ClassRoom
		$scope.update = function() {
			var classroom = $scope.classroom;

			classroom.$update(function() {
				$location.path('class-rooms/' + classroom._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of ClassRoom
		$scope.find = function() {
			$scope.classrooms = ClassRooms.query();
		};

		// Find existing ClassRoom
		$scope.findOne = function() {
			$scope.classroom = ClassRooms.get({ 
				classRoomId: $stateParams.classRoomId
			});
		};
	}
]);