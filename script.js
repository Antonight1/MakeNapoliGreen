// ===== MakeNapoliGreen — Main JavaScript =====

// ===== LANGUAGE TOGGLE =====
const LANG_KEY = 'mng_lang';

function applyLanguage(lang) {
    document.querySelectorAll('.lang-it').forEach(el => {
        el.style.display = lang === 'it' ? 'inline' : 'none';
    });
    document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = lang === 'en' ? 'inline' : 'none';
    });
    document.querySelectorAll('.lang-it-block').forEach(el => {
        el.style.display = lang === 'it' ? 'block' : 'none';
    });
    document.querySelectorAll('.lang-en-block').forEach(el => {
        el.style.display = lang === 'en' ? 'block' : 'none';
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.textContent = lang === 'it' ? 'EN' : 'IT';
        btn.setAttribute('aria-label', lang === 'it' ? 'Switch to English' : "Passa all'italiano");
    });
    document.documentElement.lang = lang === 'it' ? 'it' : 'en';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

function getCurrentLang() {
    try { return localStorage.getItem(LANG_KEY) || 'it'; } catch (e) { return 'it'; }
}

function toggleLanguage() {
    applyLanguage(getCurrentLang() === 'it' ? 'en' : 'it');
    document.dispatchEvent(new CustomEvent('mng-lang-change'));
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

    applyLanguage(getCurrentLang());

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', toggleLanguage);
    });

    // ===== HEADER SCROLL =====
    const nav = document.querySelector('nav.site-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.innerHTML = open
                ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            });
        });
    }

    // ===== BACK TO TOP =====
    const btt = document.getElementById('back-to-top');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== FILTER CHIPS (projects page) =====
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
        chip.addEventListener('click', () => {
            const group = chip.dataset.group;
            document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterProjects();
        });
    });

    // ===== SEARCH INPUT =====
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    // ===== TYPE TOGGLE (proponi/start form) =====
    document.querySelectorAll('.type-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const group = opt.closest('.type-toggle');
            if (group) group.querySelectorAll('.type-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });
});

// ===== PROJECT FILTERING (projects.html) =====
function filterProjects() {
    if (typeof projects === 'undefined') return;
    const lang = getCurrentLang();

    const catChip  = document.querySelector('.chip[data-group="cat"].active');
    const statChip = document.querySelector('.chip[data-group="stat"].active');
    const searchEl = document.getElementById('search-input');

    const cat   = catChip  ? catChip.dataset.filter  : '';
    const stat  = statChip ? statChip.dataset.filter  : '';
    const query = searchEl ? searchEl.value.toLowerCase() : '';

    const filtered = projects.filter(p => {
        const title = lang === 'it' ? p.title : p.titleEn;
        const desc  = lang === 'it' ? p.description : p.descriptionEn;
        const matchQ = !query || title.toLowerCase().includes(query) || desc.toLowerCase().includes(query) || p.location.toLowerCase().includes(query) || p.city.toLowerCase().includes(query);
        const matchC = !cat  || p.category === cat;
        const matchS = !stat || p.status === stat;
        return matchQ && matchC && matchS;
    });

    renderProjectCards(filtered, lang);
}

function renderProjectCards(list, lang) {
    const grid      = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');
    const countEl  = document.getElementById('results-count');
    if (!grid) return;

    grid.innerHTML = '';

    if (list.length === 0) {
        if (noResults) noResults.style.display = 'block';
    } else {
        if (noResults) noResults.style.display = 'none';
        list.forEach(p => grid.appendChild(buildProjectCard(p, lang)));
    }

    if (countEl) {
        countEl.textContent = lang === 'it'
            ? list.length + ' progett' + (list.length === 1 ? 'o' : 'i')
            : list.length + ' project' + (list.length === 1 ? '' : 's');
    }

    // Re-apply language to newly rendered elements
    applyLanguage(lang);
}

function buildProjectCard(p, lang) {
    const statusDot   = { 'Attivo': 'dot-attivo', 'Idea': 'dot-idea', 'Completato': 'dot-completato', 'Proposto': 'dot-proposto' };
    const statusLabelIT = { 'Attivo': 'Attivo', 'Idea': 'Idea', 'Completato': 'Completato' };
    const statusLabelEN = { 'Attivo': 'Active', 'Idea': 'Idea', 'Completato': 'Completed' };
    const catClass = { 'Aiuola': 'badge-attivo', 'Orto Urbano': 'badge-attivo', 'Pulizia': 'badge-proposto', 'Piantumazione': 'badge-attivo', 'Altro': 'badge-idea' };

    const row = document.createElement('a');
    row.href = 'project.html?id=' + p.id;
    row.className = 'issue-row';
    row.innerHTML = `
        <div class="status-dot ${statusDot[p.status] || 'dot-idea'}"></div>
        <div class="issue-body">
            <div class="issue-title">
                <span class="lang-it">${p.title}</span><span class="lang-en">${p.titleEn}</span>
            </div>
            <div class="issue-meta">
                <span class="num mono">#${p.id}</span>
                <span>${p.location}</span>
                <span class="badge ${catClass[p.category] || 'badge-idea'}">${p.category}</span>
                <span class="badge badge-${p.status === 'Attivo' ? 'attivo' : p.status === 'Completato' ? 'completato' : 'idea'}">
                    <span class="lang-it">${statusLabelIT[p.status] || p.status}</span>
                    <span class="lang-en">${statusLabelEN[p.status] || p.status}</span>
                </span>
            </div>
        </div>
        <div class="issue-right">
            <span>👤 ${p.contributors}</span>
            <div class="avatars"><div class="avatar">${p.contributors}</div></div>
        </div>
    `;
    return row;
}
