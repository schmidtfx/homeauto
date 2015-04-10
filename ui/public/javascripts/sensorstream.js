var initSensorStreamPage = function(page) {
  $("#sensorstream").dataTable({
    "iDisplayLength" : 100,
    "processing" : true,
    "serverSide" : true,
    "ajax" : "/api/v1/sensorstream/1/pagination",
    "columns" : [
      {
        "data" : "time",
        "render" : function(data, type, row) {
          if(type == 'display') {
            var d = new Date(data);
            return d;
          }
          return data;
        }
      },
      {
        "data" : "value_real",
        "render" : function(data, type, row) {
          if(type == 'display') {
            return data + " &deg;C"
          }
          return data;
        }
      }
    ],
    "searching" : false,
    "ordering" : false
  });
}
