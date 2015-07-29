'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ownermembers = require('../../app/controllers/ownermembers.server.controller');

	// Ownermembers Routes
	app.route('/ownermembers')
		.get(ownermembers.list)
		.post(users.requiresLogin, ownermembers.create);

	app.route('/ownermembers/:ownermemberId')
		.get(ownermembers.read)
		.put(users.requiresLogin, ownermembers.hasAuthorization, ownermembers.update)
		.delete(users.requiresLogin, ownermembers.hasAuthorization, ownermembers.delete);

	// Finish by binding the Ownermember middleware
	app.param('ownermemberId', ownermembers.ownermemberByID);
};
