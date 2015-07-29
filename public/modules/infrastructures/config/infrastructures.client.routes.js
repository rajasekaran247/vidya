'use strict';

//Setting up route
angular.module('infrastructures').config(['$stateProvider',
	function($stateProvider) {
		// Infrastructures state routing
		$stateProvider.
		state('listInfrastructures', {
			url: '/infrastructures',
			templateUrl: 'modules/infrastructures/views/list-infrastructures.client.view.html'
		}).
		state('createInfrastructure', {
			url: '/infrastructures/create',
			templateUrl: 'modules/infrastructures/views/create-infrastructure.client.view.html'
		}).
		state('viewInfrastructure', {
			url: '/infrastructures/:infrastructureId',
			templateUrl: 'modules/infrastructures/views/view-infrastructure.client.view.html'
		}).
		state('editInfrastructure', {
			url: '/infrastructures/:infrastructureId/edit',
			templateUrl: 'modules/infrastructures/views/edit-infrastructure.client.view.html'
		});
	}
]);