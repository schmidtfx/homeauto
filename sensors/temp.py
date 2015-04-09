import os
import glob
import time
import json
import ConfigParser

from kafka import SimpleProducer, KafkaClient

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

def read_temp_raw():
  f = open(device_file, 'r')
  lines = f.readlines()
  f.close()
  return lines

def read_temp():
  lines = read_temp_raw()
  while lines[0].strip()[-3:] != 'YES':
    time.sleep(0.2)
    lines = read_temp_raw()
  equals_pos = lines[1].find('t=')
  if equals_pos != -1:
    temp_string = lines[1][equals_pos+2:]
    temp_c = float(temp_string) / 1000.0
    temp_f = temp_c * 9.0 / 5.0 + 32.0
    return temp_c, temp_f


kafka = KafkaClient("192.168.0.25:9092")
producer = SimpleProducer(kafka)

config = ConfigParser.ConfigParser()
config.readfp(open('temp.cfg'))
sensor_id = str(config.get("Sensor", "id"))
freq = int(config.get("Sensor", "freq"))

print "Sensor id: %s - sampling frequency: %d" % (sensor_id, freq)

while True:
  temp_c, temp_f = read_temp()
  msg = {
    "sensor" : {
      "id" : sensor_id
    },
    "time" : int(time.time() * 1000),
    "value" : temp_c
  }

  producer.send_messages("sensorstream", json.dumps(msg))

  print temp_c
  time.sleep(freq)
