const commonModels = require("./commonModels");
const TimePeriodSchema = commonModels.TimePeriodSchema;
const ContactSchema = commonModels.ContactSchema;
const PickupAddressSchema = commonModels.AddressSchema;
const AddressSchema = commonModels.AddressSchema;
// const ProductSchema = require('./product');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Giveaway = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		address: { type: AddressSchema, required: false }, // temp false
		pickupTime: TimePeriodSchema,
		contact: ContactSchema,
		products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
	},
	{ collection: "givaways" }
);

mongoose.model("Giveaway", Giveaway);
