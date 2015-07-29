'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Infrastructure Schema
 */
var InfrastructureSchema = new Schema({
	
  
  leasedOwned: {
		type: String,
		required: 'Please fill leasedOwned name'
	},
  
  institutionAttachedTo: {
		type: String,
		required: 'Please fill institutionAttachedTo name'
	},
  
  documentNumber: {
		type: String,
		required: 'Please fill documentNumber name'
	},
  
  registrationChargesPaid: {
		type: Number,
		required: 'Please fill registrationChargesPaid name'
	},
  
  registrationValue: {
		type: Number,
		required: 'Please fill registrationValue name'
	},
  
  stampDutyPaid: {
		type: Number,
		required: 'Please fill stampDutyPaid name'
	},
  
  registrationDate: {
		type: Date,
		required: 'Please fill registrationDate name'
	},
  
  descriptionOfProperty: {
		type: String,
		required: 'Please fill descriptionOfProperty name'
	},
  
  area: {
		type: Number,
		required: 'Please fill area name'
	},
  
  unitOfMeasure: {
		type: String,
		required: 'Please fill unitOfMeasure name'
	},
  
  leasedPeriod: {
		type: String,
		required: 'Please fill leasedPeriod name'
	},
  
  leaseRental: {
		type: Number,
		required: 'Please fill leaseRental name'
	},
  
  leaseAdvance: {
		type: Number,
		required: 'Please fill leaseAdvance name'
	},
  
  leaseAdvancePaymentMode: {
		type: String,
		required: 'Please fill leaseAdvancePaymentMode name'
	},
  
  leaseRentDueDate: {
		type: Date,
		required: 'Please fill leaseRentDueDate name'
	},
  
  lessorName: {
		type: String,
		required: 'Please fill lessorName name'
	},
  
  lessorPhoneNumber: {
		type: String,
		required: 'Please fill lessorPhoneNumber name'
	},
  
  lessorAddress: {
		type: String,
		required: 'Please fill lessorAddress name'
	},
  
  lessorAccountNumber: {
		type: String,
		required: 'Please fill lessorAccountNumber name'
	},
  
  lessorBankDetails: {
		type: String,
		required: 'Please fill lessorBankDetails name'
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

mongoose.model('Infrastructure', InfrastructureSchema);