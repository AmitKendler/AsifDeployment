var _ = require('lodash');
const mongoose = require("mongoose");
const ConstantPath = mongoose.model("ConstantPath");

exports.getAllPaths = function(req, res, next) {
	ConstantPath.find({}).exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	})
};

exports.createPath = function(req, res, next) {
	new ConstantPath(req.body).save(function (err, path) {
		if (err) next(err);

		res.send(path);
	})
}

exports.updatePath = function(req,res, next) {
    ConstantPath.findByIdAndUpdate(req.params.id, 
                              req.body,
                              {new: true}).exec(function (err,path) {
        if (err) next(err);

        res.send(path);
    })
}

exports.deletePath = function(req, res, next) {
    ConstantPath.findByIdAndRemove(req.params.id).exec(function (err, path){
        if(err) next(err);

        res.sendStatus(200);
    })
}