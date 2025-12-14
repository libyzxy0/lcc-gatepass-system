#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 22

const char* ssid = "OrangeCat";
const char* password = "myorange32";

const char* host = "api.lccgatepass.xyz";
const int httpsPort = 443;

const char* base_url = "/api/v1/esp-api";
const char* apikey = "2b22d2e2-2450-4c12-bd49-6a30f98552b1";

const char* root_ca = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFBTCCAu2gAwIBAgIQWgDyEtjUtIDzkkFX6imDBTANBgkqhkiG9w0BAQsFADBP
MQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFy
Y2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMTAeFw0yNDAzMTMwMDAwMDBa
Fw0yNzAzMTIyMzU5NTlaMDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBF
bmNyeXB0MQwwCgYDVQQDEwNSMTMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQClZ3CN0FaBZBUXYc25BtStGZCMJlA3mBZjklTb2cyEBZPs0+wIG6BgUUNI
fSvHSJaetC3ancgnO1ehn6vw1g7UDjDKb5ux0daknTI+WE41b0VYaHEX/D7YXYKg
L7JRbLAaXbhZzjVlyIuhrxA3/+OcXcJJFzT/jCuLjfC8cSyTDB0FxLrHzarJXnzR
yQH3nAP2/Apd9Np75tt2QnDr9E0i2gB3b9bJXxf92nUupVcM9upctuBzpWjPoXTi
dYJ+EJ/B9aLrAek4sQpEzNPCifVJNYIKNLMc6YjCR06CDgo28EdPivEpBHXazeGa
XP9enZiVuppD0EqiFwUBBDDTMrOPAgMBAAGjgfgwgfUwDgYDVR0PAQH/BAQDAgGG
MB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATASBgNVHRMBAf8ECDAGAQH/
AgEAMB0GA1UdDgQWBBTnq58PLDOgU9NeT3jIsoQOO9aSMzAfBgNVHSMEGDAWgBR5
tFnme7bl5AFzgAiIyBpY9umbbjAyBggrBgEFBQcBAQQmMCQwIgYIKwYBBQUHMAKG
Fmh0dHA6Ly94MS5pLmxlbmNyLm9yZy8wEwYDVR0gBAwwCjAIBgZngQwBAgEwJwYD
VR0fBCAwHjAcoBqgGIYWaHR0cDovL3gxLmMubGVuY3Iub3JnLzANBgkqhkiG9w0B
AQsFAAOCAgEAUTdYUqEimzW7TbrOypLqCfL7VOwYf/Q79OH5cHLCZeggfQhDconl
k7Kgh8b0vi+/XuWu7CN8n/UPeg1vo3G+taXirrytthQinAHGwc/UdbOygJa9zuBc
VyqoH3CXTXDInT+8a+c3aEVMJ2St+pSn4ed+WkDp8ijsijvEyFwE47hulW0Ltzjg
9fOV5Pmrg/zxWbRuL+k0DBDHEJennCsAen7c35Pmx7jpmJ/HtgRhcnz0yjSBvyIw
6L1QIupkCv2SBODT/xDD3gfQQyKv6roV4G2EhfEyAsWpmojxjCUCGiyg97FvDtm/
NK2LSc9lybKxB73I2+P2G3CaWpvvpAiHCVu30jW8GCxKdfhsXtnIy2imskQqVZ2m
0Pmxobb28Tucr7xBK7CtwvPrb79os7u2XP3O5f9b/H66GNyRrglRXlrYjI1oGYL/
f4I1n/Sgusda6WvA6C190kxjU15Y12mHU4+BxyR9cx2hhGS9fAjMZKJss28qxvz6
Axu4CaDmRNZpK/pQrXF17yXCXkmEWgvSOEZy6Z9pcbLIVEGckV/iVeq0AOo2pkg9
p4QRIy0tK2diRENLSF2KysFwbY6B26BFeFs3v1sYVRhFW9nLkOrQVporCS0KyZmf
wVD89qSTlnctLcZnIavjKsKUu1nA1iU0yYMdYepKR7lWbnwhdx3ewok=
-----END CERTIFICATE-----
)EOF";

typedef void (*RfidScanCallback)(byte *uid, byte uidSize);

MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClientSecure client;

bool scanRfidUID(MFRC522 &rfid, String &uidOut) {
  if (!rfid.PICC_IsNewCardPresent()) return false;
  if (!rfid.PICC_ReadCardSerial()) return false;

  uidOut = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uidOut += "0";
    uidOut += String(rfid.uid.uidByte[i], HEX);
  }

  uidOut.toUpperCase();
  rfid.PICC_HaltA();
  return true;
}


void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");

  client.setCACert(root_ca);
}

void loop() {
  String uid;
  StaticJsonDocument<200> response;
  StaticJsonDocument<200> payload;
  
  if (scanRfidUID(rfid, uid)) {
    Serial.println("Scanned UID: " + uid);
    payload["apikey"] = apikey;
    payload["rfid_code"] = uid;
    payload["timestamp"] = 1765712989;

    if (http_post("/rfid", payload, response)) {
      serializeJsonPretty(response, Serial);
      Serial.println();
    }
  }
  
  /*

  String endpoint = String("/config?apikey=") + apikey;
  if (http_get(endpoint.c_str(), response)) {
    serializeJsonPretty(response, Serial);
    Serial.println();
  }
  */
}


bool http_get(const char* endpoint, JsonDocument& doc) {
  if (!client.connect(host, httpsPort)) {
    Serial.println("Connection failed!");
    return false;
  }

  client.print(String("GET ") + base_url + endpoint + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  String payload = client.readString();
  if (deserializeJson(doc, payload) != DeserializationError::Ok) {
    Serial.println("Failed to parse JSON!");
    return false;
  }
  return true;
}

bool http_post(const char* endpoint, JsonDocument& body, JsonDocument& response) {
  if (!client.connect(host, httpsPort)) {
    Serial.println("Connection failed!");
    return false;
  }

  String bodyStr;
  serializeJson(body, bodyStr);

  client.print(String("POST ") + base_url + endpoint + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Content-Type: application/json\r\n" +
               "Content-Length: " + bodyStr.length() + "\r\n" +
               "Connection: close\r\n\r\n" +
               bodyStr);

  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  String payload = client.readString();
  if (deserializeJson(response, payload) != DeserializationError::Ok) {
    Serial.println("Failed to parse JSON!");
    return false;
  }
  return true;
}