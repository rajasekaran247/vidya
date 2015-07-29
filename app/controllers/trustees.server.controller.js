'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Trustee = mongoose.model('Trustee'),
	_ = require('lodash');

/**
 * Create a Trustee
 */
exports.create = function(req, res) {
	var trustee = new Trustee(req.body);
	trustee.user = req.user;

	trustee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trustee);
		}
	});
};

/**
 * Show the current Trustee
 */
exports.read = function(req, res) {
	res.jsonp(req.trustee);
};

/**
 * Update a Trustee
 */
exports.update = function(req, res) {
	var trustee = req.trustee ;

	trustee = _.extend(trustee , req.body);

	trustee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trustee);
		}
	});
};

/**
 * Delete an Trustee
 */
exports.delete = function(req, res) {
	var trustee = req.trustee ;

	trustee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trustee);
		}
	});
};

/**
 * List of Trustees
 */
exports.list = function(req, res) { 
	Trustee.find().sort('-created').populate('user', 'displayName').exec(function(err, trustees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trustees);
		}
	});
};

/**
 * Trustee middleware
 */
exports.trusteeByID = function(req, res, next, id) { 
	Trustee.findById(id).populate('user', 'displayName').exec(function(err, trustee) {
		if (err) return next(err);
		if (! trustee) return next(new Error('Failed to load Trustee ' + id));
		req.trustee = trustee ;
		next();
	});
};

/**
 * Trustee authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trustee.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
