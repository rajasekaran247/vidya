'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Branch = mongoose.model('Branch'),
	_ = require('lodash');

/**
 * Create a Branch
 */
exports.create = function(req, res) {
	var branch = new Branch(req.body);
	branch.user = req.user;

	branch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(branch);
		}
	});
};

/**
 * Show the current Branch
 */
exports.read = function(req, res) {
	res.jsonp(req.branch);
};

/**
 * Update a Branch
 */
exports.update = function(req, res) {
	var branch = req.branch ;

	branch = _.extend(branch , req.body);

	branch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(branch);
		}
	});
};

/**
 * Delete an Branch
 */
exports.delete = function(req, res) {
	var branch = req.branch ;

	branch.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(branch);
		}
	});
};

/**
 * List of Branches
 */
exports.list = function(req, res) { 
	Branch.find().sort('-created').populate('user', 'displayName').exec(function(err, branches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(branches);
		}
	});
};

/**
 * Branch middleware
 */
exports.branchByID = function(req, res, next, id) { 
	Branch.findById(id).populate('user', 'displayName').exec(function(err, branch) {
		if (err) return next(err);
		if (! branch) return next(new Error('Failed to load Branch ' + id));
		req.branch = branch ;
		next();
	});
};

/**
 * Branch authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.branch.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
