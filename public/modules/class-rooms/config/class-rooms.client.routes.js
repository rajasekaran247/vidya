'use strict';

//Setting up route
angular.module('class-rooms').config(['$stateProvider',
	function($stateProvider) {
		// Class rooms state routing
		$stateProvider.
		state('listClassRooms', {
			url: '/class-rooms',
			templateUrl: 'modules/class-rooms/views/list-class-rooms.client.view.html'
		}).
		state('createClassRoom', {
			url: '/class-rooms/create',
			templateUrl: 'modules/class-rooms/views/create-class-room.client.view.html'
		}).
		state('viewClassRoom', {
			url: '/class-rooms/:classRoomId',
			templateUrl: 'modules/class-rooms/views/view-class-room.client.view.html'
		}).
		state('editClassRoom', {
			url: '/class-rooms/:classRoomId/edit',
			templateUrl: 'modules/class-rooms/views/edit-class-room.client.view.html'
		});
	}
]);