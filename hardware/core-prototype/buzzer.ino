#define BUZZER_PIN 4

void setup() {
  ledcSetup(0, 1000, 8);
  ledcAttachPin(BUZZER_PIN, 0);
}

void successTone() {
  ledcWriteTone(0, 880); 
  ledcWrite(0, 204); 
  delay(150);
  ledcWriteTone(0, 0);
  delay(50);
  ledcWriteTone(0, 988);
  delay(150);
  ledcWriteTone(0, 0);
}

void errorTone() {
  ledcWriteTone(0, 220);
  ledcWrite(0, 204);
  delay(400);
  ledcWriteTone(0, 0);
}

void loop() {
  successTone();
  delay(1000);
  errorTone();
  delay(2000);
}
