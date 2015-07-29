'use strict';

//Setting up route
angular.module('trustees').config(['$stateProvider',
	function($stateProvider) {
		// Trustees state routing
		$stateProvider.
		state('listTrustees', {
			url: '/trustees',
			templateUrl: 'modules/trustees/views/list-trustees.client.view.html'
		}).
		state('createTrustee', {
			url: '/trustees/create',
			templateUrl: 'modules/trustees/views/create-trustee.client.view.html'
		}).
		state('viewTrustee', {
			url: '/trustees/:trusteeId',
			templateUrl: 'modules/trustees/views/view-trustee.client.view.html'
		}).
		state('editTrustee', {
			url: '/trustees/:trusteeId/edit',
			templateUrl: 'modules/trustees/views/edit-trustee.client.view.html'
		});
	}
]);