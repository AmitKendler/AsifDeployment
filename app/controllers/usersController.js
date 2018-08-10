const mongoose = require("mongoose");
const _ = require('lodash');
const utils = require('../utils');
const User = mongoose.model("User");
const store = require('../store');

exports.login = function(req, res, next) {
    User.find({ authId: req.body.token }).exec(function(err, data) {
        if (err) next(err);

        res.send(data);
    })
}

exports.registerAssociationPushToken = function(req, res, next) {
    store.registerVolunteerClientToken(req.body.token);
    res.send(200);
}

exports.checkExists = function(req, res, next) {
    User.findOne({ authId: req.body.uid }).exec(function(err, user) {
        if (err) return next(err);

        if (user) {
            res.send(user);
        } else {
            res.send({ _id: null, info: "non existinguser" });
        }
    })
}

exports.updateUserInfo = function(req, res, next) {
    console.log("updating user...");
    User.findOne({ "_id": req.body.userId }).exec(function(err, user) {
        if (err) return next(err);
        if (user && req.body.address && req.body.phone) {
            user.address = req.body.address;
            user.phone = req.body.phone;
            user.save(function(err, user) {
                if (err) return next(err);
                res.send(user);
            });
        }
    });
}

exports.postLogin = function(req, res, next) {
    User.find({ authId: req.body.authId }).exec(function(err, data) {
        if (err) next(err);
        console.log("login data " + data);
        if (!data.length) {
            console.log("unexisting user..creating");
            new User(req.body).save(function(err, user) {
                if (err) next(err);

                res.send(user);
            });
        } else {
            res.send(data[0]);
        }
        console.log("logging in..", data);
    });
}

exports.addPushTokenToUser = function(req, res, next) {
    User.findOne({ "_id": req.body.userId }).exec(function(err, user) {
        if (err) next(err);
        if (user) {
            user.pushNotificationToken = req.body.token
            user.save(function(err, user) {
                if (err) next(err);
                console.log("success! added push token");
                res.send(user);
            });
        }
    });
}

exports.getAllUsers = function(req, res, next) {
    User.find({}).exec(function(err, data) {
        if (err) next(err);

        res.send(data);
    });
}

exports.getVolunteers = function(req, res, next) {
    User.find({ isVolunteer: true }).exec(function(err, data) {
        if (err) next(err);

        res.send(data);
    });
}

exports.getDonors = function(req, res, next) {
    User.find({ isVolunteer: false }).exec(function(err, data) {
        if (err) next(err);

        res.send(data);
    });
}

exports.getUserById = function(req, res, next) {
    User.findById(req.params.id).exec(function(err, user) {
        if (err) next(err);

        res.send(user);
    });
}

exports.addUser = function(req, res, next) {
    new User(req.body).save(function(err, user) {
        if (err) next(err);

        res.send(user);
    });
}

exports.updateUser = function(req, res, next) {
    User.findByIdAndUpdate(req.params.id,
        req.body, { new: true }).exec(function(err, user) {
        if (err) next(err);

        res.send(user);
    });
}

exports.deleteUser = function(req, res, next) {
    User.findByIdAndRemove(req.params.id).exec(function(err, user) {
        if (err) next(err);

        res.sendStatus(200);
    });
}

exports.sendMessage = function(req, res, next) {
    let userId = req.body.userId;
    let message = req.body.message;

    new Promise((resolve, reject) => {
        User.findById(userId)
        .exec(function (err, user) {
            if (err) next(err)

            resolve(user);
        })
    })
    .then(function(user) {
        let pushMessage = {
            to: user.pushNotificationToken,
            sound: 'default',
            title: 'לאסיף העיר יש הודעה בשבילך!',
            body: message 
        }

        utils.sendPush([pushMessage]);

        res.send(200);
    })
}