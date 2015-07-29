'use strict';

//Setting up route
angular.module('constitutions').config(['$stateProvider',
	function($stateProvider) {
		// Constitutions state routing
		$stateProvider.
		state('listConstitutions', {
			url: '/constitutions',
			templateUrl: 'modules/constitutions/views/list-constitutions.client.view.html'
		}).
		state('createConstitution', {
			url: '/constitutions/create',
			templateUrl: 'modules/constitutions/views/create-constitution.client.view.html'
		}).
		state('viewConstitution', {
			url: '/constitutions/:constitutionId',
			templateUrl: 'modules/constitutions/views/view-constitution.client.view.html'
		}).
		state('editConstitution', {
			url: '/constitutions/:constitutionId/edit',
			templateUrl: 'modules/constitutions/views/edit-constitution.client.view.html'
		});
	}
]);