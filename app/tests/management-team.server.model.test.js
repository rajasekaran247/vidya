'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManagementTeam = mongoose.model('ManagementTeam');

/**
 * Globals
 */
var user, managementTeam;

/**
 * Unit tests
 */
describe('Management team Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			managementTeam = new ManagementTeam({
				name: 'Management team Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return managementTeam.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			managementTeam.name = '';

			return managementTeam.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		ManagementTeam.remove().exec();
		User.remove().exec();

		done();
	});
});