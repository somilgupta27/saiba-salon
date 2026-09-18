// Saiba Hair Salon & Spa — services grid, category subview, and Products brand grid
//
// SECURITY NOTE: this file renders `categoryData` into the page. Since the
// admin CMS (see /admin/) can now override parts of this data at runtime
// (via assets/js/cms-loader.js), every value that ends up here must be
// treated as untrusted text, not as trusted markup. All rendering below
// therefore builds real DOM nodes and sets `.textContent` (which the browser
// never parses as HTML) instead of concatenating strings into `.innerHTML`.
// Only `src`/`href` attributes take a URL, and those are passed through
// `safeUrl()` first, which rejects anything except http(s) and site-relative
// paths (so a value like `javascript:...` or `data:text/html...` cannot end
// up wired to a click).

// ── SERVICES: category tiles ⇄ sub-service list ──
(function () {
  // Brand logo assets for the Products detail section.
  const LOGO_SCHWARZKOPF = "assets/images/brand-schwarzkopf.png";
  const LOGO_EUFORA = "assets/images/brand-eufora.png";
  const LOGO_K18 = "assets/images/brand-k18.png";
  const LOGO_EMINENCE = "assets/images/brand-eminence.png";

  const categoryData = {
    'haircuts-styling': {
      title: 'Haircuts & Styling',
      icon: '<circle cx="9" cy="9" r="4"/><circle cx="9" cy="27" r="4"/><path d="M30 6L12 24"/><path d="M21 21L30 30"/><path d="M12 12L17 17"/>',
      items: ["Women's Haircut & Style", "Men's Haircut & Grooming", "Children's Haircut", 'Senior Hair Services', 'Shampoo & Blow-Dry', 'Formal & Bridal Styling']
    },
    facials: {
      title: 'Facials',
      // face outline with sparkles
      icon: '<circle cx="18" cy="19" r="9"/><path d="M14 17.5c.5-.8 1.4-1.3 2.3-1.3M20 17.5c.5-.8 1.4-1.3 2.3-1.3"/><path d="M14 23c1.2 1 2.5 1.5 4 1.5s2.8-.5 4-1.5"/><path d="M9 8.5L9.7 10.5L11.7 11.2L9.7 11.9L9 13.9L8.3 11.9L6.3 11.2L8.3 10.5Z"/><path d="M27 6.5L27.5 8L29 8.5L27.5 9L27 10.5L26.5 9L25 8.5L26.5 8Z"/>',
      items: ['Hydrating', 'Age-Defying', 'Teen', "Gentleman's"]
    },
    'hair-color': {
      title: 'Hair Color',
      // angled color brush
      icon: '<path d="M24 8L14 18"/><path d="M24 8c1.8-1.8 4-1.8 4 0s-2.2 5.8-4 4L24 8Z"/><path d="M14 18l-3 7 4-1z"/>',
      items: ['Root Touch-Up', 'All-Over Color', 'Gloss & Toner', 'Partial Highlights', 'Full Highlights', 'Balayage', 'Color Correction']
    },
    brows: {
      title: 'Brows',
      // arched brow with lashes
      icon: '<path d="M8 16c3-4 8-6 12-6s7 2 8 4"/><path d="M9 22c3 2 7 3 10 3s7-1 9-3"/><path d="M9 22l-2 2M12 24l-1.5 2.5M16 25l-1 3M20 25l1 3M24 24l1.5 2.5"/>',
      items: ['Eyebrow Shaping', 'Threading', 'Brow Tint', 'Brow Lamination']
    },
    waxing: {
      title: 'Waxing',
      // wax bowl with applicator
      icon: '<ellipse cx="14" cy="26" rx="7" ry="3"/><path d="M7 26v-3a7 3 0 0114 0v3"/><path d="M25 8l4 4-9 9-3-1 1-3z"/>',
      items: ['Facial Waxing', 'Body Waxing']
    },
    'hair-treatments': {
      title: 'Hair Treatments',
      // wavy strands
      icon: '<path d="M10 8c2 3-2 5 0 8s-2 5 0 8"/><path d="M18 6c2 3-2 5 0 8s-2 5 0 8"/><path d="M26 8c2 3-2 5 0 8s-2 5 0 8"/>',
      items: ['Deep Conditioning', 'Bond Repair', 'Keratin Smoothing', 'Hair Botox']
    },
    'spa-rituals': {
      title: 'Scalp Wellness',
      // stacked stones with a blossom
      icon: '<ellipse cx="18" cy="27" rx="8" ry="2.2"/><ellipse cx="18" cy="22" rx="6" ry="1.8"/><ellipse cx="18" cy="18" rx="4" ry="1.5"/><path d="M18 14c-2-1-3-3-3-5c2 .3 3.3 1.5 3.7 3c.6-1.7 2-3 4-3.3c0 2.3-1.7 4.6-4.7 5.3z"/>',
      items: ['Signature Herbal Oil Massage']
    },
    makeup: {
      title: 'Makeup',
      // makeup brush with a sparkle
      icon: '<path d="M11 27L20.5 17.5"/><path d="M20.5 17.5c1.3-2 3.6-3.9 5.6-4.1c1.8-0.2 3 1.1 2.8 2.9c-0.2 2-2.1 4.3-4.1 5.6L20.5 17.5Z"/><path d="M29 6.5L29.7 8.5L31.7 9.2L29.7 9.9L29 11.9L28.3 9.9L26.3 9.2L28.3 8.5Z"/>',
      items: ['Natural Makeup', 'Special Occasion Makeup', 'Bridal Makeup']
    },
    products: {
      title: 'Products',
      // pump bottle — retail hair & skin care line
      icon: '<rect x="13" y="13" width="10" height="17" rx="2"/><rect x="15.5" y="7" width="5" height="6" rx="1"/><path d="M15.5 7c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3"/>',
      // Four professional brands carried at Saiba, replacing the generic category list.
      brands: [
        {
          logo: LOGO_SCHWARZKOPF,
          alt: 'Schwarzkopf Professional logo',
          chip: false,
          category: 'Hair Color',
          desc: 'Advanced professional color technology for rich, dimensional and beautiful long-lasting color.',
          url: 'https://www.schwarzkopf-professional.com/us/en.html'
        },
        {
          logo: LOGO_EUFORA,
          alt: 'Eufora logo',
          chip: true,
          category: 'Hair Care',
          desc: 'Professional hair care selected to support healthy, manageable and beautifully styled hair.',
          url: 'https://eufora.net/'
        },
        {
          logo: LOGO_K18,
          alt: 'K18 logo',
          chip: true,
          category: 'Hair Repair',
          desc: 'Advanced molecular hair-repair technology designed to restore strength, softness and healthy-looking hair.',
          url: 'https://www.k18hair.com/'
        },
        {
          logo: LOGO_EMINENCE,
          alt: 'Eminence Organic Skin Care logo',
          chip: true,
          category: 'Facials & Skin Care',
          desc: 'Professional botanical skincare thoughtfully selected for radiant, balanced and healthy-looking skin.',
          url: 'https://eminenceorganics.com/us/'
        }
      ]
    }
  };

  // Expose the SAME object (not a copy) so cms-loader.js can patch titles,
  // tile images, item lists, and brand fields in place once real CMS content
  // loads. Because showCategory() below always reads through this reference
  // at click time (never a snapshot taken earlier), later in-place edits are
  // picked up automatically with no extra wiring.
  window.SaibaCategoryData = categoryData;

  // Only allow http(s) URLs or same-site relative paths. Blocks
  // `javascript:`, `data:`, `vbscript:` and similar schemes from ever being
  // written into an href/src, even if CMS content is compromised or a field
  // is filled in carelessly.
  function safeUrl(u, fallback) {
    if (typeof u !== 'string' || !u.trim()) return fallback || '#';
    const trimmed = u.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
    // relative path (no scheme, no leading //) — e.g. "assets/images/x.jpg"
    if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !trimmed.startsWith('//')) return trimmed;
    return fallback || '#';
  }

  const stage = document.getElementById('servicesStage');
  const grid = document.getElementById('servicesCategories');
  const subview = document.getElementById('servicesSubview');
  const subviewIcon = document.getElementById('subviewIcon');
  const subviewTitle = document.getElementById('subviewTitle');
  const subserviceList = document.getElementById('subserviceList');
  const backBtn = document.getElementById('backToServices');

  if (!stage || !grid || !subview) return;

  // Both the tile grid and the sub-service list live permanently inside
  // #servicesStage (stacked via CSS grid) so the container never resizes
  // or scrolls when switching — only opacity/transform + inert toggle.
  let lastTile = null;
  const FADE_MS = 450; // keep in sync with the CSS transition duration

  function renderBrandItem(b) {
    const li = document.createElement('li');
    li.className = 'subservice-item subservice-item--brand';

    const logoWrap = document.createElement('span');
    logoWrap.className = 'brand-logo-wrap' + (b.chip ? ' brand-logo-wrap--chip' : '');
    const img = document.createElement('img');
    img.className = 'brand-logo';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = safeUrl(b.logo, '');
    img.alt = typeof b.alt === 'string' ? b.alt : '';
    logoWrap.appendChild(img);

    const cat = document.createElement('span');
    cat.className = 'brand-category';
    cat.textContent = typeof b.category === 'string' ? b.category : '';

    const desc = document.createElement('p');
    desc.className = 'brand-desc';
    desc.textContent = typeof b.desc === 'string' ? b.desc : '';

    const link = document.createElement('a');
    link.className = 'brand-learn-more';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.href = safeUrl(b.url, '#');
    link.textContent = 'Learn More ';
    const arrow = document.createElement('span');
    arrow.className = 'brand-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.appendChild(arrow);

    li.appendChild(logoWrap);
    li.appendChild(cat);
    li.appendChild(desc);
    li.appendChild(link);
    return li;
  }

  function renderPlainItem(name) {
    const li = document.createElement('li');
    li.className = 'subservice-item';
    const span = document.createElement('span');
    span.className = 'subservice-name';
    span.textContent = typeof name === 'string' ? name : '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'subservice-arrow');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M5 12h14M13 6l6 6-6 6');
    svg.appendChild(path);
    li.appendChild(span);
    li.appendChild(svg);
    return li;
  }

  function showCategory(key, originTile) {
    const data = window.SaibaCategoryData[key];
    if (!data) return;
    lastTile = originTile || null;

    // The icon is code-owned, never CMS-controlled — see security note above.
    subviewIcon.innerHTML = data.icon;
    subviewTitle.textContent = data.title;

    subserviceList.innerHTML = '';
    if (Array.isArray(data.brands)) {
      subserviceList.classList.add('subservice-list--brands');
      data.brands.forEach(b => subserviceList.appendChild(renderBrandItem(b)));
    } else {
      subserviceList.classList.remove('subservice-list--brands');
      (data.items || []).forEach(name => subserviceList.appendChild(renderPlainItem(name)));
    }

    stage.classList.add('is-detail');
    grid.inert = true;
    subview.inert = false;

    // Move focus once the subview has finished fading in.
    window.setTimeout(() => backBtn.focus(), FADE_MS);
  }

  function showGrid() {
    stage.classList.remove('is-detail');
    subview.inert = true;
    grid.inert = false;

    if (lastTile) {
      window.setTimeout(() => lastTile.focus(), FADE_MS);
    }
  }

  grid.querySelectorAll('.category-tile').forEach(tile => {
    tile.addEventListener('click', () => showCategory(tile.dataset.category, tile));
  });

  backBtn.addEventListener('click', showGrid);

  // Expose for cms-loader.js to refresh tile titles/photos without
  // duplicating the tile-lookup logic in two files.
  window.SaibaRefreshTile = function (key, title, photoSrc) {
    const tile = grid.querySelector('[data-category="' + key + '"]');
    if (!tile) return;
    if (typeof title === 'string' && title.trim()) {
      const titleEl = tile.querySelector('.tile-title');
      if (titleEl) titleEl.textContent = title;
    }
    if (typeof photoSrc === 'string' && photoSrc.trim()) {
      const img = tile.querySelector('.tile-photo');
      if (img) img.src = safeUrl(photoSrc, img.src);
    }
  };
})();
