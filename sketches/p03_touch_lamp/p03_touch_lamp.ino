// Project 3: Touch lamp
// Touch the sensor once: the lamp turns on. Touch again: it turns off.
// Touch sensor signal on D7.
//
// LED_BUILTIN is the light on the Nano, so this works with no extra parts.
// To use a real LED (with a 220 ohm resistor), plug it into D4 and
// change the next line to:  const int LED_PIN = 4;

const int TOUCH_PIN = 7;
const int LED_PIN = LED_BUILTIN;

bool lampOn = false;
bool wasTouched = false;

void setup() {
  pinMode(TOUCH_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Touch lamp ready");
}

void loop() {
  bool touched = digitalRead(TOUCH_PIN) == HIGH;

  // act only at the moment the finger lands, not while it stays there
  if (touched && !wasTouched) {
    lampOn = !lampOn;
    digitalWrite(LED_PIN, lampOn ? HIGH : LOW);
    Serial.println(lampOn ? "lamp ON" : "lamp OFF");
    delay(50);   // ignore tiny bounces
  }
  wasTouched = touched;
}
