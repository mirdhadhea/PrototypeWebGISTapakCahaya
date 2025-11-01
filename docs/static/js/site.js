// ===== helpers
const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

// ===== 1) Highlight menu by current page
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // match file name (index.html, pelukan_alam.html, etc.)
    if (href.replace('./','') === path) a.classList.add('active');
    // also treat root → index.html
    if ((path === '' || path === '/') && href.includes('index.html')) a.classList.add('active');
  });
})();

// ===== 2) Make external links open safely in new tab
(() => {
  $$('a[href^="http"]').forEach(a => {
    a.target = '_blank';
    a.rel = 'noopener';
  });
})();

// ===== 3) Draw curved connectors on “stories” section (used in warisan_abadi.html)
(() => {
  const stories = $('.stories');
  const connectors = stories?.querySelector('.story-connectors');
  if (!stories || !connectors) return;

  const relRect = (el) => {
    const c = stories.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x:r.left - c.left, y:r.top - c.top, w:r.width, h:r.height };
  };

  const anchorFor = (media) => {
    const r   = relRect(media);
    const y   = r.y + r.h * 0.55;
    const pad = 8;
    const alt = media.closest('.story')?.classList.contains('is-alt');
    return alt ? { x:r.x + pad, y, side:'right' } : { x:r.x + r.w - pad, y, side:'left' };
  };

  const draw = () => {
    const C = stories.getBoundingClientRect();
    connectors.setAttribute('viewBox', `0 0 ${C.width} ${C.height}`);
    connectors.setAttribute('width',  C.width);
    connectors.setAttribute('height', C.height);
    connectors.innerHTML = '';

    const points = $$('.story .story-media', stories).map(anchorFor);
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i+1];
      const k  = Math.min(140, Math.abs(b.x - a.x) * 0.6);
      const c1 = a.side === 'left' ? a.x + k : a.x - k;
      const c2 = b.side === 'left' ? b.x - k : b.x + k;

      const p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d', `M ${a.x} ${a.y} C ${c1} ${a.y}, ${c2} ${b.y}, ${b.x} ${b.y}`);
      p.setAttribute('class','connector');
      g.appendChild(p);
    }
    points.forEach(pt => {
      const d = document.createElementNS('http://www.w3.org/2000/svg','circle');
      d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); d.setAttribute('r', 4.2);
      d.setAttribute('class','dot');
      g.appendChild(d);
    });
    connectors.appendChild(g);
  };

  on(window, 'load',  draw);
  on(window, 'resize', draw);
  $$('img', stories).forEach(img => { if (!img.complete) on(img, 'load', draw); });
})();

// ===== 4) Leaflet maps (only if Leaflet exists & target element found)
(() => {
  if (!window.L) return;

  // Contact map (sapa_kami.html)
  const contactEl = $('#contact-map');
  if (contactEl) {
    const pos = [-5.6603970155982255, 122.76507140945692];
    const map = L.map(contactEl, { center: pos, zoom: 12, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker(pos).addTo(map).bindPopup('<b>Desa Gaya Baru</b>');
    setTimeout(() => map.invalidateSize(), 120);
    on(window, 'resize', () => map.invalidateSize());
  }

  // UMKM map (tangan_berkarya.html) — uses window.umkmPoints if provided, else defaults
  const umkmEl = $('#umkm-map');
  if (umkmEl) {
    const points = (window.umkmPoints && Array.isArray(window.umkmPoints) && window.umkmPoints.length)
      ? window.umkmPoints
      : [
          { coords: [-5.660571038678991, 122.7651485050672], name: 'Restoran Lakaliba' },
          { coords: [-5.658493705362705, 122.7648754802927], name: 'Kios Firanti' },
          { coords: [-5.65904266290017, 122.76370305905535], name: 'Kios Putra' },
        ];

    const map = L.map(umkmEl, {
      center: [-5.659498735082537, 122.76564467877607],
      zoom: 15, scrollWheelZoom: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors', maxZoom: 19
    }).addTo(map);

    const fg = L.featureGroup().addTo(map);
    points.forEach(p => L.marker(p.coords).addTo(fg).bindPopup(`<b>${p.name}</b><br>UMKM Desa Gaya Baru`));
    try { map.fitBounds(fg.getBounds(), { padding: [18,18] }); } catch(e) {}
    setTimeout(() => map.invalidateSize(), 140);
    on(window, 'resize', () => map.invalidateSize());
  }
})();

// ===== 5) Swiper slider (pelukan_alam.html) — only if Swiper & element exist
(() => {
  const el = document.querySelector('.pelukan-slider');
  if (!el || !window.Swiper) return;
  new Swiper(el, {
    loop: true, speed: 700, grabCursor: true,
    effect: 'coverflow', centeredSlides: true, slidesPerView: 'auto', spaceBetween: 40,
    coverflowEffect: { rotate: 0, stretch: 0, depth: 180, modifier: 1.2, slideShadows: false },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
    autoplay: { delay: 5000, disableOnInteraction: false },
    breakpoints: { 320:{spaceBetween:16}, 640:{spaceBetween:24}, 1024:{spaceBetween:40} }
  });
})();
