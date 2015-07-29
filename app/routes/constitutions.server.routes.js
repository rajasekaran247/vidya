'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var constitutions = require('../../app/controllers/constitutions.server.controller');

	// Constitutions Routes
	app.route('/constitutions')
		.get(constitutions.list)
		.post(users.requiresLogin, constitutions.create);

	app.route('/constitutions/:constitutionId')
		.get(constitutions.read)
		.put(users.requiresLogin, constitutions.hasAuthorization, constitutions.update)
		.delete(users.requiresLogin, constitutions.hasAuthorization, constitutions.delete);

	// Finish by binding the Constitution middleware
	app.param('constitutionId', constitutions.constitutionByID);
};
