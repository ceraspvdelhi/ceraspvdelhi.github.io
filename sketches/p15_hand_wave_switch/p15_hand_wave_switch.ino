// Project 15: Hand-wave switch
// Ultrasonic sensor: TRIG on D9, ECHO on D10, VCC to 5V, GND to ground.
// Wave your hand 5 to 15 cm in front of the sensor to switch the lamp on or off.
//
// LED_BUILTIN is the light on the Nano. For a real LED with a 220 ohm resistor,
// plug it into D4 and change LED_PIN to 4.

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int LED_PIN = LED_BUILTIN;
const int NEAR_CM = 15;         // hand counts if it is closer than this

bool lampOn = false;
bool handThere = false;

int readCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long us = pulseIn(ECHO_PIN, HIGH, 25000);
  if (us == 0) return 999;
  return us / 58;
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Hand-wave switch ready");
}

void loop() {
  int cm = readCm();
  bool near = cm < NEAR_CM;

  if (near && !handThere) {          // the hand just arrived
    lampOn = !lampOn;
    digitalWrite(LED_PIN, lampOn ? HIGH : LOW);
    Serial.print("hand at ");
    Serial.print(cm);
    Serial.println(lampOn ? " cm -> lamp ON" : " cm -> lamp OFF");
  }
  handThere = near;
  delay(60);
}
