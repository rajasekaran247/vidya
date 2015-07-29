'use strict';

//Ownermembers service used to communicate Ownermembers REST endpoints
angular.module('ownermembers').factory('Ownermembers', ['$resource',
	function($resource) {
		return $resource('ownermembers/:ownermemberId', { ownermemberId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);