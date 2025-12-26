import os
import json
import threading
import ssl
import logging
from datetime import datetime, UTC

import paho.mqtt.client as mqtt
import requests
from dotenv import load_dotenv
from colorama import Fore, Style, init

init(autoreset=True)

load_dotenv()

MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = int(os.getenv("MQTT_PORT", "8883"))
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
MQTT_SECRET = os.getenv("MQTT_SECRET")
DEV_MODE = os.getenv("DEV_MODE", "false").lower() == "true"

if not MQTT_SECRET:
    raise ValueError("MQTT_SECRET is required")

TOPICS = ["scan/qr", "scan/rfid"]
if DEV_MODE:
    TOPICS = [f"dev/{t}" for t in TOPICS]

class ColoredFormatter(logging.Formatter):
    LEVEL_COLORS = {
        logging.DEBUG: Fore.CYAN,
        logging.INFO: Fore.GREEN,
        logging.WARNING: Fore.YELLOW,
        logging.ERROR: Fore.RED,
        logging.CRITICAL: Fore.MAGENTA,
    }

    def format(self, record):
        color = self.LEVEL_COLORS.get(record.levelno, "")
        record.msg = f"{color}{record.msg}{Style.RESET_ALL}"
        return super().format(record)

handler = logging.StreamHandler()
formatter = ColoredFormatter("%(asctime)s [%(levelname)s] %(message)s")
handler.setFormatter(formatter)
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("Connected to MQTT broker")
        for topic in TOPICS:
            client.subscribe(topic)
            logger.info(f"Subscribed to: {topic}")
    else:
        logger.error(f"MQTT connection failed with code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
    except Exception:
        logger.warning("❌ Invalid JSON payload")
        return

    secret = payload.get("secret_key")
    if secret != MQTT_SECRET:
        logger.warning(f"❌ Invalid secret key from topic: {msg.topic}")
        return

    payload.pop("secret_key", None)
    payload["topic"] = msg.topic
    payload["received_at"] = payload.get('time')

    def post_webhook(data, topic):
        try:
            response = requests.post(WEBHOOK_URL, json=data, timeout=5)
            response.raise_for_status()
            client.publish(f"{topic}/response", response.text)
            logger.info(f"✅ Webhook response sent for topic: {topic}")
        except Exception as e:
            logger.error(f"Webhook error: {e}")

    threading.Thread(target=post_webhook, args=(payload, msg.topic), daemon=True).start()

def main():
    client = mqtt.Client() 
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set(cert_reqs=ssl.CERT_NONE)
    client.tls_insecure_set(True)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_forever()

if __name__ == "__main__":
    main()
