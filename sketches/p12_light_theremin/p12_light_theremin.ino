// Project 12: Light theremin
// Light sensor module on A0, buzzer on D8 (long leg to the signal pin).
// Move your hand over the sensor to change the pitch.
//
// This needs the "passive" buzzer from Project 5 for different notes.
// With an active buzzer, set ACTIVE_BUZZER to true: you get a beeper that
// speeds up as it gets darker.
//
// Open the Serial Monitor and read the numbers when the sensor is covered
// and uncovered. Put them into LOW_READING and HIGH_READING.

const bool ACTIVE_BUZZER = false;

const int LDR_PIN = A0;
const int BUZZER_PIN = 8;
const int LOW_READING = 100;
const int HIGH_READING = 900;
const int LOW_PITCH = 200;
const int HIGH_PITCH = 2000;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Light theremin ready");
}

void loop() {
  int light = analogRead(LDR_PIN);
  light = constrain(light, LOW_READING, HIGH_READING);

  if (ACTIVE_BUZZER) {
    int gap = map(light, LOW_READING, HIGH_READING, 50, 600);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(40);
    digitalWrite(BUZZER_PIN, LOW);
    delay(gap);
  } else {
    int pitch = map(light, LOW_READING, HIGH_READING, LOW_PITCH, HIGH_PITCH);
    tone(BUZZER_PIN, pitch);
    delay(30);
  }

  Serial.println(light);
}
