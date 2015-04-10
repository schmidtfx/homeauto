import urllib2
import ConfigParser
import json
import time

from kafka import SimpleProducer, KafkaClient

config = ConfigParser.ConfigParser()
config.readfp(open('weather.cfg'))

city=config.get("Sensor", "query")
address=config.get("Sensor", "url")
url="%s?%s" % (address, city)
print url

sensor_id = str(config.get("Sensor", "id"))
freq = int(config.get("Sensor", "freq"))

print "Sensor id: %s - sampling frequency: %d" % (sensor_id, freq)

kafka = KafkaClient("192.168.0.25:9092")
producer = SimpleProducer(kafka)

while True:
  weather_data = json.loads(urllib2.urlopen(url).read())
  temperature = weather_data["main"]["temp"]

  msg = {
    "sensor" : {
      "id" : sensor_id
    },
    "time" : int(time.time() * 1000),
    "value" : temperature - 273.15
  }

  producer.send_messages("sensorstream", json.dumps(msg))

  print msg
  time.sleep(freq)
