// Project 10: Mood lamp
// RGB LED: red on D9, green on D10, blue on D11, each through a 220 ohm resistor.
// The long leg of the LED goes to ground (common cathode).
// Touch sensor on D7 changes the mood.
//
// If the colours look inverted (you expected off and it is bright), your LED is
// "common anode": connect the long leg to 5V and set COMMON_ANODE to true.
//
// No resistors yet? Set HAVE_RESISTORS to 0. The sketch will not light the RGB LED;
// it only prints the colour names in the Serial Monitor.

#define HAVE_RESISTORS 1
const bool COMMON_ANODE = false;

const int RED_PIN = 9;
const int GREEN_PIN = 10;
const int BLUE_PIN = 11;
const int TOUCH_PIN = 7;

const char* moodName[] = {"Rainbow", "Calm", "Happy", "Sleepy", "Excited"};
const int moodColour[][3] = {
  {0, 0, 0},         // rainbow (changes by itself)
  {0, 80, 255},      // calm: blue
  {255, 180, 0},     // happy: yellow
  {120, 0, 200},     // sleepy: purple
  {255, 30, 30}      // excited: red
};
const int MOODS = 5;

int mood = 0;
bool wasTouched = false;

void show(int r, int g, int b) {
#if HAVE_RESISTORS
  if (COMMON_ANODE) { r = 255 - r; g = 255 - g; b = 255 - b; }
  analogWrite(RED_PIN, r);
  analogWrite(GREEN_PIN, g);
  analogWrite(BLUE_PIN, b);
#endif
}

// hue 0..767 around the colour wheel
void wheel(int h) {
  h = h % 768;
  if (h < 256)      show(255 - h, h, 0);
  else if (h < 512) show(0, 255 - (h - 256), h - 256);
  else              show(h - 512, 0, 255 - (h - 512));
}

void setup() {
  pinMode(TOUCH_PIN, INPUT);
#if HAVE_RESISTORS
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
#endif
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Mood lamp ready. Touch to change the mood.");
  Serial.println("Mood: Rainbow");
}

void loop() {
  bool touched = digitalRead(TOUCH_PIN) == HIGH;
  if (touched && !wasTouched) {
    mood = (mood + 1) % MOODS;
    Serial.print("Mood: ");
    Serial.println(moodName[mood]);
    for (int i = 0; i < mood; i++) {     // the board light blinks the mood number
      digitalWrite(LED_BUILTIN, HIGH);
      delay(80);
      digitalWrite(LED_BUILTIN, LOW);
      delay(80);
    }
  }
  wasTouched = touched;

  if (mood == 0) {
    static int hue = 0;
    wheel(hue);
    hue = (hue + 2) % 768;
    delay(15);
  } else {
    show(moodColour[mood][0], moodColour[mood][1], moodColour[mood][2]);
    delay(15);
  }
}
