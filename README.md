# MegaScreen

## Grunddateien

### `index.html`
- Grundstruktur
- inkl. Inhalte

### `contentManager.js`
- lädt alle 3 Minuten den nächsten aktuellen Inhalt aus `contentSchedule.json` 
- mit Überblendung via `element.style.display` und `element.style.opacity`

### `languageSwitcher.js`
- wechselt jede Minute die Sprache des gesamten angezeigten Inhalts 
- via CSS-Klassen `content-de`, `content-en`, `content-fr`

### `contentCycler.js`
- wechselt alle 3 Minuten zwischen verschiedenen Slides im `changingContent`-Bereich
- via CSS-Klassen `slide-1`, `slide-2`, `slide-3`, etc.
- mit Überblendung via `opacity` und `z-index`

### `contentSchedule.json`
- liefert Inhalte 
- inkl. Zeitplanung (von wann bis wann anzuzeigen)

### `indexScheduled.html`
- Test-Umgebung

### `_dateiname.endung`
- Dateien mit _[Underscore] beginnend bezeichnen Skizzen

---

## Content-Cycling-System

### Überblick
Das Content-Cycling-System ermöglicht es, zwischen mehreren Slides im `changingContent`-Bereich zu wechseln. Es arbeitet zusammen mit dem Sprachwechsler:

- **Sprachwechsel**: Alle 1 Minute (60 Sekunden) - wechselt zwischen Deutsch, Englisch und Französisch
- **Content-Wechsel**: Alle 3 Minuten (180 Sekunden) - wechselt zwischen verschiedenen Slides

### Funktionsweise

#### 1. Sprachwechsler (`languageSwitcher.js`)
- Wechselt alle 60 Sekunden die Sprache
- Verwendet CSS-Klassen: `content-de`, `content-en`, `content-fr`
- Ein kompletter Sprachzyklus dauert 3 Minuten (60 Sekunden × 3 Sprachen)

#### 2. Content-Wechsler (`contentCycler.js`)
- Wechselt alle 3 Minuten (180 Sekunden) zwischen Content-Slides
- Verwendet CSS-Klassen: `slide-1`, `slide-2`, `slide-3`, `slide-4`, etc.
- Jeder Slide enthält Inhalte für alle drei Sprachen

#### 3. Timing-Koordination
Da beide Systeme auf 3-Minuten-Zyklen laufen:
- Sprachwechsler: 1min DE → 1min EN → 1min FR → wiederholen (3min total)
- Content-Wechsler: 3min slide-1 → 3min slide-2 → 3min slide-3 → wiederholen

Das bedeutet, jeder Slide wird genau 3 Minuten angezeigt und zeigt dabei alle drei Sprachen.

### HTML-Struktur

```html
<section id="changingContent">
  <!-- Slide 1 -->
  <div class="slideContent slide-1">
    <img src="hintergrundbild.png" alt="">
    <img class="fade content-de" src="deutscher-text-overlay.png" alt="">
    <img class="fade content-en" src="englischer-text-overlay.png" alt="">
    <img class="fade content-fr" src="französischer-text-overlay.png" alt="">
  </div>
  
  <!-- Slide 2 -->
  <div class="slideContent slide-2">
    <img src="hintergrundbild-2.png" alt="">
    <img class="fade content-de" src="deutscher-text-overlay-2.png" alt="">
    <img class="fade content-en" src="englischer-text-overlay-2.png" alt="">
    <img class="fade content-fr" src="französischer-text-overlay-2.png" alt="">
  </div>
  
  <!-- Weitere Slides nach Bedarf hinzufügen -->
</section>
```

### Weitere Slides hinzufügen

#### Schritt 1: JavaScript-Array aktualisieren
In `contentCycler.js` das `contentSlides`-Array erweitern:
```javascript
const contentSlides = ['slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5']; // Weitere nach Bedarf
```

#### Schritt 2: HTML-Struktur hinzufügen
Neue `slideContent`-Divs mit entsprechenden Klassennamen hinzufügen:
```html
<div class="slideContent slide-5">
  <img src="content/slides/img/ihr-hintergrund.png" alt="">
  <img class="fade content-de" src="content/slides/txt/ihr-deutscher-text.png" alt="">
  <img class="fade content-en" src="content/slides/txt/ihr-englischer-text.png" alt="">
  <img class="fade content-fr" src="content/slides/txt/ihr-französischer-text.png" alt="">
</div>
```

### Verwendete CSS-Klassen

- `.slideContent`: Basis-Styling für Slide-Container
- `.slide-1`, `.slide-2`, etc.: Individuelle Slide-Identifikatoren
- `.fade`: Sprachspezifische Inhalte mit Überblendungen
- `.content-de`, `.content-en`, `.content-fr`: Sprach-Identifikatoren
- `.show`: Wird auf sichtbare Elemente angewendet

### Anpassungen

#### Content-Zyklus-Dauer ändern
In `contentCycler.js` die Variable `contentDuration` anpassen:
```javascript
const contentDuration = 240000; // 4 Minuten statt 3
```

#### Sprach-Zyklus-Dauer ändern
In `languageSwitcher.js` die Variable `duration` anpassen:
```javascript
const duration = 90000; // 90 Sekunden statt 60
```

**Hinweis**: Wenn Sie die Sprachdauer ändern, sollten Sie auch die Content-Dauer anpassen, um die Synchronisation beizubehalten.

### Initialisierung

Beide Systeme werden im Hauptskript initialisiert:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Sprachwechsel initialisieren
  const initialElements = document.getElementsByClassName(languages[currentIndex]);
  for (let i = 0; i < initialElements.length; i++) {
    initialElements[i].classList.add('show');
  }
  setInterval(showNextLanguage, duration);
  
  // Content-Wechsel initialisieren
  initContentCycling();
});
```