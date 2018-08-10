const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Route = new Schema({
	date: Date,
	status: { type: String, default: "READY" }, // READY, STARTED, FINISHED
	paths: Schema.Types.Mixed
}, {collection: 'routes'})

mongoose.model("Route", Route);