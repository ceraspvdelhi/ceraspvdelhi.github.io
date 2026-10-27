// Project 6: Burglar alarm
// IR sensor OUT on D2, buzzer on D8 (long leg to the signal pin).
// Most IR obstacle modules pull the pin LOW when something is in front of them.
// If yours does the opposite, change SEES_THING to HIGH.
//
// You get 5 seconds after power-up to put the sensor in place.

const int IR_PIN = 2;
const int BUZZER_PIN = 8;
const int SEES_THING = LOW;
const int ARMING_SECONDS = 5;
const bool ACTIVE_BUZZER = false;

void siren() {
  for (int i = 0; i < 4; i++) {
    if (ACTIVE_BUZZER) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(150);
      digitalWrite(BUZZER_PIN, LOW);
      delay(100);
    } else {
      tone(BUZZER_PIN, 900, 150);
      delay(170);
      tone(BUZZER_PIN, 1500, 150);
      delay(170);
    }
  }
  noTone(BUZZER_PIN);
  digitalWrite(BUZZER_PIN, LOW);
}

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.print("Arming in ");
  Serial.print(ARMING_SECONDS);
  Serial.println(" seconds...");
  for (int s = ARMING_SECONDS; s > 0; s--) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
    digitalWrite(LED_BUILTIN, LOW);
    delay(900);
  }
  Serial.println("ARMED");
}

void loop() {
  if (digitalRead(IR_PIN) == SEES_THING) {
    Serial.println("INTRUDER!");
    digitalWrite(LED_BUILTIN, HIGH);
    siren();
    digitalWrite(LED_BUILTIN, LOW);
  }
}
