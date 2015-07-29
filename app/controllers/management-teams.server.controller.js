'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ManagementTeam = mongoose.model('ManagementTeam'),
	_ = require('lodash');

/**
 * Create a Management team
 */
exports.create = function(req, res) {
	var managementTeam = new ManagementTeam(req.body);
	managementTeam.user = req.user;

	managementTeam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(managementTeam);
		}
	});
};

/**
 * Show the current Management team
 */
exports.read = function(req, res) {
	res.jsonp(req.managementTeam);
};

/**
 * Update a Management team
 */
exports.update = function(req, res) {
	var managementTeam = req.managementTeam ;

	managementTeam = _.extend(managementTeam , req.body);

	managementTeam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(managementTeam);
		}
	});
};

/**
 * Delete an Management team
 */
exports.delete = function(req, res) {
	var managementTeam = req.managementTeam ;

	managementTeam.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(managementTeam);
		}
	});
};

/**
 * List of Management teams
 */
exports.list = function(req, res) { 
	ManagementTeam.find().sort('-created').populate('user', 'displayName').exec(function(err, managementTeams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(managementTeams);
		}
	});
};

/**
 * Management team middleware
 */
exports.managementTeamByID = function(req, res, next, id) { 
	ManagementTeam.findById(id).populate('user', 'displayName').exec(function(err, managementTeam) {
		if (err) return next(err);
		if (! managementTeam) return next(new Error('Failed to load Management team ' + id));
		req.managementTeam = managementTeam ;
		next();
	});
};

/**
 * Management team authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.managementTeam.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
