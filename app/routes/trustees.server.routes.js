'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trustees = require('../../app/controllers/trustees.server.controller');

	// Trustees Routes
	app.route('/trustees')
		.get(trustees.list)
		.post(users.requiresLogin, trustees.create);

	app.route('/trustees/:trusteeId')
		.get(trustees.read)
		.put(users.requiresLogin, trustees.hasAuthorization, trustees.update)
		.delete(users.requiresLogin, trustees.hasAuthorization, trustees.delete);

	// Finish by binding the Trustee middleware
	app.param('trusteeId', trustees.trusteeByID);
};
