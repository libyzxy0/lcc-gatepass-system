import { expect, test } from "vitest";
import axios from 'axios';
import { MQTT_BRIDGE } from '@/secrets'

const checkAPI = async () => {
  try {
    const { data } = await axios.post(`${MQTT_BRIDGE}/publish`, {
      topic: 'esp32/topic',
      payload: 'Server is testing MQTT Availability!'
    });
    if (data.message) return data.message;
  } catch (error) {
    return null;
  }
}

test("Check MQTT Webhook Helper Availability", async () => {
  const res = await checkAPI();
  expect(res).toBeDefined();
});
