'use strict';

// Branch controller
angular.module('branches').controller('BranchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Branches',
	function($scope, $stateParams, $location, Authentication, Branches) {
		$scope.authentication = Authentication;

		// Create new Branch
		$scope.create = function() {
			// Create new Branch object
			var branch = new Branches ({
        
        phoneNumber: this.phoneNumber,
        
        contactPerson: this.contactPerson,
        
        email: this.email,
        
        website: this.website,
              
        created: Date.now
  
			});

			// Redirect after save
			branch.$save(function(response) {
				$location.path('branches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Branch
		$scope.remove = function(branch) {
			if ( branch ) { 
				branch.$remove();

				for (var i in $scope.Branches) {
					if ($scope.branches [i] === branch) {
						$scope.branches.splice(i, 1);
					}
				}
			} else {
				$scope.branch.$remove(function() {
					$location.path('branches');
				});
			}
		};

		// Update existing Branch
		$scope.update = function() {
			var branch = $scope.branch;

			branch.$update(function() {
				$location.path('branches/' + branch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Branch
		$scope.find = function() {
			$scope.branches = Branches.query();
		};

		// Find existing Branch
		$scope.findOne = function() {
			$scope.branch = Branches.get({ 
				branchId: $stateParams.branchId
			});
		};
	}
]);