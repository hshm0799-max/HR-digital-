(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
      toggle.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu');
    };
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Highlight current page in nav
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(function (a) {
    if ((a.getAttribute('href') || '').toLowerCase() === page) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in-view'); });
  }

  // FAQ accordion (one open at a time)
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var btn = item.querySelector('.faq-question');
    var ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;
    var id = 'faq-answer-' + i;
    ans.id = id;
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-expanded', String(item.classList.contains('active')));
    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (o) {
        o.classList.remove('active');
        var b = o.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) { item.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  // Demo form handling (replace with Formspree / EmailJS / backend later)
  function status(form, type, msg) {
    var s = form.querySelector('.form-status');
    if (!s) {
      s = document.createElement('div');
      s.className = 'form-status';
      s.setAttribute('role', 'status');
      form.appendChild(s);
    }
    s.className = 'form-status ' + type;
    s.textContent = msg;
  }
  document.querySelectorAll('.footer-newsletter').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var isNews = form.classList.contains('footer-newsletter');
      // TODO: send new FormData(form) to your backend here.
      status(form, 'success', isNews
        ? 'Thanks for subscribing! (demo mode)'
        : 'Thank you! Your inquiry has been received. We will contact you within 24 hours. (demo mode)');
      form.reset();
    });
  });
})();

/* ===== HR Digital: contact, WhatsApp enquiry, Earth background (added) ===== */
(function () {
  'use strict';
  // >>> Change these in one place <<<
  var WA = '917061899614';            // WhatsApp number (country code + number, no +)
  var PHONE = '+917061899614';
  var MAIL = 'hshm0799@gmail.com';
  var waLink = function (text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); };

  // Floating Call + WhatsApp buttons and enquiry panel
  var icoWA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.35-2 1.4-.52.05-1 .25-3.36-.7-2.84-1.14-4.64-4.04-4.78-4.23-.14-.19-1.14-1.52-1.14-2.9s.72-2.06.98-2.34c.25-.28.55-.35.74-.35l.53.01c.17 0 .4-.06.62.48.25.57.84 1.98.9 2.12.07.14.12.31.02.5-.1.19-.14.3-.28.47-.14.17-.3.37-.42.5-.14.14-.29.3-.12.58.17.28.74 1.22 1.6 1.97 1.1.98 2.03 1.28 2.32 1.43.28.14.45.12.62-.07.17-.19.72-.84.91-1.12.19-.28.38-.23.64-.14.26.1 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.18 1.37Z"/></svg>';
  var icoCall = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2Z"/></svg>';
  var icoHead = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1C7 1 3 5 3 10v7a3 3 0 0 0 3 3h3v-8H5v-2c0-3.9 3.1-7 7-7s7 3.1 7 7v2h-4v8h3a3 3 0 0 0 3-3v-7c0-5-4-9-9-9Z"/></svg>';
  var icoMail = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg>';
  var stack = document.createElement('div');
  stack.className = 'fab-stack';
  stack.innerHTML =
    '<button class="fab fab-quote" type="button" aria-label="Get a quote" aria-expanded="false" title="Get a quote">' + icoHead + '</button>' +
    '<button class="fab fab-wa" type="button" aria-label="Chat on WhatsApp" aria-expanded="false" title="WhatsApp enquiry">' + icoWA + '</button>';
  var panel = document.createElement('div');
  panel.className = 'wa-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'WhatsApp enquiry');
  panel.innerHTML =
    '<div class="wa-head"><div><strong>HR Digital</strong><span>Send your enquiry on WhatsApp</span></div><button class="wa-close" type="button" aria-label="Close">✕</button></div>' +
    '<div class="wa-body"><input class="form-control" id="wa-name" placeholder="Your name" autocomplete="name">' +
    '<textarea class="form-control" id="wa-msg" placeholder="Write your message / enquiry"></textarea>' +
    '<button class="wa-send" type="button">Send on WhatsApp</button>' +
    '<span class="wa-note">WhatsApp will open with your message ready. Tap Send there.</span></div>';
  var qm = document.createElement('div');
  qm.className = 'quote-menu';
  var qText = 'Hello HR Digital, I would like a quote for digital marketing / website services.';
  qm.innerHTML = '<h3>Get a free quote</h3>' +
    '<a class="q-wa" href="' + waLink(qText) + '" target="_blank" rel="noopener">' + icoWA + 'WhatsApp Quote</a>' +
    '<a class="q-call" href="tel:' + PHONE + '">' + icoCall + 'Call Quote</a>' +
    '<a class="q-mail" href="mailto:' + MAIL + '?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(qText + '\n\nName:\nCity:\nService:') + '">' + icoMail + 'Gmail Quote</a>';
  document.body.appendChild(qm);
  var qbtn = stack.querySelector('.fab-quote');
  function toggleQuote(open) { qm.classList.toggle('open', open); qbtn.setAttribute('aria-expanded', String(open)); if (open) togglePanel(false); }
  qbtn.addEventListener('click', function () { toggleQuote(!qm.classList.contains('open')); });
  document.body.appendChild(stack);
  document.body.appendChild(panel);
  var fab = stack.querySelector('.fab-wa');
  function togglePanel(open) {
    if (open) qm.classList.remove('open');
    panel.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('#wa-msg').focus();
  }
  fab.addEventListener('click', function () { togglePanel(!panel.classList.contains('open')); });
  panel.querySelector('.wa-close').addEventListener('click', function () { togglePanel(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { togglePanel(false); toggleQuote(false); } });
  panel.querySelector('.wa-send').addEventListener('click', function () {
    var n = panel.querySelector('#wa-name').value.trim();
    var m = panel.querySelector('#wa-msg').value.trim();
    var text = 'Hello HR Digital,' + (n ? '\nName: ' + n : '') + '\nEnquiry: ' + (m || 'I want to know more about your services.');
    window.open(waLink(text), '_blank', 'noopener');
    togglePanel(false);
  });

  // Contact form -> WhatsApp
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var text = 'New website enquiry\n' +
        'Name: ' + v('name') + '\nPhone: ' + v('phone') + '\nEmail: ' + v('email') + '\n' +
        'Service: ' + v('service') + '\nBudget: ' + v('budget') + '\nMessage: ' + v('message');
      window.open(waLink(text), '_blank', 'noopener');
      var s = form.querySelector('.form-status');
      if (!s) { s = document.createElement('div'); s.setAttribute('role', 'status'); form.appendChild(s); }
      s.className = 'form-status success';
      s.textContent = 'Opening WhatsApp… tap Send to deliver your enquiry.';
    });
  });

  // Footer contact lines
  var fb = document.querySelector('.footer-brand');
  if (fb) {
    var fc = document.createElement('div');
    fc.className = 'footer-contact';
    fc.innerHTML = '<a href="tel:' + PHONE + '">📞 +91 70618 99614</a><a href="' + waLink('Hello HR Digital') + '" target="_blank" rel="noopener">💬 WhatsApp us</a><a href="mailto:' + MAIL + '">✉ ' + MAIL + '</a>';
    fb.appendChild(fc);
  }

  // 3D Earth background (pure canvas, no libraries)
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.createElement('canvas');
  cv.id = 'earth-bg';
  cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d');
  if (!ctx) return;
  var W, H, R, dpr, mx = 0, my = 0, tx = 0, ty = 0, stars = [], ocean = [], land = [];
  function noise(x, y, z) {
    return Math.sin(x * 3.1 + 1.3) * Math.cos(y * 2.7) + Math.sin(z * 3.7 + y * 2.1) * Math.cos(x * 2.3 + 2) +
      0.6 * Math.sin(x * 7 + z * 5) * Math.cos(y * 6 + 1);
  }
  function build() {
    ocean = []; land = [];
    var N = W < 700 ? 1500 : 2600;
    for (var i = 0; i < N; i++) {
      var y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      var x = Math.cos(th) * r, z = Math.sin(th) * r;
      (noise(x, y, z) > 0.3 ? land : ocean).push([x, y, z]);
    }
    stars = [];
    for (var s = 0; s < 150; s++) stars.push([Math.random(), Math.random(), Math.random() * 1.4 + 0.3, Math.random() * 6.28]);
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W * (W < 700 ? 0.46 : 0.3), H * 0.42);
    build();
  }
  function dots(list, cx, cy, ca, sa, cb, sb, color, landFlag) {
    ctx.fillStyle = color;
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      var x1 = p[0] * ca + p[2] * sa, z1 = -p[0] * sa + p[2] * ca;
      var y2 = p[1] * cb - z1 * sb, z2 = p[1] * sb + z1 * cb;
      if (z2 <= 0) continue;
      var light = 0.5 + 0.5 * (-0.45 * x1 + 0.45 * y2 + 0.75 * z2);
      ctx.globalAlpha = Math.min(1, 0.12 + 0.95 * light * (landFlag ? 1 : 0.8));
      var sz = (landFlag ? 1.8 : 1.3) + z2 * (landFlag ? 1.6 : 1);
      ctx.fillRect(cx + x1 * R - sz / 2, cy - y2 * R - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
  }
  function ringPt(phi, k, ca) {
    var inc = 1.15, g = -0.4;
    var x = Math.cos(phi), y = -Math.sin(phi) * Math.sin(inc), z = Math.sin(phi) * Math.cos(inc);
    return [(x * Math.cos(g) - y * Math.sin(g)) * k, (x * Math.sin(g) + y * Math.cos(g)) * k, z];
  }
  function ring(cx, cy, k, front, alpha) {
    ctx.beginPath();
    var open = false;
    for (var i = 0; i <= 180; i++) {
      var p = ringPt(i / 180 * 6.2832, k);
      var ok = front ? p[2] >= 0 : p[2] < 0;
      if (ok) { var X = cx + p[0] * R, Y = cy - p[1] * R; open ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); open = true; } else open = false;
    }
    ctx.strokeStyle = 'rgba(110,200,255,' + alpha + ')'; ctx.lineWidth = 1; ctx.stroke();
  }
  function frame(now) {
    var t = (now || 0) / 1000;
    var sc = window.scrollY || 0, prog = Math.min(sc / H, 1);
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    var cx = W * ((W < 700 ? 0.5 : 0.5 + 0.26 * prog)), cy = H * (0.52 - 0.06 * prog);
    var R0 = R; R = R0 * (1 - 0.12 * prog);
    ctx.clearRect(0, 0, W, H);
    // stars
    ctx.fillStyle = '#bfdcff';
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 1.4 + st[3]);
      ctx.fillRect(st[0] * W + mx * st[2] * 14, st[1] * H + my * st[2] * 14, st[2], st[2]);
    }
    ctx.globalAlpha = (W < 700 ? 0.85 : 1) * (1 - 0.35 * prog);
    // back ring
    ring(cx, cy, 1.42, false, 0.25);
    // atmosphere glow
    var g = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.32);
    g.addColorStop(0, 'rgba(40,150,255,.55)'); g.addColorStop(1, 'rgba(0,60,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.32, 0, 6.2832); ctx.fill();
    // sphere body
    var b = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
    b.addColorStop(0, 'rgba(45,140,255,.9)'); b.addColorStop(1, 'rgba(4,22,90,.95)');
    ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
    // dots
    var a = t * 0.12 + sc * 0.0008 + mx * 0.4, tilt = 0.41 + my * 0.12;
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(tilt), sb = Math.sin(tilt);
    dots(ocean, cx, cy, ca, sa, cb, sb, '#5aa8ff', false);
    dots(land, cx, cy, ca, sa, cb, sb, '#a6f3ff', true);
    // rim light
    ctx.strokeStyle = 'rgba(130,210,255,.55)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
    // front ring + satellite
    ring(cx, cy, 1.42, true, 0.6);
    var sp = ringPt(t * 0.45, 1.42), sx = cx + sp[0] * R, sy = cy - sp[1] * R;
    if (sp[2] >= 0 || Math.hypot(sp[0], sp[1]) > 1) {
      ctx.fillStyle = 'rgba(120,220,255,.25)'; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#e9fbff'; ctx.beginPath(); ctx.arc(sx, sy, 3, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    R = R0;
    if (!reduce) requestAnimationFrame(frame);
  }
  size();
  window.addEventListener('resize', function () { size(); if (reduce) frame(0); });
  window.addEventListener('pointermove', function (e) { tx = e.clientX / W - 0.5; ty = e.clientY / H - 0.5; }, { passive: true });
  if (reduce) { window.addEventListener('scroll', function () { frame(0); }, { passive: true }); frame(0); }
  else requestAnimationFrame(frame);
})();

/* ===== AI chat assistant (added) ===== */
(function () {
  'use strict';
  // Set this to your deployed backend (see ai-backend/README). Leave '' to use the built-in answers only.
  var AI_ENDPOINT = '';   // e.g. 'https://hr-chat.YOURNAME.workers.dev' or '/chat.php'
  var WA = '917061899614';

  var stack = document.querySelector('.fab-stack');
  if (!stack) return;
  var btn = document.createElement('button');
  btn.className = 'fab fab-ai'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Ask our AI assistant'); btn.setAttribute('aria-expanded', 'false'); btn.title = 'Ask AI';
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Zm7 11 .9 2.6L22.5 16.5l-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13ZM6 15l.7 2.1L8.8 18l-2.1.7L6 21l-.7-2.3L3 18l2.3-.9L6 15Z"/></svg>';
  stack.insertBefore(btn, stack.firstChild);

  var panel = document.createElement('div');
  panel.className = 'ai-panel';
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'AI assistant');
  panel.innerHTML =
    '<div class="ai-head"><div><strong>HR Digital AI</strong><span>AI assistant · ask anything</span></div><div><a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">WhatsApp</a><button type="button" class="ai-close" aria-label="Close chat">✕</button></div></div>' +
    '<div class="ai-log" aria-live="polite"></div>' +
    '<div class="ai-quick"></div>' +
    '<form class="ai-form"><input type="text" maxlength="500" placeholder="Type your question…" aria-label="Your question" autocomplete="off"><button type="submit">Send</button></form>';
  document.body.appendChild(panel);
  var log = panel.querySelector('.ai-log'), form = panel.querySelector('.ai-form'),
      input = form.querySelector('input'), send = form.querySelector('button'), quick = panel.querySelector('.ai-quick');

  var history = [];
  function add(role, text) {
    var d = document.createElement('div');
    d.className = 'ai-msg ' + (role === 'user' ? 'me' : 'bot');
    d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  }
  function open(v) {
    panel.classList.toggle('open', v); btn.setAttribute('aria-expanded', String(v));
    if (v) {
      document.querySelectorAll('.quote-menu,.wa-panel').forEach(function (e) { e.classList.remove('open'); });
      if (!log.children.length) {
        add('bot', 'Namaste! I am the HR Digital AI assistant. Ask me about websites, SEO, Meta Ads, Google Business Profile or any digital marketing question. You can write in English, Hindi or Hinglish.');
        ['What services do you offer?', 'How much does a website cost?', 'What is SEO / AEO / GEO?', 'I want a quote'].forEach(function (q) {
          var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
          b.addEventListener('click', function () { ask(q); }); quick.appendChild(b);
        });
      }
      setTimeout(function () { input.focus(); }, 50);
    }
  }
  btn.addEventListener('click', function () { open(!panel.classList.contains('open')); });
  panel.querySelector('.ai-close').addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  stack.addEventListener('click', function (e) { var b = e.target.closest('.fab-quote,.fab-wa'); if (b) panel.classList.remove('open'); });

  // Built-in answers (used when no backend is set or the backend is unreachable)
  var KB = [
    [/(hello|hi\b|hey|namaste|namaskar)/i, 'Hello! How can I help you today? You can ask about our services, pricing, Meta Ads, SEO or how to get a quote.'],
    [/(price|pricing|cost|charge|fee|kitna|rate|budget|quote)/i, 'The price depends on what you need (pages, features, ad budget, city). Please share your service, city and goal and tap WhatsApp for a quote: +91 70618 99614. You can also see the Pricing page.'],
    [/(aeo|geo|answer engine|generative)/i, 'AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) structure your content with clear answers, FAQs and schema so Google answers and AI assistants can understand and cite your business.'],
    [/\bseo\b|google rank|ranking/i, 'SEO helps your website appear in Google for what customers search. It includes keywords, content, technical fixes, Google Business Profile and links. It takes a few months, and no one can honestly guarantee a position.'],
    [/(meta|facebook|instagram|fb ads|insta)/i, 'We run Meta Ads (Facebook and Instagram) for leads, messages and sales. See the Meta Ads page for how campaigns, ad sets, ads and metrics like CPM, CTR, CPL and ROAS work.'],
    [/(google ads|adwords|ppc|search ads)/i, 'We set up and manage Google Ads (Search, Performance Max, YouTube) with conversion tracking so you can see calls and leads from your spend.'],
    [/(website|web site|landing|e-?commerce|store|app)/i, 'We build fast, mobile-friendly websites, landing pages and online stores designed to turn visitors into enquiries. A standard business site usually takes 1 to 3 weeks depending on pages and content.'],
    [/(google business|gmb|maps|local)/i, 'Google Business Profile optimisation helps you appear in local map results and get calls and direction requests. We set up, verify and optimise your profile.'],
    [/(service|offer|what do you do|kya karte)/i, 'We offer website design and development, SEO, AEO/GEO, Google Business Profile, Meta Ads, Google Ads, social media marketing and branding for businesses across India.'],
    [/(city|location|india|where|kahan|patna|delhi|mumbai)/i, 'We serve businesses in every city and state of India, working remotely. See the All India Locations page or tell me your city.'],
    [/(contact|call|phone|number|whatsapp|email|mail)/i, 'You can call or WhatsApp +91 70618 99614, or email hshm0799@gmail.com. Hours: Monday to Saturday, 10 AM to 7 PM.'],
    [/(time|how long|days|kitne din|delivery)/i, 'A standard website usually takes 1 to 3 weeks. Ads can start within a few days of approval. SEO is gradual and takes a few months.']
  ];
  function local(q) {
    for (var i = 0; i < KB.length; i++) if (KB[i][0].test(q)) return KB[i][1];
    return 'I can answer questions about our services, pricing, SEO, Meta Ads and websites. For anything else, please message us on WhatsApp +91 70618 99614 and our team will help.';
  }

  function ask(q) {
    q = (q || '').trim(); if (!q) return;
    quick.style.display = 'none';
    add('user', q); history.push({ role: 'user', content: q });
    input.value = ''; send.disabled = true;
    var t = add('bot', ''); t.innerHTML = '<span class="ai-typing"><i></i><i></i><i></i></span>';
    function done(text) {
      t.textContent = text; history.push({ role: 'assistant', content: text });
      send.disabled = false; log.scrollTop = log.scrollHeight;
    }
    if (!AI_ENDPOINT) { setTimeout(function () { done(local(q)); }, 450); return; }
    var ctl = new AbortController(), to = setTimeout(function () { ctl.abort(); }, 30000);
    fetch(AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12) }), signal: ctl.signal })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { done(d.reply || local(q)); })
      .catch(function () { done(local(q)); })
      .then(function () { clearTimeout(to); });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
})();

/* ===== v3: live counters, order modal, address ===== */
(function () {
  'use strict';
  var WA = '917061899614', MAIL = 'hshm0799@gmail.com', SERVICES = {"aeo-geo": "AEO and GEO", "apk-app-development": "Android App", "branding": "Branding and Logo Design", "content-email-marketing": "Content and Email Marketing", "digital-marketing": "Digital Marketing Agency Services", "ecommerce-website": "E-Commerce Website Development", "google-ads": "Google Ads", "google-business-seo": "Google Business SEO", "hotel-website": "Hotel Website Design", "lead-generation-email": "Lead Generation and Email Marketing", "lead-generation": "Lead Generation Marketing", "marketplace-ads": "Marketplace Ads", "meta-ads": "Meta Ads", "portfolio-website": "Portfolio Website Design", "restaurant-website": "Restaurant Website Design", "school-college-website": "School and College Website Design", "seo": "SEO", "social-media-marketing": "Social Media Marketing", "ui-ux-web-design": "Web Design and UI/UX", "web-application-development": "Web Application and UI/UX Design", "web-design-development": "Website Design and Development Agency", "website-development": "Website Development", "website-redesign": "Website Redesign Services", "whatsapp-crm": "WhatsApp and CRM Automation", "wordpress-development": "WordPress and PHP Development", "wordpress-shopify-development": "WordPress and Shopify Development"};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Live counters
  var els = document.querySelectorAll('.count');
  function run(el) {
    var to = +el.dataset.to, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = to + suf; return; }
    (function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }); }, { threshold: 0.4 });
    els.forEach(function (e) { e.textContent = '0' + (e.dataset.suffix || ''); io.observe(e); });
  } else els.forEach(run);

  // Order modal -> WhatsApp / Gmail
  var opts = '<option value="">Select service</option>' + Object.keys(SERVICES).map(function (k) { return '<option value="' + k + '">' + SERVICES[k] + '</option>'; }).join('');
  var back = document.createElement('div');
  back.className = 'order-back';
  back.innerHTML = '<div class="order-box" role="dialog" aria-modal="true" aria-label="Order a service"><h2>Order a service</h2><p>Fill this in and your order goes to our WhatsApp. We reply with a quote.</p>' +
    '<select class="form-control" id="o-svc">' + opts + '</select>' +
    '<select class="form-control" id="o-pkg"><option>Starter</option><option>Growth</option><option>Custom</option></select>' +
    '<input class="form-control" id="o-name" placeholder="Your name" autocomplete="name">' +
    '<input class="form-control" id="o-phone" placeholder="Phone number" type="tel" autocomplete="tel">' +
    '<input class="form-control" id="o-city" placeholder="City">' +
    '<textarea class="form-control" id="o-note" placeholder="Details (optional)"></textarea>' +
    '<div class="order-actions"><button type="button" id="o-wa">Order on WhatsApp</button><button type="button" class="alt" id="o-mail">Order by Gmail</button><button type="button" class="alt" id="o-x">Cancel</button></div></div>';
  document.body.appendChild(back);
  var $ = function (id) { return back.querySelector('#' + id); };
  function text() {
    var s = $('o-svc').value;
    if (!$('o-name').value.trim() || !$('o-phone').value.trim() || !s) { alert('Please select a service and enter your name and phone.'); return null; }
    return 'New order\nService: ' + SERVICES[s] + '\nPackage: ' + $('o-pkg').value + '\nName: ' + $('o-name').value.trim() + '\nPhone: ' + $('o-phone').value.trim() + '\nCity: ' + $('o-city').value.trim() + '\nDetails: ' + $('o-note').value.trim();
  }
  function close() { back.classList.remove('open'); }
  $('o-x').onclick = close;
  back.addEventListener('click', function (e) { if (e.target === back) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  $('o-wa').onclick = function () { var t = text(); if (t) { window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t), '_blank', 'noopener'); close(); } };
  $('o-mail').onclick = function () { var t = text(); if (t) { location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('New order') + '&body=' + encodeURIComponent(t); close(); } };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-order]');
    if (!b) return;
    e.preventDefault();
    $('o-svc').value = b.getAttribute('data-order') || '';
    back.classList.add('open');
    setTimeout(function () { $('o-name').focus(); }, 50);
  });
  // add "Order Online" to quote menu
  var qm = document.querySelector('.quote-menu');
  if (qm) { var a = document.createElement('a'); a.href = '#'; a.setAttribute('data-order', ''); a.className = 'q-call'; a.textContent = '🛒 Order Online'; qm.insertBefore(a, qm.children[1]); }
  var fc = document.querySelector('.footer-contact');
  if (fc) { var ad = document.createElement('a'); ad.href = 'https://maps.app.goo.gl/MQGaVS48uFE2V7Ro8'; ad.target = '_blank'; ad.rel = 'noopener'; ad.textContent = '📍 Pahadi Mandir, Harmu Rd, Kumhartoli, Ranchi 834001'; fc.appendChild(ad); }
})();
