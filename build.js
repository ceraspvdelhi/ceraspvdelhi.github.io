// node build.js  ->  writes the site into ./docs (index, start, box, and one page per project)
const fs = require('fs');
const path = require('path');
const P = require('./projects.js');
const CAT = require('./catalog.js');
const root = (p) => path.join(__dirname, p);
const OUT = root('docs');
const CSS = fs.readFileSync(root('src/site.css'), 'utf8');
const JS = fs.readFileSync(root('src/site.js'), 'utf8');
global.self = global;
require('./src/art.js');
const ART = global.CampArt;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SITE = 'https://abhijithgiridhar.github.io/chipcamp-projects/';

// ---------- code colouring ----------
const KW = /\b(const|int|bool|void|if|else|for|while|return|true|false|HIGH|LOW|INPUT|OUTPUT|long|unsigned|char|static|define|byte)\b/;
function colour(code) {
  const re = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|(#define|\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*)(?=\s*\()|(\b[A-Za-z_]\w*\b)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += '<span class="t-c">' + esc(t) + '</span>';
    else if (m[2]) out += '<span class="t-s">' + esc(t) + '</span>';
    else if (m[3]) out += '<span class="' + (t[0] === '#' ? 't-k' : 't-n') + '">' + esc(t) + '</span>';
    else if (m[4]) out += KW.test(t) ? '<span class="t-k">' + t + '</span>' : '<span class="t-f">' + t + '</span>';
    else out += KW.test(t) ? '<span class="t-k">' + t + '</span>' : esc(t);
    last = m.index + t.length;
  }
  return out + esc(code.slice(last));
}

// ---------- wiring diagram ----------
function diagram(rows) {
  const W = 760, RH = 62, pad = 12;
  const H = rows.length * RH + pad * 2;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wiring diagram">';
  s += '<text x="12" y="14" font-family="Fredoka,sans-serif" font-size="12" fill="#69709a">NANO BASE BOARD</text>';
  s += '<text x="' + (W - 12) + '" y="14" text-anchor="end" font-family="Fredoka,sans-serif" font-size="12" fill="#69709a">PART</text>';
  rows.forEach((r, i) => {
    const y = pad + 16 + i * RH + RH / 2 - 8;
    const first = r.items[0].replace('pin:', ''), last = r.items[r.items.length - 1].replace('end:', '');
    const lw = Math.max(86, first.length * 9 + 24), rw = Math.max(150, last.length * 8.2 + 26);
    const x0 = 10 + lw, x1 = W - 10 - rw;
    s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="' + r.c + '" stroke-width="6" stroke-linecap="round"/>';
    const mids = r.items.slice(1, -1);
    mids.forEach((it, k) => {
      const cx = x0 + (x1 - x0) * (k + 1) / (mids.length + 1);
      if (it === 'bb') {
        s += '<rect x="' + (cx - 38) + '" y="' + (y - 16) + '" width="76" height="32" rx="6" fill="#fff" stroke="#9aa6c8" stroke-width="2"/>';
        for (let a = 0; a < 5; a++) for (let b = 0; b < 2; b++) s += '<circle cx="' + (cx - 24 + a * 12) + '" cy="' + (y - 6 + b * 12) + '" r="2" fill="#9aa6c8"/>';
        s += '<text x="' + cx + '" y="' + (y + 30) + '" text-anchor="middle" font-family="Nunito,sans-serif" font-size="11" fill="#69709a">breadboard</text>';
      } else if (it.indexOf('res:') === 0) {
        s += '<rect x="' + (cx - 42) + '" y="' + (y - 11) + '" width="84" height="22" rx="8" fill="#f2d7a4" stroke="#b78a3a" stroke-width="2"/>';
        [['#c0392b', -22], ['#c0392b', -10], ['#7b4a1e', 2]].forEach((b) => { s += '<rect x="' + (cx + b[1]) + '" y="' + (y - 11) + '" width="5" height="22" fill="' + b[0] + '"/>'; });
        s += '<text x="' + cx + '" y="' + (y + 30) + '" text-anchor="middle" font-family="Nunito,sans-serif" font-size="11" fill="#69709a">' + it.slice(4) + ' Ω resistor</text>';
      }
    });
    s += '<rect x="10" y="' + (y - 16) + '" width="' + lw + '" height="32" rx="10" fill="#fff" stroke="' + r.c + '" stroke-width="3"/>';
    s += '<text x="' + (10 + lw / 2) + '" y="' + (y + 5) + '" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#2b2f4a">' + esc(first) + '</text>';
    s += '<rect x="' + x1 + '" y="' + (y - 16) + '" width="' + rw + '" height="32" rx="10" fill="' + r.c + '"/>';
    s += '<text x="' + (x1 + rw / 2) + '" y="' + (y + 5) + '" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="800" font-size="14" fill="#fff">' + esc(last) + '</text>';
  });
  return s + '</svg>';
}

function wiringTable(rows) {
  let t = '<table><tr><th>From (base board)</th><th>Through</th><th>To</th><th>Jumper</th></tr>';
  rows.forEach((r) => {
    const via = [];
    if (r.items.indexOf('bb') >= 0) via.push('breadboard');
    r.items.forEach((it) => { if (it.indexOf('res:') === 0) via.push(it.slice(4) + ' Ω resistor'); });
    const jump = r.items.indexOf('bb') >= 0 ? 'male-female (female end on the base board)' : 'female-female';
    t += '<tr><td><b>' + esc(r.items[0].replace('pin:', '')) + '</b></td><td>' + (via.join(' then ') || 'direct') + '</td><td>' + esc(r.items[r.items.length - 1].replace('end:', '')) + '</td><td>' + jump + '</td></tr>';
  });
  return t + '</table>';
}

// ---------- page shell ----------
const logo = '<span class="logo"><i style="background:#ffbf00"></i><i style="background:#4c97ff"></i><i style="background:#3fb950"></i><i style="background:#ff6680"></i></span>';
function shell(title, body, opts) {
  opts = opts || {};
  const nav = [['index.html', 'Projects'], ['start.html', 'Getting started'], ['box.html', 'Your box'], ['buy.html', 'Buy parts'], ['learn.html', 'Learn more']]
    .map((n) => '<a href="' + n[0] + '"' + (opts.page === n[0] ? ' aria-current="page"' : '') + '>' + n[1] + '</a>').join('');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(title) + '</title><meta name="description" content="' + esc(opts.desc || 'Fifteen Arduino projects for the Chip Camp take-home kit.') + '">' +
    '<style>' + CSS + '</style></head><body' + (opts.color ? ' style="--pc:' + opts.color + '"' : '') + '>' +
    '<header class="top"><div class="wrap"><a class="brand" href="index.html">' + logo + 'Chip Camp Kit</a><nav class="nav">' + nav + '</nav></div></header>' +
    body +
    '<footer>Chip Camp take-home kit · made by your trainer. All sketches are for the Arduino Nano.</footer>' +
    '<script>' + JS + '</script></body></html>';
}

const resPill = { none: ['ok', 'No extra parts'], optional: ['blue', 'Resistor optional'], needed: ['warn', 'Needs 220 Ω resistors'] };
const stars = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

// ---------- project page ----------
function projectPage(p, i) {
  const rp = resPill[p.resistor];
  const code = (sk) => {
    const src = fs.readFileSync(root('sketches/' + sk.file + '/' + sk.file + '.ino'), 'utf8');
    return '<div class="code" data-file="' + sk.file + '.ino"><div class="bar"><b>' + esc(sk.title) + '</b>' +
      '<button class="btn small" data-copy>Copy code</button><button class="btn small" data-dl>Download .ino</button></div>' +
      '<pre>' + colour(src) + '</pre><textarea hidden>' + esc(src) + '</textarea></div>';
  };
  let b = '<div class="banner"><div class="wrap"><div class="num">' + p.n + '</div><div><h1>' + esc(p.title) + '</h1><p>' + esc(p.tagline) + '</p>' +
    '<div class="pillrow"><span class="pill ' + rp[0] + '">' + rp[1] + '</span><span class="pill">' + p.minutes + ' min</span><span class="pill">Level ' + stars(p.level) + '</span></div></div></div></div><div class="wrap">';
  b += '<section class="block"><h2>What you will make</h2><p>' + esc(p.intro) + '</p>';
  if (p.noRes) b += '<div class="note"><b>No resistors?</b> ' + esc(p.noRes) + '</div>';
  b += '</section>';
  b += '<section class="block"><h2>What you need</h2><ul class="parts">' + p.parts.map((x) => '<li class="' + (/not in the box/.test(x[0]) ? 'miss' : '') + '"><b>' + x[1] + '</b>' + esc(x[0]) + '</li>').join('') + '</ul>' + (p.parts.some((x) => /not in the box/.test(x[0])) ? '<p><a class="btn" href="buy.html">Where to get 220 Ω resistors</a></p>' : '') + '<p class="soft">Each part is described on <a href="box.html">Your box</a>.</p></section>';
  b += '<section class="block"><h2>Build it</h2><ol class="steps">' + p.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>';
  if (p.rows.length) {
    b += '<h2>Wiring</h2><div class="diagram">' + diagram(p.rows) + '</div>' + wiringTable(p.rows) +
      '<h3>Tick each wire when it is done</h3><ul class="ticks">' + p.rows.map((r) => '<li><label><input type="checkbox"> ' + esc(r.items[0].replace('pin:', '')) + ' → ' + esc(r.items[r.items.length - 1].replace('end:', '')) + '</label></li>').join('') + '</ul><div class="note"><b>Before you plug in the USB:</b> every box above is ticked and no bare metal legs touch each other.' + (p.rows.some((r) => r.items.some((i) => i.indexOf('res:') === 0)) ? ' The long leg of each LED goes to the resistor side.' : '') + '</div><div class="tip">Always change wires with the USB unplugged. Orange is a signal wire, red is power (5 V) and dark is ground. Your real jumpers can be any colour.</div>';
  }
  b += '</section><section class="block"><h2>The code</h2><p>Open the Arduino IDE, delete everything in the window, paste this, and press Upload. Board settings are on the <a href="start.html">Getting started</a> page.</p>' + p.sketches.map(code).join('');
  if (p.table) b += '<table><tr>' + p.table.head.map((h) => '<th>' + h + '</th>').join('') + '</tr>' + p.table.rows.map((r) => '<tr>' + r.map((c) => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>';
  b += '</section><section class="block"><h2>What you should see</h2><p>' + esc(p.see) + '</p><h2>How it works</h2><ul class="plain">' + p.how.map((h) => '<li>' + esc(h) + '</li>').join('') + '</ul></section>';
  const srcAll = p.sketches.map((sk) => fs.readFileSync(root('sketches/' + sk.file + '/' + sk.file + '.ino'), 'utf8')).join('\n');
  const refs = Object.keys(CAT.ref).filter((k) => new RegExp('\\b' + k + (k === 'Serial' ? '\\.' : '\\(')).test(srcAll));
  if (refs.length) b += '<section class="block"><h2>Look it up</h2><p>Every command in this sketch is explained on the Arduino site:</p><div class="pillrow">' + refs.map((k) => '<a class="pill blue" target="_blank" rel="noopener" href="' + CAT.ref[k][1] + '">' + CAT.ref[k][0] + '</a>').join('') + '</div><p>More like this: <a href="learn.html">projects and tutorials online</a>.</p></section>';
  b += '<section class="block"><h2>Try this</h2><ul class="plain">' + p.tryThis.map((h) => '<li>' + esc(h) + '</li>').join('') + '</ul></section>';
  b += '<section class="block"><h2>If it does not work</h2>' + p.fix.map((f) => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') + '</section>';
  b += '<button class="btn go built" data-built="' + p.id + '">I built it!</button>';
  const prev = P[i - 1], next = P[i + 1];
  b += '<div class="nextrow">' + (prev ? '<a class="btn" href="' + prev.slug + '.html">← ' + prev.n + '. ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn" href="' + next.slug + '.html">' + next.n + '. ' + esc(next.title) + ' →</a>' : '<a class="btn" href="index.html">All projects</a>') + '</div></div>';
  return shell(p.n + '. ' + p.title + ' · Chip Camp Kit', b, { color: p.color, desc: p.tagline });
}

// ---------- index ----------
function indexPage() {
  let b = '<div class="wrap"><div class="hero"><div><h1>Your Chip Camp kit, 15 projects</h1><p class="lead">Everything here uses only what is in your box. Start at project 1 and work your way up, or jump to whatever looks fun.</p>' +
    '<div class="pillrow"><a class="btn go" href="start.html">Start here: set up the Arduino IDE</a><a class="btn" href="box.html">What is in my box?</a></div>' +
    '<p><span class="pill" id="count">0 of 15 built</span></p></div><div class="art">' + ART.html('bug') + '</div></div>';
  b += '<div class="note"><b>One thing is not in the box:</b> resistors. Projects 2 and 10 need a few 220 Ω resistors from any electronics shop, and projects 3, 4 and 15 can use a real LED if you have them. Every project tells you before you start and shows what to do without them.</div>';
  b += '<div class="grid">' + P.map((p) => {
    const rp = resPill[p.resistor];
    return '<a class="card" id="c-' + p.id + '" href="' + p.slug + '.html" style="--pc:' + p.color + '"><div class="band"><span class="num">' + p.n + '</span><h3>' + esc(p.title) + '</h3><span class="done">✓</span></div><div class="body"><p>' + esc(p.tagline) + '</p><div class="pillrow" style="margin:0"><span class="pill ' + rp[0] + '">' + rp[1] + '</span><span class="pill">' + p.minutes + ' min</span><span class="pill">' + stars(p.level) + '</span></div></div></a>';
  }).join('') + '</div></div>';
  return shell('Chip Camp Kit · 15 projects', b, { page: 'index.html' });
}

// ---------- getting started ----------
function startPage() {
  const li = (s) => '<li>' + s + '</li>';
  let b = '<div class="wrap"><div class="hero"><div><h1>Getting started</h1><p class="lead">Ten minutes, once. After this, every project is just wires and code.</p></div><div class="art">' + ART.html('chip') + '</div></div>';
  b += '<section class="block"><h2>1. Put the Nano on its base board</h2><ol class="steps">' +
    li('Hold the base board with its screw terminals and pin rows facing up. Look for the USB socket drawing on it.') +
    li('Press the Nano into the two long rows of sockets, with the Nano\'s USB socket at the same end as the drawing. Press evenly. Never force it.') +
    li('If your base board has a little jumper or switch marked 3.3V and 5V, set it to 5V.') + '</ol>' +
    '<div class="tip">The base board gives every pin three sockets in a row: <b>S</b> (signal), <b>V</b> (5 volts) and <b>G</b> (ground). Most modules plug in with three jumpers, one to each. That is why we say "wire it to the D7 triplet".</div></section>';
  b += '<section class="block"><h2>2. Install the Arduino IDE</h2><ol class="steps">' +
    li('Go to <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">arduino.cc/en/software</a> and download the Arduino IDE (version 2 is fine) for your computer.') +
    li('Install it and open it. Nothing else to install for these projects. No libraries.') + '</ol></section>';
  b += '<section class="block"><h2>3. Plug in and pick the board</h2><ol class="steps">' +
    li('Plug the USB cable into the Nano and into the computer. A power light comes on.') +
    li('In the IDE, open <b>Tools</b>, then <b>Board</b>, and choose <b>Arduino Nano</b>.') +
    li('In <b>Tools</b>, then <b>Processor</b>, choose <b>ATmega328P (Old Bootloader)</b>. Most Nano boards sold in India need this one. If the upload fails later, try the other choice.') +
    li('In <b>Tools</b>, then <b>Port</b>, choose the port that appeared when you plugged in. On a Mac it looks like /dev/cu.usbserial or wchusbserial. On Windows it is COM3 or another COM number.') + '</ol>' +
    '<div class="note"><b>No port appears?</b> Your Nano probably uses a CH340 chip and your computer needs its driver. Search for "CH340 driver" for your system, install it, unplug the Nano and plug it back in. Also try another USB cable if you have one. Some cables only charge.</div></section>';
  b += '<section class="block"><h2>4. Your first upload</h2><ol class="steps">' +
    li('Open <a href="hello-nano.html">Project 1: Hello Nano</a>. Copy the code.') +
    li('In the IDE delete everything in the editor window and paste.') +
    li('Press the arrow (Upload). The light on the board flickers while it sends. Wait for "Done uploading".') +
    li('Open the Serial Monitor (magnifying glass, top right) and set 9600 baud at the bottom right. You should see your Nano talking.') + '</ol></section>';
  b += '<section class="block"><h2>5. Rules of the bench</h2><ul class="plain"><li><b>Unplug the USB before you move any wire.</b> Wires first, USB last.</li><li>Red is power, dark is ground. Do not let the two touch.</li><li>An LED always needs a resistor, unless you use the light that is already on the Nano.</li><li>Take the water sensors out of the water and dry them when you are done.</li></ul></section>';
  b += '<section class="block"><h2>When the upload fails</h2>' +
    [['avrdude: stk500_getsync(): not in sync', 'Change Processor to the other bootloader choice. Check the Port. Unplug the Nano and try another USB port.'],
     ['Port is greyed out or missing', 'Install the CH340 driver (see above), and try another cable.'],
     ['Compile error', 'The code was not pasted whole. Delete everything in the editor, copy again with the Copy code button, and paste. If it says "undefined reference to setup and loop", this is the cause.'],
     ['It uploads, nothing happens', 'Open the Serial Monitor at 9600. If it prints, the Nano is fine and the problem is a wire. Check each wire against the table on the project page.']]
      .map((f) => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') + '</section></div>';
  return shell('Getting started · Chip Camp Kit', b, { page: 'start.html' });
}

// ---------- box ----------
const tile = (kind, color) => {
  const base = '<svg viewBox="0 0 200 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  const pins = (n, x0, y) => Array.from({ length: n }, (_, i) => '<rect x="' + (x0 + i * 16) + '" y="' + y + '" width="8" height="12" rx="2" fill="#2b2f4a"/>').join('');
  if (kind === 'module') return base + '<rect x="40" y="10" width="120" height="58" rx="10" fill="' + color + '"/><circle cx="70" cy="36" r="12" fill="#fff" opacity=".85"/><rect x="100" y="26" width="40" height="20" rx="4" fill="#fff" opacity=".5"/>' + pins(4, 76, 68) + '</svg>';
  if (kind === 'led') return base + '<path d="M80 52 V28 a20 20 0 0 1 40 0 V52 Z" fill="' + color + '"/><rect x="74" y="50" width="52" height="6" fill="' + color + '"/><rect x="88" y="56" width="4" height="26" fill="#9aa6c8"/><rect x="108" y="56" width="4" height="20" fill="#9aa6c8"/></svg>';
  if (kind === 'buzzer') return base + '<circle cx="100" cy="42" r="32" fill="#2b2f4a"/><circle cx="100" cy="42" r="8" fill="#69709a"/><text x="62" y="26" font-family="Fredoka" font-size="16" fill="#fff">+</text></svg>';
  if (kind === 'nano') return base + '<rect x="30" y="18" width="140" height="48" rx="6" fill="' + color + '"/><rect x="30" y="34" width="18" height="16" fill="#cfd6e6"/><rect x="92" y="30" width="30" height="24" rx="2" fill="#2b2f4a"/></svg>';
  if (kind === 'bb') return base + '<rect x="20" y="10" width="160" height="64" rx="8" fill="#f5f5f2" stroke="#d3def6" stroke-width="2"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((a) => [0, 1, 2, 3, 4].map((b) => '<circle cx="' + (34 + a * 15) + '" cy="' + (22 + b * 11) + '" r="2.5" fill="#9aa6c8"/>').join('')).join('') + '</svg>';
  return base + '<path d="M20 60 C50 10 80 90 110 40 S160 20 180 30" stroke="' + color + '" stroke-width="7" fill="none" stroke-linecap="round"/></svg>';
};
function boxPage() {
  const parts = CAT.parts.map((x) => [x.kind, x.color, x.name + (x.qty !== '1' ? ' (' + x.qty + ')' : ''), x.what, x.know]);
  let b = '<div class="wrap"><div class="hero"><div><h1>What is in my box?</h1><p class="lead">The full list of what came in the box, what each part is for, and which projects use it.</p></div><div class="art">' + ART.html('kid') + '</div></div>';
  b += '<section class="block"><h2>The full list</h2><table><tr><th>Part</th><th>How many</th><th>Used in project</th></tr>' + CAT.parts.map((x) => '<tr><td><b>' + esc(x.name) + '</b></td><td>' + esc(x.qty) + '</td><td>' + esc(x.used === 'all' ? 'all of them' : x.used) + '</td></tr>').join('') + '</table><p>Count them when you open the box. If something is missing or broken, tell your trainer. You can also <a href="buy.html">buy a spare</a>.</p></section>';
  b += '<h2>What each part is</h2><div class="parttiles">' + parts.map((x) => '<div class="ptile">' + tile(x[0], x[1]) + '<h3>' + esc(x[2]) + '</h3><p>' + esc(x[3]) + '</p><p><b>Good to know:</b> ' + esc(x[4]) + '</p></div>').join('') + '</div>';
  b += '<div class="note" style="margin-top:20px"><b>Not in the box: resistors.</b> A resistor limits the current. LEDs need one. Buy a small pack of 220 Ω resistors (any value from 150 to 470 Ω works) at any electronics shop. The colours on a 220 Ω are red, red, brown. Projects 2 and 10 need them. Projects 3, 4 and 15 work without them by using the light on the Nano. <a href="buy.html">Where to buy</a>.</div>';
  b += '<section class="block"><h2>How the base board works</h2><p>Each pin on the Nano has three sockets on the base board in a row.</p><table><tr><th>Letter</th><th>What it is</th><th>Wire colour in this site</th></tr><tr><td><b>S</b></td><td>Signal. The pin the code talks to.</td><td>Orange</td></tr><tr><td><b>V</b></td><td>5 volts of power.</td><td>Red</td></tr><tr><td><b>G</b></td><td>Ground. The way back.</td><td>Dark</td></tr></table></section>';
  b += '<section class="block"><h2>How the breadboard works</h2>' +
    '<div class="diagram"><svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="620" height="150" rx="14" fill="#f5f5f2" stroke="#d3def6" stroke-width="3"/>' +
    [0, 1, 2, 3, 4].map((r) => Array.from({ length: 20 }, (_, c) => '<circle cx="' + (60 + c * 26) + '" cy="' + (36 + r * 16) + '" r="4" fill="' + (c % 5 === 2 ? '#7c4dff' : '#9aa6c8') + '"/>').join('')).join('') +
    '<rect x="40" y="28" width="26" height="86" rx="6" fill="none" stroke="#ef4444" stroke-width="3"/><text x="53" y="132" text-anchor="middle" font-family="Nunito" font-size="12" fill="#ef4444">these 5 are joined</text>' +
    '<rect x="30" y="140" width="580" height="10" rx="5" fill="#ef4444" opacity=".35"/><text x="620" y="152" text-anchor="end" font-family="Nunito" font-size="11" fill="#69709a">power rail</text></svg></div>' +
    '<ul class="plain"><li>The five holes in one short column (or row, depending how you turn it) are joined by metal under the plastic. Push two legs into the same group and they are connected.</li><li>The long strips along the sides are the power rails. We use one for ground. A jumper from any G pin to the rail gives every part on the board a ground.</li><li>The gap in the middle splits the board in two halves. The halves are not joined.</li></ul></section>';
  b += '<section class="block"><h2>Jumper wires</h2><ul class="plain"><li><b>Female-female</b> (a hole at both ends): from a module pin to the base board pin. These go on most modules.</li><li><b>Male-female</b> (a pin at one end, a hole at the other): the hole goes on the base board, the pin goes into the breadboard.</li><li><b>Male-male</b> (a pin at both ends): inside the breadboard, or from rail to row.</li></ul><p>If you are not sure which pack is which, look at the plug ends.</p></section></div>';
  return shell('Your box · Chip Camp Kit', b, { page: 'box.html' });
}

function buyPage() {
  const link = (shop, term) => shop.search ? '<a href="' + shop.search + encodeURIComponent(term) + '" target="_blank" rel="noopener">' + shop.name + '</a>' : '';
  let b = '<div class="wrap"><div class="hero"><div><h1>Where to buy parts</h1><p class="lead">Spares, resistors, and things to grow your kit. Type the words in the last column into any shop below. Prices and stock change, so check the shop.</p></div><div class="art">' + ART.html('chip') + '</div></div>';
  b += '<section class="block"><h2>Shops to search</h2><p>Open any of these and type what you need in their search box. The words to type are in the tables below.</p><ul class="plain">' + CAT.shops.map((z) => '<li><a href="' + z.url + '" target="_blank" rel="noopener"><b>' + z.name + '</b></a>: ' + esc(z.note) + '</li>').join('') + '</ul></section>';
  b += '<section class="block"><h2>You need these for the projects</h2><table><tr><th>Part</th><th>Why</th><th>Search for</th></tr>' + CAT.missing.map((x) => '<tr><td><b>' + esc(x.name) + '</b></td><td>' + esc(x.why) + '</td><td>' + '<code>' + esc(x.search) + '</code>' + '</td></tr>').join('') + '</table><div class="tip">Ask for "220 ohm, quarter watt, through hole". A pack of 100 costs very little and lasts a long time.</div></section>';
  b += '<section class="block"><h2>Spares for what is in your box</h2><table><tr><th>Part</th><th>Search for</th></tr>' + CAT.parts.map((x) => '<tr><td><b>' + esc(x.name) + '</b></td><td>' + '<code>' + esc(x.search) + '</code>' + '</td></tr>').join('') + '</table></section>';
  b += '<section class="block"><h2>Ideas for your next purchase</h2><table><tr><th>Part</th><th>What you could make</th><th>Search for</th></tr>' + CAT.next.map((x) => '<tr><td><b>' + esc(x.name) + '</b></td><td>' + esc(x.why) + '</td><td>' + '<code>' + esc(x.search) + '</code>' + '</td></tr>').join('') + '</table></section>';
  b += '</div>';
  return shell('Buy parts · Chip Camp Kit', b, { page: 'buy.html' });
}
function learnPage() {
  let b = '<div class="wrap"><div class="hero"><div><h1>Learn more</h1><p class="lead">Finished the 15? These are good places to go next.</p></div><div class="art">' + ART.html('kids') + '</div></div>';
  b += CAT.learn.map((g) => '<section class="block"><h2>' + esc(g.group) + '</h2><ul class="plain">' + g.items.map((i) => '<li><a href="' + i[1] + '" target="_blank" rel="noopener"><b>' + esc(i[0]) + '</b></a>: ' + esc(i[2]) + '</li>').join('') + '</ul></section>').join('');
  b += '<section class="block"><h2>Make your own project</h2><ol class="steps"><li>Pick one of the 15 and change one thing. A different sensor, a different sound, a different rule.</li><li>Draw what should happen before you write code: "when this, then that".</li><li>Get one part working at a time. Check it in the Serial Monitor.</li><li>When it works, write down the wiring so you can build it again.</li></ol></section></div>';
  return shell('Learn more · Chip Camp Kit', b, { page: 'learn.html' });
}
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
fs.writeFileSync(path.join(OUT, 'start.html'), startPage());
fs.writeFileSync(path.join(OUT, 'box.html'), boxPage());
fs.writeFileSync(path.join(OUT, 'buy.html'), buyPage());
fs.writeFileSync(path.join(OUT, 'learn.html'), learnPage());
P.forEach((p, i) => fs.writeFileSync(path.join(OUT, p.slug + '.html'), projectPage(p, i)));
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('built ' + (P.length + 5) + ' pages into docs/');
