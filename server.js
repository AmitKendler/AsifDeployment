'use strict';

/*
 * nodejs-express-mongoose
 * Copyright(c) 2015 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const store = require("./app/store");

store.setIo(io);

io.on('connection', function(socket) {
    console.log('a user connected');
});


// const connection = connect();
// const connection = mongoose.createConnection(config.db);
/**
 * Expose
 */

module.exports = {
    app,
    // connection
};

// Bootstrap models
fs.readdirSync(models)
    .filter(file => ~file.indexOf('.js'))
    .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/express')(app);
require('./config/routes')(app);


// connection
//   .on('error', console.log)
//   .on('disconnected', connect)
//   .once('open', listen);

var options = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect("mongodb://asif-user:1q2w3e4r5t@ds111299.mlab.com:11299/asif-db", options).then(
    listen,
    console.log
);

function listen() {
    if (app.get('env') === 'test') return;
    server.listen(port);
    console.log('Express app started on port ' + port);
}

// function connect () {
//   var options = { server: { socketOptions: { keepAlive: 1 } } };
//   var connection = mongoose.connect(config.db, options).connection;
//   return connection;
// }