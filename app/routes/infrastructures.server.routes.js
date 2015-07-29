'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var infrastructures = require('../../app/controllers/infrastructures.server.controller');

	// Infrastructures Routes
	app.route('/infrastructures')
		.get(infrastructures.list)
		.post(users.requiresLogin, infrastructures.create);

	app.route('/infrastructures/:infrastructureId')
		.get(infrastructures.read)
		.put(users.requiresLogin, infrastructures.hasAuthorization, infrastructures.update)
		.delete(users.requiresLogin, infrastructures.hasAuthorization, infrastructures.delete);

	// Finish by binding the Infrastructure middleware
	app.param('infrastructureId', infrastructures.infrastructureByID);
};
