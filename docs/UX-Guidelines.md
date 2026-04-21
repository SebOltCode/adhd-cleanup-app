# UX-Guidelines (ADHS Fokus)

## Prinzipien

1. **Ein Fokuspunkt**: Immer nur eine Aktion pro Screen. TaskScreen zeigt genau einen Task.
2. **Schnelles Feedback**: Abschluss löst sofort Celebration-Overlay + XP-Update aus.
3. **Konstante Struktur**: Tabs, Buttons und Texte behalten konsistente Positionen.
4. **Positive Sprache**: Texte motivieren („Yeah!“, „Dopamin-Power“) statt zu tadeln.
5. **Low Cognitive Load**: Große Schrift, viel White Space, klare Farb-Codes.

## Design Tokens

| Token            | Wert       | Einsatz                          |
|------------------|-----------|----------------------------------|
| Primärfarbe      | #4685FF   | Buttons, Gradients               |
| Dopamin-Accent   | #FF90E8   | Rewards, Progress-Bar            |
| Hintergrund dunkel | #071333 | Hintergrund Task/Stats           |
| Erfolg           | #34D399   | Positive Stats                   |

## Komponenten

- **TaskCard**: Liquid-Glass Gradient, Info-Hierarchie: Raum → Item → Task.
- **CelebrationOverlay**: Vollflächiger Gradient + Emoji, max. 1,8 s sichtbar.
- **StatCards**: Drei gleich große Kacheln mit unterschiedlichen Accentfarben.
- **WeeklyChart**: Minimalistische Balken, gleiche Breite, sanfte Farbübergänge.

## Microcopy Beispiele

- CTA Buttons: „Aufgabe abhaken ✅“, „Account anlegen & starten“.
- Status: „Dein nächster Mikro-Schritt“, „Alles erledigt! Zeit für eine Pause.“
- Fehlertexte: freundlich, lösungsorientiert („Bitte prüfe deine Daten …“).

## Barrierefreiheit

- Hoher Kontrast zwischen Text und Hintergrund.
- Textgrößen ≥ 16pt, Buttons mit min. 48px Höhe.
- Kein Flackern/blinkende Animationen, CelebrationOverlay nutzt Fading.

## Notification-Konzept (Vorbereitung)

- Reminder-Templates: „5-Minuten-Aufräum-Snack?“, „Reset dein Lieblingszimmer“.
- Zeitfenster: Vormittag, Nachmittag, Abend – konfigurierbar pro User.

Diese Guidelines dienen als Basis für spätere Iterationen (Gamification, Belohnungssystem, Animationsausbau).
