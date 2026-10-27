// Project 4: Night light
// The light sensor module (LDR) is on A0. When the room gets dark, the lamp turns on.
//
// Step 1: upload, open the Serial Monitor and cover the sensor with your hand.
// Does the number go UP or DOWN? Set DARK_GOES_UP below to match (true or false).
// Step 2: read the number in a bright room and a dark room, then set THRESHOLD between them.
//
// LED_BUILTIN is the light on the Nano. For a real LED with a 220 ohm resistor,
// plug it into D4 and change LED_PIN to 4.

const int LDR_PIN = A0;
const int LED_PIN = LED_BUILTIN;
const int THRESHOLD = 500;
const bool DARK_GOES_UP = true;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Night light ready. Cover the sensor and watch the number.");
}

void loop() {
  int light = analogRead(LDR_PIN);
  bool dark = DARK_GOES_UP ? (light > THRESHOLD) : (light < THRESHOLD);

  digitalWrite(LED_PIN, dark ? HIGH : LOW);

  Serial.print("light reading: ");
  Serial.print(light);
  Serial.println(dark ? "   -> dark, lamp ON" : "   -> bright, lamp OFF");
  delay(300);
}
