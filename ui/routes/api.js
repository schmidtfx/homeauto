var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/homeauto/backend/temp.db');

var getSensorStream = function(sensor_id, starttime, endtime, callback) {
  var filter = "WHERE sensor_fk = " + sensor_id;
  if(starttime && endtime) {
    filter += " AND time >= " + starttime + " AND time <= " + endtime;
  } else if(starttime) {
    filter += " AND time >= " + starttime;
  } else if(endtime) {
    filter += " AND time <= " + endtime;
  }

  var stmt = "SELECT * FROM sensorstream " + filter + " ORDER BY time";
  console.log(stmt)
  db.all(stmt, callback);
}

/* GET home page. */
router.get('/v1/temperature', function(req, res, next) {
  getSensorStream(1, req.query.starttime, req.query.endtime, function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/temperature/current', function(req, res, next) {
  db.all("SELECT * FROM sensorstream WHERE sensor_fk = 1 ORDER BY time DESC LIMIT 1", function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/sensorstream/:sid', function(req, res, next) {
  var sensor_id = req.params.sid;
  getSensorStream(sensor_id, req.query.starttime, req.query.endtime, function(err, rows) {
    res.send(rows);
  });
});

module.exports = router;
