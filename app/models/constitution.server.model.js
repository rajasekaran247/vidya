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
  
  constitutionType: {
		type: String,
		required: 'Please fill constitutionType name'
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