'use strict';

// Constitution controller
angular.module('constitutions').controller('ConstitutionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Constitutions',
	function($scope, $stateParams, $location, Authentication, Constitutions) {
		$scope.authentication = Authentication;

		// Create new Constitution
		$scope.create = function() {
			// Create new Constitution object
			var constitution = new Constitutions ({
        
        constitutionName: this.constitutionName,
        
        constitutionType: this.constitutionType,
              
        created: Date.now
  
			});

			// Redirect after save
			constitution.$save(function(response) {
				$location.path('constitutions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Constitution
		$scope.remove = function(constitution) {
			if ( constitution ) { 
				constitution.$remove();

				for (var i in $scope.Constitutions) {
					if ($scope.constitutions [i] === constitution) {
						$scope.constitutions.splice(i, 1);
					}
				}
			} else {
				$scope.constitution.$remove(function() {
					$location.path('constitutions');
				});
			}
		};

		// Update existing Constitution
		$scope.update = function() {
			var constitution = $scope.constitution;

			constitution.$update(function() {
				$location.path('constitutions/' + constitution._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Constitution
		$scope.find = function() {
			$scope.constitutions = Constitutions.query();
		};

		// Find existing Constitution
		$scope.findOne = function() {
			$scope.constitution = Constitutions.get({ 
				constitutionId: $stateParams.constitutionId
			});
		};
	}
]);