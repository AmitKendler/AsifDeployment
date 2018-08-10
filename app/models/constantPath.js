const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConstantPath = new Schema({
	name: { type: String, required: true },
	points: Schema.Types.Mixed
}, {collection: 'constantPaths'})

mongoose.model("ConstantPath", ConstantPath);