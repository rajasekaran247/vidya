'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Branch Schema
 */
var BranchSchema = new Schema({
	
  
  phoneNumber: {
		type: Number,
		required: 'Please fill phoneNumber name'
	},
  
  contactPerson: {
		type: String,
		required: 'Please fill contactPerson name'
	},
  
  email: {
		type: String,
		required: 'Please fill email name'
	},
  
  website: {
		type: String,
		required: 'Please fill website name'
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

mongoose.model('Branch', BranchSchema);