'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ClassRoom Schema
 */
var ClassRoomSchema = new Schema({
	
  
  capacity: {
		type: Number,
		required: 'Please fill capacity name'
	},
  
  institutionAssignedTo: {
		type: String,
		required: 'Please fill institutionAssignedTo name'
	},
  
  institutionAssignedSince: {
		type: Date,
		required: 'Please fill institutionAssignedSince name'
	},
  
  
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ClassRoom', ClassRoomSchema);