(function () {
    'use strict';
    const KEY = 'mng_cookie_consent';
    if (localStorage.getItem(KEY)) return;

    function show() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.style.cssText = [
            'position:fixed;bottom:0;left:0;right:0;z-index:999',
            'background:rgba(28,27,25,0.97);color:#d8cdb2',
            'border-top:1px solid rgba(243,239,228,0.12)',
            'backdrop-filter:blur(8px);font-family:Inter,sans-serif'
        ].join(';');

        banner.innerHTML = `
            <div style="max-width:1120px;margin:0 auto;padding:16px 32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
                <p style="font-size:13px;color:#b9ac8c;max-width:56ch;line-height:1.5;">
                    <span style="font-family:'IBM Plex Mono',monospace;color:#6fa050;margin-right:8px;">cookie /</span>
                    Utilizziamo solo cookie tecnici necessari al funzionamento del sito. Nessuna profilazione.
                </p>
                <button id="cookie-accept" style="flex-shrink:0;font-family:Inter,sans-serif;font-size:13px;font-weight:600;padding:9px 20px;border-radius:6px;background:#4f7a3d;color:#f3efe4;border:none;cursor:pointer;white-space:nowrap;transition:background 0.15s;">
                    Ho capito
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        banner.querySelector('#cookie-accept').addEventListener('mouseenter', function () { this.style.background = '#6fa050'; });
        banner.querySelector('#cookie-accept').addEventListener('mouseleave', function () { this.style.background = '#4f7a3d'; });
        banner.querySelector('#cookie-accept').addEventListener('click', function () {
            try { localStorage.setItem(KEY, '1'); } catch (e) {}
            banner.style.transition = 'opacity 0.3s';
            banner.style.opacity = '0';
            setTimeout(function () { banner.remove(); }, 320);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', show);
    } else {
        show();
    }
})();
