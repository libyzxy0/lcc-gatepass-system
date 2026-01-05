#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define BUZZER_CHANNEL 0
#define BUZZER_RESOLUTION 8
#define BUZZER_DUTY 255

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

#define BUZZER_PIN 5

/* Choose which server to communicate with, production(true) or development(false) */
bool PRODUCTION = false;

/* ——————————————————————————————— */

/*
* WiFi Configurations (Important)
* @ssid - WiFi SSID;
* @password - WiFi Password;
*/
const char* ssid = "OrangeCat";
const char* password = "myorange32";

/* ——————————————————————————————— */

/* Server Authorization Configuration */
const char* SECRET_KEY = "79408c3e-6c50-4fb0-98cb-98db70596411";

/* ——————————————————————————————— */

/* MQTT HiveMQ Configuration 
* Please dont take screenshots/pictures at this part, as it may cause security issues!
*/
const char* mqtt_server   = "37638f32d99b49fa968d88c783e2b03a.s1.eu.hivemq.cloud";
const int   mqtt_port     = 8883;
const char* mqtt_user     = "libyzxy0";
const char* mqtt_password = "Libyzxy0@123_esp32";
const char* client_id     = "esp_gate01";

/* ——————————————————————————————— */

/* SSL Certificate Issued by Let's Encrypt */
const char* ca_cert = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";

/* ——————————————————————————————— */

/* Library Configurations */
WiFiClientSecure secureClient;
PubSubClient mqtt(secureClient);

/* ——————————————————————————————— */

/* Utility Functions */
void buzzerTone(uint32_t freq) {
  if (freq == 0) {
    digitalWrite(BUZZER_PIN, LOW);
    return;
  }

  uint32_t periodUs = 1000000UL / freq;
  uint32_t halfPeriod = periodUs / 2;

  unsigned long start = millis();
  while (millis() - start < 120) {
    digitalWrite(BUZZER_PIN, HIGH);
    delayMicroseconds(halfPeriod);
    digitalWrite(BUZZER_PIN, LOW);
    delayMicroseconds(halfPeriod);
  }
}

class JsonUtil {
  public:
  class Builder {
    private:
    StaticJsonDocument < 512 > doc;
    public:
    Builder& add(const char* key, const char* value) {
      doc[key] = value;
      return *this;
    }
    Builder& add(const char* key, int value) {
      doc[key] = value;
      return *this;
    }
    Builder& add(const char* key, float value) {
      doc[key] = value;
      return *this;
    }
    Builder& add(const char* key, bool value) {
      doc[key] = value;
      return *this;
    }
    String toString() {
      String output;
      serializeJson(doc, output);
      return output;
    }
  };

  static Builder create() {
    return Builder();
  }

  static String getString(const String& json, const char* key) {
    StaticJsonDocument < 512 > doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) return "";
    if (!doc.containsKey(key)) return "";
    return String(doc[key].as < const char*>());
  }

  static int getInt(const String& json, const char* key) {
    StaticJsonDocument < 512 > doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) return 0;
    if (!doc.containsKey(key)) return 0;
    return doc[key].as < int > ();
  }

  static bool getBool(const String& json, const char* key) {
    StaticJsonDocument < 512 > doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) return false;
    if (!doc.containsKey(key)) return false;
    return doc[key].as < bool > ();
  }

  static float getFloat(const String& json, const char* key) {
    StaticJsonDocument < 512 > doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) return 0.0;
    if (!doc.containsKey(key)) return 0.0;
    return doc[key].as < float > ();
  }
};
class NotificationUtil {
public:
  static void successTone () {
    buzzerTone(880);
    delay(150);
    buzzerTone(0);
    delay(50);
    buzzerTone(988);
    delay(150);
    buzzerTone(0);
  }

  static void errorTone() {
    buzzerTone(220);
    delay(400);
    buzzerTone(0);
  }

  static void readyTone() {
    buzzerTone(523);
    delay(100);
    buzzerTone(659);
    delay(100);
    buzzerTone(0);
  }

  static void initializedTone() {
    buzzerTone(1319);
    delay(100);
    buzzerTone(1568);
    delay(100);
    buzzerTone(1760);
    delay(100);
    buzzerTone(0);
  }
};

/* ——————————————————————————————— */

/* Setup Functions */
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
}

void connectMQTT() {
  while (!mqtt.connected()) {
    Serial.print("Connecting to MQTT...");

    if (mqtt.connect(client_id, mqtt_user, mqtt_password)) {
      Serial.println("connected");
      mqtt.subscribe("#");
      NotificationUtil::readyTone();
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqtt.state());
      Serial.println(" retrying in 5 seconds");
      NotificationUtil::errorTone();
      delay(5000);
    }
  }
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  display.clearDisplay();
  Serial.print("Message [");
  Serial.print(topic);
  Serial.print("]: ");
  
  display.setCursor(0,0);
  display.print("Message [");
  display.print(topic);
  display.print("]: ");

  for (unsigned int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    display.print((char)payload[i]);
  }
  Serial.println();
  display.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
  Serial.println("Peripherals Ready");
  NotificationUtil::readyTone();
  if(!display.begin(0x3C, false)) {
    Serial.println("OLED init failed");
    while(1);
  }
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);
  display.setCursor(0,0);
  display.println("Connecting to WiFi...");
  display.display();

  connectWiFi();
  if(WiFi.status() == WL_CONNECTED) {
    NotificationUtil::readyTone();
  } else {
    NotificationUtil::errorTone();
  }
  Serial.println("WiFi Ready");
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("WiFi Ready");
  display.display();

  secureClient.setCACert(ca_cert);
  mqtt.setServer(mqtt_server, mqtt_port);
  mqtt.setCallback(mqtt_callback);
  mqtt.setBufferSize(512);
  
  connectMQTT();
  Serial.println("MQTT Connected!");
  Serial.println("Device Ready, See Configs:");
  Serial.println("[=========================]");
  Serial.print("ENVIRONMENT: ");
  Serial.println(PRODUCTION ? "PRODUCTION" : "DEVELOPMENT");
  Serial.print("WIFI CRED: ");
  Serial.println(String(ssid) + ":" + String(password));
  Serial.print("SECRET KEY: ");
  Serial.println(SECRET_KEY);
  
  Serial.println("[=========================]");
  NotificationUtil::initializedTone();
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Setup Finished, connected to MQTT");
  display.display();
}

/* ——————————————————————————————— */

/* Main Functions */
void loop() {
  if (!mqtt.connected()) {
    connectMQTT();
  }
  
  mqtt.loop();
}