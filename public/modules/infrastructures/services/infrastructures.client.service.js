'use strict';

//Infrastructures service used to communicate Infrastructures REST endpoints
angular.module('infrastructures').factory('Infrastructures', ['$resource',
	function($resource) {
		return $resource('infrastructures/:infrastructureId', { infrastructureId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);