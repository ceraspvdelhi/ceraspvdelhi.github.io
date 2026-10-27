// Project 9: Water tank monitor
// Water level sensor: S to A1, + to 5V, - to ground.
// Only the printed lines of the sensor go in the water, never the top.
//
// Step 1: upload and dip the sensor a little at a time. Watch the number rise.
// Step 2: put the numbers you saw into LOW_LEVEL, HALF_LEVEL and FULL_LEVEL.
// Buzzer on D8 sounds when the tank is full.

const int LEVEL_PIN = A1;
const int BUZZER_PIN = 8;
const int LOW_LEVEL = 100;
const int HALF_LEVEL = 250;
const int FULL_LEVEL = 400;
const bool ACTIVE_BUZZER = false;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Tank monitor ready");
}

void loop() {
  int v = analogRead(LEVEL_PIN);

  const char* label;
  int bars;
  if (v >= FULL_LEVEL)      { label = "FULL";  bars = 4; }
  else if (v >= HALF_LEVEL) { label = "HALF";  bars = 3; }
  else if (v >= LOW_LEVEL)  { label = "LOW";   bars = 2; }
  else                      { label = "EMPTY"; bars = 1; }

  Serial.print("[");
  for (int i = 0; i < 4; i++) Serial.print(i < bars ? "#" : " ");
  Serial.print("] ");
  Serial.print(label);
  Serial.print("   (reading ");
  Serial.print(v);
  Serial.println(")");

  digitalWrite(LED_BUILTIN, bars == 1 ? HIGH : LOW);   // light on = refill

  if (bars == 4) {
    if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, HIGH);
    else tone(BUZZER_PIN, 1000);
    delay(300);
    if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, LOW);
    else noTone(BUZZER_PIN);
  }
  delay(500);
}
