'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var managementTeams = require('../../app/controllers/management-teams.server.controller');

	// Management teams Routes
	app.route('/management-teams')
		.get(managementTeams.list)
		.post(users.requiresLogin, managementTeams.create);

	app.route('/management-teams/:managementTeamId')
		.get(managementTeams.read)
		.put(users.requiresLogin, managementTeams.hasAuthorization, managementTeams.update)
		.delete(users.requiresLogin, managementTeams.hasAuthorization, managementTeams.delete);

	// Finish by binding the Management team middleware
	app.param('managementTeamId', managementTeams.managementTeamByID);
};
