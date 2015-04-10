import urllib2
import ConfigParser

config = ConfigParser.ConfigParser()
config.readfp(open('weather.cfg'))

city=config.get("Sensor", "query")
address=config.get("Sensor", "url")
url="%s?%s" % (address, city)
print url

response = urllib2.urlopen(url).read()
print response


