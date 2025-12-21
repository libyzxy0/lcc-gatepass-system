#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <HardwareSerial.h>

#define SS_PIN 5
#define RST_PIN 22

#define QR_RX 16
#define QR_TX 17

#define MAX_SCAN_LENGTH 128
#define CHAR_TIMEOUT 50

#define BUZZER_PIN 4

const char* ssid = "OrangeCat";
const char* password = "myorange32";
const char* SERVER_HOST = "api.lccgatepass.xyz";

MFRC522 rfid(SS_PIN, RST_PIN);
HardwareSerial QRScanner(2);

char qrBuffer[MAX_SCAN_LENGTH];
uint8_t qrIndex = 0;
unsigned long lastQrCharTime = 0;

const char* rootCACert = \
"-----BEGIN CERTIFICATE-----\n"
"MIIFBjCCAu6gAwIBAgIRAMISMktwqbSRcdxA9+KFJjwwDQYJKoZIhvcNAQELBQAw\n"
"TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\n"
"cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMjQwMzEzMDAwMDAw\n"
"WhcNMjcwMzEyMjM1OTU5WjAzMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3Mg\n"
"RW5jcnlwdDEMMAoGA1UEAxMDUjEyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\n"
"CgKCAQEA2pgodK2+lP474B7i5Ut1qywSf+2nAzJ+Npfs6DGPpRONC5kuHs0BUT1M\n"
"5ShuCVUxqqUiXXL0LQfCTUA83wEjuXg39RplMjTmhnGdBO+ECFu9AhqZ66YBAJpz\n"
"kG2Pogeg0JfT2kVhgTU9FPnEwF9q3AuWGrCf4yrqvSrWmMebcas7dA8827JgvlpL\n"
"Thjp2ypzXIlhZZ7+7Tymy05v5J75AEaz/xlNKmOzjmbGGIVwx1Blbzt05UiDDwhY\n"
"XS0jnV6j/ujbAKHS9OMZTfLuevYnnuXNnC2i8n+cF63vEzc50bTILEHWhsDp7CH4\n"
"WRt/uTp8n1wBnWIEwii9Cq08yhDsGwIDAQABo4H4MIH1MA4GA1UdDwEB/wQEAwIB\n"
"hjAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwEwEgYDVR0TAQH/BAgwBgEB\n"
"/wIBADAdBgNVHQ4EFgQUALUp8i2ObzHom0yteD763OkM0dIwHwYDVR0jBBgwFoAU\n"
"ebRZ5nu25eQBc4AIiMgaWPbpm24wMgYIKwYBBQUHAQEEJjAkMCIGCCsGAQUFBzAC\n"
"hhZodHRwOi8veDEuaS5sZW5jci5vcmcvMBMGA1UdIAQMMAowCAYGZ4EMAQIBMCcG\n"
"A1UdHwQgMB4wHKAaoBiGFmh0dHA6Ly94MS5jLmxlbmNyLm9yZy8wDQYJKoZIhvcN\n"
"AQELBQADggIBAI910AnPanZIZTKS3rVEyIV29BWEjAK/duuz8eL5boSoVpHhkkv3\n"
"4eoAeEiPdZLj5EZ7G2ArIK+gzhTlRQ1q4FKGpPPaFBSpqV/xbUb5UlAXQOnkHn3m\n"
"FVj+qYv87/WeY+Bm4sN3Ox8BhyaU7UAQ3LeZ7N1X01xxQe4wIAAE3JVLUCiHmZL+\n"
"qoCUtgYIFPgcg350QMUIWgxPXNGEncT921ne7nluI02V8pLUmClqXOsCwULw+PVO\n"
"ZCB7qOMxxMBoCUeL2Ll4oMpOSr5pJCpLN3tRA2s6P1KLs9TSrVhOk+7LX28NMUlI\n"
"usQ/nxLJID0RhAeFtPjyOCOscQBA53+NRjSCak7P4A5jX7ppmkcJECL+S0i3kXVU\n"
"y5Me5BbrU8973jZNv/ax6+ZK6TM8jWmimL6of6OrX7ZU6E2WqazzsFrLG3o2kySb\n"
"zlhSgJ81Cl4tv3SbYiYXnJExKQvzf83DYotox3f0fwv7xln1A2ZLplCb0O+l/AK0\n"
"YE0DS2FPxSAHi0iwMfW2nNHJrXcY3LLHD77gRgje4Eveubi2xxa+Nmk/hmhLdIET\n"
"iVDFanoCrMVIpQ59XWHkzdFmoHXHBV7oibVjGSO7ULSQ7MJ1Nz51phuDJSgAIU7A\n"
"0zrLnOrAj/dfrlEWRhCvAgbuwLZX1A2sjNjXoPOHbsPiy+lO1KF8/XY7\n"
"-----END CERTIFICATE-----\n";

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
class HttpUtil {
  private:
  const char* host;
  int port;
  bool debug;
  const char* rootCACert;

  public:
  HttpUtil(const char* _host, const char* _rootCACert, int _port = 443, bool _debug = true): host(_host),
  port(_port),
  rootCACert(_rootCACert),
  debug(_debug) {}

  String get(const String& path) {
    return request("GET", path, "");
  }

  String post(const String& path, const String& body, const String& contentType = "application/json") {
    return request("POST", path, body, contentType);
  }

  private:
  String request(const String& method, const String& path, const String& body = "", const String& contentType = "") {
    WiFiClientSecure client;
    client.setCACert(rootCACert);

    if (!client.connect(host, port)) {
      if (debug) Serial.printf("Connection to %s failed\n", host);
      return "";
    }

    client.printf("%s %s HTTP/1.1\r\n", method.c_str(), path.c_str());
    client.printf("Host: %s\r\n", host);
    if (method == "POST") {
      client.printf("Content-Type: %s\r\n", contentType.c_str());
      client.printf("Content-Length: %d\r\n", body.length());
    }
    client.print("Connection: close\r\n\r\n");

    if (method == "POST") client.print(body);

    String response;
    unsigned long timeout = millis();
    while (client.connected() && millis() - timeout < 5000) {
      while (client.available()) {
        response += char(client.read());
        timeout = millis();
      }
    }

    client.stop();

    int bodyIndex = response.indexOf("\r\n\r\n");
    String headers = (bodyIndex != -1) ? response.substring(0, bodyIndex): "";
    String responseBody = (bodyIndex != -1) ? response.substring(bodyIndex + 4): response;

    StaticJsonDocument < 512 > doc;
    DeserializationError error = deserializeJson(doc, responseBody);

    if (error) {
      if (debug) {
        Serial.println("HTTP Response Headers:");
        Serial.println(headers);
        Serial.println("HTTP Response Body:");
        Serial.println(responseBody);
        Serial.print("JSON Parse Error: ");
        Serial.println(error.c_str());
      }
      return "";
    }

    if (debug) {
      Serial.println("JSON Response:");
      Serial.println(responseBody);
    }
    return responseBody;
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
  while (QRScanner.available()) {
    char c = QRScanner.read();

    if (qrIndex < MAX_SCAN_LENGTH - 1) {
      qrBuffer[qrIndex++] = c;
    }

    lastQrCharTime = millis();
  }

  if (qrIndex > 0 && millis() - lastQrCharTime > CHAR_TIMEOUT) {
    qrBuffer[qrIndex] = '\0';
    qrOut = String(qrBuffer);
    qrIndex = 0;
    return true;
  }

  return false;
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  QRScanner.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
  ledcSetup(0, 1000, 8);
  ledcAttachPin(BUZZER_PIN, 0);
  Serial.println("Peripherals Ready");
  NotificationUtil::initializedTone();

  int wifiAttempts = 0;
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 5) {
    delay(500);
    wifiAttempts++;
    Serial.println("Connecting to WiFi...");
  }

  if (WiFi.status() == WL_CONNECTED) {
    NotificationUtil::readyTone();
    Serial.println("System Ready");
  } else {
    NotificationUtil::errorTone();
    Serial.println("Failed to connect to WiFi");
  }
}


void loop() {
  String uid;
  if (scanRfid(uid)) {
    Serial.print("Scanned RFID: ");
    Serial.println(uid);
    
    if(uid == "67993725") {
      NotificationUtil::successTone();
    } else {
      NotificationUtil::errorTone();
    }
    /*
    HttpUtil http(SERVER_HOST, rootCACert);
    String payload = JsonUtil::create()
    .add("rfid", uid)
    .add("apikey", "libypogi")
    .add("timestamp", "1766202447")
    .toString();
    String resPost = http.post("/api/v1/esp-api/rfid", payload);
    Serial.println("POST result:");
    Serial.println(resPost);
    if(resPost == "") {
      NotificationUtil::errorTone();
    } else {
      NotificationUtil::successTone();
      /*
      String status = JsonUtil::getString(resPost, "status");

      Serial.println("Parsed POST Response:");
      Serial.println("Status: " + status);
      */
   // }
  }

  String qr;
  if (scanQRCode(qr)) {
    Serial.print("Scanned QR: ");
    Serial.println(qr);
    NotificationUtil::successTone();
  }
}