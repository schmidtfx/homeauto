import os
import glob
import time
import sqlite3
import json
from kafka import KafkaConsumer

conn = sqlite3.connect('temp.db')
c = conn.cursor()
c.execute('CREATE TABLE IF NOT EXISTS temperature (time integer, value real)')
conn.commit()

consumer = KafkaConsumer(
  "sensorstream",
  group_id = "persist",
  bootstrap_servers=["192.168.0.25:9092"],
  auto_commit_enable = True,
  auto_commit_interval_ms = 30 * 1000,
  auto_offset_reset = "largest")

for m in consumer:
  print m
  msg = json.loads(m.value)

  c.execute('INSERT INTO temperature VALUES (' + str(msg["time"]) + ', ' + str(msg["value"]) + ')')
  conn.commit()

  consumer.task_done(m)

consumer.commit()
