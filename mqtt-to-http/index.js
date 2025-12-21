import 'dotenv/config'

import express from 'express';
import axios from 'axios';
import { client } from './mqtt.js';

const BASE_URL = process.env.BASE_URL;
const app = express();

client.subscribe('test/topic');

const sendEvent = async (event) => {
  try {
    await axios.post(`${BASE_URL}/esp-api/event`, event);
  } catch (error) {
    console.error('Failed to send event to the server!');
  }
}

client.on('connect', async () => {
  await sendEvent({
    type: 'connect',
    message: 'Connected to mqtt broker!'
  })
  console.log("Connected to mqtt broker!");
});

client.on('error', async (error) => {
  await sendEvent({
    type: 'error',
    error
  })
  console.log(error)
});

client.on('message', async (topic, message) => {
  sendEvent({
    type: 'message',
    topic,
    message: message.toString()
  })
});

app.post('/api/publish', (req, res) => {
  const { topic, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Please specify what message to publish' });
  if (!topic) return res.status(400).json({ error: 'Please specify where topic to publish' });

  client.publish(topic, message);
  res.status(200).json({ message: 'Message sent? I hope(:' });
});

app.listen(8080, () => console.log('App is listinenng on port 8080!'));