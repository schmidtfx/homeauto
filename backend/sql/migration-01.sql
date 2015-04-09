CREATE TABLE sensors (
  id integer primary key autoincrement,
  sensor_type text,
  name text,
  location text
);

CREATE TABLE sensorstream (
  id integer primary key autoincrement,
  sensor_fk integer,
  time integer, 
  value_real real, 
  value_boolean boolean,
  foreign key (sensor_fk) references sensors
); 

INSERT INTO sensors (sensor_type, name, location) VALUES ('temperature', 'Temperature Livingroom', 'Livingroom');
INSERT INTO sensors (sensor_type, name, location) VALUES ('weatherdata', 'Weather Data', 'Rest');

INSERT INTO sensorstream (sensor_fk, time, value_real) SELECT 1, time, value FROM temperature;
