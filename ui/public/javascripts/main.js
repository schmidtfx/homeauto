$(function() {
  console.log("page: " + current_page)
  if(current_page == "temperature") {
    withSelectedFilter();
    $("#refresh").click(withSelectedFilter);
    $("#filter").change(withSelectedFilter);
  } else if(current_page == "sensorstream") {
    $("#sensorstream").dataTable({
      "processing" : true,
      "serverSide" : true,
      "ajax" : "/api/v1/sensorstream/1/pagination"
    });
  }
});

var withSelectedFilter = function() {
  var val = $("#filter").find(":selected").val();
  if(val == "last24") {
    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    loaddata(yesterday.getTime(), null);
  } else if(val == "lastWeek") {
    var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 7));
    loaddata(yesterday.getTime(), null);
  } else {
    loaddata(null, null);
  }
}

var loaddata = function(starttime, endtime) {
  var url = "/api/v1/sensorstream/1"
  var params = $.param({ starttime: starttime, endtime: endtime })
  console.log(params)
  url = url + "?" + params
  $.getJSON(url, function(data) {
    data.forEach(function(d) {
      d.time = new Date(d.time);
    });

    var chart = c3.generate({
      bindto: '#tempChart',
      data: {
        json: data,
        keys: {
          x: 'time',
          value: ['value_real']
        },
        type: 'spline',
        colors: {
          value_real: '#33339F'
        },
        names: {
          value_real: "Temperature Livingroom"
        }
      },
      point: {
        show: false
      },
      axis: {
        x: {
          label: 'Time',
          type: 'timeseries',
          tick: {
            count: 10,
            format: '%Y-%m-%d %H:%M:%S'
          }
        },
        y: {
          tick: {
            format: d3.format('.2f')
          },
          label: 'Temperature °C'
        }
      },
      regions: [
        { axis: 'y', start: 20, end: 23.5, class: 'regionY' }
      ]
    });
  });

  $.getJSON("/api/v1/sensorstream/1/latest", function(d) {
    d.time = new Date(d.time);
    var now = new Date();
    var diff = ((now - d.time) / 1000).toFixed(0);
    $('#temp').text(d.value_real.toFixed(2));
    $('#time').text(dateFormat(d.time, "yyyy-mm-dd HH:MM:ss"));
    $('#ago').text(diff);
    if(d.value_real < 20) {
      $('#comfort').removeClass().addClass("label label-primary");
      $('#comfort').text("Too cold!");
    } else if(d.value_real >= 20 && d.value_real <= 23.5) {
      $('#comfort').removeClass().addClass("label label-success");
      $('#comfort').text("Comfy :)");
    } else {
      $('#comfort').removeClass().addClass("label label-danger");
      $('#comfort').text("Too warm!");
    }
  });
};

$.urlParams = function() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
