import mqtt from 'mqtt';

const options = {
    host: process.env.MQTT_URL,
    port: 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}

export const client = mqtt.connect(options);