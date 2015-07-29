'use strict';

// ManagementTeam controller
angular.module('management-teams').controller('ManagementTeamsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ManagementTeams',
	function($scope, $stateParams, $location, Authentication, ManagementTeams) {
		$scope.authentication = Authentication;

		// Create new ManagementTeam
		$scope.create = function() {
			// Create new ManagementTeam object
			var managementteam = new ManagementTeams ({
        
        name: this.name,
        
        address: this.address,
        
        phoneNumber: this.phoneNumber,
        
        designation: this.designation,
        
        dateOfJoining: this.dateOfJoining,
        
        dateOfCreation: this.dateOfCreation,
        
        pan: this.pan,
        
        tan: this.tan,
        
        itexemption: this.itexemption,
        
        registrationCertificateNo: this.registrationCertificateNo,
              
        created: Date.now
  
			});

			// Redirect after save
			managementteam.$save(function(response) {
				$location.path('management-teams/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing ManagementTeam
		$scope.remove = function(managementteam) {
			if ( managementteam ) { 
				managementteam.$remove();

				for (var i in $scope.ManagementTeams) {
					if ($scope.managementteams [i] === managementteam) {
						$scope.managementteams.splice(i, 1);
					}
				}
			} else {
				$scope.managementteam.$remove(function() {
					$location.path('management-teams');
				});
			}
		};

		// Update existing ManagementTeam
		$scope.update = function() {
			var managementteam = $scope.managementteam;

			managementteam.$update(function() {
				$location.path('management-teams/' + managementteam._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of ManagementTeam
		$scope.find = function() {
			$scope.managementteams = ManagementTeams.query();
		};

		// Find existing ManagementTeam
		$scope.findOne = function() {
			$scope.managementteam = ManagementTeams.get({ 
				managementTeamId: $stateParams.managementTeamId
			});
		};
	}
]);