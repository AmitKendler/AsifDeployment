const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
	number: {type: String, required: true},
	type: {type: String},
}, {collection: 'vehicles'})

mongoose.model("Vehicle", VehicleSchema);