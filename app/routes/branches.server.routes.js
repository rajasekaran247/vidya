'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var branches = require('../../app/controllers/branches.server.controller');

	// Branches Routes
	app.route('/branches')
		.get(branches.list)
		.post(users.requiresLogin, branches.create);

	app.route('/branches/:branchId')
		.get(branches.read)
		.put(users.requiresLogin, branches.hasAuthorization, branches.update)
		.delete(users.requiresLogin, branches.hasAuthorization, branches.delete);

	// Finish by binding the Branch middleware
	app.param('branchId', branches.branchByID);
};
