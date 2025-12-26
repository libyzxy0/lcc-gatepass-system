#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <HardwareSerial.h>
#include <time.h>

#define SS_PIN 5
#define RST_PIN 22

#define QR_RX 16
#define QR_TX 17

#define MAX_SCAN_LENGTH 512

#define BUZZER_PIN 4

const char* ssid = "Strawberry";
const char* password = "pogiko123";

const char* ntpServer = "pool.ntp.org";
const char* time_zone = "PST-8";

const char* mqtt_server   = "37638f32d99b49fa968d88c783e2b03a.s1.eu.hivemq.cloud";
const int   mqtt_port     = 8883;
const char* mqtt_user     = "libyzxy0";
const char* mqtt_password = "Libyzxy0@123_esp32";
const char* client_id     = "esp_gate01";

bool PRODUCTION = false;
bool SCANNING = false;

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

WiFiClientSecure secureClient;
PubSubClient mqtt(secureClient);
MFRC522 rfid(SS_PIN, RST_PIN);
HardwareSerial QRScanner(2);

char qrBuffer[MAX_SCAN_LENGTH];
uint8_t qrIndex = 0;
unsigned long lastQrCharTime = 0;

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
    ledcWriteTone(0, 880);
    ledcWrite(0, 204);
    delay(150);
    ledcWriteTone(0, 0);
    delay(50);
    ledcWriteTone(0, 988);
    delay(150);
    ledcWriteTone(0, 0);
  }
  static void errorTone() {
    ledcWriteTone(0, 220);
    ledcWrite(0, 204);
    delay(400);
    ledcWriteTone(0, 0);
  }
  static void readyTone() {
    ledcWriteTone(0, 523);
    ledcWrite(0, 204);
    delay(100);
    ledcWriteTone(0, 659);
    ledcWrite(0, 204);
    delay(100);
    ledcWriteTone(0, 0);
  }
  static void initializedTone() {
    ledcWriteTone(0, 1319);
    ledcWrite(0, 204);
    delay(100);
    ledcWriteTone(0, 1568);
    ledcWrite(0, 204);
    delay(100);
    ledcWriteTone(0, 1760);
    ledcWrite(0, 204);
    delay(100);
    ledcWriteTone(0, 0);
  }
};

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
      mqtt.subscribe("dev/scan/#");
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

bool scanRfid(String &uidOut) {
  if (!rfid.PICC_IsNewCardPresent()) return false;
  if (!rfid.PICC_ReadCardSerial()) return false;
  uidOut = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uidOut += '0';
    uidOut += String(rfid.uid.uidByte[i], HEX);
  }
  uidOut.toUpperCase();
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  return true;
}

bool scanQRCode(String &qrOut) {
    static String barcode = "";
    while (QRScanner.available()) {
        char c = QRScanner.read();
        if (c == '\n' || c == '\r') { 
            if (barcode.length() > 0) {
                qrOut = barcode;
                barcode = ""; 
                return true; 
            }
        } else {
            Serial.print(c); 
            barcode += c;
        }
    }

    return false; 
}

void setup_time() {
  configTime(28800, 0, ntpServer);
  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 24 * 3600) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("\nTime synchronized.");
}

void getISOTime(char* buffer, size_t bufferSize) {
  time_t now = time(nullptr);
  struct tm timeinfo;
  localtime_r(&now, &timeinfo);

  strftime(buffer, bufferSize, "%Y-%m-%dT%H:%M:%S+08:00", &timeinfo);
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message [");
  Serial.print(topic);
  Serial.print("]: ");

  for (unsigned int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  QRScanner.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
  ledcSetup(0, 1000, 8);
  ledcAttachPin(BUZZER_PIN, 0);
  Serial.println("Peripherals Ready");
  NotificationUtil::readyTone();

  connectWiFi();
  setup_time();
  if(WiFi.status() == WL_CONNECTED) {
    NotificationUtil::readyTone();
  } else {
    NotificationUtil::errorTone();
  }
  Serial.println("WiFi and Time Ready");

  secureClient.setCACert(ca_cert);
  mqtt.setServer(mqtt_server, mqtt_port);
  mqtt.setCallback(mqtt_callback);
  mqtt.setBufferSize(512);
  
  connectMQTT();
  Serial.println("MQTT Connected!");
  delay(500);
  Serial.println("Device Ready");
  NotificationUtil::initializedTone();
}


void loop() {
  if (!mqtt.connected()) {
    connectMQTT();
  }
  
  char isoTime[40];
  getISOTime(isoTime, sizeof(isoTime));
  
  mqtt.loop();
  
  String uid;
  if (scanRfid(uid) && !SCANNING) {
    SCANNING = true;
    Serial.print("Scanned RFID: ");
    Serial.println(uid);
    
    String payload = JsonUtil::create()
    .add("action", "SCAN_RFID")
    .add("data", uid.c_str())
    .add("secret_key", "8d70ccda-2e57-416b-94db-8b24136fb27b")
    .add("time", isoTime)
    .toString();
    
    if (mqtt.publish(PRODUCTION ? "scan/rfid" : "dev/scan/rfid", payload.c_str())) {
      Serial.println("Message published successfully");
      NotificationUtil::successTone();
    } else {
      Serial.println("Message publish FAILED");
      NotificationUtil::errorTone();
    }
  }

  String qr_data;
  if (scanQRCode(qr_data) && !SCANNING) {
    SCANNING = true;
    Serial.print("Scanned QR: ");
    Serial.println(qr_data);
    
    String payload = JsonUtil::create()
    .add("action", "SCAN_QR")
    .add("data", qr_data.c_str())
    .add("secret_key", "8d70ccda-2e57-416b-94db-8b24136fb27b")
    .add("time", isoTime)
    .toString();
    
    if (mqtt.publish(PRODUCTION ? "scan/qr" : "dev/scan/qr", payload.c_str())) {
      Serial.println("Message published successfully");
      NotificationUtil::successTone();
    } else {
      Serial.println("Message publish FAILED");
      NotificationUtil::errorTone();
    }
  }
}