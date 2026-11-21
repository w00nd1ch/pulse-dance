/* =========================================================
   ПУЛЬС — интерактив
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Расписание ---------- */
  const LEVELS = {
    any: { label: 'все уровни', cls: 'level--any' },
    new: { label: 'новички', cls: 'level--new' },
    mid: { label: 'средний', cls: 'level--mid' },
    pro: { label: 'про', cls: 'level--pro' }
  };

  const SCHEDULE = [
    { day: 'Понедельник', short: 'ПН', lessons: [
      { time: '08:00', name: 'Утренний contemporary', sub: 'мягкий старт · вес и дыхание', coach: 'Алиса Ветрова', level: 'any', hall: 'зал «Неон»' },
      { time: '18:30', name: 'Hip-Hop · база', sub: 'bounce, groove, изоляции', coach: 'Марк Дэй', level: 'new', hall: 'зал «Блок»' },
      { time: '20:00', name: 'Vogue femme', sub: 'hands performance · runway', coach: 'Ника Стронг', level: 'mid', hall: 'зал «Подиум»' },
      { time: '21:30', name: 'Breaking · open session', sub: 'топрок, футворк, cypher', coach: 'Марк Дэй', level: 'any', hall: 'зал «Блок»' }
    ]},
    { day: 'Вторник', short: 'ВТ', lessons: [
      { time: '10:00', name: 'Stretching & body', sub: 'растяжка, мобильность, дыхание', coach: 'Ева Ланге', level: 'any', hall: 'зал «Неон»' },
      { time: '19:00', name: 'Jazz Funk', sub: 'подача, чёткость, драйв', coach: 'Алиса Ветрова', level: 'mid', hall: 'зал «Подиум»' },
      { time: '20:30', name: 'Dancehall', sub: 'ямайский грув · кардио', coach: 'Ника Стронг', level: 'new', hall: 'зал «Блок»' },
      { time: '22:00', name: 'Contact jam', sub: 'свободная практика с резидентами', coach: 'резиденты студии', level: 'any', hall: 'зал «Неон»' }
    ]},
    { day: 'Среда', short: 'СР', lessons: [
      { time: '08:00', name: 'Bodysculpt', sub: 'сила и выносливость для танцора', coach: 'Ева Ланге', level: 'any', hall: 'зал «Блок»' },
      { time: '18:30', name: 'Hip-Hop · pro', sub: 'рутины, импровизация, съёмка', coach: 'Марк Дэй', level: 'pro', hall: 'зал «Блок»' },
      { time: '20:00', name: 'Contemporary flow', sub: 'партер, падения, контакт', coach: 'Алиса Ветрова', level: 'mid', hall: 'зал «Неон»' },
      { time: '21:30', name: 'Krump lab', sub: 'экспрессия и Character', coach: 'Дэн Флоу', level: 'any', hall: 'зал «Подиум»' }
    ]},
    { day: 'Четверг', short: 'ЧТ', lessons: [
      { time: '10:00', name: 'Yoga for dancers', sub: 'баланс, дыхание, восстановление', coach: 'Ева Ланге', level: 'any', hall: 'зал «Неон»' },
      { time: '19:00', name: 'Dancehall', sub: 'база + комбинация недели', coach: 'Ника Стронг', level: 'mid', hall: 'зал «Блок»' },
      { time: '20:30', name: 'Vogue · performance', sub: 'категория, образ, подиум', coach: 'Ника Стронг', level: 'mid', hall: 'зал «Подиум»' },
      { time: '22:00', name: 'Open stage practice', sub: 'свободный зал и свет', coach: 'самостоятельно', level: 'any', hall: 'зал «Неон»' }
    ]},
    { day: 'Пятница', short: 'ПТ', lessons: [
      { time: '08:00', name: 'Morning groove', sub: 'лёгкая хореография перед работой', coach: 'Марк Дэй', level: 'new', hall: 'зал «Блок»' },
      { time: '18:30', name: 'Breaking · base', sub: 'стойки, фризы, связки', coach: 'Дэн Флоу', level: 'new', hall: 'зал «Блок»' },
      { time: '20:00', name: 'Hip-Hop party class', sub: 'учим рутину под dj-сет', coach: 'Марк Дэй', level: 'any', hall: 'зал «Подиум»' },
      { time: '21:30', name: 'Jazz Funk · show', sub: 'постановка к отчётному концерту', coach: 'Алиса Ветрова', level: 'pro', hall: 'зал «Неон»' }
    ]},
    { day: 'Суббота', short: 'СБ', lessons: [
      { time: '11:00', name: 'Kids · 6–10 лет', sub: 'координация, ритм, игра', coach: 'Ева Ланге', level: 'new', hall: 'зал «Неон»' },
      { time: '12:30', name: 'Teens · 11–15 лет', sub: 'hip-hop основа и подача', coach: 'Марк Дэй', level: 'new', hall: 'зал «Блок»' },
      { time: '15:00', name: 'Open class для новичков', sub: 'первое занятие бесплатно', coach: 'команда ПУЛЬС', level: 'new', hall: 'зал «Подиум»' },
      { time: '18:00', name: 'Battle night', sub: 'баттлы 1×1 и джем · раз в месяц', coach: 'судьи сезона', level: 'any', hall: 'зал «Блок»' }
    ]},
    { day: 'Воскресенье', short: 'ВС', lessons: [
      { time: '12:00', name: 'Slow contemporary', sub: 'для тела и головы', coach: 'Алиса Ветрова', level: 'any', hall: 'зал «Неон»' },
      { time: '14:00', name: 'Choreo lab', sub: 'постановка за 2 часа', coach: 'Алиса Ветрова', level: 'mid', hall: 'зал «Подиум»' },
      { time: '17:00', name: 'Krump / Hip-Hop jam', sub: 'открытый cypher, вход свободный', coach: 'резиденты студии', level: 'any', hall: 'зал «Блок»' }
    ]}
  ];

  const panel = $('#dayPanel');
  const tabs  = $$('.day-tab');

  function renderDay(index) {
    const data = SCHEDULE[index];
    if (!panel || !data) return;

    panel.innerHTML = data.lessons.map((lesson, i) => {
      const lvl = LEVELS[lesson.level] || LEVELS.any;
      return `
        <div class="lesson" style="animation-delay:${i * 60}ms">
          <span class="lesson__time">${lesson.time}</span>
          <span class="lesson__name">${lesson.name}<small>${lesson.sub}</small></span>
          <span class="lesson__coach">${lesson.coach}</span>
          <span class="level ${lvl.cls}">${lvl.label}</span>
          <span class="lesson__hall">${lesson.hall}</span>
        </div>`;
    }).join('');
  }

  function selectDay(tab) {
    tabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
    });
    renderDay(Number(tab.dataset.day));
  }

  if (tabs.length) {
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectDay(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        selectDay(next);
      });
    });
    selectDay(tabs[0]);
  }

  /* ---------- 2. Шапка, прогресс, «наверх» ---------- */
  const nav      = $('#nav');
  const progress = $('#progressBar');
  const toTop    = $('#toTop');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? Math.min(y / h, 1) * 100 : 0) + '%';
    }
    if (toTop) toTop.classList.toggle('visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 3. Мобильное меню ---------- */
  const burger = $('#burger');
  const mobileMenu = $('#mobileMenu');

  function setMenu(open) {
    if (!burger || !mobileMenu) return;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => setMenu(!burger.classList.contains('is-open')));
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && burger.classList.contains('is-open')) setMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) setMenu(false);
    });
  }

  /* ---------- 4. Появление блоков при скролле ---------- */
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 5. Счётчики ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count || 0);
    if (!target) return;
    if (reduced) { el.textContent = target.toLocaleString('ru-RU'); return; }

    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = $$('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(c => counterObserver.observe(c));
    } else {
      counters.forEach(countUp);
    }
  }

  /* ---------- 6. Подсветка активного пункта меню ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav__links a');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => linkObserver.observe(s));
  }

  /* ---------- 7. Маска телефона ---------- */
  const phoneInput = $('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7')) digits = '7' + digits;
      digits = digits.slice(0, 11);

      const a = digits.slice(1, 4);
      const b = digits.slice(4, 7);
      const c = digits.slice(7, 9);
      const d = digits.slice(9, 11);

      let out = '+7';
      if (a) out += ' (' + a;
      if (a.length === 3) out += ')';
      if (b) out += ' ' + b;
      if (c) out += '-' + c;
      if (d) out += '-' + d;

      phoneInput.value = out;
    });
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.replace(/\D/g, '').length <= 1) phoneInput.value = '';
    });
  }

  /* ---------- 8. Форма ---------- */
  const form = $('#bookingForm');
  const toast = $('#toast');
  let toastTimer;

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 5200);
  }

  function validateField(input) {
    const field = input.closest('.field');
    if (!field) return true;
    let valid = true;

    if (input.name === 'name') {
      valid = input.value.trim().length >= 2;
    } else if (input.name === 'phone') {
      valid = input.value.replace(/\D/g, '').length === 11;
    }

    field.classList.toggle('is-invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  if (form) {
    const inputs = $$('input[required]', form);

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        const field = input.closest('.field');
        if (field && field.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const allValid = inputs.map(validateField).every(Boolean);

      if (!allValid) {
        const firstInvalid = $('.field.is-invalid input', form);
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      const btn = $('button[type="submit"]', form);
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Отправляем…';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        form.reset();
        showToast();
      }, 700);
    });
  }

  /* ---------- 9. Год в подвале ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 10. Курсор-свечение ---------- */
  const glow = $('#cursorGlow');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (glow && finePointer && !reduced) {
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf;

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (glow.style.opacity !== '1') glow.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { glow.style.opacity = '1'; });

    loop();

    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  /* ---------- 11. Плавный скролл по якорям ---------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      try { history.replaceState(null, '', id); } catch (err) { /* file:// и локальные ограничения */ }
    });
  });

})();
