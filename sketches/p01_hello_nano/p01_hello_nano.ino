// Project 1: Hello Nano
// The little orange light on your Nano is wired to pin 13.
// This sketch blinks it and says hello in the Serial Monitor.

const int LED_PIN = LED_BUILTIN;   // the light on the board (pin 13)
const int ON_TIME = 500;           // how long the light stays on, in milliseconds
const int OFF_TIME = 500;          // how long it stays off

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Hello from my Nano!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("light ON");
  delay(ON_TIME);

  digitalWrite(LED_PIN, LOW);
  Serial.println("light OFF");
  delay(OFF_TIME);
}
