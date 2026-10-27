// The box contents (from the kit list), what each part is for, and what to search when buying more.
// `used` lists project numbers. `kind` picks the little picture on the Your box page.
module.exports = {
  parts: [
    { name: 'Arduino Nano', qty: '1', kind: 'nano', color: '#2fa6a0', used: 'all', what: 'The brain. It runs your code.', know: 'Plugs into the base board. Leave it on the base board all the time.', search: 'arduino nano' },
    { name: 'Nano base board', qty: '1', kind: 'nano', color: '#4c97ff', used: 'all', what: 'Gives every Nano pin three sockets in a row: S (signal), V (5 volts), G (ground).', know: 'Most modules plug in with three jumpers, one in each. If it has a 3.3V/5V jumper, set it to 5V.', search: 'nano shield io expansion board' },
    { name: 'USB cable', qty: '1', kind: 'jumper', color: '#7c4dff', used: 'all', what: 'Brings power to the Nano and carries your code across.', know: 'If the computer cannot see the Nano, try another cable. Some only charge.', search: 'usb mini b cable arduino nano' },
    { name: 'LEDs, assorted colours', qty: '25', kind: 'led', color: '#ef4444', used: '2, 3, 4, 15 (optional in 3, 4, 15)', what: 'Small lights.', know: 'They work one way round only: the long leg is plus (+). They need a 220 Ω resistor.', search: '5mm led assorted' },
    { name: 'RGB LEDs', qty: '5', kind: 'led', color: '#d946ef', used: '10', what: 'Red, green and blue LEDs in one. Mix them to get any colour.', know: 'Four legs. The longest is the shared one (ground, usually). Each colour leg needs a 220 Ω resistor.', search: '5mm rgb led common cathode' },
    { name: 'IR sensor module', qty: '1', kind: 'module', color: '#22c55e', used: '6, 14', what: 'Sees things in front of it using invisible infrared light.', know: 'Pins: OUT, VCC, GND. Output goes LOW when it sees something. A tiny screw sets the range.', search: 'ir obstacle sensor module' },
    { name: 'Light sensor module (LDR)', qty: '1', kind: 'module', color: '#8b5cf6', used: '4, 12', what: 'Gives a number that changes with the light in the room.', know: 'Use the AO pin for numbers. Pins: AO, VCC, GND (some modules also have DO).', search: 'ldr sensor module' },
    { name: 'Buzzer', qty: '1', kind: 'buzzer', color: '#2b2f4a', used: '5, 6, 7, 8, 9, 11, 12, 13, 14', what: 'Beeps.', know: 'Two legs, the longer one is plus (+). Project 5 tells you if it can play notes (passive) or only beep (active).', search: 'buzzer 5v passive' },
    { name: 'Touch sensor module', qty: '1', kind: 'module', color: '#06b6d4', used: '3, 5, 10, 11, 13', what: 'A pad that feels a finger. Like a button with no moving part.', know: 'Pins: I/O, VCC, GND. Output goes HIGH while you touch it.', search: 'ttp223 touch sensor module' },
    { name: 'Raindrop sensor', qty: '1', kind: 'module', color: '#2563eb', used: '8', what: 'A sensing pad on a cable and a small module. Water on the pad lowers the number.', know: 'Module pins: AO, DO, GND, VCC. Keep the module dry, only the pad gets wet.', search: 'raindrop sensor module' },
    { name: 'Water level sensor', qty: '1', kind: 'module', color: '#0d9488', used: '9', what: 'A strip with copper lines. The more of it is underwater, the bigger the number.', know: 'Pins: S, +, -. Dip only the lines and dry it after. Water slowly eats the copper.', search: 'water level sensor arduino' },
    { name: 'Ultrasonic sensor (HC-SR04)', qty: '1', kind: 'module', color: '#0ea5e9', used: '7, 15', what: 'Measures distance using sound you cannot hear.', know: 'Four pins: VCC, Trig, Echo, GND. Two "eyes" on the front: one sends, one listens.', search: 'hc-sr04 ultrasonic sensor' },
    { name: '400-point breadboard', qty: '1', kind: 'bb', color: '#f5f5f2', used: '2, 3 to 15 when an LED or buzzer is used', what: 'A board for building circuits without soldering.', know: 'The five holes in one short row are joined. The long strips on the sides are power rails.', search: '400 point breadboard' },
    { name: 'Jumper wires', qty: '3 packs of 40', kind: 'jumper', color: '#f59e0b', used: 'all', what: 'Wires with a plug on each end.', know: 'Female end has a hole, male end has a pin. You should have female-female, male-female and male-male.', search: 'jumper wires male female 40' }
  ],
  missing: [
    { name: 'Resistors, 220 Ω', why: 'LED projects (2 and 10, and a real LED in 3, 4 and 15). Anything from 150 to 470 Ω works.', search: '220 ohm resistor' },
    { name: 'Resistors, 10 kΩ', why: 'Only if you want to build your own light sensor from a bare LDR (project ideas, not needed for the 15).', search: '10k ohm resistor' }
  ],
  next: [
    { name: 'SG90 servo motor', why: 'Makes the secret knock lock (13) open a real latch, or the hand-wave switch (15) wave a flag.', search: 'sg90 servo' },
    { name: '0.96 inch OLED display (I2C)', why: 'Show the parking distance or the reaction time on a screen.', search: '0.96 oled i2c' },
    { name: 'Push buttons', why: 'Real buttons for the reaction game and the lock.', search: 'push button tactile' },
    { name: 'DHT11 temperature and humidity sensor', why: 'Build a small weather station.', search: 'dht11' },
    { name: 'Relay module', why: 'Switch a mains lamp safely with an adult. Do not do this alone.', search: 'relay module 5v' },
    { name: 'More resistors, LEDs and wires', why: 'Always useful.', search: 'resistor kit assorted' }
  ],
  shops: [
    { name: 'Robocraze', url: 'https://robocraze.com', search: 'https://robocraze.com/search?q=', note: 'Bengaluru. Good for kits and modules.' },
    { name: 'Robu.in', url: 'https://robu.in', search: 'https://robu.in/?post_type=product&s=', note: 'Wide range of boards and sensors.' },
    { name: 'Think Robotics', url: 'https://thinkrobotics.com', search: '', note: 'Arduino boards and modules.' },
    { name: 'Electronicscomp', url: 'https://www.electronicscomp.com', search: '', note: 'Components and modules.' },
    { name: 'Flipkart', url: 'https://www.flipkart.com', search: 'https://www.flipkart.com/search?q=', note: 'Easy for small packs of resistors and wires.' },
    { name: 'Amazon.in', url: 'https://www.amazon.in', search: 'https://www.amazon.in/s?k=', note: 'Check the seller and the reviews.' }
  ],
  learn: [
    { group: 'Start here', items: [
      ['Arduino Nano page', 'https://docs.arduino.cc/hardware/nano/', 'Official guide to your board.'],
      ['Arduino IDE download', 'https://www.arduino.cc/en/software', 'The program you write code in.'],
      ['Arduino Learn', 'https://docs.arduino.cc/learn/', 'Tutorials from the Arduino team, from first steps up.'],
      ['Built-in examples', 'https://docs.arduino.cc/built-in-examples/', 'Short, well explained example programs. The IDE has them under File, Examples.']
    ] },
    { group: 'More projects to build', items: [
      ['Arduino Project Hub (Nano)', 'https://projecthub.arduino.cc/tag/arduino-nano', 'Thousands of projects shared by makers, filtered for the Nano.'],
      ['Random Nerd Tutorials', 'https://randomnerdtutorials.com/projects-arduino/', 'Step by step Arduino projects with wiring pictures.'],
      ['Adafruit Learn', 'https://learn.adafruit.com/category/learn-arduino', 'Long, friendly guides.'],
      ['Instructables: Arduino', 'https://www.instructables.com/circuits/arduino/projects/', 'Projects from people all over the world.']
    ] },
    { group: 'Try circuits without wires', items: [
      ['Tinkercad Circuits', 'https://www.tinkercad.com/circuits', 'Free. Build and run Arduino circuits in your browser before you touch a wire.']
    ] },
    { group: 'Look up how code works', items: [
      ['Arduino language reference', 'https://docs.arduino.cc/language-reference/', 'Every function with a short example.'],
      ['Arduino on YouTube', 'https://www.youtube.com/@ArduinoOfficial', 'Videos from the Arduino team.']
    ] }
  ],
  ref: {
    tone: ['tone()', 'https://docs.arduino.cc/language-reference/en/functions/advanced-io/tone/'],
    analogRead: ['analogRead()', 'https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/'],
    analogWrite: ['analogWrite()', 'https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/'],
    pulseIn: ['pulseIn()', 'https://docs.arduino.cc/language-reference/en/functions/advanced-io/pulseIn/'],
    millis: ['millis()', 'https://docs.arduino.cc/language-reference/en/functions/time/millis/'],
    map: ['map()', 'https://docs.arduino.cc/language-reference/en/functions/math/map/'],
    Serial: ['Serial', 'https://docs.arduino.cc/language-reference/en/functions/communication/serial/']
  }
};
