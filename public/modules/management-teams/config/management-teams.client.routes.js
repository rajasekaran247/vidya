'use strict';

//Setting up route
angular.module('management-teams').config(['$stateProvider',
	function($stateProvider) {
		// Management teams state routing
		$stateProvider.
		state('listManagementTeams', {
			url: '/management-teams',
			templateUrl: 'modules/management-teams/views/list-management-teams.client.view.html'
		}).
		state('createManagementTeam', {
			url: '/management-teams/create',
			templateUrl: 'modules/management-teams/views/create-management-team.client.view.html'
		}).
		state('viewManagementTeam', {
			url: '/management-teams/:managementTeamId',
			templateUrl: 'modules/management-teams/views/view-management-team.client.view.html'
		}).
		state('editManagementTeam', {
			url: '/management-teams/:managementTeamId/edit',
			templateUrl: 'modules/management-teams/views/edit-management-team.client.view.html'
		});
	}
]);