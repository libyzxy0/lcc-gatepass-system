#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <HardwareSerial.h>

#define SS_PIN 5
#define RST_PIN 22
#define QR_RX 16
#define QR_TX 17
#define BUZZER_PIN 4
#define RELAY_MAIN_PIN 27
#define RELAY_SECONDARY_PIN 26
#define LOCK_SENSOR_PIN 33

bool productionMode = true;
bool emergencyOpen = false;

const char* wifiSsid = "OrangeCat";
const char* wifiPassword = "myorange32";

const char* clientId = "ESP-GATE-001";
const char* secretKey = "79408c3e-6c50-4fb0-98cb-98db70596411";

const char* mqttHost = "37638f32d99b49fa968d88c783e2b03a.s1.eu.hivemq.cloud";
const int mqttPort = 8883;
const char* mqttUser = "libyzxy0";
const char* mqttPass = "Libyzxy0@123_esp32";

const char* rootCaCert = R"EOF(
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
HardwareSerial qrSerial(2);

bool scanning = false;
bool gateOpen = false;
unsigned long lastScanTime = 0;
unsigned long gateOpenedAt = 0;
String lastScanValue = "";

const unsigned long duplicateWindowMs = 10000;
const unsigned long autoCloseMs = 5000;

class Tone {
  public:
  static unsigned long lastUpdate;
  static int pitch;
  static bool ascending;
    
  static void tone(int f, int d) { ledcWriteTone(0,f); ledcWrite(0,204); delay(d); ledcWriteTone(0,0); }
  static void ok() { tone(880,150); delay(50); tone(988,150); }
  static void bad() { tone(220,400); }
  static void ready() { tone(523,100); tone(659,100); }
  static void init() { tone(1319,100); tone(1568,100); tone(1760,100); }
  static void duplicate() { tone(600,80); delay(60); tone(600,80); }
  static void booted() { tone(800,100); delay(50); tone(1000,120); }
  
  static void emergencyLoop() {
    unsigned long now = millis();
    if (now - lastUpdate >= 20) {
      lastUpdate = now;
      if (ascending) pitch += 10;
      else pitch -= 10;

      if (pitch >= 1200) ascending = false;
      if (pitch <= 800) ascending = true;

      ledcWriteTone(0, pitch);
      ledcWrite(0, 204);
    }
  }

  static void emergencyStop() {
    ledcWriteTone(0, 0);
    pitch = 800;
    ascending = true;
  }
};

class Json {
  public:
  class Builder {
    StaticJsonDocument<512> doc;
    public:
    template<typename T> Builder& add(const char* k, T v){ doc[k]=v; return *this; }
    String str(){ String o; serializeJson(doc,o); return o; }
  };
  static Builder build(){ return Builder(); }
  template<typename T>
  static T get(const String& json, const char* key, T def) {
    StaticJsonDocument<512> doc;
    if (deserializeJson(doc,json)) return def;
    if (!doc.containsKey(key)) return def;
    return doc[key].as<T>();
  }
};

void setGate(bool mainValue, bool secondaryValue){
  digitalWrite(RELAY_MAIN_PIN, mainValue);
  digitalWrite(RELAY_SECONDARY_PIN, secondaryValue);
}

bool readRfid(String &out){
  if (!rfid.PICC_IsNewCardPresent()) return false;
  if (!rfid.PICC_ReadCardSerial()) return false;
  out="";
  for(byte i=0;i<rfid.uid.size;i++){ if(rfid.uid.uidByte[i]<0x10) out+='0'; out+=String(rfid.uid.uidByte[i],HEX); }
  out.toUpperCase();
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  delay(50);
  rfid.PCD_Init();
  return true;
}

bool readQr(String &out){
  static String buff="";
  while(qrSerial.available()){
    char c=qrSerial.read();
    if(c=='\n'||c=='\r'){ if(buff.length()){ out=buff; buff=""; return true; } }
    else buff+=c;
  }
  return false;
}

bool isDuplicate(const String& data){
  if(data==lastScanValue && millis()-lastScanTime < duplicateWindowMs){
    Tone::duplicate();
    return true;
  }
  lastScanValue=data;
  lastScanTime=millis();
  return false;
}

void mqttPublishScan(const char* type, const String& data){
  String payload = Json::build()
    .add("data", data)
    .add("secret_key", secretKey)
    .add("client_id", clientId)
    .str();
  String topic = String(productionMode?"scan/":"dev/scan/") + type;
  mqtt.publish(topic.c_str(), payload.c_str());
}

void mqttSubscribeScan(){
  mqtt.unsubscribe("scan/#");
  mqtt.unsubscribe("dev/scan/#");
  mqtt.subscribe(productionMode?"scan/#":"dev/scan/#");
}

void setMode(bool prod){
  productionMode = prod;
  scanning = false;
  mqttSubscribeScan();
  Tone::init();
}

void wifiConnect(){
  WiFi.begin(wifiSsid, wifiPassword);
  int retry=0;
  while(WiFi.status()!=WL_CONNECTED){
    delay(500);
    if(++retry>=5) ESP.restart();
  }
}

void processGate(String msg){
  String status = Json::get<String>(msg,"status","");
  String entry = Json::get<String>(msg,"entry","");
  if(status=="ok"){
    if(entry=="IN") setGate(LOW,HIGH);
    else if(entry=="OUT") setGate(HIGH,LOW);
    Tone::ok();
    gateOpenedAt = millis();
    gateOpen = true;
  } 
  else if(status=="bad") Tone::bad();
  scanning=false;
}

void processConfig(String msg){
  String action = Json::get<String>(msg,"action","");
  String emergency = Json::get<String>(msg,"emergency_open","");
  String prod = Json::get<String>(msg,"production","");
  if(action=="WRITE"){
    if(prod=="yes") setMode(true);
    else if(prod=="no") setMode(false);
    if(emergency=="yes"){ setGate(LOW,LOW); gateOpenedAt=millis(); gateOpen=true; emergencyOpen=true; scanning=false; }
    else if(emergency=="no"){ setGate(HIGH,HIGH); emergencyOpen=false; }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length){
  if(!length) return;
  String msg; msg.reserve(length);
  for(unsigned int i=0;i<length;i++) msg+=(char)payload[i];
  if(!msg.startsWith("{")||!msg.endsWith("}")) return;
  String t = topic;
  if(t.startsWith("config")||t.startsWith("dev/config")){ processConfig(msg); return; }
  if(((productionMode && t.startsWith("scan/")) || (!productionMode && t.startsWith("dev/"))) && t.endsWith("/response"))
    processGate(msg);
}

void mqttConnect(){
  while(!mqtt.connected()){
    String statusTopic = "status/" + String(clientId);
    String offlinePayload = Json::build()
      .add("client_id", clientId)
      .add("status", "offline")
      .add("secret_key", secretKey)
      .str();
    bool ok = mqtt.connect(clientId, mqttUser, mqttPass, statusTopic.c_str(), 1, true, offlinePayload.c_str());
    if(ok){
      mqtt.subscribe("config");
      mqtt.subscribe("dev/config");
      mqttSubscribeScan();
      String onlinePayload = Json::build()
        .add("client_id", clientId)
        .add("status", "online")
        .add("secret_key", secretKey)
        .str();
      mqtt.publish(statusTopic.c_str(), onlinePayload.c_str(), true);
      Tone::ready();
    } else {
      Tone::bad();
      delay(5000);
    }
  }
}

void initHardware(){
  SPI.begin();
  rfid.PCD_Init();
  qrSerial.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
  ledcSetup(0,1000,8);
  ledcAttachPin(BUZZER_PIN,0);
  pinMode(RELAY_MAIN_PIN,OUTPUT);
  pinMode(RELAY_SECONDARY_PIN,OUTPUT);
  pinMode(LOCK_SENSOR_PIN,INPUT_PULLUP);
  digitalWrite(RELAY_MAIN_PIN,HIGH);
  digitalWrite(RELAY_SECONDARY_PIN,HIGH);
  Tone::booted();
}

unsigned long Tone::lastUpdate = 0;
int Tone::pitch = 800;
bool Tone::ascending = true;

void setup(){
  Serial.begin(115200);
  initHardware();
  wifiConnect();
  secureClient.setCACert(rootCaCert);
  mqtt.setServer(mqttHost, mqttPort);
  mqtt.setCallback(mqttCallback);
  mqtt.setBufferSize(512);
  mqttConnect();
  Tone::init();
}

void loop(){
  if(!mqtt.connected()) mqttConnect();
  mqtt.loop();
  
  if (emergencyOpen) {
    Tone::emergencyLoop();
    return;
  }
  Tone::emergencyStop();



  if(gateOpen && millis() - gateOpenedAt >= autoCloseMs){
    setGate(HIGH,HIGH);
    gateOpen=false;
    scanning=false;
  }

  if(digitalRead(LOCK_SENSOR_PIN)==LOW && gateOpen && !emergencyOpen){
    setGate(HIGH,HIGH);
    gateOpen=false;
  }

  if(Serial.available()){
    String cmd=Serial.readStringUntil('\n');
    if(cmd=="DEV_MODE") setMode(false);
    else if(cmd=="PROD_MODE") setMode(true);
  }

  String uid;
  if(readRfid(uid) && !scanning && !isDuplicate(uid)){
    scanning=true;
    mqttPublishScan("rfid",uid);
    Tone::ready();
  }

  String qr;
  if(readQr(qr) && !scanning && !isDuplicate(qr)){
    scanning=true;
    mqttPublishScan("qr",qr);
    Tone::ready();
  }
}
