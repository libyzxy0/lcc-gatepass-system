#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

const char* ssid = "OrangeCat";
const char* password = "myorange32";

const char* host = "api.lccgatepass.xyz";
const int httpsPort = 443;

const char* base_url = "/api/v1/esp-api";
const char* apikey = "2b22d2e2-2450-4c12-bd49-6a30f98552b1";

const char* root_ca = R"EOF(-----BEGIN CERTIFICATE-----
MIIFDDCCA/SgAwIBAgISBYeK0LLemrp50O465YGTWHvYMA0GCSqGSIb3DQEBCwUA
MDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQD
EwNSMTMwHhcNMjUxMjA3MDg1OTAzWhcNMjYwMzA3MDg1OTAyWjAeMRwwGgYDVQQD
ExNhcGkubGNjZ2F0ZXBhc3MueHl6MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA3PhieBpsnaQu0Ag8NPHOZGJrrLvoukVAFXys5bAH6SRbtZFgN8L672J+
JmFHqWIhjN/wy6+IAdHL90AVhVj39RPH3cpJEHu/gSYiSahCRNppjyAMgd2CwQTu
HA+HmapJjBcVEucBRDc968W+ngGzfjVgzS6iDkAycR1pmLDi15kWMKTq5LRubMFL
9MNtvlWHf5J6OYyh9/j4qbJ7n6ZtOT8Y6zDHDAjGH0QEJKRsnWy5byF0Lx9TH+nL
LDLuWwgtOtaRARqEAZpeSf85lmmyhhLG4vNVP0pHLsXTicckoO5aC1svzxfrBO4v
Mj9unoWTVPHJSrsH2hBhy/0rtyXVgwIDAQABo4ICLTCCAikwDgYDVR0PAQH/BAQD
AgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAA
MB0GA1UdDgQWBBROnFoTRlXaMKcBXFMEqVU4kD66KjAfBgNVHSMEGDAWgBTnq58P
LDOgU9NeT3jIsoQOO9aSMzAzBggrBgEFBQcBAQQnMCUwIwYIKwYBBQUHMAKGF2h0
dHA6Ly9yMTMuaS5sZW5jci5vcmcvMB4GA1UdEQQXMBWCE2FwaS5sY2NnYXRlcGFz
cy54eXowEwYDVR0gBAwwCjAIBgZngQwBAgEwLgYDVR0fBCcwJTAjoCGgH4YdaHR0
cDovL3IxMy5jLmxlbmNyLm9yZy84OS5jcmwwggEOBgorBgEEAdZ5AgQCBIH/BIH8
APoAdwBkEcRspBLsp4kcogIuALyrTygH1B41J6vq/tUDyX3N8AAAAZr4PsJMAAAE
AwBIMEYCIQCX2FoQBeyC+QhtgMXoLRdi4PKMnLHfO+2B21f4mdPZ9gIhAPNxm29x
bde6f6ZjT7Yw3TUPDo228dsNxLmpvskM4clTAH8A4yON8o2iiOCq4Kzw+pDJhfC2
v/XSpSewAfwcRFjEtugAAAGa+D7EuwAIAAAFACmaNLkEAwBIMEYCIQDq93eIhuLS
dSfscGxIebpS4C+R4v8i5hDmspsqixeEyAIhAJGaI43u/8HaaOMTOQINFmx1U7PO
Hi3zYpAYmh9y2QGxMA0GCSqGSIb3DQEBCwUAA4IBAQBp9wbqj9ki7ivoCWfNhMBL
+9u2h3WzoqgBNj1zrd0E3RvUmlA6ykxRoZ+YqoaX2A8MJO6Zm+vMjVol85F0x7sO
JSWe4QYHo8Y+iRZL9pVrbXFPF8X511KC9QLku/33kBf6OeGV5AJZRlEeQyaNUvfR
8SHWBJslpIVigxVvErkOPP6gPXIAn8+cSeVB5HRk8iF1igE+1+HI+tzuoHTB8yPH
nfGH53ds7pyJSHgU9SYmOzSCJ9QD0moEpirFJ1tCs3kHMqV/diM0j3FwM1QGUTec
QQ+Gm7a0ItBLbVFP5PLI0tMqv325rnbbs4/fm2MgkQQX7ipS3dhqtbGOzHq3bjKu
-----END CERTIFICATE-----)EOF";

WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  delay(100);

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
  StaticJsonDocument<200> response;

  if (http_get("/config?apikey=" + apikey, response)) {
    serializeJsonPretty(response, Serial);
    Serial.println();
  }

  StaticJsonDocument<200> payload;
  payload["apikey"] = apikey;
  payload["rfid_code"] = "67 99 37 25";
  payload["timestamp"] = 1765712989;

  if (http_post("/rfid", payload, response)) {
    serializeJsonPretty(response, Serial);
    Serial.println();
  }

  delay(5000);
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
