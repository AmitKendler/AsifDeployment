/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;

// Creating model, defining fields
const VoluntaryAssociationSchema = new Schema({
    code: { type: String, default: "" },
    password: { type: String, default: "" },
    name: { type: String, default: "", required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
}, { collection: "voluntaryAssociations" })

// Presave function for password checking
VoluntaryAssociationSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Helper function to compare passwords
VoluntaryAssociationSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

mongoose.model("VoluntaryAssociation", VoluntaryAssociationSchema);