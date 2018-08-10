const mongoose = require("mongoose");
const _ = require('lodash');
const Route = mongoose.model("Route");

exports.createRoute = function(req, res, next) {
	let route = req.body;
		
	new Route(req.body).save(function(err, route) {
		if (err) next(err);

		res.send(route);
	})
}

exports.updateRoute = function(req, res, next) {
    Route.findByIdAndUpdate(req.params.id, 
                              req.body,
                              {new: true}).exec(function (err,route) {
        if (err) next(err);

        res.send(route);
    })
}

exports.getAllRoutes = function(req, res, next) {
	Route.find({}).exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	})
};

exports.getRouteById = function(req, res, next) {
	Route.findById(req.params.id).exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	});
}

exports.deleteRoute = function(req, res, next) {
    Route.findByIdAndRemove(req.params.id).exec(function (err, route){
        if(err) next(err);

        res.sendStatus(200);
    })
}