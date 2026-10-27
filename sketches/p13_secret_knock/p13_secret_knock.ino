// Project 13: Secret knock lock
// Touch sensor on D7. Buzzer on D8 (optional). The light on the board is the lock:
// off = locked, on for 3 seconds = open.
//
// The secret: short, short, long. A short touch is under 300 ms, a long touch is 300 ms or more.
// Change SECRET and CODE_LENGTH to make your own.

const int TOUCH_PIN = 7;
const int BUZZER_PIN = 8;
const int LONG_MS = 300;
const int IDLE_RESET_MS = 3000;

const char SECRET[] = "SSL";
const int CODE_LENGTH = 3;

char entered[8];
int count = 0;
unsigned long lastTouch = 0;

void openLock() {
  Serial.println("UNLOCKED!");
  digitalWrite(LED_BUILTIN, HIGH);
  tone(BUZZER_PIN, 880, 150);
  delay(200);
  tone(BUZZER_PIN, 1320, 300);
  delay(3000);
  digitalWrite(LED_BUILTIN, LOW);
}

void wrongCode() {
  Serial.println("Wrong code. Locked.");
  tone(BUZZER_PIN, 150, 500);
  delay(600);
}

void setup() {
  pinMode(TOUCH_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Locked. Knock the secret.");
}

void loop() {
  if (count > 0 && millis() - lastTouch > IDLE_RESET_MS) {
    Serial.println("Took too long. Starting over.");
    count = 0;
  }

  if (digitalRead(TOUCH_PIN) == HIGH) {
    unsigned long down = millis();
    while (digitalRead(TOUCH_PIN) == HIGH) {
      delay(5);
    }
    unsigned long held = millis() - down;
    lastTouch = millis();

    char c = (held >= LONG_MS) ? 'L' : 'S';
    Serial.print("touch: ");
    Serial.println(c == 'L' ? "long" : "short");
    entered[count] = c;
    count++;

    if (count == CODE_LENGTH) {
      bool ok = true;
      for (int i = 0; i < CODE_LENGTH; i++) {
        if (entered[i] != SECRET[i]) ok = false;
      }
      if (ok) openLock();
      else wrongCode();
      count = 0;
    }
  }
}
