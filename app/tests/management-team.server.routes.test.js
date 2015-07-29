'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ManagementTeam = mongoose.model('ManagementTeam'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, managementTeam;

/**
 * Management team routes tests
 */
describe('Management team CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Management team
		user.save(function() {
			managementTeam = {
				name: 'Management team Name'
			};

			done();
		});
	});

	it('should be able to save Management team instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Management team
				agent.post('/management-teams')
					.send(managementTeam)
					.expect(200)
					.end(function(managementTeamSaveErr, managementTeamSaveRes) {
						// Handle Management team save error
						if (managementTeamSaveErr) done(managementTeamSaveErr);

						// Get a list of Management teams
						agent.get('/management-teams')
							.end(function(managementTeamsGetErr, managementTeamsGetRes) {
								// Handle Management team save error
								if (managementTeamsGetErr) done(managementTeamsGetErr);

								// Get Management teams list
								var managementTeams = managementTeamsGetRes.body;

								// Set assertions
								(managementTeams[0].user._id).should.equal(userId);
								(managementTeams[0].name).should.match('Management team Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Management team instance if not logged in', function(done) {
		agent.post('/management-teams')
			.send(managementTeam)
			.expect(401)
			.end(function(managementTeamSaveErr, managementTeamSaveRes) {
				// Call the assertion callback
				done(managementTeamSaveErr);
			});
	});

	it('should not be able to save Management team instance if no name is provided', function(done) {
		// Invalidate name field
		managementTeam.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Management team
				agent.post('/management-teams')
					.send(managementTeam)
					.expect(400)
					.end(function(managementTeamSaveErr, managementTeamSaveRes) {
						// Set message assertion
						(managementTeamSaveRes.body.message).should.match('Please fill Management team name');
						
						// Handle Management team save error
						done(managementTeamSaveErr);
					});
			});
	});

	it('should be able to update Management team instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Management team
				agent.post('/management-teams')
					.send(managementTeam)
					.expect(200)
					.end(function(managementTeamSaveErr, managementTeamSaveRes) {
						// Handle Management team save error
						if (managementTeamSaveErr) done(managementTeamSaveErr);

						// Update Management team name
						managementTeam.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Management team
						agent.put('/management-teams/' + managementTeamSaveRes.body._id)
							.send(managementTeam)
							.expect(200)
							.end(function(managementTeamUpdateErr, managementTeamUpdateRes) {
								// Handle Management team update error
								if (managementTeamUpdateErr) done(managementTeamUpdateErr);

								// Set assertions
								(managementTeamUpdateRes.body._id).should.equal(managementTeamSaveRes.body._id);
								(managementTeamUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Management teams if not signed in', function(done) {
		// Create new Management team model instance
		var managementTeamObj = new ManagementTeam(managementTeam);

		// Save the Management team
		managementTeamObj.save(function() {
			// Request Management teams
			request(app).get('/management-teams')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Management team if not signed in', function(done) {
		// Create new Management team model instance
		var managementTeamObj = new ManagementTeam(managementTeam);

		// Save the Management team
		managementTeamObj.save(function() {
			request(app).get('/management-teams/' + managementTeamObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', managementTeam.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Management team instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Management team
				agent.post('/management-teams')
					.send(managementTeam)
					.expect(200)
					.end(function(managementTeamSaveErr, managementTeamSaveRes) {
						// Handle Management team save error
						if (managementTeamSaveErr) done(managementTeamSaveErr);

						// Delete existing Management team
						agent.delete('/management-teams/' + managementTeamSaveRes.body._id)
							.send(managementTeam)
							.expect(200)
							.end(function(managementTeamDeleteErr, managementTeamDeleteRes) {
								// Handle Management team error error
								if (managementTeamDeleteErr) done(managementTeamDeleteErr);

								// Set assertions
								(managementTeamDeleteRes.body._id).should.equal(managementTeamSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Management team instance if not signed in', function(done) {
		// Set Management team user 
		managementTeam.user = user;

		// Create new Management team model instance
		var managementTeamObj = new ManagementTeam(managementTeam);

		// Save the Management team
		managementTeamObj.save(function() {
			// Try deleting Management team
			request(app).delete('/management-teams/' + managementTeamObj._id)
			.expect(401)
			.end(function(managementTeamDeleteErr, managementTeamDeleteRes) {
				// Set message assertion
				(managementTeamDeleteRes.body.message).should.match('User is not logged in');

				// Handle Management team error error
				done(managementTeamDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ManagementTeam.remove().exec();
		done();
	});
});