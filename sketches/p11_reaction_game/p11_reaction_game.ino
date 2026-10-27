// Project 11: Reaction game
// Touch sensor on D7. The light on the board is the signal (no resistor needed).
// Wait for the light, then touch as fast as you can. Touch too early and you lose.
// Optional buzzer on D8 gives a beep when the light comes on.

const int TOUCH_PIN = 7;
const int BUZZER_PIN = 8;
const int LED_PIN = LED_BUILTIN;

unsigned long best = 99999;

void setup() {
  pinMode(TOUCH_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  randomSeed(analogRead(A5));
  Serial.println("Reaction game! Touch the sensor to start a round.");
}

void waitForTouch(bool wanted) {
  while ((digitalRead(TOUCH_PIN) == HIGH) != wanted) {
    delay(5);
  }
}

void loop() {
  waitForTouch(true);
  waitForTouch(false);           // let go first
  Serial.println("Get ready...");
  delay(300);

  unsigned long waitTime = random(2000, 6000);
  unsigned long start = millis();
  while (millis() - start < waitTime) {
    if (digitalRead(TOUCH_PIN) == HIGH) {
      Serial.println("Too early! Round over.");
      waitForTouch(false);
      return;
    }
  }

  digitalWrite(LED_PIN, HIGH);
  tone(BUZZER_PIN, 1500, 80);    // quiet on an active buzzer if it has no tone, harmless
  unsigned long t0 = millis();
  while (digitalRead(TOUCH_PIN) == LOW) {
    if (millis() - t0 > 3000) break;
  }
  unsigned long ms = millis() - t0;
  digitalWrite(LED_PIN, LOW);

  if (ms > 3000) {
    Serial.println("Too slow. Touch to try again.");
    return;
  }
  Serial.print("Your time: ");
  Serial.print(ms);
  Serial.println(" ms");
  if (ms < best) {
    best = ms;
    Serial.println("NEW BEST!");
  }
  Serial.print("Best so far: ");
  Serial.print(best);
  Serial.println(" ms");
  Serial.println("Touch to play again.");
}
