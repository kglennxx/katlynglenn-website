(function () {
  // Mobile menu
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  if (header && btn) {
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Year in footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Work page: series filters
  var filterBtns = document.querySelectorAll('.filters button');
  var blocks = document.querySelectorAll('.series-block');
  function applyFilter(key) {
    filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.filter === key ? 'true' : 'false'); });
    blocks.forEach(function (s) { s.hidden = !(key === 'all' || s.dataset.series === key); });
  }
  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.dataset.filter); });
  });
  if (filterBtns.length) {
    var h = (location.hash || '').replace('#', '');
    var match = Array.prototype.some.call(filterBtns, function (b) { return b.dataset.filter === h; });
    applyFilter(match ? h : 'all');
  }

  // Lightbox
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('p');
    var lbClose = lb.querySelector('.close');
    var lastFocus = null;
    document.querySelectorAll('.work button').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = b.querySelector('img');
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCap.textContent = img.alt;
        lastFocus = b;
        lb.classList.add('open');
        lbClose.focus();
      });
    });
    function close() { lb.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Contact form: sends through FormSubmit (free, emails each enquiry to Katlyn)
  var form = document.getElementById('contact-form');
  if (form) {
    var ok = document.getElementById('form-ok');
    var err = document.getElementById('form-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ok.classList.add('hidden'); err.classList.add('hidden');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok || String(d.success) !== 'true') throw new Error(d.message || r.status); }); })
        .then(function () { form.reset(); ok.classList.remove('hidden'); })
        .catch(function () { err.classList.remove('hidden'); })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }
})();

// One-page: highlight the nav link for the section in view, close menu after a tap
(function () {
  var links = document.querySelectorAll('.nav a[href^="#"]');
  var header = document.querySelector('.site-header');
  links.forEach(function (a) {
    a.addEventListener('click', function () { if (header) header.classList.remove('open'); });
  });
  if (!('IntersectionObserver' in window) || !links.length) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && map[e.target.id]) {
        links.forEach(function (a) { a.classList.remove('active'); });
        map[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
})();
