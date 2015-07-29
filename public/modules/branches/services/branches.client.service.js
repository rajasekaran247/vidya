'use strict';

//Branches service used to communicate Branches REST endpoints
angular.module('branches').factory('Branches', ['$resource',
	function($resource) {
		return $resource('branches/:branchId', { branchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);