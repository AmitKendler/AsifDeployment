const mongoose = require("mongoose");
const Schema = mongoose.Schema;

exports.TimePeriodSchema = new Schema({
	startTime: Date,
	endTime: Date
});

exports.ContactSchema = new Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true }
});

exports.ProductAmountSchema = new Schema({
	amount: { type: Number, required: true },
	units: { type: String, required: true }
});

let LocationSchema = new Schema({
	type: { type: String },
	coordinates: [Number]
});

exports.AddressSchema = new Schema({
	location: LocationSchema,
	city: { type: String, required: true },
	streetName: { type: String, required: true },
	houseNumber: { type: String, required: true },
	aptNumber: Number
});

exports.LocationSchema = LocationSchema;
