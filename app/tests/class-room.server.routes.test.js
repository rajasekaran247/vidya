'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ClassRoom = mongoose.model('ClassRoom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, classRoom;

/**
 * Class room routes tests
 */
describe('Class room CRUD tests', function() {
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

		// Save a user to the test db and create new Class room
		user.save(function() {
			classRoom = {
				name: 'Class room Name'
			};

			done();
		});
	});

	it('should be able to save Class room instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Class room
				agent.post('/class-rooms')
					.send(classRoom)
					.expect(200)
					.end(function(classRoomSaveErr, classRoomSaveRes) {
						// Handle Class room save error
						if (classRoomSaveErr) done(classRoomSaveErr);

						// Get a list of Class rooms
						agent.get('/class-rooms')
							.end(function(classRoomsGetErr, classRoomsGetRes) {
								// Handle Class room save error
								if (classRoomsGetErr) done(classRoomsGetErr);

								// Get Class rooms list
								var classRooms = classRoomsGetRes.body;

								// Set assertions
								(classRooms[0].user._id).should.equal(userId);
								(classRooms[0].name).should.match('Class room Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Class room instance if not logged in', function(done) {
		agent.post('/class-rooms')
			.send(classRoom)
			.expect(401)
			.end(function(classRoomSaveErr, classRoomSaveRes) {
				// Call the assertion callback
				done(classRoomSaveErr);
			});
	});

	it('should not be able to save Class room instance if no name is provided', function(done) {
		// Invalidate name field
		classRoom.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Class room
				agent.post('/class-rooms')
					.send(classRoom)
					.expect(400)
					.end(function(classRoomSaveErr, classRoomSaveRes) {
						// Set message assertion
						(classRoomSaveRes.body.message).should.match('Please fill Class room name');
						
						// Handle Class room save error
						done(classRoomSaveErr);
					});
			});
	});

	it('should be able to update Class room instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Class room
				agent.post('/class-rooms')
					.send(classRoom)
					.expect(200)
					.end(function(classRoomSaveErr, classRoomSaveRes) {
						// Handle Class room save error
						if (classRoomSaveErr) done(classRoomSaveErr);

						// Update Class room name
						classRoom.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Class room
						agent.put('/class-rooms/' + classRoomSaveRes.body._id)
							.send(classRoom)
							.expect(200)
							.end(function(classRoomUpdateErr, classRoomUpdateRes) {
								// Handle Class room update error
								if (classRoomUpdateErr) done(classRoomUpdateErr);

								// Set assertions
								(classRoomUpdateRes.body._id).should.equal(classRoomSaveRes.body._id);
								(classRoomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Class rooms if not signed in', function(done) {
		// Create new Class room model instance
		var classRoomObj = new ClassRoom(classRoom);

		// Save the Class room
		classRoomObj.save(function() {
			// Request Class rooms
			request(app).get('/class-rooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Class room if not signed in', function(done) {
		// Create new Class room model instance
		var classRoomObj = new ClassRoom(classRoom);

		// Save the Class room
		classRoomObj.save(function() {
			request(app).get('/class-rooms/' + classRoomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', classRoom.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Class room instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Class room
				agent.post('/class-rooms')
					.send(classRoom)
					.expect(200)
					.end(function(classRoomSaveErr, classRoomSaveRes) {
						// Handle Class room save error
						if (classRoomSaveErr) done(classRoomSaveErr);

						// Delete existing Class room
						agent.delete('/class-rooms/' + classRoomSaveRes.body._id)
							.send(classRoom)
							.expect(200)
							.end(function(classRoomDeleteErr, classRoomDeleteRes) {
								// Handle Class room error error
								if (classRoomDeleteErr) done(classRoomDeleteErr);

								// Set assertions
								(classRoomDeleteRes.body._id).should.equal(classRoomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Class room instance if not signed in', function(done) {
		// Set Class room user 
		classRoom.user = user;

		// Create new Class room model instance
		var classRoomObj = new ClassRoom(classRoom);

		// Save the Class room
		classRoomObj.save(function() {
			// Try deleting Class room
			request(app).delete('/class-rooms/' + classRoomObj._id)
			.expect(401)
			.end(function(classRoomDeleteErr, classRoomDeleteRes) {
				// Set message assertion
				(classRoomDeleteRes.body.message).should.match('User is not logged in');

				// Handle Class room error error
				done(classRoomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ClassRoom.remove().exec();
		done();
	});
});