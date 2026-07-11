# 🌿 MakeNapoliGreen

**MakeNapoliGreen** è una piattaforma civica open-source per la creazione e il monitoraggio di progetti di sostenibilità urbana — aiuole, orti comunitari, piantumazioni, pulizie ambientali — nelle città della Campania e oltre.

> A civic platform where people create and follow local sustainability projects in their city.

## Stack tecnico

- HTML5 semantico
- [Tailwind CSS](https://tailwindcss.com/) via CDN (con configurazione custom)
- [Lucide Icons](https://lucide.dev/)
- [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- [Leaflet.js](https://leafletjs.com/) per le mappe (solo `project.html`)
- [Web3Forms](https://web3forms.com/) per il form di contatto
- Vanilla JavaScript — nessun framework

## Struttura

```
index.html       # Homepage
projects.html    # Lista progetti con filtri
project.html     # Dettaglio singolo progetto (con mappa)
start.html       # Form per avviare o contribuire a un progetto
about.html       # Missione, chi siamo, disclaimer legale
projects.js      # Dati dei progetti (array JS)
script.js        # JS condiviso (header, menu, lingua)
styles.css       # Stili base condivisi
cookie-banner.js # Cookie banner (IIFE)
robots.txt       # Accesso motori di ricerca
```

## Funzionalità

- **Bilingue IT/EN** con toggle lingua persistente (localStorage)
- **Filtro progetti** per categoria, stato e ricerca testo
- **Mappa interattiva** su ogni pagina di dettaglio progetto (Leaflet.js)
- **Form Web3Forms** per avviare o contribuire a un progetto
- **Cookie banner** conforme alle best practice italiane
- **Responsive** (mobile-first)

## Come aggiungere un progetto

Modifica `projects.js` e aggiungi un oggetto all'array `projects` con i campi richiesti (vedi gli esempi esistenti).

## Disclaimer

Questa piattaforma facilita l'organizzazione civica informale. Non siamo un ente giuridico registrato. Consulta `about.html` per maggiori dettagli.

---

© 2026 MakeNapoliGreen — rilasciato con licenza MIT
