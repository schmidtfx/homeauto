var express = require('express');
var router = express.Router();
var revision = require('git-rev');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/home/pi/homeauto/backend/temp.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  revision.short(function(short)) {
    res.render('index', { title: 'Temperature', page: 'home' , commit: short });
  });
});

router.get('/temperature', function(req, res, next) {
  revision.short(function(short)) {
    res.render('temperature', { title: 'Temperature', page: 'temperature', commit: short });
  });
});

router.get('/sensorstream', function(req, res, next) {
  revision.short(function(short)) {
    res.render('sensorstream', { title: 'Sensorstream', page: 'sensorstream', commit: short });
  });
});

module.exports = router;
