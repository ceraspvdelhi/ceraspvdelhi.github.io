(function () {
  var KEY = 'chipcampkit.built';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  var built = load();
  document.querySelectorAll('.code').forEach(function (box) {
    var text = box.querySelector('textarea').value;
    box.querySelector('[data-copy]').onclick = function (ev) {
      var b = ev.currentTarget;
      var done = function () { b.textContent = 'Copied!'; setTimeout(function () { b.textContent = 'Copy code'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      else fallback();
      function fallback() { var t = box.querySelector('textarea'); t.hidden = false; t.select(); document.execCommand('copy'); t.hidden = true; done(); }
    };
    box.querySelector('[data-dl]').onclick = function () {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      a.download = box.getAttribute('data-file');
      document.body.appendChild(a); a.click(); a.remove();
    };
  });
  var btn = document.querySelector('[data-built]');
  if (btn) {
    var id = btn.getAttribute('data-built');
    var paint = function () { btn.textContent = built[id] ? 'Built it! (tap to undo)' : 'I built it!'; };
    btn.onclick = function () { if (built[id]) delete built[id]; else built[id] = 1; save(built); paint(); };
    paint();
  }
  var count = document.getElementById('count');
  if (count) {
    var n = 0;
    Object.keys(built).forEach(function (k) { var c = document.getElementById('c-' + k); if (c) { c.classList.add('is-done'); n++; } });
    count.textContent = n + ' of 15 built';
  }
})();
