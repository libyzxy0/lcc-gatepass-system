#include <HardwareSerial.h>

#define QR_RX 16
#define QR_TX 17
#define LED_PIN 2

HardwareSerial QRScanner(2);
String barcode = "";  // dynamic string buffer

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  QRScanner.begin(9600, SERIAL_8N1, QR_RX, QR_TX);
}

void loop() {
  while (QRScanner.available()) {
    char c = QRScanner.read();
    digitalWrite(LED_PIN, HIGH);  

    if (c == '\n' || c == '\r') {  
      if (barcode.length() > 0) {
        Serial.println("Scanned barcode: " + barcode);
        barcode = ""; 
        digitalWrite(LED_PIN, LOW);
      }
    } else {
      Serial.print(c); 
      barcode += c;
    }
  }
}
