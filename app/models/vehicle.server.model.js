'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Vehicle Schema
 */
var VehicleSchema = new Schema({
	
  
  rcnumber: {
		type: String,
		required: 'Please fill rcnumber name'
	},
  
  insuranceNumber: {
		type: String,
		required: 'Please fill insuranceNumber name'
	},
  
  ownedLeased: {
		type: String,
		required: 'Please fill ownedLeased name'
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

mongoose.model('Vehicle', VehicleSchema);