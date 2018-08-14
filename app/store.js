const _ = require('lodash');
const loggedInVoluntarieesTokens = [];

let myIo;

exports.setIo = function(io) {
    myIo = io;
}

exports.getIo = function() {
    return myIo;
}


exports.registerVolunteerClientToken = function(token) {

    if (!loggedInVoluntarieesTokens.includes(token)) {
        loggedInVoluntarieesTokens.push(token);
        console.log("Added volunteer token " + token);
    }
}

exports.getRegisteredVolunteerClientsToken = function() {
    return loggedInVoluntarieesTokens;
}

// exports.store = {registerVolunteerClientToken, getRegisteredVolunteerClientsToken};