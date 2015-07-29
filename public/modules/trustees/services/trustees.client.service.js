'use strict';

//Trustees service used to communicate Trustees REST endpoints
angular.module('trustees').factory('Trustees', ['$resource',
	function($resource) {
		return $resource('trustees/:trusteeId', { trusteeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);