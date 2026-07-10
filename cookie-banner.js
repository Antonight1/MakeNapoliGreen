/* ===== MakeNapoliGreen — Cookie Banner ===== */
(function () {
    'use strict';

    const STORAGE_KEY = 'mng_cookie_consent';

    if (localStorage.getItem(STORAGE_KEY)) return;

    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Informativa sui cookie');
        banner.className = 'fixed bottom-0 left-0 right-0 z-50 shadow-2xl border-t';
        banner.style.cssText = 'background:rgba(27,27,27,0.96);color:#fff;border-color:#2d6a4f;backdrop-filter:blur(8px);';

        banner.innerHTML = `
            <div style="max-width:80rem;margin:0 auto;padding:1rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;">
                <div style="font-size:0.875rem;color:rgba(255,255,255,0.9);flex:1;min-width:200px;">
                    <p style="font-weight:600;margin-bottom:0.25rem;">🍪 Informativa sui Cookie</p>
                    <p>
                        Utilizziamo solo cookie tecnici necessari al funzionamento del sito. Non usiamo cookie di profilazione né strumenti di tracciamento.
                    </p>
                </div>
                <button id="cookie-accept" style="flex-shrink:0;padding:0.6rem 1.25rem;background:#2d6a4f;color:#fff;font-size:0.875rem;font-weight:600;border:none;border-radius:9999px;cursor:pointer;white-space:nowrap;transition:background 0.2s;">
                    Ho capito
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        const btn = document.getElementById('cookie-accept');
        btn.addEventListener('mouseenter', function () { this.style.background = '#1b4332'; });
        btn.addEventListener('mouseleave', function () { this.style.background = '#2d6a4f'; });

        btn.addEventListener('click', function () {
            try {
                localStorage.setItem(STORAGE_KEY, 'true');
            } catch (e) {
                // localStorage non disponibile (navigazione privata)
            }
            banner.style.transition = 'opacity 0.3s';
            banner.style.opacity = '0';
            setTimeout(function () { banner.remove(); }, 300);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
    } else {
        createBanner();
    }
})();
