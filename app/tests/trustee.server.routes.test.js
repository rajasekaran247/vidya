'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trustee = mongoose.model('Trustee'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, trustee;

/**
 * Trustee routes tests
 */
describe('Trustee CRUD tests', function() {
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

		// Save a user to the test db and create new Trustee
		user.save(function() {
			trustee = {
				name: 'Trustee Name'
			};

			done();
		});
	});

	it('should be able to save Trustee instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trustee
				agent.post('/trustees')
					.send(trustee)
					.expect(200)
					.end(function(trusteeSaveErr, trusteeSaveRes) {
						// Handle Trustee save error
						if (trusteeSaveErr) done(trusteeSaveErr);

						// Get a list of Trustees
						agent.get('/trustees')
							.end(function(trusteesGetErr, trusteesGetRes) {
								// Handle Trustee save error
								if (trusteesGetErr) done(trusteesGetErr);

								// Get Trustees list
								var trustees = trusteesGetRes.body;

								// Set assertions
								(trustees[0].user._id).should.equal(userId);
								(trustees[0].name).should.match('Trustee Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Trustee instance if not logged in', function(done) {
		agent.post('/trustees')
			.send(trustee)
			.expect(401)
			.end(function(trusteeSaveErr, trusteeSaveRes) {
				// Call the assertion callback
				done(trusteeSaveErr);
			});
	});

	it('should not be able to save Trustee instance if no name is provided', function(done) {
		// Invalidate name field
		trustee.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trustee
				agent.post('/trustees')
					.send(trustee)
					.expect(400)
					.end(function(trusteeSaveErr, trusteeSaveRes) {
						// Set message assertion
						(trusteeSaveRes.body.message).should.match('Please fill Trustee name');
						
						// Handle Trustee save error
						done(trusteeSaveErr);
					});
			});
	});

	it('should be able to update Trustee instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trustee
				agent.post('/trustees')
					.send(trustee)
					.expect(200)
					.end(function(trusteeSaveErr, trusteeSaveRes) {
						// Handle Trustee save error
						if (trusteeSaveErr) done(trusteeSaveErr);

						// Update Trustee name
						trustee.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Trustee
						agent.put('/trustees/' + trusteeSaveRes.body._id)
							.send(trustee)
							.expect(200)
							.end(function(trusteeUpdateErr, trusteeUpdateRes) {
								// Handle Trustee update error
								if (trusteeUpdateErr) done(trusteeUpdateErr);

								// Set assertions
								(trusteeUpdateRes.body._id).should.equal(trusteeSaveRes.body._id);
								(trusteeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trustees if not signed in', function(done) {
		// Create new Trustee model instance
		var trusteeObj = new Trustee(trustee);

		// Save the Trustee
		trusteeObj.save(function() {
			// Request Trustees
			request(app).get('/trustees')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Trustee if not signed in', function(done) {
		// Create new Trustee model instance
		var trusteeObj = new Trustee(trustee);

		// Save the Trustee
		trusteeObj.save(function() {
			request(app).get('/trustees/' + trusteeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', trustee.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Trustee instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trustee
				agent.post('/trustees')
					.send(trustee)
					.expect(200)
					.end(function(trusteeSaveErr, trusteeSaveRes) {
						// Handle Trustee save error
						if (trusteeSaveErr) done(trusteeSaveErr);

						// Delete existing Trustee
						agent.delete('/trustees/' + trusteeSaveRes.body._id)
							.send(trustee)
							.expect(200)
							.end(function(trusteeDeleteErr, trusteeDeleteRes) {
								// Handle Trustee error error
								if (trusteeDeleteErr) done(trusteeDeleteErr);

								// Set assertions
								(trusteeDeleteRes.body._id).should.equal(trusteeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Trustee instance if not signed in', function(done) {
		// Set Trustee user 
		trustee.user = user;

		// Create new Trustee model instance
		var trusteeObj = new Trustee(trustee);

		// Save the Trustee
		trusteeObj.save(function() {
			// Try deleting Trustee
			request(app).delete('/trustees/' + trusteeObj._id)
			.expect(401)
			.end(function(trusteeDeleteErr, trusteeDeleteRes) {
				// Set message assertion
				(trusteeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Trustee error error
				done(trusteeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Trustee.remove().exec();
		done();
	});
});