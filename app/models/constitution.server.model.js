'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Constitution Schema
 */
var ConstitutionSchema = new Schema({
	
  
  constitutionName: {
		type: String,
		required: 'Please fill constitutionName name'
	},
  
  natureOfConstitution: {
		type: String,
		required: 'Please fill natureOfConstitution name'
	},
  
  dateOfFormation: {
		type: Date,
		required: 'Please fill dateOfFormation name'
	},
  
  registeredAddress: {
		type: String,
		required: 'Please fill registeredAddress name'
	},
  
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

mongoose.model('Constitution', ConstitutionSchema);