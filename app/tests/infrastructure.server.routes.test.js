'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Infrastructure = mongoose.model('Infrastructure'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, infrastructure;

/**
 * Infrastructure routes tests
 */
describe('Infrastructure CRUD tests', function() {
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

		// Save a user to the test db and create new Infrastructure
		user.save(function() {
			infrastructure = {
				name: 'Infrastructure Name'
			};

			done();
		});
	});

	it('should be able to save Infrastructure instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infrastructure
				agent.post('/infrastructures')
					.send(infrastructure)
					.expect(200)
					.end(function(infrastructureSaveErr, infrastructureSaveRes) {
						// Handle Infrastructure save error
						if (infrastructureSaveErr) done(infrastructureSaveErr);

						// Get a list of Infrastructures
						agent.get('/infrastructures')
							.end(function(infrastructuresGetErr, infrastructuresGetRes) {
								// Handle Infrastructure save error
								if (infrastructuresGetErr) done(infrastructuresGetErr);

								// Get Infrastructures list
								var infrastructures = infrastructuresGetRes.body;

								// Set assertions
								(infrastructures[0].user._id).should.equal(userId);
								(infrastructures[0].name).should.match('Infrastructure Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Infrastructure instance if not logged in', function(done) {
		agent.post('/infrastructures')
			.send(infrastructure)
			.expect(401)
			.end(function(infrastructureSaveErr, infrastructureSaveRes) {
				// Call the assertion callback
				done(infrastructureSaveErr);
			});
	});

	it('should not be able to save Infrastructure instance if no name is provided', function(done) {
		// Invalidate name field
		infrastructure.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infrastructure
				agent.post('/infrastructures')
					.send(infrastructure)
					.expect(400)
					.end(function(infrastructureSaveErr, infrastructureSaveRes) {
						// Set message assertion
						(infrastructureSaveRes.body.message).should.match('Please fill Infrastructure name');
						
						// Handle Infrastructure save error
						done(infrastructureSaveErr);
					});
			});
	});

	it('should be able to update Infrastructure instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infrastructure
				agent.post('/infrastructures')
					.send(infrastructure)
					.expect(200)
					.end(function(infrastructureSaveErr, infrastructureSaveRes) {
						// Handle Infrastructure save error
						if (infrastructureSaveErr) done(infrastructureSaveErr);

						// Update Infrastructure name
						infrastructure.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Infrastructure
						agent.put('/infrastructures/' + infrastructureSaveRes.body._id)
							.send(infrastructure)
							.expect(200)
							.end(function(infrastructureUpdateErr, infrastructureUpdateRes) {
								// Handle Infrastructure update error
								if (infrastructureUpdateErr) done(infrastructureUpdateErr);

								// Set assertions
								(infrastructureUpdateRes.body._id).should.equal(infrastructureSaveRes.body._id);
								(infrastructureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Infrastructures if not signed in', function(done) {
		// Create new Infrastructure model instance
		var infrastructureObj = new Infrastructure(infrastructure);

		// Save the Infrastructure
		infrastructureObj.save(function() {
			// Request Infrastructures
			request(app).get('/infrastructures')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Infrastructure if not signed in', function(done) {
		// Create new Infrastructure model instance
		var infrastructureObj = new Infrastructure(infrastructure);

		// Save the Infrastructure
		infrastructureObj.save(function() {
			request(app).get('/infrastructures/' + infrastructureObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', infrastructure.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Infrastructure instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Infrastructure
				agent.post('/infrastructures')
					.send(infrastructure)
					.expect(200)
					.end(function(infrastructureSaveErr, infrastructureSaveRes) {
						// Handle Infrastructure save error
						if (infrastructureSaveErr) done(infrastructureSaveErr);

						// Delete existing Infrastructure
						agent.delete('/infrastructures/' + infrastructureSaveRes.body._id)
							.send(infrastructure)
							.expect(200)
							.end(function(infrastructureDeleteErr, infrastructureDeleteRes) {
								// Handle Infrastructure error error
								if (infrastructureDeleteErr) done(infrastructureDeleteErr);

								// Set assertions
								(infrastructureDeleteRes.body._id).should.equal(infrastructureSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Infrastructure instance if not signed in', function(done) {
		// Set Infrastructure user 
		infrastructure.user = user;

		// Create new Infrastructure model instance
		var infrastructureObj = new Infrastructure(infrastructure);

		// Save the Infrastructure
		infrastructureObj.save(function() {
			// Try deleting Infrastructure
			request(app).delete('/infrastructures/' + infrastructureObj._id)
			.expect(401)
			.end(function(infrastructureDeleteErr, infrastructureDeleteRes) {
				// Set message assertion
				(infrastructureDeleteRes.body.message).should.match('User is not logged in');

				// Handle Infrastructure error error
				done(infrastructureDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Infrastructure.remove().exec();
		done();
	});
});