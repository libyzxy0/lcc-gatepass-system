import { expect, test, describe } from "vitest";
import axios from 'axios';
import { MQTT_BRIDGE } from '@/secrets'

const checkMQTT = async () => {
  try {
    const { data } = await axios.post(`${MQTT_BRIDGE}/publish`, {
      topic: 'esp32/topic',
      payload: 'Server is testing MQTT Availability!'
    }, {
      timeout: 5000
    });

    return data.status === 'ok';
  } catch (error) {
    return false;
  }
}

describe('MQTT Bridge', () => {
  test("publishes message successfully", async () => {
    const working = await checkMQTT();
    expect(working).toBe(true);
  });
});