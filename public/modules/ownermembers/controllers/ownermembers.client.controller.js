'use strict';

// Ownermembers controller
angular.module('ownermembers').controller('OwnermembersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ownermembers',
	function($scope, $stateParams, $location, Authentication, Ownermembers) {
		$scope.authentication = Authentication;

		// Create new Ownermember
		$scope.create = function() {
			// Create new Ownermember object
			var ownermember = new Ownermembers ({
				name: this.name
			});

			// Redirect after save
			ownermember.$save(function(response) {
				$location.path('ownermembers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ownermember
		$scope.remove = function(ownermember) {
			if ( ownermember ) { 
				ownermember.$remove();

				for (var i in $scope.ownermembers) {
					if ($scope.ownermembers [i] === ownermember) {
						$scope.ownermembers.splice(i, 1);
					}
				}
			} else {
				$scope.ownermember.$remove(function() {
					$location.path('ownermembers');
				});
			}
		};

		// Update existing Ownermember
		$scope.update = function() {
			var ownermember = $scope.ownermember;

			ownermember.$update(function() {
				$location.path('ownermembers/' + ownermember._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ownermembers
		$scope.find = function() {
			$scope.ownermembers = Ownermembers.query();
		};

		// Find existing Ownermember
		$scope.findOne = function() {
			$scope.ownermember = Ownermembers.get({ 
				ownermemberId: $stateParams.ownermemberId
			});
		};
	}
]);