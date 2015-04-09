import urllib2

city="Dublin,ie"
url="http://api.openweathermap.org/data/2.5/weather?q=%s" % city

response = urllib2.urlopen(url).read()
print response


