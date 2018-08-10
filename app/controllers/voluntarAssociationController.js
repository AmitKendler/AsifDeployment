var _ = require('lodash');
const mongoose = require("mongoose");
const VoluntaryAssociation = mongoose.model("VoluntaryAssociation");

exports.getAll = function(req, res) {
	VoluntaryAssociation.find({}).exec(function (err, data) {
		if (err) throw err;

		res.send(data);
	})
};

exports.getById = function(req, res) {
	let volAsId = req.params.id;
	VoluntaryAssociation.find({_id: volAsId}).exec(function (err, data) {
		if (err) throw err;

		res.send(data);
	});
}

exports.create = function(req, res) {
	new VoluntaryAssociation(req.body).save(function (err, volas) {
		if (err) throw err;

		res.send(volas);
	})
}