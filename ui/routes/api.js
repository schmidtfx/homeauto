var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/homeauto/backend/temp.db');

var getSensorStream = function(sensor_id, starttime, endtime, offset, limit, callback) {
  var filter = "WHERE sensor_fk = " + sensor_id;
  if(starttime && endtime) {
    filter += " AND time >= " + starttime + " AND time <= " + endtime;
  } else if(starttime) {
    filter += " AND time >= " + starttime;
  } else if(endtime) {
    filter += " AND time <= " + endtime;
  }

  var stmt = "SELECT * FROM sensorstream " + filter + " ORDER BY time";
  if(limit) {
    stmt += " LIMIT " + limit;
  }
  if(offset) {
    stmt += " OFFSET " + offset;
  }
  console.log(stmt);
  db.all(stmt, callback);
}

var getSensorStreamLatest = function(sensor_id, callback) {
  var stmt = "SELECT * FROM sensorstream WHERE sensor_fk = ? ORDER BY time DESC LIMIT 1";
  console.log(stmt);
  db.get(stmt, sensor_id, callback);
}

/* GET home page. */
router.get('/v1/temperature', function(req, res, next) {
  getSensorStream(1, req.query.starttime, req.query.endtime, null, null, function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/temperature/current', function(req, res, next) {
  getSensorStreamLatest(1, function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/sensorstream/:sid', function(req, res, next) {
  var sensor_id = req.params.sid;
  var starttime = req.query.starttime;
  var endtime = req.query.endtime;
  var offset = req.query.offset;
  var limit = req.query.limit;
  getSensorStream(sensor_id, starttime, endtime, offset, limit, function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/sensorstream/:sid/latest', function(req, res, next) {
  var sensor_id = req.params.sid;
  getSensorStreamLatest(sensor_id, function(err, rows) {
    res.send(rows);
  });
});

//router.get('/v1/sensorstream', function(req, res, next) {
//  res.send();
//});

module.exports = router;