'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Institution = mongoose.model('Institution'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, institution;

/**
 * Institution routes tests
 */
describe('Institution CRUD tests', function() {
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

		// Save a user to the test db and create new Institution
		user.save(function() {
			institution = {
				name: 'Institution Name'
			};

			done();
		});
	});

	it('should be able to save Institution instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Institution
				agent.post('/institutions')
					.send(institution)
					.expect(200)
					.end(function(institutionSaveErr, institutionSaveRes) {
						// Handle Institution save error
						if (institutionSaveErr) done(institutionSaveErr);

						// Get a list of Institutions
						agent.get('/institutions')
							.end(function(institutionsGetErr, institutionsGetRes) {
								// Handle Institution save error
								if (institutionsGetErr) done(institutionsGetErr);

								// Get Institutions list
								var institutions = institutionsGetRes.body;

								// Set assertions
								(institutions[0].user._id).should.equal(userId);
								(institutions[0].name).should.match('Institution Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Institution instance if not logged in', function(done) {
		agent.post('/institutions')
			.send(institution)
			.expect(401)
			.end(function(institutionSaveErr, institutionSaveRes) {
				// Call the assertion callback
				done(institutionSaveErr);
			});
	});

	it('should not be able to save Institution instance if no name is provided', function(done) {
		// Invalidate name field
		institution.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Institution
				agent.post('/institutions')
					.send(institution)
					.expect(400)
					.end(function(institutionSaveErr, institutionSaveRes) {
						// Set message assertion
						(institutionSaveRes.body.message).should.match('Please fill Institution name');
						
						// Handle Institution save error
						done(institutionSaveErr);
					});
			});
	});

	it('should be able to update Institution instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Institution
				agent.post('/institutions')
					.send(institution)
					.expect(200)
					.end(function(institutionSaveErr, institutionSaveRes) {
						// Handle Institution save error
						if (institutionSaveErr) done(institutionSaveErr);

						// Update Institution name
						institution.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Institution
						agent.put('/institutions/' + institutionSaveRes.body._id)
							.send(institution)
							.expect(200)
							.end(function(institutionUpdateErr, institutionUpdateRes) {
								// Handle Institution update error
								if (institutionUpdateErr) done(institutionUpdateErr);

								// Set assertions
								(institutionUpdateRes.body._id).should.equal(institutionSaveRes.body._id);
								(institutionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Institutions if not signed in', function(done) {
		// Create new Institution model instance
		var institutionObj = new Institution(institution);

		// Save the Institution
		institutionObj.save(function() {
			// Request Institutions
			request(app).get('/institutions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Institution if not signed in', function(done) {
		// Create new Institution model instance
		var institutionObj = new Institution(institution);

		// Save the Institution
		institutionObj.save(function() {
			request(app).get('/institutions/' + institutionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', institution.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Institution instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Institution
				agent.post('/institutions')
					.send(institution)
					.expect(200)
					.end(function(institutionSaveErr, institutionSaveRes) {
						// Handle Institution save error
						if (institutionSaveErr) done(institutionSaveErr);

						// Delete existing Institution
						agent.delete('/institutions/' + institutionSaveRes.body._id)
							.send(institution)
							.expect(200)
							.end(function(institutionDeleteErr, institutionDeleteRes) {
								// Handle Institution error error
								if (institutionDeleteErr) done(institutionDeleteErr);

								// Set assertions
								(institutionDeleteRes.body._id).should.equal(institutionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Institution instance if not signed in', function(done) {
		// Set Institution user 
		institution.user = user;

		// Create new Institution model instance
		var institutionObj = new Institution(institution);

		// Save the Institution
		institutionObj.save(function() {
			// Try deleting Institution
			request(app).delete('/institutions/' + institutionObj._id)
			.expect(401)
			.end(function(institutionDeleteErr, institutionDeleteRes) {
				// Set message assertion
				(institutionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Institution error error
				done(institutionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Institution.remove().exec();
		done();
	});
});