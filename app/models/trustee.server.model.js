'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trustee Schema
 */
var TrusteeSchema = new Schema({
	
  
  name: {
		type: String,
		required: 'Please fill name name'
	},
  
  address: {
		type: String,
		required: 'Please fill address name'
	},
  
  phoneNumber: {
		type: Number,
		required: 'Please fill phoneNumber name'
	},
  
  designation: {
		type: String,
		required: 'Please fill designation name'
	},
  
  dateOfJoining: {
		type: Date,
		required: 'Please fill dateOfJoining name'
	},
  
  dateOfCeasation: {
		type: Date,
		required: 'Please fill dateOfCeasation name'
	},
  
  pan: {
		type: String,
		required: 'Please fill pan name'
	},
  
  email: {
		type: String,
		required: 'Please fill email name'
	},
  
  fathersName: {
		type: String,
		required: 'Please fill fathersName name'
	},
  
  dateOfBirth: {
		type: Date,
		required: 'Please fill dateOfBirth name'
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

mongoose.model('Trustee', TrusteeSchema);