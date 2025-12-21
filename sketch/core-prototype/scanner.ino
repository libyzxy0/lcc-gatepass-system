#include <SPI.h>
#include <MFRC522.h>
#include <HardwareSerial.h>

#define SS_PIN 5
#define RST_PIN 22

#define QR_RX 16
#define QR_TX 17

#define MAX_SCAN_LENGTH 128
#define CHAR_TIMEOUT 50

MFRC522 rfid(SS_PIN, RST_PIN);
HardwareSerial QRScanner(2);

char qrBuffer[MAX_SCAN_LENGTH];
uint8_t qrIndex = 0;
unsigned long lastQrCharTime = 0;


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
  Serial.println("System Ready");
}

void loop() {
  String uid;
  if (scanRfid(uid)) {
    Serial.print("Scanned RFID: ");
    Serial.println(uid);
  }
  
  String qr;
  if (scanQRCode(qr)) {
    Serial.print("Scanned QR: ");
    Serial.println(qr);
  }
}
