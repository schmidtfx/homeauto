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

module.exports = router;
