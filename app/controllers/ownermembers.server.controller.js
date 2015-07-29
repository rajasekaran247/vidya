'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ownermember = mongoose.model('Ownermember'),
	_ = require('lodash');

/**
 * Create a Ownermember
 */
exports.create = function(req, res) {
	var ownermember = new Ownermember(req.body);
	ownermember.user = req.user;

	ownermember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ownermember);
		}
	});
};

/**
 * Show the current Ownermember
 */
exports.read = function(req, res) {
	res.jsonp(req.ownermember);
};

/**
 * Update a Ownermember
 */
exports.update = function(req, res) {
	var ownermember = req.ownermember ;

	ownermember = _.extend(ownermember , req.body);

	ownermember.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ownermember);
		}
	});
};

/**
 * Delete an Ownermember
 */
exports.delete = function(req, res) {
	var ownermember = req.ownermember ;

	ownermember.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ownermember);
		}
	});
};

/**
 * List of Ownermembers
 */
exports.list = function(req, res) { 
	Ownermember.find().sort('-created').populate('user', 'displayName').exec(function(err, ownermembers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ownermembers);
		}
	});
};

/**
 * Ownermember middleware
 */
exports.ownermemberByID = function(req, res, next, id) { 
	Ownermember.findById(id).populate('user', 'displayName').exec(function(err, ownermember) {
		if (err) return next(err);
		if (! ownermember) return next(new Error('Failed to load Ownermember ' + id));
		req.ownermember = ownermember ;
		next();
	});
};

/**
 * Ownermember authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ownermember.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
