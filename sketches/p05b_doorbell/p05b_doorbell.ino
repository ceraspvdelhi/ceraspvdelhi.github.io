// Project 5, part B: Doorbell
// Touch sensor on D7, buzzer on D8 (long leg to the signal pin).
// Touch the sensor and the doorbell plays a short tune.
//
// Set ACTIVE_BUZZER to true if Part A told you your buzzer is the "active" kind.
// It will then play the rhythm only, with the same sound for every note.

const bool ACTIVE_BUZZER = false;

const int TOUCH_PIN = 7;
const int BUZZER_PIN = 8;

void note(int pitch, int ms) {
  if (ACTIVE_BUZZER) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(ms);
    digitalWrite(BUZZER_PIN, LOW);
  } else {
    tone(BUZZER_PIN, pitch, ms);
    delay(ms);
    noTone(BUZZER_PIN);
  }
  delay(40);
}

void ding() {
  note(659, 250);   // E
  note(523, 250);   // C
  note(587, 250);   // D
  note(392, 500);   // G
}

void setup() {
  pinMode(TOUCH_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Doorbell ready. Touch the sensor.");
}

void loop() {
  if (digitalRead(TOUCH_PIN) == HIGH) {
    Serial.println("Ding dong!");
    ding();
    delay(500);
  }
}
