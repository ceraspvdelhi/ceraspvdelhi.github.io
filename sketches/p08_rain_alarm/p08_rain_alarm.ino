// Project 8: Rain alarm
// Rain module: AO to A0, VCC to 5V, GND to ground. The sensing pad plugs into the module.
// Buzzer on D8. Dry reads a big number (near 1000). Wet drops it.
//
// Upload, open the Serial Monitor, touch the pad with a wet finger and see how low the
// number goes. Put WET_BELOW somewhere in between.

const int RAIN_PIN = A0;
const int BUZZER_PIN = 8;
const int WET_BELOW = 700;
const bool ACTIVE_BUZZER = false;

void alarm() {
  for (int i = 0; i < 3; i++) {
    if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, HIGH);
    else tone(BUZZER_PIN, 1200);
    delay(200);
    if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, LOW);
    else noTone(BUZZER_PIN);
    delay(150);
  }
}

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Rain alarm ready. Drop some water on the pad.");
}

void loop() {
  int value = analogRead(RAIN_PIN);
  bool wet = value < WET_BELOW;

  Serial.print("rain reading: ");
  Serial.print(value);
  Serial.println(wet ? "   RAIN!" : "   dry");

  digitalWrite(LED_BUILTIN, wet ? HIGH : LOW);
  if (wet) alarm();
  delay(300);
}
