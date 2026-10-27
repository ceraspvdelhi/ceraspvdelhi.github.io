// All the words for the 15 projects. build.js turns this into pages.
// Wiring rows: color, items. Items: 'pin:D7 S' (a pin on the Nano base board), 'bb' (goes through the breadboard),
// 'res:220' (resistor), 'end:label' (the part leg or pin it finishes on).

const SIG = '#f59e0b', PWR = '#e11d48', GND = '#334155';
const pin = (p) => 'pin:' + p, end = (t) => 'end:' + t;

// three wires from one base board triplet to a 3 pin module
const mod3 = (p, part, sig, vcc, gnd) => [
  { c: SIG, items: [pin(p + ' S'), end(part + ' · ' + sig)] },
  { c: PWR, items: [pin(p + ' V'), end(part + ' · ' + (vcc || 'VCC'))] },
  { c: GND, items: [pin(p + ' G'), end(part + ' · ' + (gnd || 'GND'))] }
];
const buzzerRows = (p) => [
  { c: SIG, items: [pin((p || 'D8') + ' S'), 'bb', end('Buzzer long leg (+)')] },
  { c: GND, items: [pin((p || 'D8') + ' G'), 'bb', end('Buzzer short leg')] }
];
const ledRows = (p, name, col) => [
  { c: col || SIG, items: [pin(p + ' S'), 'bb', 'res:220', end((name || 'LED') + ' long leg (+)')] },
  { c: GND, items: [pin(p + ' G'), 'bb', end((name || 'LED') + ' short leg')] }
];
const usRows = () => [
  { c: SIG, items: [pin('D9 S'), end('Ultrasonic · TRIG')] },
  { c: '#0ea5e9', items: [pin('D10 S'), end('Ultrasonic · ECHO')] },
  { c: PWR, items: [pin('D9 V'), end('Ultrasonic · VCC')] },
  { c: GND, items: [pin('D9 G'), end('Ultrasonic · GND')] }
];

const trouble = {
  nothing: ['Nothing happens at all.', 'Check the power light on the Nano. Then check that the wires sit on the S, V and G of the same pin number, not a mix of two. Unplug the USB before you move any wire.'],
  upload: ['The upload fails with a red message.', 'In Tools, set Processor to ATmega328P (Old Bootloader) and pick the right Port. Try another USB port. The Getting started page has the full list.'],
  serial: ['The Serial Monitor shows funny symbols.', 'Set the speed at the bottom right of the Serial Monitor to 9600 baud.'],
  bb: ['The breadboard part does not work.', 'The five holes in one short row are joined together. Make sure the LED leg and the resistor leg share a row, and not a column of the other half.']
};

module.exports = [
  {
    id: 'p01', n: 1, slug: 'hello-nano', title: 'Hello Nano', color: '#7c4dff', level: 1, minutes: 10, resistor: 'none',
    tagline: 'Make the little light on your Nano blink, and make it talk.',
    parts: [['Arduino Nano', 1], ['USB cable', 1]],
    intro: 'This is the first one for everybody. There is nothing to wire. The Nano has a small light on the board that is connected to pin 13, and you are going to tell it when to go on and off. You will also make the Nano send a message to your computer.',
    steps: [
      'Plug the Nano into the base board if it is not already, with the USB socket at the edge. The Getting started page shows how.',
      'Plug the USB cable into the Nano and into the computer.',
      'Open the Arduino IDE, paste the code below over everything that is already there, and press Upload (the arrow).',
      'When it says Done uploading, the light on the board blinks once a second.',
      'Open the Serial Monitor (the magnifying glass at the top right, set to 9600 baud) and read what your Nano says.'
    ],
    rows: [],
    sketches: [{ file: 'p01_hello_nano', title: 'Hello Nano' }],
    how: [
      'setup() runs once, when the Nano starts. We tell pin 13 it is an OUTPUT and start the Serial connection.',
      'loop() runs again and again for ever. digitalWrite(LED_PIN, HIGH) switches the light on, delay(500) waits half a second, then LOW switches it off.',
      'Serial.println() sends a line of text down the USB cable. That is how a robot tells you what it is doing.'
    ],
    see: 'The light on the board blinks once a second, and the Serial Monitor prints "light ON", "light OFF" in turn.',
    tryThis: [
      'Change ON_TIME to 100 and OFF_TIME to 900. What does it look like now?',
      'Make it blink SOS: three short, three long, three short.',
      'Change the message in Serial.println to your own name.'
    ],
    fix: [trouble.upload, trouble.serial, ['The light never blinks but the upload said Done.', 'On some boards the light is dim. Look from the side in a dark room. If it is still off, upload again.']]
  },
  {
    id: 'p02', n: 2, slug: 'traffic-light', title: 'Traffic light', color: '#ef4444', level: 2, minutes: 25, resistor: 'needed',
    tagline: 'Three LEDs that stop, get ready and go, just like the one on the road.',
    parts: [['Arduino Nano + base board', 1], ['LED: red', 1], ['LED: yellow', 1], ['LED: green', 1], ['Breadboard', 1], ['Resistor 220 Ω (not in the box)', 3], ['Jumper wires, male to female', 6]],
    intro: 'An LED lets current through in one direction only, and it needs a resistor in front of it or it will burn out. That is why this project needs three 220 Ω resistors. They are not in the box, but any electronics shop will sell them. Resistors from 150 Ω to 470 Ω all work.',
    noRes: 'Open the code, change the line #define HAVE_RESISTORS 1 to 0 and upload. You only need the Nano. The light on the board becomes the traffic light: steady means stop, a fast blink means get ready, a slow blink means go.',
    steps: [
      'Unplug the USB first. Always change wires with the power off.',
      'Push the three LEDs into the breadboard in a row, a few columns apart. The long leg of each LED goes on the left, the short leg on the right.',
      'Put a 220 Ω resistor from the long-leg column of each LED to an empty column to its left.',
      'Run a male-female jumper from D2 S on the base board (female end on the base board) to the resistor of the red LED. D3 S goes to yellow, D4 S to green.',
      'Run a jumper from any G pin to the blue rail of the breadboard, then a short wire from each short leg to the rail.',
      'Plug in the USB and upload the code.'
    ],
    rows: [
      { c: '#ef4444', items: [pin('D2 S'), 'bb', 'res:220', end('Red LED long leg (+)')] },
      { c: '#eab308', items: [pin('D3 S'), 'bb', 'res:220', end('Yellow LED long leg (+)')] },
      { c: '#22c55e', items: [pin('D4 S'), 'bb', 'res:220', end('Green LED long leg (+)')] },
      { c: GND, items: [pin('G'), 'bb', end('All three LED short legs')] }
    ],
    sketches: [{ file: 'p02_traffic_light', title: 'Traffic light' }],
    how: [
      'Each LED has its own pin. lights(true, false, false) means red on, yellow off, green off.',
      'The loop goes STOP, GET READY (red and yellow together, like in many countries), GO, SLOW DOWN, and then starts again.',
      'The times are constants at the top. Change them and the whole light changes, with nothing else to touch.'
    ],
    see: 'Red for four seconds, red and yellow, green for four seconds, yellow, and round again. The Serial Monitor names each stage.',
    tryThis: [
      'Make the green light longer than the red one.',
      'Add the touch sensor from the box as a crossing button: when somebody touches it, finish the green and go to red sooner.',
      'Make the yellow light blink three times before it goes red.'
    ],
    fix: [['One LED stays dark.', 'LEDs only work one way round. Turn it around, long leg to the resistor side.'], trouble.bb, trouble.nothing]
  },
  {
    id: 'p03', n: 3, slug: 'touch-lamp', title: 'Touch lamp', color: '#06b6d4', level: 1, minutes: 15, resistor: 'optional',
    tagline: 'Touch to switch a light on. Touch again to switch it off.',
    parts: [['Arduino Nano + base board', 1], ['Touch sensor module', 1], ['Female-female jumpers', 3], ['Optional: LED, 220 Ω resistor, breadboard', 1]],
    intro: 'The touch sensor has a small pad on it. When your finger lands on the pad, the signal pin goes HIGH. Here we use that as a switch for the light on the Nano. If you buy a resistor later, you can swap in a real LED.',
    noRes: 'This project needs no resistor because it uses the light on the Nano. To use a real LED, plug it into D4 with a 220 Ω resistor as in the traffic light, and change LED_PIN to 4 in the code.',
    steps: [
      'Unplug the USB.',
      'Connect three female-female jumpers from the base board D7 triplet to the touch sensor: S to the I/O pin, V to VCC, G to GND.',
      'Plug in the USB, upload, and touch the pad on the sensor with a fingertip.'
    ],
    rows: mod3('D7', 'Touch sensor', 'I/O'),
    sketches: [{ file: 'p03_touch_lamp', title: 'Touch lamp' }],
    how: [
      'digitalRead tells us if the pin is HIGH (touched) or LOW.',
      'If we only checked "is it touched", the lamp would flicker on and off while your finger rests. So we remember the last state in wasTouched and act only at the moment the finger lands.',
      'lampOn = !lampOn flips between true and false every time.'
    ],
    see: 'One touch and the lamp goes on, the next touch and it goes off. The Serial Monitor says the same.',
    tryThis: ['Make the lamp stay on only while you touch.', 'Make it blink three times when you touch.', 'Use a real LED on D4 with a resistor.'],
    fix: [['It switches on its own.', 'Keep your hand away from the board and the wires. Touch sensors can feel static. A shorter wire helps.'], trouble.nothing, trouble.upload]
  },
  {
    id: 'p04', n: 4, slug: 'night-light', title: 'Night light', color: '#4f46e5', level: 2, minutes: 20, resistor: 'optional',
    tagline: 'A lamp that switches itself on when the room goes dark.',
    parts: [['Arduino Nano + base board', 1], ['Light sensor module (LDR)', 1], ['Female-female jumpers', 3], ['Optional: LED, 220 Ω resistor, breadboard', 1]],
    intro: 'The light sensor changes its number with the light. You need to find out two things: what number you get in the light, and what you get in the dark. Different modules read in different directions, so we look at the numbers first.',
    noRes: 'No resistor needed when you use the light on the Nano. For a real LED, put it on D4 with a 220 Ω resistor and set LED_PIN to 4.',
    steps: [
      'Unplug the USB. Connect the sensor with three jumpers to the A0 triplet: S to the output labelled AO (or OUT), V to VCC, G to GND. If your module has four pins, use AO and not DO.',
      'Upload the code and open the Serial Monitor at 9600.',
      'Cover the sensor with your hand. Does the number go up or down? If it goes down, change DARK_GOES_UP to false.',
      'Note one number from a bright room and one from a dark room. Put THRESHOLD roughly halfway between.',
      'Upload again and test with your hand.'
    ],
    rows: mod3('A0', 'Light sensor', 'AO'),
    sketches: [{ file: 'p04_night_light', title: 'Night light' }],
    how: [
      'analogRead gives a number from 0 to 1023. 0 is 0 volts, 1023 is 5 volts.',
      'THRESHOLD is the line between "bright" and "dark". The sensor and the room decide where it should be, which is why we measure it first.',
      'The condition (light > THRESHOLD) or (light < THRESHOLD) is picked by the DARK_GOES_UP flag, so the same sketch works for both kinds of module.'
    ],
    see: 'Cover the sensor and the light turns on. Uncover it and the light goes off. The Serial Monitor prints every reading.',
    tryThis: ['Print a bar of # signs in the Serial Monitor that grows with the light.', 'Add a delay so the lamp stays on for at least 5 seconds.', 'Use a real LED on pin 5 and fade it with analogWrite.'],
    fix: [['The lamp is always on or always off.', 'Check THRESHOLD against the numbers in the Serial Monitor, and check DARK_GOES_UP.'], ['The number never changes.', 'You may have used the DO pin. Move the jumper to AO.'], trouble.nothing]
  },
  {
    id: 'p05', n: 5, slug: 'buzzer-doorbell', title: 'Which buzzer? And a doorbell', color: '#f59e0b', level: 1, minutes: 20, resistor: 'none',
    tagline: 'Find out what kind of buzzer you have, then make a tune.',
    parts: [['Arduino Nano + base board', 1], ['Buzzer', 1], ['Breadboard', 1], ['Touch sensor module (part B)', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'Buzzers come in two kinds. An active buzzer makes one fixed sound when it gets power. A passive buzzer is like a tiny speaker: you give it a pitch and it plays that note. Only a passive one can play tunes, so the first sketch tells you which one you have.',
    steps: [
      'Unplug the USB. Push the buzzer into the breadboard, one leg in each of two different rows. The longer leg is the + leg.',
      'Run a male-female jumper from D8 S on the base board to the row of the long leg. Run another from a G pin to the row of the short leg.',
      'Upload part A (Which buzzer?) and listen for about ten seconds.',
      'Read the table below, then set ACTIVE_BUZZER in part B to true or false.',
      'Wire the touch sensor to D7 with three female-female jumpers, as in Project 3, upload part B and touch the pad.'
    ],
    rows: [...buzzerRows('D8'), ...mod3('D7', 'Touch sensor (part B)', 'I/O')],
    sketches: [{ file: 'p05a_which_buzzer', title: 'Part A: Which buzzer do I have?' }, { file: 'p05b_doorbell', title: 'Part B: Doorbell' }],
    table: {
      head: ['What you hear', 'Your buzzer is'],
      rows: [
        ['Test A: a steady, loud beep. Test B: the same note every time, with little breaks', 'Active. Set ACTIVE_BUZZER to true. Melodies play as rhythms.'],
        ['Test A: silence or a small click. Test B: five different notes going up', 'Passive. Leave ACTIVE_BUZZER as false. You can play tunes.'],
        ['Nothing at all', 'Flip the legs, and check D8 S and G. Press the legs firmly into the breadboard.']
      ]
    },
    how: [
      'digitalWrite(HIGH) on a buzzer is plain power. An active buzzer has its own oscillator inside and starts to sing. A passive one just clicks.',
      'tone(pin, pitch, ms) makes the Nano switch the pin on and off very fast, hundreds of times a second. The pitch is the number of switches a second, in Hz. A passive buzzer turns that into a note.',
      'The note() helper picks the right way for your buzzer, so the doorbell code stays tidy.'
    ],
    see: 'Part A beeps and plays a scale, over and over. Part B plays a four note doorbell tune when you touch the pad.',
    tryThis: ['Change the notes in ding() to play your own tune. A table of note frequencies is easy to search for.', 'Make it play a different tune for a short touch and a long touch.', 'Make it play Happy Birthday.'],
    fix: [['The buzzer is quiet.', 'Active buzzers are loud on 5 V. If it clicks, it is probably a passive one.'], trouble.bb, trouble.nothing]
  },
  {
    id: 'p06', n: 6, slug: 'burglar-alarm', title: 'Burglar alarm', color: '#dc2626', level: 2, minutes: 20, resistor: 'none',
    tagline: 'An invisible beam that screams when somebody gets near.',
    parts: [['Arduino Nano + base board', 1], ['IR sensor module', 1], ['Buzzer', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'The IR module sends out infrared light and looks for its reflection. When something is in front of it, the output pin changes. Most modules pull the pin LOW when they see something. There is a tiny screw (a trimmer) on the module that changes how far it can see.',
    steps: [
      'Unplug the USB. Wire the buzzer to D8 as in Project 5.',
      'Wire the IR module with three female-female jumpers to the D2 triplet: S to OUT, V to VCC, G to GND.',
      'Upload. You have five seconds to point the sensor at the door, then it is ARMED.',
      'Wave a hand in front of the sensor. If it never fires, turn the tiny screw on the module slowly until the small light on the module comes on when your hand is 10 cm away.'
    ],
    rows: [...mod3('D2', 'IR sensor', 'OUT'), ...buzzerRows('D8')],
    sketches: [{ file: 'p06_burglar_alarm', title: 'Burglar alarm' }],
    how: [
      'SEES_THING is LOW for most IR modules. If yours is the other way round, change it to HIGH.',
      'setup() counts down five arming seconds, blinking the board light each second.',
      'siren() plays two alternating notes four times. On an active buzzer it beeps instead.'
    ],
    see: 'The Serial Monitor says ARMED, and then every wave of the hand sets off the siren and prints INTRUDER!',
    tryThis: ['Add the touch sensor as a secret disarm button.', 'Count how many times the alarm went off.', 'Make the siren get faster the longer someone stays there.'],
    fix: [['It is always ringing.', 'The module is seeing the table or wall. Turn the screw to shorten its range, or point it into open space.'], ['It never rings.', 'Check the small light on the module when you wave. If it flashes but the buzzer is quiet, the buzzer wiring is the problem. If it never flashes, check VCC and GND.'], trouble.nothing]
  },
  {
    id: 'p07', n: 7, slug: 'parking-sensor', title: 'Parking sensor', color: '#0891b2', level: 2, minutes: 25, resistor: 'none',
    tagline: 'Beeps faster the closer you get, just like a car.',
    parts: [['Arduino Nano + base board', 1], ['Ultrasonic sensor (HC-SR04)', 1], ['Buzzer', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 4 female-female', 6]],
    intro: 'The ultrasonic sensor makes a sound too high for you to hear and times how long the echo takes to return. Sound travels about 29 microseconds for a centimetre, and the echo has to go there and back, so the distance in centimetres is the time divided by 58.',
    steps: [
      'Unplug the USB. Wire the buzzer to D8.',
      'The ultrasonic sensor has four pins: VCC, Trig, Echo, GND. Connect Trig to D9 S and Echo to D10 S.',
      'Connect VCC to D9 V and GND to D9 G. This borrows power from the D9 triplet.',
      'Upload and slide your hand toward the sensor. Watch the distance in the Serial Monitor.'
    ],
    rows: [...usRows(), ...buzzerRows('D8')],
    sketches: [{ file: 'p07_parking_sensor', title: 'Parking sensor' }],
    how: [
      'We send a 10 microsecond pulse on TRIG. The sensor sends its sound and raises ECHO for as long as the sound takes to come back.',
      'pulseIn measures that time. It gives up after 25 ms, so the sketch does not hang when there is nothing to hear.',
      'map() turns a distance into a waiting time: close means a short gap between beeps, far means a long one.'
    ],
    see: 'Quiet beyond about 60 cm. Slow beeps as you come closer, fast beeps at 20 cm and a steady tone under 8 cm.',
    tryThis: ['Change FAR_CM and STOP_CM to make it more sensitive.', 'Show the distance as a row of # signs.', 'Add the light on the Nano flashing in time with the beeps.'],
    fix: [['The distance always says 999.', 'Check that Trig and Echo are on D9 and D10 and not swapped. Check VCC and GND.'], ['The numbers jump around.', 'Soft things like clothes absorb the sound. Try a flat wall or a book.'], trouble.nothing]
  },
  {
    id: 'p08', n: 8, slug: 'rain-alarm', title: 'Rain alarm', color: '#2563eb', level: 2, minutes: 20, resistor: 'none',
    tagline: 'Hang it out of the window and it tells you when the first drop falls.',
    parts: [['Arduino Nano + base board', 1], ['Raindrop sensor module and sensing pad', 1], ['Buzzer', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'The sensing pad has lots of thin copper lines. Water joins them together and lets current flow. The module turns that into a number: high when dry, lower when wet. Never put it in a bucket. A few drops are enough.',
    steps: [
      'Unplug the USB. Connect the pad to the module with the two wire cable that came with it.',
      'Wire the buzzer to D8 as in Project 5.',
      'Connect the module to the A0 triplet: S to AO, V to VCC, G to GND. Leave the DO pin empty.',
      'Upload and open the Serial Monitor. A dry pad reads close to 1000. Touch it with a wet fingertip and watch the number fall.',
      'If it does not trigger, change WET_BELOW to a number between the dry and the wet reading.'
    ],
    rows: [...mod3('A0', 'Rain module', 'AO'), ...buzzerRows('D8')],
    sketches: [{ file: 'p08_rain_alarm', title: 'Rain alarm' }],
    how: [
      'analogRead(A0) gives a number from 0 to 1023. Dry is high and wet is low, because water is a bad conductor and the module works the other way round from what you might expect.',
      'The wet flag is just value < WET_BELOW.',
      'alarm() beeps three times and then the loop reads the pad again.'
    ],
    see: 'The Serial Monitor prints "dry" with a big number. When a drop lands on the pad it prints RAIN! and the buzzer beeps.',
    tryThis: ['Print how many times it rained.', 'Make it beep only once per shower, and not every cycle.', 'Dry the pad with a tissue. Does the number come back?'],
    fix: [['It rings when dry.', 'Raise or lower WET_BELOW. A pad that has been wet and is only damp reads lower than before.'], ['The reading is stuck at 1023 or 0.', 'Check the cable between pad and module and the AO jumper.'], trouble.nothing]
  },
  {
    id: 'p09', n: 9, slug: 'water-tank', title: 'Water tank monitor', color: '#0d9488', level: 2, minutes: 25, resistor: 'none',
    tagline: 'Empty, low, half or full, shown on the screen and with a beep.',
    parts: [['Arduino Nano + base board', 1], ['Water level sensor', 1], ['Buzzer', 1], ['Breadboard', 1], ['A small cup of water', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'The water level sensor has a row of thin copper lines. The more of them are under water, the bigger the number. Only the lines go in the water. Keep the top part with the pins dry, and take the sensor out when you are done, because water slowly eats the copper.',
    steps: [
      'Unplug the USB. Wire the buzzer to D8.',
      'Wire the sensor to the A1 triplet: S to S, V to +, G to -.',
      'Upload and dip the sensor into the cup a little at a time. Write down the numbers you see at about a quarter, half and full.',
      'Put your numbers in LOW_LEVEL, HALF_LEVEL and FULL_LEVEL and upload again.'
    ],
    rows: [...mod3('A1', 'Water sensor', 'S', '+', '-'), ...buzzerRows('D8')],
    sketches: [{ file: 'p09_water_tank', title: 'Water tank monitor' }],
    how: [
      'The reading rises with the water, so each level is a bigger number than the last. The if / else if chain starts with the biggest, so the first match wins.',
      'The bar is built with a for loop that prints # for each filled level and a space for the rest.',
      'The light on the Nano comes on when the tank is empty, which is when you need to refill.'
    ],
    see: 'The Serial Monitor shows [####] FULL, [### ] HALF and so on. When full, the buzzer beeps.',
    tryThis: ['Make a version that warns when the tank is nearly empty, with a different sound.', 'Make the bar longer, with eight levels.', 'Power the sensor from a digital pin so it is only on while reading. That keeps the copper from wearing.'],
    fix: [['The number is always 0.', 'The lines are not under water, or the S wire is loose. Check A1 S.'], ['The numbers drift.', 'That is normal with this kind of sensor. Use the levels as a guide, not a measurement.'], trouble.nothing]
  },
  {
    id: 'p10', n: 10, slug: 'mood-lamp', title: 'Mood lamp', color: '#d946ef', level: 3, minutes: 35, resistor: 'needed',
    tagline: 'A colour-changing lamp. Touch it to change its mood.',
    parts: [['Arduino Nano + base board', 1], ['RGB LED', 1], ['Touch sensor module', 1], ['Breadboard', 1], ['Resistor 220 Ω (not in the box)', 3], ['Jumpers: 4 male-female, 3 female-female', 7]],
    intro: 'An RGB LED is three LEDs in one: red, green and blue. It has four legs. The longest leg is the shared one, which goes to ground. By lighting each colour a little or a lot, you can make any colour. Each colour leg needs a 220 Ω resistor.',
    noRes: 'This one needs the three resistors. Without them the RGB LED must stay unplugged. You can still run the sketch with HAVE_RESISTORS set to 0: it prints the mood names and blinks the light on the Nano once for mood 1, twice for mood 2 and so on.',
    steps: [
      'Unplug the USB. Push the RGB LED into the breadboard with each leg in its own row. The longest leg is the one second from the flat side.',
      'Put a 220 Ω resistor from each of the three shorter legs to an empty row.',
      'Run jumpers: D9 S to the red resistor, D10 S to green, D11 S to blue. The long leg goes to the G rail.',
      'Wire the touch sensor to D7 as in Project 3.',
      'Upload. The lamp starts as a rainbow. Touch to move to Calm, Happy, Sleepy and Excited.'
    ],
    rows: [
      { c: '#ef4444', items: [pin('D9 S'), 'bb', 'res:220', end('RGB red leg')] },
      { c: '#22c55e', items: [pin('D10 S'), 'bb', 'res:220', end('RGB green leg')] },
      { c: '#3b82f6', items: [pin('D11 S'), 'bb', 'res:220', end('RGB blue leg')] },
      { c: GND, items: [pin('G'), 'bb', end('RGB longest leg')] },
      ...mod3('D7', 'Touch sensor', 'I/O')
    ],
    sketches: [{ file: 'p10_mood_lamp', title: 'Mood lamp' }],
    how: [
      'analogWrite(pin, 0 to 255) switches the pin on and off thousands of times a second. 255 is always on, 0 is off, and the numbers between give a dimmer LED. Only pins marked with ~ on the Nano can do this: D3, D5, D6, D9, D10 and D11.',
      'Mix red 255, green 180, blue 0 and you get yellow. The mood table keeps one colour per mood.',
      'wheel() walks around the colour wheel: red fades into green, green into blue, blue back to red.'
    ],
    see: 'A slowly changing rainbow. Each touch picks a steady mood colour. After the fifth touch the rainbow is back.',
    tryThis: ['Add a sixth mood with your favourite colour.', 'Make the rainbow slower or faster.', 'Make the lamp go dark in a dark room, using the light sensor from Project 4.'],
    fix: [['The colours look wrong or inverted.', 'Your LED may be a common anode type. Connect the long leg to 5V instead of ground and set COMMON_ANODE to true.'], ['One colour is missing.', 'That leg is in the wrong row, or the resistor does not share a row with it.'], trouble.bb]
  },
  {
    id: 'p11', n: 11, slug: 'reaction-game', title: 'Reaction game', color: '#f97316', level: 2, minutes: 20, resistor: 'none',
    tagline: 'How fast are you? The Nano times you to the millisecond.',
    parts: [['Arduino Nano + base board', 1], ['Touch sensor module', 1], ['Buzzer (optional)', 1], ['Female-female jumpers', 3]],
    intro: 'Touch the sensor to start. After a random wait the light on the board comes on. Touch again as fast as you can. A good time is under 300 ms. If you touch before the light, you lose the round.',
    steps: ['Unplug the USB.', 'Wire the touch sensor to D7 as in Project 3. Optional: wire the buzzer to D8.', 'Upload, open the Serial Monitor, and touch the sensor to play.'],
    rows: [...mod3('D7', 'Touch sensor', 'I/O'), ...buzzerRows('D8')],
    sketches: [{ file: 'p11_reaction_game', title: 'Reaction game' }],
    how: [
      'millis() tells us how long the Nano has been on, in milliseconds. We read it when the light comes on and again when you touch, and subtract.',
      'random(2000, 6000) gives a different wait every time, so you cannot guess.',
      'best remembers the best time until you unplug the board.'
    ],
    see: 'The Serial Monitor says "Get ready", then the light comes on and it prints your time, for example "Your time: 287 ms".',
    tryThis: ['Make the light blink to confuse the player, with a rule that only a steady light counts.', 'Print a message for different speed ranges: Lightning, Quick, Sleepy.', 'Two players: use the IR sensor as the second button.'],
    fix: [['It always says Too early.', 'Your finger may still be on the pad, or the sensor is touching something. Let go and start again.'], trouble.nothing, trouble.serial]
  },
  {
    id: 'p12', n: 12, slug: 'light-theremin', title: 'Light theremin', color: '#8b5cf6', level: 3, minutes: 20, resistor: 'none',
    tagline: 'Play music with your hand, without touching anything.',
    parts: [['Arduino Nano + base board', 1], ['Light sensor module', 1], ['Buzzer (passive works best)', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'A theremin is a real instrument you play by moving your hands near it. This one reads the light. Cover the sensor and the pitch falls, uncover it and the pitch rises. It sounds best on a passive buzzer. An active buzzer only gives a beeper that changes speed.',
    steps: [
      'Unplug the USB. Wire the buzzer to D8 and the light sensor to A0, as in Projects 4 and 5.',
      'Upload and open the Serial Monitor to see the numbers for covered and uncovered.',
      'Put those numbers in LOW_READING and HIGH_READING, and upload again.',
      'If you found out in Project 5 that you have an active buzzer, set ACTIVE_BUZZER to true.'
    ],
    rows: [...mod3('A0', 'Light sensor', 'AO'), ...buzzerRows('D8')],
    sketches: [{ file: 'p12_light_theremin', title: 'Light theremin' }],
    how: [
      'constrain() keeps the reading inside our range, so the map is never out of bounds.',
      'map(light, 100, 900, 200, 2000) turns a light reading into a pitch between 200 and 2000 Hz.',
      'tone(pin, pitch) with no length keeps playing until the next call.'
    ],
    see: 'The pitch swoops up and down as you move your hand over the sensor.',
    tryThis: ['Flip the direction so more light gives a lower note.', 'Round the pitch to the nearest note of a scale.', 'Add the ultrasonic sensor and play it as a second instrument.'],
    fix: [['The note never changes.', 'Check the numbers in the Serial Monitor. If the reading hardly moves, shine a torch from the side.'], ['Only a click.', 'You may have an active buzzer. Set ACTIVE_BUZZER to true.'], trouble.nothing]
  },
  {
    id: 'p13', n: 13, slug: 'secret-knock', title: 'Secret knock lock', color: '#be185d', level: 3, minutes: 30, resistor: 'none',
    tagline: 'Short, short, long. Only you know the knock that opens it.',
    parts: [['Arduino Nano + base board', 1], ['Touch sensor module', 1], ['Buzzer (optional)', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'This lock listens to how long you touch the pad. Short and long touches make a code. The light on the board shows the lock: off means locked, on for three seconds means open. You can change the code to your own pattern.',
    steps: ['Unplug the USB.', 'Wire the touch sensor to D7 and the buzzer to D8.', 'Upload, open the Serial Monitor, and try: short, short, long.', 'Change SECRET and CODE_LENGTH and make your own.'],
    rows: [...mod3('D7', 'Touch sensor', 'I/O'), ...buzzerRows('D8')],
    sketches: [{ file: 'p13_secret_knock', title: 'Secret knock lock' }],
    how: [
      'We measure how long the pin stays HIGH. 300 ms or more is a long touch, less is short.',
      'Each touch goes into the entered[] list. When the list is as long as the code, we compare it letter by letter with SECRET.',
      'If you wait more than three seconds the list is cleared, so a half-finished code does not hang around.'
    ],
    see: 'The Serial Monitor prints each touch, and then UNLOCKED! or Wrong code. The light stays on three seconds when it opens.',
    tryThis: ['Make a longer code with 5 touches.', 'Make a three-strikes rule: after three wrong codes, sound an alarm.', 'Use the lock to guard the burglar alarm from Project 6.'],
    fix: [['Short touches count as long.', 'Raise LONG_MS to 400 or 500.'], ['It counts one touch twice.', 'Rest your finger on the pad. Small taps can bounce. Try a firmer press.'], trouble.nothing]
  },
  {
    id: 'p14', n: 14, slug: 'people-counter', title: 'People counter', color: '#16a34a', level: 2, minutes: 20, resistor: 'none',
    tagline: 'Count everyone who walks through, and ring when it gets crowded.',
    parts: [['Arduino Nano + base board', 1], ['IR sensor module', 1], ['Buzzer (optional)', 1], ['Breadboard', 1], ['Jumpers: 2 male-female, 3 female-female', 5]],
    intro: 'The IR module sees something in front of it. A person walking past makes the output change once, and we add one to the count. It works well with hands, and on a narrow doorway. When the count goes over the CAPACITY, an alarm sounds.',
    steps: ['Unplug the USB.', 'Wire the IR module to D2 as in Project 6 and the buzzer to D8.', 'Stick the sensor on the side of a doorway, or hold it, with the front facing the opening.', 'Upload. Pass your hand in front of it and watch the count go up.'],
    rows: [...mod3('D2', 'IR sensor', 'OUT'), ...buzzerRows('D8')],
    sketches: [{ file: 'p14_people_counter', title: 'People counter' }],
    how: [
      'blocked && !wasBlocked is true only at the moment the beam is first blocked, so one person counts as one, even if they stay in front for a while.',
      'people++ adds one to the count.',
      'The alarm starts after people > CAPACITY, which is five by default.'
    ],
    see: 'The Serial Monitor prints Count: 1, Count: 2... with a little beep and blink for each. After the sixth person it prints TOO MANY PEOPLE!',
    tryThis: ['Add a second touch sensor as a reset button.', 'Count down when people leave, using a second IR sensor.', 'Show the count as a row of blinks on the Nano light.'],
    fix: [['It counts twice for one hand.', 'Move the hand quickly, or add a longer delay at the end of the loop.'], ['It never counts.', 'Turn the little screw on the module until the module light comes on when your hand is close. Or change SEES_THING to HIGH.'], trouble.nothing]
  },
  {
    id: 'p15', n: 15, slug: 'hand-wave-switch', title: 'Hand-wave switch', color: '#0284c7', level: 3, minutes: 25, resistor: 'optional',
    tagline: 'Wave at the lamp to switch it. No buttons, no touching.',
    parts: [['Arduino Nano + base board', 1], ['Ultrasonic sensor (HC-SR04)', 1], ['Female-female jumpers', 4], ['Optional: LED, 220 Ω resistor, breadboard', 1]],
    intro: 'This works like the hand dryers in public toilets. The ultrasonic sensor measures the distance all the time. When a hand comes closer than 15 cm, the lamp changes: on becomes off, off becomes on.',
    noRes: 'No resistor needed with the light on the Nano. For a real LED, use D4 with a 220 Ω resistor and set LED_PIN to 4.',
    steps: ['Unplug the USB.', 'Wire the sensor as in Project 7: Trig to D9 S, Echo to D10 S, VCC to D9 V, GND to D9 G.', 'Upload, then hold your hand about 10 cm in front of the sensor and take it away.', 'Do it again to switch back.'],
    rows: usRows(),
    sketches: [{ file: 'p15_hand_wave_switch', title: 'Hand-wave switch' }],
    how: [
      'near is true when the distance is less than NEAR_CM.',
      'We switch only at the moment the hand arrives (near && !handThere), the same trick as in the touch lamp.',
      'Without that trick the lamp would flicker for as long as your hand stayed there.'
    ],
    see: 'Each wave toggles the lamp. The Serial Monitor tells you how far your hand was.',
    tryThis: ['Use a different distance for turning on and off.', 'Hold your hand there for two seconds to dim the lamp.', 'Put the sensor next to the light sensor and make the lamp work only in the dark.'],
    fix: [['Nothing happens.', 'Check the Serial Monitor. If the distance is always 999, Trig and Echo are swapped or VCC is loose.'], ['It flips back and forth.', 'Something else is close to the sensor. Point it away from the wall.'], trouble.nothing]
  }
];
