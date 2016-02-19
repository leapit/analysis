/*
 * Together Analysis
 * Copyright 2016 Tony Tam @tabenren
 */

var AbstractPersistence = require("./abstract");
var mongo = require('mongodb');
var async = require('async');
var MongoClient = mongo.MongoClient;
var util = require("util");
var extend = require("extend");

function MongoPersistence(options, done) {
    if (!(this instanceof MongoPersistence)) {
        return new MongoPersistence(options, done);
    }

    this.options = extend({}, options);
    this.options.mongo.safe = true;

    var that = this;

    var connected = function(err, db) {
        this.db = db;
        if (err) {
            if (done) {
                return done(err);
            }
            throw err;
        }
        that.reportsCollection = this.db.collection(that.options.reports);
        that.logsCollection = this.db.collection(that.options.logs);
        return done(null);
    };

    // Connect to the db
    if (options.connection) {
        connected(null, this.options.connection);
    } else {
        MongoClient.connect(this.options.url, this.options.mongo, connected);
    }
}
util.inherits(MongoPersistence, AbstractPersistence);

MongoPersistence.prototype.record = function(packet, log, cb) {
    var that = this;
    async.parallel({
        file: function(callback) {
            that.reportsCollection.insert(packet, function(err, result) {
                if (err) {
                    callback(err);
                }else{
                    callback(null, result);
                }
            });
        }, 
        log: function(callback) {
            that.logsCollection.insert(log, function(err, result) {
                if (err) {
                    callback(err);
                }else{
                    callback(null, result);
                }
            });
        }
    }, function (err, results) {
        cb(err);
    });
};

module.exports = MongoPersistence;
