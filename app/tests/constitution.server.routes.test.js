'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Constitution = mongoose.model('Constitution'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, constitution;

/**
 * Constitution routes tests
 */
describe('Constitution CRUD tests', function() {
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

		// Save a user to the test db and create new Constitution
		user.save(function() {
			constitution = {
				name: 'Constitution Name'
			};

			done();
		});
	});

	it('should be able to save Constitution instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Constitution
				agent.post('/constitutions')
					.send(constitution)
					.expect(200)
					.end(function(constitutionSaveErr, constitutionSaveRes) {
						// Handle Constitution save error
						if (constitutionSaveErr) done(constitutionSaveErr);

						// Get a list of Constitutions
						agent.get('/constitutions')
							.end(function(constitutionsGetErr, constitutionsGetRes) {
								// Handle Constitution save error
								if (constitutionsGetErr) done(constitutionsGetErr);

								// Get Constitutions list
								var constitutions = constitutionsGetRes.body;

								// Set assertions
								(constitutions[0].user._id).should.equal(userId);
								(constitutions[0].name).should.match('Constitution Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Constitution instance if not logged in', function(done) {
		agent.post('/constitutions')
			.send(constitution)
			.expect(401)
			.end(function(constitutionSaveErr, constitutionSaveRes) {
				// Call the assertion callback
				done(constitutionSaveErr);
			});
	});

	it('should not be able to save Constitution instance if no name is provided', function(done) {
		// Invalidate name field
		constitution.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Constitution
				agent.post('/constitutions')
					.send(constitution)
					.expect(400)
					.end(function(constitutionSaveErr, constitutionSaveRes) {
						// Set message assertion
						(constitutionSaveRes.body.message).should.match('Please fill Constitution name');
						
						// Handle Constitution save error
						done(constitutionSaveErr);
					});
			});
	});

	it('should be able to update Constitution instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Constitution
				agent.post('/constitutions')
					.send(constitution)
					.expect(200)
					.end(function(constitutionSaveErr, constitutionSaveRes) {
						// Handle Constitution save error
						if (constitutionSaveErr) done(constitutionSaveErr);

						// Update Constitution name
						constitution.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Constitution
						agent.put('/constitutions/' + constitutionSaveRes.body._id)
							.send(constitution)
							.expect(200)
							.end(function(constitutionUpdateErr, constitutionUpdateRes) {
								// Handle Constitution update error
								if (constitutionUpdateErr) done(constitutionUpdateErr);

								// Set assertions
								(constitutionUpdateRes.body._id).should.equal(constitutionSaveRes.body._id);
								(constitutionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Constitutions if not signed in', function(done) {
		// Create new Constitution model instance
		var constitutionObj = new Constitution(constitution);

		// Save the Constitution
		constitutionObj.save(function() {
			// Request Constitutions
			request(app).get('/constitutions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Constitution if not signed in', function(done) {
		// Create new Constitution model instance
		var constitutionObj = new Constitution(constitution);

		// Save the Constitution
		constitutionObj.save(function() {
			request(app).get('/constitutions/' + constitutionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', constitution.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Constitution instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Constitution
				agent.post('/constitutions')
					.send(constitution)
					.expect(200)
					.end(function(constitutionSaveErr, constitutionSaveRes) {
						// Handle Constitution save error
						if (constitutionSaveErr) done(constitutionSaveErr);

						// Delete existing Constitution
						agent.delete('/constitutions/' + constitutionSaveRes.body._id)
							.send(constitution)
							.expect(200)
							.end(function(constitutionDeleteErr, constitutionDeleteRes) {
								// Handle Constitution error error
								if (constitutionDeleteErr) done(constitutionDeleteErr);

								// Set assertions
								(constitutionDeleteRes.body._id).should.equal(constitutionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Constitution instance if not signed in', function(done) {
		// Set Constitution user 
		constitution.user = user;

		// Create new Constitution model instance
		var constitutionObj = new Constitution(constitution);

		// Save the Constitution
		constitutionObj.save(function() {
			// Try deleting Constitution
			request(app).delete('/constitutions/' + constitutionObj._id)
			.expect(401)
			.end(function(constitutionDeleteErr, constitutionDeleteRes) {
				// Set message assertion
				(constitutionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Constitution error error
				done(constitutionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Constitution.remove().exec();
		done();
	});
});