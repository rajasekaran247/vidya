'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Institution Schema
 */
var InstitutionSchema = new Schema({
	
  
  institutionName: {
		type: String,
		required: 'Please fill institutionName name'
	},
  
  typeOfInstitution: {
		type: String,
		required: 'Please fill typeOfInstitution name'
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

mongoose.model('Institution', InstitutionSchema);