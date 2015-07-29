'use strict';

// Institution controller
angular.module('institutions').controller('InstitutionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Institutions',
	function($scope, $stateParams, $location, Authentication, Institutions) {
		$scope.authentication = Authentication;

		// Create new Institution
		$scope.create = function() {
			// Create new Institution object
			var institution = new Institutions ({
        
        institutionName: this.institutionName,
        
        typeOfInstitution: this.typeOfInstitution,
              
        created: Date.now
  
			});

			// Redirect after save
			institution.$save(function(response) {
				$location.path('institutions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Institution
		$scope.remove = function(institution) {
			if ( institution ) { 
				institution.$remove();

				for (var i in $scope.Institutions) {
					if ($scope.institutions [i] === institution) {
						$scope.institutions.splice(i, 1);
					}
				}
			} else {
				$scope.institution.$remove(function() {
					$location.path('institutions');
				});
			}
		};

		// Update existing Institution
		$scope.update = function() {
			var institution = $scope.institution;

			institution.$update(function() {
				$location.path('institutions/' + institution._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Institution
		$scope.find = function() {
			$scope.institutions = Institutions.query();
		};

		// Find existing Institution
		$scope.findOne = function() {
			$scope.institution = Institutions.get({ 
				institutionId: $stateParams.institutionId
			});
		};
	}
]);