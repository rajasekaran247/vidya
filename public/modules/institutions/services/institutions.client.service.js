'use strict';

//Institutions service used to communicate Institutions REST endpoints
angular.module('institutions').factory('Institutions', ['$resource',
	function($resource) {
		return $resource('institutions/:institutionId', { institutionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);