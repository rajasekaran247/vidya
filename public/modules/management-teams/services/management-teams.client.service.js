'use strict';

//Management teams service used to communicate Management teams REST endpoints
angular.module('management-teams').factory('ManagementTeams', ['$resource',
	function($resource) {
		return $resource('management-teams/:managementTeamId', { managementTeamId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);