/*
 * Together Analysis
 * Copyright 2016 Tony Tam @tabenren
 */

/*

Usage

e.g. express

var opts = {
    persistence: {
        url: 'mongodb://localhost:27017/analysis',
        mongo: {},
        reports: 'reports',
        logs:'logs'
    },
    ipdata : {
        city: './ipdata/GeoLite2-City.mmdb'
    }
};

app.use(analysis(opts));

*/ 

var _ = require('lodash');
var shortid = require('shortid');
var UAParser = require('ua-parser-js');
var moment = require('moment');
var extend = require("extend");
var mmdbreader = require('maxmind-db-reader');
var persistence = require('./persistence');

/**
 * Adds analysis methods to request object via express/connect middleware
 *
 * @method analysis
 * @param  {object}         options
 * @return {function}       middleware
 */

var analysis = function(options) {
    var that = this;
    options = options || {};
    var defaults = {
        persistence: {
            url: 'mongodb://localhost:27017/analysis',
            mongo: {},
            reports: 'reports',
            logs: 'logs'
        },
        ipdata : {
            city: './ipdata/GeoLite2-City.mmdb'
        }
    };

    _.defaults(options, defaults);

    persistenceFactory = persistence.getFactory('mongo');
    this.persistence = persistenceFactory(options.persistence,function(err){
    });

    console.log('\x1B[32mAnalysis middleware init\033[0m');

    return function(req, res, next) {

      var timestamp = Date.now();

      var parser = new UAParser();
      var ua = req.headers['user-agent']

      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      var referer = req.headers['referer'] || '';

      var reports = parser.setUA(ua).getResult();
      var logs = {timestamp: timestamp};
      var time = {fullday:moment().format('YYYYMMDD'),fulltime:moment().format('YYYYMMDDHHmmss'),timestamp:moment().format('X'),year:moment().format('YYYY'),quarter:moment().format('Q'),month:moment().format('MM'),day:moment().format('DD'),week:moment().format('WW'),dayofweek:moment().format('E'),hour:moment().format('HH'),minutes:moment().format('mm'),second:moment().format('ss')}

      reports.ip = ip;
      reports.referer = referer;
      reports.time = time;

      reports.id = shortid.generate();

      req.record = function(api,parameters){
          reports.api = logs.api = api;
          if(parameters){
              reports.extra = parameters;
              extend(logs, parameters);
          }

          var city = mmdbreader.openSync(options.ipdata.city);
          var ipresult = city.getGeoDataSync(ip);
          extend(reports, {ipdata: ipresult});

          that.persistence.store(reports, logs, function(err){
              //
          });
      }
      next();
    };
};

module.exports = analysis;