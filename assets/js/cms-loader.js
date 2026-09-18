// Saiba Hair Salon & Spa — CMS data loader + Netlify Identity redirect handling
//
// This file loads content published through the admin CMS (see /admin/,
// backed by Netlify Identity + Git Gateway) and patches it into the page
// that already has the current real content hardcoded as a fallback. If any
// fetch fails, is missing a field, or a JSON file simply doesn't exist yet,
// the corresponding `.catch(() => null)` / `if (x)` guard leaves the
// hardcoded HTML exactly as it is — the site never breaks because of a CMS
// data problem.
//
// SECURITY NOTE: every value below comes from a JSON file that an
// authenticated CMS editor can change. That is a much smaller attack surface
// than public user input, but a compromised editor account, a copy-pasted
// value, or a future collaborator with less care could still put something
// unsafe in a field (e.g. a phone/address field containing `<script>`, or a
// URL field containing `javascript:...`). To keep that from ever becoming
// live markup that runs in every visitor's browser:
//   - Text values are written with `.textContent`, never `.innerHTML`.
//   - Any value used as `href`/`src` goes through `safeUrl()`, which only
//     allows http(s)/mailto/tel links or same-site relative paths.
//   - List sections (hours, services, team, testimonials, gallery) are
//     rebuilt as real DOM nodes, not by joining strings into innerHTML.

(function () {
  function safeUrl(u, fallback) {
    if (typeof u !== 'string' || !u.trim()) return fallback || '#';
    const trimmed = u.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !trimmed.startsWith('//')) return trimmed;
    return fallback || '#';
  }

  function str(v, fallback) {
    return typeof v === 'string' && v.trim() ? v : (fallback !== undefined ? fallback : '');
  }

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  async function loadCMSData() {
    try {
      // Relative paths so this also works under a GitHub-Pages-style
      // subpath. These point at _data/*.json, which the admin CMS (Decap
      // CMS, configured in admin/config.yml) publishes to via a commit to
      // this repo — see SETUP.md for how that publish flow is secured.
      const [contact, services, team, testimonials, about, gallery] = await Promise.all([
        fetch('_data/contact.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('_data/services.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('_data/team.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('_data/testimonials.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('_data/about.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('_data/gallery.json').then(r => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      // ── CONTACT ──
      if (contact) {
        const phoneEl = document.getElementById('cms-phone');
        if (phoneEl && str(contact.phone_display)) {
          const existingA = phoneEl.querySelector('a');
          const existingHref = existingA ? existingA.href : '#';
          clearChildren(phoneEl);
          const a = document.createElement('a');
          a.href = safeUrl(contact.phone_tel ? 'tel:' + contact.phone_tel : '', existingHref);
          a.textContent = contact.phone_display;
          phoneEl.appendChild(a);
        }
        // Utility-bar phone icon link (no visible text, just the href).
        if (str(contact.phone_tel)) {
          document.querySelectorAll('.cms-phone-tel').forEach(el => {
            el.href = safeUrl('tel:' + contact.phone_tel, el.href);
          });
        }

        if (str(contact.email)) {
          document.querySelectorAll('.cms-email').forEach(el => {
            el.href = safeUrl('mailto:' + contact.email, el.href);
            el.textContent = contact.email;
          });
        }

        const addrEl = document.getElementById('cms-address');
        if (addrEl && (str(contact.address_line1) || str(contact.address_line2))) {
          clearChildren(addrEl);
          const a = document.createElement('a');
          a.target = '_blank';
          a.rel = 'noopener';
          a.href = safeUrl(contact.maps_url, '#');
          a.appendChild(document.createTextNode(str(contact.address_line1)));
          if (str(contact.address_line2)) {
            a.appendChild(document.createElement('br'));
            a.appendChild(document.createTextNode(contact.address_line2));
          }
          addrEl.appendChild(a);
        }
        if (str(contact.maps_url)) {
          const mapLink = document.getElementById('cms-address-link');
          if (mapLink) mapLink.href = safeUrl(contact.maps_url, mapLink.href);
        }

        if (str(contact.vagaro_url)) {
          document.querySelectorAll('.cms-vagaro').forEach(el => {
            el.href = safeUrl(contact.vagaro_url, el.href);
          });
        }
        if (str(contact.facebook_url)) {
          document.querySelectorAll('.cms-facebook').forEach(el => {
            el.href = safeUrl(contact.facebook_url, el.href);
          });
        }
        if (str(contact.instagram_url)) {
          document.querySelectorAll('.cms-instagram').forEach(el => {
            el.href = safeUrl(contact.instagram_url, el.href);
          });
        }

        const hoursEl = document.getElementById('cms-hours');
        if (hoursEl && Array.isArray(contact.hours) && contact.hours.length) {
          clearChildren(hoursEl);
          contact.hours.forEach(h => {
            const row = document.createElement('div');
            row.className = 'hours-row';
            const day = document.createElement('span');
            day.className = 'hours-day';
            day.textContent = str(h && h.day);
            const time = document.createElement('span');
            time.className = 'hours-time';
            time.textContent = str(h && h.time);
            row.appendChild(day);
            row.appendChild(time);
            hoursEl.appendChild(row);
          });
        }
      }

      // ── SERVICES (categories + Products brands) ──
      // Patches the existing categoryData object in-place (see
      // assets/js/services.js — window.SaibaCategoryData) rather than
      // replacing it, and refreshes each tile's visible title/photo via
      // window.SaibaRefreshTile. The hand-drawn SVG icon for each category
      // stays code-owned and is never taken from CMS content.
      if (services && Array.isArray(services.categories) && window.SaibaCategoryData) {
        services.categories.forEach(cat => {
          if (!cat || typeof cat.key !== 'string') return;
          const existing = window.SaibaCategoryData[cat.key];
          if (!existing) return; // unknown key — ignore rather than injecting a new, unreviewed category

          if (str(cat.title)) existing.title = cat.title;

          if (cat.type === 'brands' && Array.isArray(cat.brands)) {
            existing.brands = cat.brands
              .filter(b => b && typeof b === 'object')
              .map(b => ({
                logo: str(b.logo, existing.brands && existing.brands[0] ? existing.brands[0].logo : ''),
                alt: str(b.alt),
                chip: !!b.chip,
                category: str(b.category),
                desc: str(b.desc),
                url: str(b.url, '#')
              }));
          } else if (Array.isArray(cat.items)) {
            existing.items = cat.items.filter(i => typeof i === 'string' && i.trim());
          }

          if (window.SaibaRefreshTile) {
            window.SaibaRefreshTile(cat.key, cat.title, cat.tile_image);
          }
        });
      }

      // ── TEAM ──
      if (team && Array.isArray(team.team)) {
        const grid = document.getElementById('cms-team-grid');
        if (grid) {
          clearChildren(grid);
          team.team.forEach(m => {
            if (!m) return;
            const card = document.createElement('div');
            card.className = 'team-card';

            const avatar = document.createElement('div');
            avatar.className = 'team-avatar';
            if (str(m.photo)) {
              avatar.style.padding = '0';
              avatar.style.overflow = 'hidden';
              const img = document.createElement('img');
              img.src = safeUrl(m.photo, '');
              img.alt = str(m.name);
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';
              img.style.objectPosition = 'center top';
              img.style.display = 'block';
              avatar.appendChild(img);
            } else {
              avatar.textContent = str(m.initial, '?');
            }

            const info = document.createElement('div');
            info.className = 'team-info';
            const name = document.createElement('div');
            name.className = 'team-name';
            name.textContent = str(m.name);
            const role = document.createElement('div');
            role.className = 'team-role';
            role.textContent = str(m.role);
            const bio = document.createElement('p');
            bio.className = 'team-bio';
            bio.textContent = str(m.bio);
            info.appendChild(name);
            info.appendChild(role);
            info.appendChild(bio);

            card.appendChild(avatar);
            card.appendChild(info);
            grid.appendChild(card);
          });
        }
      }

      // ── TESTIMONIALS ──
      if (testimonials && Array.isArray(testimonials.testimonials)) {
        const grid = document.getElementById('cms-testimonials-grid');
        if (grid) {
          clearChildren(grid);
          testimonials.testimonials.forEach(t => {
            if (!t) return;
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            const mark = document.createElement('div');
            mark.className = 'testimonial-quote-mark';
            mark.textContent = '"';
            const stars = document.createElement('div');
            stars.className = 'stars';
            stars.textContent = '★★★★★';
            const text = document.createElement('p');
            text.className = 'testimonial-text';
            text.textContent = str(t.text);
            const author = document.createElement('div');
            author.className = 'testimonial-author';
            author.textContent = str(t.author) ? ('— ' + t.author.replace(/^[—-]\s*/, '')) : '';
            card.appendChild(mark);
            card.appendChild(stars);
            card.appendChild(text);
            card.appendChild(author);
            grid.appendChild(card);
          });
        }
      }

      // ── ABOUT / OUR STORY ──
      if (about) {
        const p1 = document.getElementById('cms-about-p1');
        const p2 = document.getElementById('cms-about-p2');
        const p3 = document.getElementById('cms-about-p3');
        const fq = document.getElementById('cms-founder-quote');
        const fn = document.getElementById('cms-founder-name');
        if (p1 && str(about.para1)) p1.textContent = about.para1;
        if (p2 && str(about.para2)) p2.textContent = about.para2;
        if (p3 && str(about.para3)) p3.textContent = about.para3;
        if (fq && str(about.founder_quote)) fq.textContent = '"' + about.founder_quote + '"';
        if (fn && str(about.founder_name)) fn.textContent = about.founder_name;

        if (str(about.founder_photo)) {
          const photoBox = document.getElementById('cms-founder-photo');
          if (photoBox) {
            clearChildren(photoBox);
            const img = document.createElement('img');
            img.src = safeUrl(about.founder_photo, '');
            img.alt = 'Saiba Hair Salon & Spa founder';
            photoBox.appendChild(img);
          }
        }
      }

      // ── GALLERY ──
      if (gallery && Array.isArray(gallery.items)) {
        const grid = document.getElementById('cms-gallery-grid');
        if (grid) {
          clearChildren(grid);
          gallery.items.forEach(item => {
            if (!item) return;
            const cell = document.createElement('div');
            cell.className = 'gallery-item';
            if (str(item.photo)) {
              const img = document.createElement('img');
              img.src = safeUrl(item.photo, '');
              img.alt = str(item.label);
              img.loading = 'lazy';
              cell.appendChild(img);
            } else {
              const ph = document.createElement('p');
              ph.className = 'gallery-placeholder';
              ph.textContent = str(item.label);
              cell.appendChild(ph);
            }
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            const tag = document.createElement('span');
            tag.className = 'gallery-tag';
            tag.textContent = str(item.label);
            overlay.appendChild(tag);
            cell.appendChild(overlay);
            grid.appendChild(cell);
          });
        }
      }

    } catch (e) {
      console.log('CMS data not available, using default content.');
    }
  }

  // Run on page load
  loadCMSData();

  // Netlify Identity - handle invite tokens and login redirect.
  // This only does anything once the site is hosted on Netlify with
  // Identity enabled; elsewhere `window.netlifyIdentity` is simply absent
  // and this block is a no-op.
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', user => {
      if (!user) {
        window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
      }
    });
    const hash = window.location.hash;
    if (hash && (hash.includes('invite_token') || hash.includes('recovery_token') || hash.includes('confirmation_token'))) {
      window.netlifyIdentity.open();
    }
  }
})();
