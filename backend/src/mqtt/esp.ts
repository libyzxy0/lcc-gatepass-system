import { client } from '@/mqtt/client';

client.on('connect', function () {
    console.log('Connected to MQTT Broker!');
});

client.on('error', function (error) {
    console.log("MQTT Error Something went wrong:", error);
});

client.subscribe('test/topic');

client.on('message', function (topic, message) {
    console.log('Received message:', topic, message.toString());
});