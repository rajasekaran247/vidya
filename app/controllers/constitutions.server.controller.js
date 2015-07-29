'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Constitution = mongoose.model('Constitution'),
	_ = require('lodash');

/**
 * Create a Constitution
 */
exports.create = function(req, res) {
	var constitution = new Constitution(req.body);
	constitution.user = req.user;

	constitution.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(constitution);
		}
	});
};

/**
 * Show the current Constitution
 */
exports.read = function(req, res) {
	res.jsonp(req.constitution);
};

/**
 * Update a Constitution
 */
exports.update = function(req, res) {
	var constitution = req.constitution ;

	constitution = _.extend(constitution , req.body);

	constitution.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(constitution);
		}
	});
};

/**
 * Delete an Constitution
 */
exports.delete = function(req, res) {
	var constitution = req.constitution ;

	constitution.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(constitution);
		}
	});
};

/**
 * List of Constitutions
 */
exports.list = function(req, res) { 
	Constitution.find().sort('-created').populate('user', 'displayName').exec(function(err, constitutions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(constitutions);
		}
	});
};

/**
 * Constitution middleware
 */
exports.constitutionByID = function(req, res, next, id) { 
	Constitution.findById(id).populate('user', 'displayName').exec(function(err, constitution) {
		if (err) return next(err);
		if (! constitution) return next(new Error('Failed to load Constitution ' + id));
		req.constitution = constitution ;
		next();
	});
};

/**
 * Constitution authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.constitution.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
