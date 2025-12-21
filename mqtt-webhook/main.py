from flask import Flask, request
import threading
import paho.mqtt.client as mqtt
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

MQTT_BROKER = os.environ.get("MQTT_BROKER", "")
MQTT_PORT = int(os.environ.get("MQTT_PORT", 8883))
MQTT_USERNAME = os.environ.get("MQTT_USERNAME", "")
MQTT_PASSWORD = os.environ.get("MQTT_PASSWORD", "")
MQTT_TOPIC_SUB = os.environ.get("MQTT_TOPIC_SUB", "")
WEBHOOK_URL = os.environ.get("WEBHOOK_URL", "")
MQTT_SECRET = os.environ.get("MQTT_SECRET", "")

client = mqtt.Client()
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
client.tls_set()

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker")
    client.subscribe(MQTT_TOPIC_SUB)
    print(f"Subscribed to {MQTT_TOPIC_SUB}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"Received MQTT: {payload}")
    try:
        requests.post(WEBHOOK_URL, json={"topic": msg.topic, "payload": payload})
        print("Forwarded to webhook")
    except Exception as e:
        print("Error sending webhook:", e)

client.on_connect = on_connect
client.on_message = on_message

def start_mqtt():
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_forever()

threading.Thread(target=start_mqtt).start()

@app.route("/publish", methods=["POST"])
def publish():
    data = request.get_json()
    topic = data.get("topic")
    message = data.get("payload")
    secret_key = data.get("secret_key")
    if(secret_key != MQTT_SECRET):
      return {"error": "Missing topic or payload"}, 400
    if not topic or not message:
        return {"error": "Missing topic or payload"}, 400
    client.publish(topic, message)
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
    