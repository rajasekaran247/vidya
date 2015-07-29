'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Building Schema
 */
var BuildingSchema = new Schema({
	
  
  totalBuildUpArea: {
		type: Number,
		required: 'Please fill totalBuildUpArea name'
	},
  
  purposeOfFloor: {
		type: String,
		required: 'Please fill purposeOfFloor name'
	},
  
  blockName: {
		type: String,
		required: 'Please fill blockName name'
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

mongoose.model('Building', BuildingSchema);