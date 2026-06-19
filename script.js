/* ============================================================
   PULSE LABS — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loader ---------------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 700);
    });
    // fallback in case load event already fired
    setTimeout(() => loader.classList.add('is-hidden'), 2200);
  }

  /* ---------------- Year in footer ---------------- */
  document.querySelectorAll('.cur-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------------- Sticky nav ---------------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
    const btt = document.querySelector('.back-to-top');
    if (btt) btt.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-active');
      links.classList.remove('is-open');
    }));
  }

  /* ---------------- Back to top ---------------- */
  const btt = document.querySelector('.back-to-top');
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Cursor glow ---------------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  }

  /* ---------------- Service card hover glow ---------------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-fade');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => {
      el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.num[data-count]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffixEl = el.querySelector('.suffix');
      const suffix = suffixEl ? suffixEl.outerHTML : '';
      const dur = 1600;
      const start = performance.now();
      const isFloat = target % 1 !== 0;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.innerHTML = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.innerHTML = (isFloat ? target.toFixed(1) : target) + suffix;
      }
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------------- Typing effect ---------------- */
  const typeEl = document.querySelector('[data-typing]');
  if (typeEl) {
    const words = JSON.parse(typeEl.dataset.typing);
    let wIdx = 0, cIdx = 0, deleting = false;
    const span = document.createElement('span');
    span.className = 'accent';
    typeEl.appendChild(span);
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    typeEl.appendChild(cursor);

    function loop() {
      const word = words[wIdx];
      if (!deleting) {
        cIdx++;
        span.textContent = word.slice(0, cIdx);
        if (cIdx === word.length) { deleting = true; setTimeout(loop, 1600); return; }
      } else {
        cIdx--;
        span.textContent = word.slice(0, cIdx);
        if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
      }
      setTimeout(loop, deleting ? 45 : 85);
    }
    loop();
  }

  /* ---------------- Hero neural canvas ---------------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const mouse = { x: null, y: null };
    const NODE_COUNT_BASE = 70;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(NODE_COUNT_BASE, Math.floor((w * h) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(124,92,255,${0.16 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        if (mouse.x !== null) {
          const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.strokeStyle = `rgba(255,122,69,${0.45 * (1 - dist / 180)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245,244,248,0.55)';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------- Parallax floating elements ---------------- */
  const floatEls = document.querySelectorAll('.float-el');
  if (floatEls.length) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      floatEls.forEach(el => {
        const depth = parseFloat(el.dataset.depth || 20);
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  /* ---------------- Parallax on scroll (hero blobs) ---------------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const sc = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax || 0.2);
        el.style.transform = `translateY(${sc * speed}px)`;
      });
    }, { passive: true });
  }

  /* ---------------- Project filter ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const match = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------------- Testimonial slider ---------------- */
  const slides = document.querySelectorAll('.testi-slide');
  if (slides.length) {
    let current = 0;
    const dotsWrap = document.querySelector('.testi-dots');
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap && dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];

    function goTo(i) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }
    document.querySelector('.testi-next')?.addEventListener('click', () => goTo(current + 1));
    document.querySelector('.testi-prev')?.addEventListener('click', () => goTo(current - 1));
    let autoplay = setInterval(() => goTo(current + 1), 6000);
    document.querySelector('.testi-wrap')?.addEventListener('mouseenter', () => clearInterval(autoplay));
    document.querySelector('.testi-wrap')?.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(current + 1), 6000);
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Contact form validation ---------------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = contactForm.querySelectorAll('[data-validate]');
      fields.forEach(field => {
        const wrap = field.closest('.field');
        const rule = field.dataset.validate;
        let ok = true;
        if (rule === 'required') ok = field.value.trim().length > 0;
        if (rule === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (rule === 'min10') ok = field.value.trim().length >= 10;
        wrap.classList.toggle('has-error', !ok);
        if (!ok) valid = false;
      });
      const successMsg = contactForm.querySelector('.form-success');
      if (valid) {
        contactForm.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => successMsg.style.display = 'none', 5000);
        }
      }
    });
    contactForm.querySelectorAll('[data-validate]').forEach(f => {
      f.addEventListener('input', () => f.closest('.field').classList.remove('has-error'));
    });
  }

  /* ---------------- Newsletter form ---------------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.parentElement.querySelector('.form-msg');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (msg) {
        msg.textContent = ok ? 'You\'re subscribed. Welcome aboard.' : 'Enter a valid email address.';
        msg.className = 'form-msg ' + (ok ? 'ok' : 'err');
      }
      if (ok) input.value = '';
    });
  });

});
