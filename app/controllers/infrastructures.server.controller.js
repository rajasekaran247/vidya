'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Infrastructure = mongoose.model('Infrastructure'),
	_ = require('lodash');

/**
 * Create a Infrastructure
 */
exports.create = function(req, res) {
	var infrastructure = new Infrastructure(req.body);
	infrastructure.user = req.user;

	infrastructure.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infrastructure);
		}
	});
};

/**
 * Show the current Infrastructure
 */
exports.read = function(req, res) {
	res.jsonp(req.infrastructure);
};

/**
 * Update a Infrastructure
 */
exports.update = function(req, res) {
	var infrastructure = req.infrastructure ;

	infrastructure = _.extend(infrastructure , req.body);

	infrastructure.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infrastructure);
		}
	});
};

/**
 * Delete an Infrastructure
 */
exports.delete = function(req, res) {
	var infrastructure = req.infrastructure ;

	infrastructure.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infrastructure);
		}
	});
};

/**
 * List of Infrastructures
 */
exports.list = function(req, res) { 
	Infrastructure.find().sort('-created').populate('user', 'displayName').exec(function(err, infrastructures) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(infrastructures);
		}
	});
};

/**
 * Infrastructure middleware
 */
exports.infrastructureByID = function(req, res, next, id) { 
	Infrastructure.findById(id).populate('user', 'displayName').exec(function(err, infrastructure) {
		if (err) return next(err);
		if (! infrastructure) return next(new Error('Failed to load Infrastructure ' + id));
		req.infrastructure = infrastructure ;
		next();
	});
};

/**
 * Infrastructure authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.infrastructure.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
