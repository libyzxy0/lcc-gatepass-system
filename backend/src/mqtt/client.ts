import mqtt, { IClientOptions } from 'mqtt';
import { MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD } from '@/secrets'

const options: IClientOptions = {
  host: MQTT_URL,
  port: 8883,
  protocol: 'mqtts',
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD
}

export const client = mqtt.connect(options);