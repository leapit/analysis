/*
 * Together Analysis
 * Copyright 2016 Tony Tam @tabenren
 */

var util = require("util");

function AbstractPersistence() {
}

AbstractPersistence.prototype.store = function(packet, log, cb) {
    var done = function() {
        if (cb) {
            cb();
        }
    };
    this.record(packet, log, done);
};

module.exports = AbstractPersistence;