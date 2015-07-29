'use strict';

// Infrastructure controller
angular.module('infrastructures').controller('InfrastructuresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Infrastructures',
	function($scope, $stateParams, $location, Authentication, Infrastructures) {
		$scope.authentication = Authentication;

		// Create new Infrastructure
		$scope.create = function() {
			// Create new Infrastructure object
			var infrastructure = new Infrastructures ({
        
        leasedOwned: this.leasedOwned,
        
        institutionAttachedTo: this.institutionAttachedTo,
        
        documentNumber: this.documentNumber,
        
        registrationChargesPaid: this.registrationChargesPaid,
        
        registrationValue: this.registrationValue,
        
        stampDutyPaid: this.stampDutyPaid,
        
        registrationDate: this.registrationDate,
        
        descriptionOfProperty: this.descriptionOfProperty,
        
        area: this.area,
        
        unitOfMeasure: this.unitOfMeasure,
        
        leasedPeriod: this.leasedPeriod,
        
        leaseRental: this.leaseRental,
        
        leaseAdvance: this.leaseAdvance,
        
        leaseAdvancePaymentMode: this.leaseAdvancePaymentMode,
        
        leaseRentDueDate: this.leaseRentDueDate,
        
        lessorName: this.lessorName,
        
        lessorPhoneNumber: this.lessorPhoneNumber,
        
        lessorAddress: this.lessorAddress,
        
        lessorAccountNumber: this.lessorAccountNumber,
        
        lessorBankDetails: this.lessorBankDetails,
              
        created: Date.now
  
			});

			// Redirect after save
			infrastructure.$save(function(response) {
				$location.path('infrastructures/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Infrastructure
		$scope.remove = function(infrastructure) {
			if ( infrastructure ) { 
				infrastructure.$remove();

				for (var i in $scope.Infrastructures) {
					if ($scope.infrastructures [i] === infrastructure) {
						$scope.infrastructures.splice(i, 1);
					}
				}
			} else {
				$scope.infrastructure.$remove(function() {
					$location.path('infrastructures');
				});
			}
		};

		// Update existing Infrastructure
		$scope.update = function() {
			var infrastructure = $scope.infrastructure;

			infrastructure.$update(function() {
				$location.path('infrastructures/' + infrastructure._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Infrastructure
		$scope.find = function() {
			$scope.infrastructures = Infrastructures.query();
		};

		// Find existing Infrastructure
		$scope.findOne = function() {
			$scope.infrastructure = Infrastructures.get({ 
				infrastructureId: $stateParams.infrastructureId
			});
		};
	}
]);