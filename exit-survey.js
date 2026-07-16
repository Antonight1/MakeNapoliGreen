/* MakeNapoliGreen — exit survey
   Drop-in, self-contained: injects its own CSS + modal markup and wires up triggers.
   Include with <script src="exit-survey.js"></script> before </body>.
   Manual trigger from anywhere: window.MNGExitSurvey.open()
*/
(function () {
  if (window.MNGExitSurvey) return; // don't double-init if included twice

  var SHOWN_KEY = 'mng_survey_shown';
  var DONE_KEY = 'mng_survey_done';
  var TIMER_MS = 42000; // mobile-friendly fallback trigger

  var css = `
  .mng-es-tab{
    position:fixed; right:18px; bottom:72px; z-index:9998;
    display:flex; align-items:center; gap:8px;
    background:#1c1b19; color:#f3efe4; border:1px solid rgba(243,239,228,0.16);
    font-family:'IBM Plex Mono', monospace; font-size:11.5px;
    padding:10px 14px; border-radius:24px; cursor:pointer;
    box-shadow:0 6px 20px rgba(0,0,0,0.25);
    transition: transform .15s ease;
  }
  .mng-es-tab:hover{ transform:translateY(-2px); }
  .mng-es-tab .dot{ width:7px; height:7px; border-radius:50%; background:#6fa050; box-shadow:0 0 0 3px rgba(111,160,80,0.25); flex-shrink:0; }

  .mng-es-overlay{
    position:fixed; inset:0; z-index:9999;
    background:rgba(28,27,25,0.72);
    display:none; align-items:center; justify-content:center;
    padding:20px;
    font-family:'Inter', sans-serif;
  }
  .mng-es-overlay.open{ display:flex; }
  .mng-es-card{
    position:relative;
    background:#fdf8ef; color:#1c1b19;
    border:1px solid #e8dfc6; border-radius:16px;
    max-width:440px; width:100%;
    max-height:88vh; overflow-y:auto;
    padding:30px 26px 24px;
    animation: mng-es-in .28s cubic-bezier(.2,.8,.2,1);
  }
  @keyframes mng-es-in{ from{ opacity:0; transform:translateY(14px) scale(.98);} to{ opacity:1; transform:translateY(0) scale(1);} }
  .mng-es-pin{ font-size:18px; margin-bottom:10px; display:block; }
  .mng-es-close{
    position:absolute; top:14px; right:14px;
    width:28px; height:28px; border-radius:50%;
    border:1px solid rgba(28,27,25,0.14); background:#fff;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:13px; color:#5c5a52;
  }
  .mng-es-eyebrow{ font-family:'IBM Plex Mono', monospace; font-size:11px; color:#4f7a3d; margin-bottom:8px; letter-spacing:0.03em; }
  .mng-es-title{ font-family:'Fraunces', serif; font-weight:600; font-size:22px; line-height:1.2; margin-bottom:8px; }
  .mng-es-sub{ font-size:13.5px; color:#5c5a52; line-height:1.55; margin-bottom:22px; }
  .mng-es-q{ margin-bottom:20px; }
  .mng-es-q label{ display:block; font-size:12.5px; font-weight:600; margin-bottom:9px; }
  .mng-es-chips{ display:flex; flex-wrap:wrap; gap:8px; }
  .mng-es-chip{
    font-size:12.5px; padding:8px 13px; border-radius:16px;
    border:1px solid rgba(28,27,25,0.16); background:#fff; cursor:pointer;
    transition: border-color .15s, background .15s;
  }
  .mng-es-chip.sel{ border-color:#1c1b19; background:#1c1b19; color:#f3efe4; }
  .mng-es-scale{ display:flex; gap:8px; }
  .mng-es-scale button{
    flex:1; font-size:22px; padding:10px 0; border-radius:10px;
    border:1px solid rgba(28,27,25,0.14); background:#fff; cursor:pointer;
    transition: border-color .15s, background .15s, transform .1s;
  }
  .mng-es-scale button.sel{ border-color:#6fa050; background:rgba(111,160,80,0.12); transform:scale(1.06); }
  .mng-es-q textarea{
    width:100%; min-height:64px; border:1px solid rgba(28,27,25,0.14); border-radius:8px;
    padding:10px 12px; font-family:'Inter', sans-serif; font-size:13.5px; resize:vertical;
    background:#fff;
  }
  .mng-es-q textarea::placeholder{ color:#a39c8a; }
  .mng-es-actions{ display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:6px; }
  .mng-es-skip{ font-family:'IBM Plex Mono', monospace; font-size:11.5px; color:#9a8c70; cursor:pointer; background:none; border:none; }
  .mng-es-submit{
    background:#4f7a3d; color:#fff; font-weight:600; font-size:13.5px;
    padding:11px 20px; border-radius:8px; border:none; cursor:pointer;
  }
  .mng-es-submit:hover{ background:#6fa050; }
  .mng-es-thanks{ text-align:center; padding:14px 4px 4px; display:none; }
  .mng-es-thanks .icon{ font-size:34px; margin-bottom:10px; }
  .mng-es-thanks h3{ font-family:'Fraunces', serif; font-size:19px; margin-bottom:8px; }
  .mng-es-thanks p{ font-size:13px; color:#5c5a52; line-height:1.55; }
  `;

  var html = `
  <div class="mng-es-overlay" id="mng-es-overlay">
    <div class="mng-es-card">
      <button class="mng-es-close" id="mng-es-close" aria-label="Chiudi">✕</button>

      <div id="mng-es-form-wrap">
        <span class="mng-es-pin">📌</span>
        <div class="mng-es-eyebrow">prima di andare</div>
        <div class="mng-es-title">Puoi rispondere a queste domande?</div>
        <p class="mng-es-sub">Ci serve la vostra opinione per rendere reale questo progetto. Ci vuole meno di un minuto.</p>

        <form id="mng-es-form">
          <div class="mng-es-q">
            <label>Perché hai scansionato il QR code?</label>
            <div class="mng-es-chips" data-group="motivo">
              <div class="mng-es-chip" data-val="curiosità">Curiosità</div>
              <div class="mng-es-chip" data-val="passavo di lì">Passavo di lì</div>
              <div class="mng-es-chip" data-val="me l'ha detto qualcuno">Me l'ha detto qualcuno</div>
              <div class="mng-es-chip" data-val="mi interessa il tema">Mi interessa il tema</div>
            </div>
          </div>

          <div class="mng-es-q">
            <label>Prima impressione?</label>
            <div class="mng-es-scale" data-group="impressione">
              <button type="button" data-val="1">😕</button>
              <button type="button" data-val="2">😐</button>
              <button type="button" data-val="3">🙂</button>
              <button type="button" data-val="4">😍</button>
            </div>
          </div>

          <div class="mng-es-q">
            <label>C'è qualcosa che non ha funzionato o ti ha confuso? <span style="font-weight:400;color:#9a8c70;">(facoltativo)</span></label>
            <textarea id="mng-es-broken" placeholder="Es. non capivo dove cliccare per..."></textarea>
          </div>

          <div class="mng-es-q" style="margin-bottom:22px;">
            <label>Cosa ti piacerebbe vedere in questo progetto?</label>
            <textarea id="mng-es-wish" placeholder="La tua idea, anche buttata lì..."></textarea>
          </div>

          <div class="mng-es-actions">
            <button type="button" class="mng-es-skip" id="mng-es-skip">no, grazie</button>
            <button type="submit" class="mng-es-submit">Invia →</button>
          </div>
        </form>
      </div>

      <div class="mng-es-thanks" id="mng-es-thanks">
        <div class="icon">🌿</div>
        <h3>Grazie assai.</h3>
        <p>Quello che ci hai detto conta davvero — è così che questo progetto diventa reale.</p>
      </div>
    </div>
  </div>
  <div class="mng-es-tab" id="mng-es-tab"><span class="dot"></span>la tua opinione</div>
  `;

  function inject() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  }

  function initModal() {
    var overlay = document.getElementById('mng-es-overlay');
    var closeBtn = document.getElementById('mng-es-close');
    var skipBtn = document.getElementById('mng-es-skip');
    var tab = document.getElementById('mng-es-tab');
    var form = document.getElementById('mng-es-form');
    var formWrap = document.getElementById('mng-es-form-wrap');
    var thanks = document.getElementById('mng-es-thanks');

    var state = { motivo: null, impressione: null };

    document.querySelectorAll('.mng-es-chips .mng-es-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.mng-es-chips .mng-es-chip').forEach(function (c) {
          c.classList.remove('sel');
        });
        chip.classList.add('sel');
        state.motivo = chip.dataset.val;
      });
    });
    document.querySelectorAll('.mng-es-scale button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.mng-es-scale button').forEach(function (b) {
          b.classList.remove('sel');
        });
        btn.classList.add('sel');
        state.impressione = btn.dataset.val;
      });
    });

    function open() {
      overlay.classList.add('open');
      try {
        sessionStorage.setItem(SHOWN_KEY, '1');
      } catch (e) {}
    }
    function close() {
      overlay.classList.remove('open');
    }

    closeBtn.addEventListener('click', close);
    skipBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Demo mode: no backend wired yet — record locally + show thanks.
      // TODO: POST to web3forms (or MNG backend) once access_key is available.
      var payload = {
        motivo: state.motivo,
        impressione: state.impressione,
        cosa_non_ha_funzionato: document.getElementById('mng-es-broken').value.trim(),
        cosa_vorresti_vedere: document.getElementById('mng-es-wish').value.trim(),
        pagina: location.pathname,
        ts: new Date().toISOString()
      };
      try {
        var log = JSON.parse(localStorage.getItem('mng_survey_responses') || '[]');
        log.push(payload);
        localStorage.setItem('mng_survey_responses', JSON.stringify(log));
      } catch (e) {}

      formWrap.style.display = 'none';
      thanks.style.display = 'block';
      try {
        sessionStorage.setItem(DONE_KEY, '1');
      } catch (e) {}
      tab.querySelector('span:last-child') || null;
      tab.lastChild.textContent = 'grazie 🌿';

      setTimeout(close, 2200);
    });

    tab.addEventListener('click', function () {
      if (thanks.style.display === 'block') {
        formWrap.style.display = 'block';
        thanks.style.display = 'none';
      }
      open();
    });

    window.MNGExitSurvey = { open: open, close: close };

    // ── Triggers ──────────────────────────────────────────────────────
    var already = false;
    try {
      already =
        sessionStorage.getItem(SHOWN_KEY) === '1' || sessionStorage.getItem(DONE_KEY) === '1';
    } catch (e) {}
    if (already) return;

    // Desktop exit-intent
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.addEventListener('mouseout', function (e) {
        if (e.clientY <= 0 && !e.relatedTarget) {
          var shown = false;
          try {
            shown =
              sessionStorage.getItem(SHOWN_KEY) === '1' ||
              sessionStorage.getItem(DONE_KEY) === '1';
          } catch (err) {}
          if (!shown) open();
        }
      });
    }

    // Mobile / general fallback: soft timer
    setTimeout(function () {
      var shown = false;
      try {
        shown =
          sessionStorage.getItem(SHOWN_KEY) === '1' || sessionStorage.getItem(DONE_KEY) === '1';
      } catch (e) {}
      if (!shown) open();
    }, TIMER_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      inject();
      initModal();
    });
  } else {
    inject();
    initModal();
  }
})();
