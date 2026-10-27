// Project 5, part A: Which buzzer do I have?
// Buzzer: long leg (+) to D8, short leg to GND.
//
// Listen to the two tests, then read the table on the project page.
//   Test A: the pin goes HIGH and stays HIGH for one second.
//   Test B: the pin plays a rising scale, C D E F G.

const int BUZZER_PIN = 8;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Which buzzer do I have?");
}

void loop() {
  Serial.println("Test A: steady power for 1 second. Do you hear a beep?");
  digitalWrite(BUZZER_PIN, HIGH);
  delay(1000);
  digitalWrite(BUZZER_PIN, LOW);
  delay(1500);

  Serial.println("Test B: a scale, going up. Does the pitch change?");
  int notes[] = {262, 294, 330, 349, 392};
  for (int i = 0; i < 5; i++) {
    tone(BUZZER_PIN, notes[i], 300);
    delay(400);
  }
  noTone(BUZZER_PIN);
  delay(2500);
}
