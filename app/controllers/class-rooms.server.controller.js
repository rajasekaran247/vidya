'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ClassRoom = mongoose.model('ClassRoom'),
	_ = require('lodash');

/**
 * Create a Class room
 */
exports.create = function(req, res) {
	var classRoom = new ClassRoom(req.body);
	classRoom.user = req.user;

	classRoom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classRoom);
		}
	});
};

/**
 * Show the current Class room
 */
exports.read = function(req, res) {
	res.jsonp(req.classRoom);
};

/**
 * Update a Class room
 */
exports.update = function(req, res) {
	var classRoom = req.classRoom ;

	classRoom = _.extend(classRoom , req.body);

	classRoom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classRoom);
		}
	});
};

/**
 * Delete an Class room
 */
exports.delete = function(req, res) {
	var classRoom = req.classRoom ;

	classRoom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classRoom);
		}
	});
};

/**
 * List of Class rooms
 */
exports.list = function(req, res) { 
	ClassRoom.find().sort('-created').populate('user', 'displayName').exec(function(err, classRooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(classRooms);
		}
	});
};

/**
 * Class room middleware
 */
exports.classRoomByID = function(req, res, next, id) { 
	ClassRoom.findById(id).populate('user', 'displayName').exec(function(err, classRoom) {
		if (err) return next(err);
		if (! classRoom) return next(new Error('Failed to load Class room ' + id));
		req.classRoom = classRoom ;
		next();
	});
};

/**
 * Class room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.classRoom.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
