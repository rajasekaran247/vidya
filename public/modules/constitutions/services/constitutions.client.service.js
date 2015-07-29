'use strict';

//Constitutions service used to communicate Constitutions REST endpoints
angular.module('constitutions').factory('Constitutions', ['$resource',
	function($resource) {
		return $resource('constitutions/:constitutionId', { constitutionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);