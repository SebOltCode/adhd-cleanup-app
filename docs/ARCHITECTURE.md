# Architekturüberblick

## Gesamtsystem

```
Mobile (Expo/React Native) <——> REST API (Express + TypeORM) <——> PostgreSQL
                                    │
                                    └── Seed-Service (Default-Räume & Tasks)
```

- **Mobile App**: React Native + Expo. State-Management über React Query & Kontext. Tailwind (NativeWind) für Styling.
- **Backend**: Express-Server mit TypeORM (PostgreSQL oder SQLite für lokale Tests). JWT-basierte Authentifizierung.
- **Datenbank**: PostgreSQL 15 (Docker), Tabellen werden via TypeORM synchronisiert. UUID-Primärschlüssel.

## Domainmodell

| Entität        | Beschreibung                                                         |
|----------------|-----------------------------------------------------------------------|
| `User`         | Nutzerprofil inkl. Level, XP und Streak                               |
| `Room`         | Raum mit individueller Konfiguration und Bezug zum User               |
| `Item`         | Bereich im Raum (z. B. „Couchtisch“), hat `frequencyDays`             |
| `TaskGroup`    | Logischer Schritt-Bereich (z. B. „Quick Reset“)                       |
| `Task`         | Konkreter Mikro-Task, Reihenfolge & Reward-Punkte                     |
| `TaskProgress` | Fortschritt pro Task & User, speichert Status & Reward                |

Beziehungen: `User 1:n Room`, `Room 1:n Item`, `Item 1:n TaskGroup`, `TaskGroup 1:n Task`, `Task 1:n TaskProgress`.

## Services & Logik

- **Auth-Service**: Registriert User, hasht Passwörter (bcrypt) und legt Default-Daten an.
- **Task-Service**: Sucht den nächsten offenen Task (`COALESCE(progress.completed, false) = false`) und zählt Restaufgaben.
- **Gamification**: XP werden pro Task addiert. Level = `floor(experience / 100) + 1`. Streak wird aus den letzten 60 Abschlüssen berechnet.
- **Stats-Service**: Aggregiert abgeschlossene Tasks der letzten 7 Tage im Backend, liefert Diagramm-Daten für Frontend.

## Mobile App Flow

1. **SetupScreen**: User gibt Backend-URL, Mail, Passwort ein → Registrierung/Login.
2. **TaskScreen**: Holt `/tasks/next`, zeigt eine Karte mit Raum, Item und Task. „Aufgabe abhaken“ führt `/tasks/:id/complete` aus, triggert Celebration.
3. **StatsScreen**: Lädt `/users/me`, zeigt Level, XP-Progress, Streak sowie Wochenbalken.
4. Navigation über Bottom Tabs (`Tasks`, `Stats`). Auth-Gate via Stack Navigator.

## Styling & UX

- Liquid-Glass-Look: Gradients, transparente Karten, Fokus auf wenige Elemente pro Screen.
- ADHS-Prinzipien: Einzelner Task, keine Listen, dopaminreiche Farben & positive Feedback-Texte.
- NativeWind Tailwind Klassen für konsistente Abstände/Farben.

## Erweiterungen (Roadmap)

- Push Notifications via Expo Notification Service.
- Wiederkehrende Tasks mit Fälligkeiten & Zurücksetzen der Progress-Einträge.
- Web-Dashboard (Next.js) als Ergänzung.
- CI/CD via GitHub Actions + EAS (Konfig-Platzhalter bereits vorbereitet).
