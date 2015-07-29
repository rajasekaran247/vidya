'use strict';

//Class rooms service used to communicate Class rooms REST endpoints
angular.module('class-rooms').factory('ClassRooms', ['$resource',
	function($resource) {
		return $resource('class-rooms/:classRoomId', { classRoomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);