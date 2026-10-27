// Project 2: Traffic light
// Three LEDs, each with its own 220 ohm resistor: red on D2, yellow on D3, green on D4.
//
// No resistors yet? Change the next line to 0. The light on the board
// will do the job of all three: steady = stop, fast blink = get ready, slow blink = go.

#define HAVE_RESISTORS 1

const int RED_PIN = 2;
const int YELLOW_PIN = 3;
const int GREEN_PIN = 4;

const int STOP_TIME = 4000;     // milliseconds
const int READY_TIME = 1500;
const int GO_TIME = 4000;

#if HAVE_RESISTORS
void lights(bool r, bool y, bool g) {
  digitalWrite(RED_PIN, r);
  digitalWrite(YELLOW_PIN, y);
  digitalWrite(GREEN_PIN, g);
}
#else
// One light only: show the state with a blink pattern.
void blinkFor(int total, int period) {
  unsigned long start = millis();
  while (millis() - start < (unsigned long)total) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(period / 2);
    digitalWrite(LED_BUILTIN, LOW);
    delay(period / 2);
  }
}
#endif

void setup() {
  Serial.begin(9600);
#if HAVE_RESISTORS
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
#else
  pinMode(LED_BUILTIN, OUTPUT);
#endif
  Serial.println("Traffic light ready");
}

void loop() {
#if HAVE_RESISTORS
  Serial.println("STOP");
  lights(true, false, false);
  delay(STOP_TIME);

  Serial.println("GET READY");
  lights(true, true, false);
  delay(READY_TIME);

  Serial.println("GO");
  lights(false, false, true);
  delay(GO_TIME);

  Serial.println("SLOW DOWN");
  lights(false, true, false);
  delay(READY_TIME);
#else
  Serial.println("STOP (steady light)");
  digitalWrite(LED_BUILTIN, HIGH);
  delay(STOP_TIME);

  Serial.println("GET READY (fast blink)");
  blinkFor(READY_TIME, 200);

  Serial.println("GO (slow blink)");
  blinkFor(GO_TIME, 1000);
#endif
}
