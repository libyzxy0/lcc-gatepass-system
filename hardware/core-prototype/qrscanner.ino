#include <HardwareSerial.h>

#define QR_RX 16
#define QR_TX 17
#define LED_PIN 2
#define MAX_SCAN_LENGTH 128
#define CHAR_TIMEOUT 100

HardwareSerial QRScanner(2);

char scannedData[MAX_SCAN_LENGTH];
uint8_t scanIndex = 0;
unsigned long lastCharTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  QRScanner.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
}

void loop() {
  while (QRScanner.available()) {
    char c = QRScanner.read();
    digitalWrite(LED_PIN, HIGH);
    if (scanIndex < MAX_SCAN_LENGTH - 1) {
      scannedData[scanIndex++] = c;
    }
    lastCharTime = millis();
  }

  if (scanIndex > 0 && millis() - lastCharTime > CHAR_TIMEOUT) {
    scannedData[scanIndex] = '\0';
    
    Serial.print("DATA: "); Serial.println(scannedData);
    scanIndex = 0;
    digitalWrite(LED_PIN, LOW);
  }
}