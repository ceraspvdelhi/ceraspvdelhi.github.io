// Project 14: People counter
// IR sensor OUT on D2, pointing across a doorway or at the spot where hands pass.
// Buzzer on D8 (optional). Each time something passes, the count goes up by one.
// If it passes the CAPACITY, the alarm sounds.

const int IR_PIN = 2;
const int BUZZER_PIN = 8;
const int SEES_THING = LOW;     // change to HIGH if your module works the other way round
const int CAPACITY = 5;

int people = 0;
bool wasBlocked = false;

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("People counter ready. Count: 0");
}

void loop() {
  bool blocked = digitalRead(IR_PIN) == SEES_THING;

  if (blocked && !wasBlocked) {            // count when something arrives
    people++;
    Serial.print("Count: ");
    Serial.println(people);
    digitalWrite(LED_BUILTIN, HIGH);
    tone(BUZZER_PIN, 1000, 60);
    delay(120);
    digitalWrite(LED_BUILTIN, LOW);

    if (people > CAPACITY) {
      Serial.println("TOO MANY PEOPLE!");
      tone(BUZZER_PIN, 400, 700);
      delay(800);
    }
  }
  wasBlocked = blocked;
  delay(20);
}
