'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ManagementTeam Schema
 */
var ManagementTeamSchema = new Schema({
	
  
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
  
  dateOfCreation: {
		type: Date,
		required: 'Please fill dateOfCreation name'
	},
  
  pan: {
		type: String,
		required: 'Please fill pan name'
	},
  
  tan: {
		type: String,
		required: 'Please fill tan name'
	},
  
  itexemption: {
		type: String,
		required: 'Please fill itexemption name'
	},
  
  registrationCertificateNo: {
		type: String,
		required: 'Please fill registrationCertificateNo name'
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

mongoose.model('ManagementTeam', ManagementTeamSchema);