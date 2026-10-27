// node tests/run.js  (add --compile to also compile every sketch for the Nano with arduino-cli)
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.join(__dirname, '..');
const P = require('../projects.js');
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL ' + m); };
const docs = path.join(root, 'docs');

if (P.length !== 15) fail('expected 15 projects, found ' + P.length);
P.forEach((p) => {
  p.sketches.forEach((s) => { if (!fs.existsSync(path.join(root, 'sketches', s.file, s.file + '.ino'))) fail(p.id + ' missing sketch ' + s.file); });
  if (!fs.existsSync(path.join(docs, p.slug + '.html'))) fail('no page for ' + p.id);
  if (p.resistor !== 'none' && !p.noRes && p.resistor === 'needed') fail(p.id + ' needs a no-resistor note');
  p.rows.forEach((r) => { if (!/^pin:/.test(r.items[0]) || !/^end:/.test(r.items[r.items.length - 1])) fail(p.id + ' wiring row must start with pin: and end with end:'); });
});
fs.readdirSync(docs).filter((f) => f.endsWith('.html')).forEach((f) => {
  const h = fs.readFileSync(path.join(docs, f), 'utf8');
  (h.match(/href="([^"#:]+\.html)"/g) || []).forEach((a) => { const t = a.slice(6, -1); if (!fs.existsSync(path.join(docs, t))) fail(f + ' links to missing ' + t); });
  if (/—/.test(h)) fail(f + ' contains an em dash');
});
// sketches should stay ASCII so the Arduino IDE does not choke on pasted text
fs.readdirSync(path.join(root, 'sketches')).forEach((d) => {
  const t = fs.readFileSync(path.join(root, 'sketches', d, d + '.ino'), 'utf8');
  if (/[^\x00-\x7f]/.test(t)) fail(d + ' has non-ASCII characters');
});
if (process.argv.includes('--compile')) {
  const AC = '/Applications/Arduino IDE.app/Contents/Resources/app/lib/backend/resources/arduino-cli';
  fs.readdirSync(path.join(root, 'sketches')).forEach((d) => {
    try { cp.execFileSync(AC, ['compile', '--fqbn', 'arduino:avr:nano:cpu=atmega328', path.join(root, 'sketches', d)], { stdio: 'pipe' }); }
    catch (e) { fail('compile ' + d + '\n' + String(e.stdout || e.stderr).slice(0, 400)); }
  });
}
console.log(bad ? bad + ' problem(s)' : 'all checks passed');
process.exit(bad ? 1 : 0);
