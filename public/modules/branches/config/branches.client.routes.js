'use strict';

//Setting up route
angular.module('branches').config(['$stateProvider',
	function($stateProvider) {
		// Branches state routing
		$stateProvider.
		state('listBranches', {
			url: '/branches',
			templateUrl: 'modules/branches/views/list-branches.client.view.html'
		}).
		state('createBranch', {
			url: '/branches/create',
			templateUrl: 'modules/branches/views/create-branch.client.view.html'
		}).
		state('viewBranch', {
			url: '/branches/:branchId',
			templateUrl: 'modules/branches/views/view-branch.client.view.html'
		}).
		state('editBranch', {
			url: '/branches/:branchId/edit',
			templateUrl: 'modules/branches/views/edit-branch.client.view.html'
		});
	}
]);