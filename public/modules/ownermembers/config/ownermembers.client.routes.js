'use strict';

//Setting up route
angular.module('ownermembers').config(['$stateProvider',
	function($stateProvider) {
		// Ownermembers state routing
		$stateProvider.
		state('listOwnermembers', {
			url: '/ownermembers',
			templateUrl: 'modules/ownermembers/views/list-ownermembers.client.view.html'
		}).
		state('createOwnermember', {
			url: '/ownermembers/create',
			templateUrl: 'modules/ownermembers/views/create-ownermember.client.view.html'
		}).
		state('viewOwnermember', {
			url: '/ownermembers/:ownermemberId',
			templateUrl: 'modules/ownermembers/views/view-ownermember.client.view.html'
		}).
		state('editOwnermember', {
			url: '/ownermembers/:ownermemberId/edit',
			templateUrl: 'modules/ownermembers/views/edit-ownermember.client.view.html'
		});
	}
]);