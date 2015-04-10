var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/homeauto/backend/temp.db');

/* GET home page. */
router.get('/v1/temperature', function(req, res, next) {
  var filter = "WHERE sensor_fk = 1";
  if(req.query.starttime && req.query.endtime) {
    filter += " AND time >= " + req.query.starttime + " AND time <= " + req.query.endtime;
  } else if(req.query.starttime) {
    filter += " AND time >= " + req.query.starttime;
  } else if(req.query.endtime) {
    filter += " AND time <= " + req.query.endtime;
  }

  var stmt = "SELECT * FROM sensorstream " + filter + " ORDER BY time";
  console.log(stmt)
  db.all(stmt, function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/temperature/current', function(req, res, next) {
  db.all("SELECT * FROM sensorstream WHERE sensor_fk = 1 ORDER BY time DESC LIMIT 1", function(err, rows) {
    res.send(rows);
  });
});

router.get('/v1/sensorstream/:id', function(req, res, next) {
  var sensor_id = req.params.id;
  console.log("sensor id: " + id)
});

module.exports = router;
