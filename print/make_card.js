// node print/make_card.js  ->  print/pdf/QR card (A6) and QR card sheet (A4, 4 per page)
const fs = require('fs'), path = require('path'), cp = require('child_process');
global.self = global; require('../src/art.js');
const qr = fs.readFileSync(path.join(__dirname, 'qr.svg'), 'utf8').replace(/<svg [^>]*?(viewBox="[^"]*")?[^>]*?>/, (m) => { const w = /width="(\d+)"/.exec(m)[1], h = /height="(\d+)"/.exec(m)[1]; return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" shape-rendering="crispEdges">'; });
const bug = global.CampArt.raw('bug');
const card = `<div class="card"><div class="top"><span class="logo"><i style="background:#ffbf00"></i><i style="background:#4c97ff"></i><i style="background:#3fb950"></i><i style="background:#ff6680"></i></span><b>Chip Camp Kit</b></div>
<div class="main"><div class="l"><h1>Scan me!<br><span>15 projects for your kit</span></h1>
<ol><li><b>1</b><span>Point your phone camera at the code.</span></li><li><b>2</b><span>Open <u>Getting started</u> and set up the Arduino IDE once.</span></li><li><b>3</b><span>Build <u>Project 1: Hello Nano</u>. Then keep going!</span></li></ol>
<p class="url">abhijithgiridhar.github.io/chipcamp-projects</p></div>
<div class="r"><div class="qr">${qr}</div><div class="bug">${bug}</div></div></div></div>`;
const css = `@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@600;800&display=swap');
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Nunito","Trebuchet MS",sans-serif;color:#2b2f4a}
.card{width:148mm;height:105mm;background:#eef3ff;border:1mm solid #7c4dff;border-radius:6mm;overflow:hidden;display:flex;flex-direction:column}
.top{background:linear-gradient(90deg,#7c4dff,#4c97ff);color:#fff;display:flex;align-items:center;gap:3mm;padding:2.5mm 6mm;font-family:"Fredoka",sans-serif;font-size:13pt}
.logo{display:grid;grid-template-columns:repeat(2,3mm);gap:.8mm;transform:rotate(-8deg)}.logo i{width:3mm;height:3mm;border-radius:1mm;display:block}
.main{flex:1;display:flex;gap:5mm;padding:5mm 6mm}.l{flex:1;display:flex;flex-direction:column}
h1{font-family:"Fredoka",sans-serif;font-size:30pt;line-height:1;margin:0 0 3mm;color:#7c4dff}h1 span{display:block;font-size:12pt;color:#ff6680;margin-top:1.5mm}
ol{list-style:none;margin:0;padding:0;font-size:10pt}li{display:flex;gap:2.5mm;align-items:center;margin:1.6mm 0;line-height:1.2}
li b{flex:none;width:6mm;height:6mm;border-radius:2mm;color:#fff;font-family:"Fredoka",sans-serif;display:grid;place-items:center;font-size:11pt}
li:nth-child(1) b{background:#ffbf00}li:nth-child(2) b{background:#3fb950}li:nth-child(3) b{background:#4c97ff}u{text-decoration:none;font-weight:800;color:#7c4dff}
.url{margin:auto 0 0;font-family:"Fredoka",sans-serif;font-size:9pt;font-weight:600;background:#fff;border:.6mm solid #d3def6;border-radius:3mm;padding:1.8mm 3mm;white-space:nowrap}
.r{width:46mm;display:flex;flex-direction:column;align-items:center;gap:2mm}
.qr{width:44mm;height:44mm;background:#fff;padding:2.5mm;border-radius:4mm;border:1mm solid #ffbf00;box-shadow:1.2mm 1.2mm 0 #ff6680}.bug{width:24mm}.bug svg{width:100%;height:auto}
.sheet{display:grid;grid-template-columns:148mm 148mm;grid-template-rows:105mm 105mm;width:297mm;height:210mm}
.sheet .card{border-radius:0;border-width:.3mm;border-color:#999}`;
const out = path.join(__dirname, 'pdf'); fs.mkdirSync(out, { recursive: true });
const C = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
function pdf(name, html, size) {
  const f = path.join(out, name + '.html');
  fs.writeFileSync(f, '<!doctype html><meta charset="utf-8"><style>' + css + (size ? '@page{size:' + size + ';margin:0}' : '') + '</style>' + html);
  cp.execFileSync(C, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=' + path.join(out, name + '.pdf'), 'file://' + f], { stdio: 'ignore' });
  fs.unlinkSync(f);
}
pdf('Box QR card (single, A5 landscape)', card, '148mm 105mm');
pdf('Box QR cards (4 on one A4 landscape sheet)', '<div class="sheet">' + card.repeat(4) + '</div>', '297mm 210mm');
console.log('done');
