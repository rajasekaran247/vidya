'use strict';

// Trustee controller
angular.module('trustees').controller('TrusteesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trustees',
	function($scope, $stateParams, $location, Authentication, Trustees) {
		$scope.authentication = Authentication;

		// Create new Trustee
		$scope.create = function() {
			// Create new Trustee object
			var trustee = new Trustees ({
        
        name: this.name,
        
        address: this.address,
        
        phoneNumber: this.phoneNumber,
        
        designation: this.designation,
        
        dateOfJoining: this.dateOfJoining,
        
        dateOfCeasation: this.dateOfCeasation,
        
        pan: this.pan,
        
        email: this.email,
        
        fathersName: this.fathersName,
        
        dateOfBirth: this.dateOfBirth,
              
        created: Date.now
  
			});

			// Redirect after save
			trustee.$save(function(response) {
				$location.path('trustees/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trustee
		$scope.remove = function(trustee) {
			if ( trustee ) { 
				trustee.$remove();

				for (var i in $scope.Trustees) {
					if ($scope.trustees [i] === trustee) {
						$scope.trustees.splice(i, 1);
					}
				}
			} else {
				$scope.trustee.$remove(function() {
					$location.path('trustees');
				});
			}
		};

		// Update existing Trustee
		$scope.update = function() {
			var trustee = $scope.trustee;

			trustee.$update(function() {
				$location.path('trustees/' + trustee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trustee
		$scope.find = function() {
			$scope.trustees = Trustees.query();
		};

		// Find existing Trustee
		$scope.findOne = function() {
			$scope.trustee = Trustees.get({ 
				trusteeId: $stateParams.trusteeId
			});
		};
	}
]);