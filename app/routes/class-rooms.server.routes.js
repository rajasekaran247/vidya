'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var classRooms = require('../../app/controllers/class-rooms.server.controller');

	// Class rooms Routes
	app.route('/class-rooms')
		.get(classRooms.list)
		.post(users.requiresLogin, classRooms.create);

	app.route('/class-rooms/:classRoomId')
		.get(classRooms.read)
		.put(users.requiresLogin, classRooms.hasAuthorization, classRooms.update)
		.delete(users.requiresLogin, classRooms.hasAuthorization, classRooms.delete);

	// Finish by binding the Class room middleware
	app.param('classRoomId', classRooms.classRoomByID);
};
