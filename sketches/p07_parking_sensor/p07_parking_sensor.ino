// Project 7: Parking sensor
// Ultrasonic sensor: TRIG on D9, ECHO on D10, VCC to 5V, GND to ground.
// Buzzer on D8. The closer the car, the faster the beeps.

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 8;
const int FAR_CM = 60;      // quiet beyond this
const int STOP_CM = 8;      // steady beep at this distance or closer
const bool ACTIVE_BUZZER = false;

int readCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long us = pulseIn(ECHO_PIN, HIGH, 25000);   // give up after 25 ms
  if (us == 0) return 999;                    // nothing heard
  return us / 58;
}

void beep(int ms) {
  if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, HIGH);
  else tone(BUZZER_PIN, 1000);
  delay(ms);
  if (ACTIVE_BUZZER) digitalWrite(BUZZER_PIN, LOW);
  else noTone(BUZZER_PIN);
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Parking sensor ready");
}

void loop() {
  int cm = readCm();
  Serial.print("distance: ");
  Serial.print(cm);
  Serial.println(" cm");

  if (cm <= STOP_CM) {
    beep(200);                       // steady tone
  } else if (cm < FAR_CM) {
    int gap = map(cm, STOP_CM, FAR_CM, 40, 700);   // closer = shorter gap
    beep(60);
    delay(gap);
  } else {
    delay(150);
  }
}
