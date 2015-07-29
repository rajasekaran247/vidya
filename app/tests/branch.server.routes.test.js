'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Branch = mongoose.model('Branch'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, branch;

/**
 * Branch routes tests
 */
describe('Branch CRUD tests', function() {
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

		// Save a user to the test db and create new Branch
		user.save(function() {
			branch = {
				name: 'Branch Name'
			};

			done();
		});
	});

	it('should be able to save Branch instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Branch
				agent.post('/branches')
					.send(branch)
					.expect(200)
					.end(function(branchSaveErr, branchSaveRes) {
						// Handle Branch save error
						if (branchSaveErr) done(branchSaveErr);

						// Get a list of Branches
						agent.get('/branches')
							.end(function(branchesGetErr, branchesGetRes) {
								// Handle Branch save error
								if (branchesGetErr) done(branchesGetErr);

								// Get Branches list
								var branches = branchesGetRes.body;

								// Set assertions
								(branches[0].user._id).should.equal(userId);
								(branches[0].name).should.match('Branch Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Branch instance if not logged in', function(done) {
		agent.post('/branches')
			.send(branch)
			.expect(401)
			.end(function(branchSaveErr, branchSaveRes) {
				// Call the assertion callback
				done(branchSaveErr);
			});
	});

	it('should not be able to save Branch instance if no name is provided', function(done) {
		// Invalidate name field
		branch.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Branch
				agent.post('/branches')
					.send(branch)
					.expect(400)
					.end(function(branchSaveErr, branchSaveRes) {
						// Set message assertion
						(branchSaveRes.body.message).should.match('Please fill Branch name');
						
						// Handle Branch save error
						done(branchSaveErr);
					});
			});
	});

	it('should be able to update Branch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Branch
				agent.post('/branches')
					.send(branch)
					.expect(200)
					.end(function(branchSaveErr, branchSaveRes) {
						// Handle Branch save error
						if (branchSaveErr) done(branchSaveErr);

						// Update Branch name
						branch.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Branch
						agent.put('/branches/' + branchSaveRes.body._id)
							.send(branch)
							.expect(200)
							.end(function(branchUpdateErr, branchUpdateRes) {
								// Handle Branch update error
								if (branchUpdateErr) done(branchUpdateErr);

								// Set assertions
								(branchUpdateRes.body._id).should.equal(branchSaveRes.body._id);
								(branchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Branches if not signed in', function(done) {
		// Create new Branch model instance
		var branchObj = new Branch(branch);

		// Save the Branch
		branchObj.save(function() {
			// Request Branches
			request(app).get('/branches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Branch if not signed in', function(done) {
		// Create new Branch model instance
		var branchObj = new Branch(branch);

		// Save the Branch
		branchObj.save(function() {
			request(app).get('/branches/' + branchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', branch.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Branch instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Branch
				agent.post('/branches')
					.send(branch)
					.expect(200)
					.end(function(branchSaveErr, branchSaveRes) {
						// Handle Branch save error
						if (branchSaveErr) done(branchSaveErr);

						// Delete existing Branch
						agent.delete('/branches/' + branchSaveRes.body._id)
							.send(branch)
							.expect(200)
							.end(function(branchDeleteErr, branchDeleteRes) {
								// Handle Branch error error
								if (branchDeleteErr) done(branchDeleteErr);

								// Set assertions
								(branchDeleteRes.body._id).should.equal(branchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Branch instance if not signed in', function(done) {
		// Set Branch user 
		branch.user = user;

		// Create new Branch model instance
		var branchObj = new Branch(branch);

		// Save the Branch
		branchObj.save(function() {
			// Try deleting Branch
			request(app).delete('/branches/' + branchObj._id)
			.expect(401)
			.end(function(branchDeleteErr, branchDeleteRes) {
				// Set message assertion
				(branchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Branch error error
				done(branchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Branch.remove().exec();
		done();
	});
});