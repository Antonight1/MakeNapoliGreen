// ===== MakeNapoliGreen — Main JavaScript =====

// ===== LANGUAGE TOGGLE =====
const LANG_KEY = 'mng_lang';

function applyLanguage(lang) {
    // Explicitly set inline display to override CSS initial rules
    document.querySelectorAll('.lang-it').forEach(el => {
        el.style.display = lang === 'it' ? 'inline' : 'none';
    });
    document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = lang === 'en' ? 'inline' : 'none';
    });
    // Update all toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.textContent = lang === 'it' ? 'EN' : 'IT';
        btn.setAttribute('aria-label', lang === 'it' ? 'Switch to English' : "Passa all'italiano");
    });
    // Update html lang attribute
    document.documentElement.lang = lang === 'it' ? 'it' : 'en';

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

function getCurrentLang() {
    try { return localStorage.getItem(LANG_KEY) || 'it'; } catch (e) { return 'it'; }
}

function toggleLanguage() {
    const current = getCurrentLang();
    applyLanguage(current === 'it' ? 'en' : 'it');
    // Notify other listeners on the same page (e.g. dynamic card renderers)
    document.dispatchEvent(new CustomEvent('mng-lang-change'));
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

    // Init Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Apply saved language preference
    applyLanguage(getCurrentLang());

    // Language toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', toggleLanguage);
    });

    // ===== HEADER SCROLL SHADOW =====
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.innerHTML = isOpen
                ? '<i data-lucide="x" class="w-6 h-6 text-foresta" style="color:#2d6a4f"></i>'
                : '<i data-lucide="menu" class="w-6 h-6 text-foresta" style="color:#2d6a4f"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6" style="color:#2d6a4f"></i>';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== LAZY IMAGES =====
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
});
