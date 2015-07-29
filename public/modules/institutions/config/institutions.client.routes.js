'use strict';

//Setting up route
angular.module('institutions').config(['$stateProvider',
	function($stateProvider) {
		// Institutions state routing
		$stateProvider.
		state('listInstitutions', {
			url: '/institutions',
			templateUrl: 'modules/institutions/views/list-institutions.client.view.html'
		}).
		state('createInstitution', {
			url: '/institutions/create',
			templateUrl: 'modules/institutions/views/create-institution.client.view.html'
		}).
		state('viewInstitution', {
			url: '/institutions/:institutionId',
			templateUrl: 'modules/institutions/views/view-institution.client.view.html'
		}).
		state('editInstitution', {
			url: '/institutions/:institutionId/edit',
			templateUrl: 'modules/institutions/views/edit-institution.client.view.html'
		});
	}
]);