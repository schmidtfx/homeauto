var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/homeauto/backend/temp.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Temperature', page: 'home' });
});

router.get('/temperature', function(req, res, next) {
  res.render('temperature', { title: 'Temperature', page: 'temperature' });
});

router.get('/api/v1/temperature', function(req, res, next) {
  var filter = "";
  if(req.query.starttime && req.query.endtime) {
    filter = "WHERE time >= " + req.query.starttime + " AND time <= " + req.query.endtime;
  } else if(req.query.starttime) {
    filter = "WHERE time >= " + req.query.starttime;
  } else if(req.query.endtime) {
    filter = "WHERE time <= " + req.query.endtime;
  }

  var stmt = "SELECT * FROM sensorstream " + filter + " ORDER BY time";
  db.all(stmt, function(err, rows) {
    res.send(rows);
  });
});

router.get('/api/v1/temperature/current', function(req, res, next) {
  db.all("SELECT * FROM sensorstream ORDER BY time DESC LIMIT 1", function(err, rows) {
    res.send(rows);
  });
});

module.exports = router;
