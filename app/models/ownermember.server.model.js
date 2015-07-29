'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ownermember Schema
 */
var OwnermemberSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ownermember name',
		trim: true
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

mongoose.model('Ownermember', OwnermemberSchema);