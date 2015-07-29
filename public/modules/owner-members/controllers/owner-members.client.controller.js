'use strict';

// OwnerMember controller
angular.module('owner-members').controller('OwnerMembersController', ['$scope', '$stateParams', '$location', 'Authentication', 'OwnerMembers',
	function($scope, $stateParams, $location, Authentication, OwnerMembers) {
		$scope.authentication = Authentication;

		// Create new OwnerMember
		$scope.create = function() {
			// Create new OwnerMember object
			var ownermember = new OwnerMembers ({
        
        ownerMemberName: this.ownerMemberName,
        
        phoneNumber: this.phoneNumber,
        
        address: this.address,
        
        pannumber: this.pannumber,
              
        created: Date.now
  
			});

			// Redirect after save
			ownermember.$save(function(response) {
				$location.path('owner-members/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing OwnerMember
		$scope.remove = function(ownermember) {
			if ( ownermember ) { 
				ownermember.$remove();

				for (var i in $scope.OwnerMembers) {
					if ($scope.ownermembers [i] === ownermember) {
						$scope.ownermembers.splice(i, 1);
					}
				}
			} else {
				$scope.ownermember.$remove(function() {
					$location.path('owner-members');
				});
			}
		};

		// Update existing OwnerMember
		$scope.update = function() {
			var ownermember = $scope.ownermember;

			ownermember.$update(function() {
				$location.path('owner-members/' + ownermember._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of OwnerMember
		$scope.find = function() {
			$scope.ownermembers = OwnerMembers.query();
		};

		// Find existing OwnerMember
		$scope.findOne = function() {
			$scope.ownermember = OwnerMembers.get({ 
				ownermemberId: $stateParams.ownermemberId
			});
		};
	}
]);