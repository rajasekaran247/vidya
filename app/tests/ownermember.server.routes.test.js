'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ownermember = mongoose.model('Ownermember'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ownermember;

/**
 * Ownermember routes tests
 */
describe('Ownermember CRUD tests', function() {
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

		// Save a user to the test db and create new Ownermember
		user.save(function() {
			ownermember = {
				name: 'Ownermember Name'
			};

			done();
		});
	});

	it('should be able to save Ownermember instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ownermember
				agent.post('/ownermembers')
					.send(ownermember)
					.expect(200)
					.end(function(ownermemberSaveErr, ownermemberSaveRes) {
						// Handle Ownermember save error
						if (ownermemberSaveErr) done(ownermemberSaveErr);

						// Get a list of Ownermembers
						agent.get('/ownermembers')
							.end(function(ownermembersGetErr, ownermembersGetRes) {
								// Handle Ownermember save error
								if (ownermembersGetErr) done(ownermembersGetErr);

								// Get Ownermembers list
								var ownermembers = ownermembersGetRes.body;

								// Set assertions
								(ownermembers[0].user._id).should.equal(userId);
								(ownermembers[0].name).should.match('Ownermember Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ownermember instance if not logged in', function(done) {
		agent.post('/ownermembers')
			.send(ownermember)
			.expect(401)
			.end(function(ownermemberSaveErr, ownermemberSaveRes) {
				// Call the assertion callback
				done(ownermemberSaveErr);
			});
	});

	it('should not be able to save Ownermember instance if no name is provided', function(done) {
		// Invalidate name field
		ownermember.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ownermember
				agent.post('/ownermembers')
					.send(ownermember)
					.expect(400)
					.end(function(ownermemberSaveErr, ownermemberSaveRes) {
						// Set message assertion
						(ownermemberSaveRes.body.message).should.match('Please fill Ownermember name');
						
						// Handle Ownermember save error
						done(ownermemberSaveErr);
					});
			});
	});

	it('should be able to update Ownermember instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ownermember
				agent.post('/ownermembers')
					.send(ownermember)
					.expect(200)
					.end(function(ownermemberSaveErr, ownermemberSaveRes) {
						// Handle Ownermember save error
						if (ownermemberSaveErr) done(ownermemberSaveErr);

						// Update Ownermember name
						ownermember.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ownermember
						agent.put('/ownermembers/' + ownermemberSaveRes.body._id)
							.send(ownermember)
							.expect(200)
							.end(function(ownermemberUpdateErr, ownermemberUpdateRes) {
								// Handle Ownermember update error
								if (ownermemberUpdateErr) done(ownermemberUpdateErr);

								// Set assertions
								(ownermemberUpdateRes.body._id).should.equal(ownermemberSaveRes.body._id);
								(ownermemberUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ownermembers if not signed in', function(done) {
		// Create new Ownermember model instance
		var ownermemberObj = new Ownermember(ownermember);

		// Save the Ownermember
		ownermemberObj.save(function() {
			// Request Ownermembers
			request(app).get('/ownermembers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ownermember if not signed in', function(done) {
		// Create new Ownermember model instance
		var ownermemberObj = new Ownermember(ownermember);

		// Save the Ownermember
		ownermemberObj.save(function() {
			request(app).get('/ownermembers/' + ownermemberObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ownermember.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ownermember instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ownermember
				agent.post('/ownermembers')
					.send(ownermember)
					.expect(200)
					.end(function(ownermemberSaveErr, ownermemberSaveRes) {
						// Handle Ownermember save error
						if (ownermemberSaveErr) done(ownermemberSaveErr);

						// Delete existing Ownermember
						agent.delete('/ownermembers/' + ownermemberSaveRes.body._id)
							.send(ownermember)
							.expect(200)
							.end(function(ownermemberDeleteErr, ownermemberDeleteRes) {
								// Handle Ownermember error error
								if (ownermemberDeleteErr) done(ownermemberDeleteErr);

								// Set assertions
								(ownermemberDeleteRes.body._id).should.equal(ownermemberSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ownermember instance if not signed in', function(done) {
		// Set Ownermember user 
		ownermember.user = user;

		// Create new Ownermember model instance
		var ownermemberObj = new Ownermember(ownermember);

		// Save the Ownermember
		ownermemberObj.save(function() {
			// Try deleting Ownermember
			request(app).delete('/ownermembers/' + ownermemberObj._id)
			.expect(401)
			.end(function(ownermemberDeleteErr, ownermemberDeleteRes) {
				// Set message assertion
				(ownermemberDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ownermember error error
				done(ownermemberDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ownermember.remove().exec();
		done();
	});
});