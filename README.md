# MegaScreen

### `index.html`
- Grundstruktur
- inkl. Tag 1-Inhalte
### `contentManager.js`
- lädt alle 3 Minuten den nächsten aktuellen Inhalt aus `contentSchedule.json` 
- mit Überblendung via `element.style.display` und `element.style.opacity`
### `languageSwitcher.js`
- wechselt jede Minute die Sprache des gesamten angezeigten Inhalts 
- via CSS-Klassen `content-de`, `content-en`, `content-fr`
### `contentSchedule.json`
- liefert Inhalte 
- inkl. Zeitplanung (von wann bis wann anzuzeigen)
### `indexScheduled.html`
- Test-Umgebung

### `_dateiname.endung`
- Dateien mit _[Underscore] beginnend bezeichnen Skizzen