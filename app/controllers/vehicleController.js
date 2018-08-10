var _ = require('lodash');
const mongoose = require("mongoose");
const Vehicle = mongoose.model("Vehicle");

exports.getAllVehicles = function(req, res, next) {
	Vehicle.find({}).exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	})
};

exports.getVehicleById = function(req, res, next) {
	Vehicle.findById(req.params.id).exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	});
}

exports.createVehicale = function(req, res, next) {
	new Vehicle(req.body).save(function (err, vehicle) {
		if (err) next(err);

		res.send(vehicle);
	})
}

exports.updateVehicle = function(req,res, next) {
    Vehicle.findByIdAndUpdate(req.params.id, 
                              req.body,
                              {new: true}).exec(function (err,vehicle) {
        if (err) next(err);

        res.send(vehicle);
    })
}

exports.deleteVehicle = function(req, res, next) {
    Vehicle.findByIdAndRemove(req.params.id).exec(function (err, vehicle){
        if(err) next(err);

        res.sendStatus(200);
    })
}
