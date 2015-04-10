$(function() {
  console.log("page: " + current_page);
  initPage(current_page);
});

var initPage = function(page) {
  if(page == "temperature") {
    initTemperaturePage(page);
  } else if(page == "sensorstream") {
    initSensorStreamPage(page);
  }
}
