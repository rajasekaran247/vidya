'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * OwnerMember Schema
 */
var OwnerMemberSchema = new Schema({
	
  
  ownerMemberName: {
		type: String,
		required: 'Please fill ownerMemberName name'
	},
  
  phoneNumber: {
		type: String,
		required: 'Please fill phoneNumber name'
	},
  
  address: {
		type: String,
		required: 'Please fill address name'
	},
  
  pannumber: {
		type: String,
		required: 'Please fill pannumber name'
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

mongoose.model('OwnerMember', OwnerMemberSchema);