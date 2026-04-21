# ADHS Cleanup Companion

Eine Expo/React-Native-App plus Node.js/Express-Backend, die ADHS-Betroffenen beim Aufräumen unterstützt. Die App zerlegt Haushalts-
 und Organisationsaufgaben in motivierende Mikro-Schritte, verfolgt Fortschritt und belohnt erledigte Tasks mit Dopamin-Triggern.

## 🚀 Quickstart

## ✅ Aktueller Stand (bereits testbar)

Ja — du kannst die App **jetzt schon lokal testen** (Backend + Expo-App auf Android/Windows).

Aktuell stabil testbar:

- Registrierung/Login
- Wohnungs-Templates inkl. initialer Aufgaben
- Fokus-Ansicht mit jeweils einer Aufgabe
- Aufgabe abhaken + Belohnungs-Overlay
- einfache Statistikansicht

Noch nicht final ausgebaut:

- echte Push-Reminder mit produktiver Expo-Token-Pipeline
- ausgereifte Migrations-/Prod-Deploy-Strecke
- vollständige Gamification-Progression (mehrstufige Levelsysteme etc.)

### 1. Repository klonen

```bash
git clone https://github.com/<dein-account>/adhd-cleanup-app.git
cd adhd-cleanup-app
```

### 2. Abhängigkeiten installieren

Nutze am besten Node.js ≥ 18. Auf Windows empfiehlt sich [nvm-windows](https://github.com/coreybutler/nvm-windows).

```bash
npm install
npm install -w backend
npm install -w mobile
```

### 3. Datenbank starten (Docker)

```bash
cd database
docker compose up -d
cd ..
```

Standard-Zugangsdaten:

- Host: `localhost`
- Port: `5432`
- Datenbank: `adhd_cleanup`
- Benutzer: `adhd_admin`
- Passwort: `adhd_secret`

### 4. Backend im Dev-Modus

```bash
npm run dev:backend
```

Das Backend erzeugt bei Registrierung automatisch Beispielräume, Items und Tasks. Standard-Port: `4000`.

### 5. Mobile App mit Expo

```bash
npm run dev:mobile
```

- **Android**: `npm run dev:mobile` starten, anschließend in der Metro-Konsole `a` drücken oder in Expo Go den QR-Code scannen.
- **Windows**: Expo CLI funktioniert über PowerShell oder Git Bash. Stelle sicher, dass Android Studio bzw. ein Emulator läuft oder ein echtes Gerät via USB verbunden ist.
- **Android-Geräte**: In der Setup-Ansicht der App die eigene Rechner-IP eingeben (z. B. `http://192.168.0.42:4000`).

### 6. Login/Registrierung

1. App öffnen → Setup-Screen.
2. Backend-URL eintragen.
3. Account anlegen oder mit vorhandenen Daten einloggen.
4. Erster Task wird geladen, Belohnungen aktivieren Dopamin-Overlay.

## 🧪 Exakter Testablauf (Windows + Android)

### A) Backend-Schnellcheck (empfohlen vor App-Start)

1. Terminal 1:

```bash
npm run dev:backend
```

2. Terminal 2 (Health-Check):

```bash
curl http://localhost:4000/health
```

Wenn kein `/health` vorhanden ist, teste stattdessen Registrierung:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test User","email":"test@example.com","password":"Passwort123"}'
```

Erwartung: JSON-Antwort mit User/Token (oder Hinweis, dass der User schon existiert).

### B) Android testen (Expo Go)

1. Auf dem Android-Gerät **Expo Go** installieren.
2. Im Projekt:

```bash
npm run dev:mobile
```

3. QR-Code mit Expo Go scannen.
4. In der Setup-Ansicht als API-URL die LAN-IP deines Rechners eintragen, z. B.:

```txt
http://192.168.0.42:4000
```

5. Registrieren → erster Task erscheint → Task abhaken → Belohnungs-Overlay prüfen → Stats-Tab öffnen.

### C) Windows testen (Entwicklungsrechner)

Variante 1 (empfohlen): Android Emulator unter Windows starten und im Metro-Terminal `a` drücken.

Variante 2: Physisches Android-Gerät per USB/WLAN + Expo Go wie oben.

Wichtig unter Windows:

- Firewall-Freigabe für Node/Expo erlauben (sonst Gerät erreicht Backend nicht).
- Backend muss auf `4000` laufen, bevor die App gestartet wird.
- Bei Portkonflikten Port anpassen und dieselbe URL in der App setzen.

## 📦 Projektstruktur

```
backend/          Express + TypeORM Backend
mobile/           Expo/React Native App
cicd/             EAS- & GitHub-Actions-Vorbereitung (Platzhalter)
database/         Docker Compose + Init-SQL
docs/             Architektur- & API-Übersicht
```

## 🔧 Backend-Konfiguration

Leg eine `.env` im Verzeichnis `backend/` an:

```env
PORT=4000
DATABASE_URL=postgres://adhd_admin:adhd_secret@localhost:5432/adhd_cleanup
JWT_SECRET=super_secret_key
TYPEORM_SYNC=true
```

> **Hinweis:** Für lokale Tests kann alternativ SQLite genutzt werden. Setze `USE_SQLITE=true` und optional `SQLITE_PATH=./adhd-cleanup.sqlite`.

Nach dem Start synchronisiert TypeORM automatisch das Schema und legt Default-Daten an.

## 📱 Mobile-Konfiguration

- Öffentliche Backend-URL über `EXPO_PUBLIC_API_URL` setzen (z. B. `.env` im Projekt root oder beim Start `EXPO_PUBLIC_API_URL=http://192.168.0.42:4000 npm run dev:mobile`).
- Push Notifications sind vorbereitet (`expo-notifications`), müssen aber später mit einem echten Expo-Projekt verknüpft werden.

## 🧪 Tests & Linting

```bash
npm run lint           # führt Backend- und Mobile-Linting aus
npm run test           # (Platzhalter) Backend Tests
```

Backend-Linting verwendet ESLint, das mobile Projekt nutzt `expo lint`.

## 🛠️ Windows-spezifische Tipps

- Verwende `wsl --install` oder Git Bash, falls PowerShell Probleme mit langen Pfaden hat.
- Docker Desktop benötigt Administratorrechte und aktivierte Hyper-V/WSL2.
- Setze in `database/docker-compose.yml` bei Bedarf einen anderen Port, falls `5432` belegt ist.

## 📊 Beispiel-Workflow

1. Account anlegen → Default-Räume „Wohnzimmer“, „Küche“, „Bad“ werden erzeugt.
2. Taskscreen zeigt immer genau einen Task.
3. Nach Abschluss erscheint ein Celebration-Overlay, Erfahrungspunkte werden gutgeschrieben.
4. Statistikseite visualisiert erledigte Tasks der Woche, Anzahl der Räume und Gesamt-Fortschritt.

## 📚 Weitere Dokumentation

- [docs/API.md](docs/API.md) – REST-Endpunkte & Beispielpayloads
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – Überblick über Frontend/Backend und Datenmodell
- [docs/UX-Guidelines.md](docs/UX-Guidelines.md) – ADHS-gerechte UX-Prinzipien & Design Tokens


## 🧯 PR-Fehler: „Binärdaten werden nicht unterstützt"

Wenn beim Erstellen eines Pull Requests diese Meldung erscheint, sind meist **binäre Dateien** (z. B. `*.apk`, `*.aab`, `*.db`, ZIPs, Screenshots) im Commit oder im Staging enthalten.

Schnelle Lösung:

```bash
git status
git diff --name-only --cached
```

Binärdateien aus dem Staging entfernen:

```bash
git restore --staged <datei>
```

Falls sie nicht ins Repo sollen, zusätzlich ignorieren (siehe `.gitignore`) und lokal entfernen:

```bash
rm <datei>
git add .gitignore
```

Danach PR erneut erstellen.

## 🧪 Verifizierter Laufzeit-Status (Stand: 21.04.2026)

Durch lokale Smoke-Tests ist aktuell verifiziert:

- Backend startet im Dev-Modus mit SQLite (`USE_SQLITE=true`) und liefert `/health`.
- User-Registrierung/Login über `POST /api/auth/register` und `POST /api/auth/login` funktionieren.
- Token-geschützte Endpunkte wie `GET /api/tasks/next` und `GET /api/users/me` antworten erwartungsgemäß.

Für Nutzer-Tests empfohlen:

1. lokal mit SQLite starten (kein Docker nötig) für schnellen Funktionstest,
2. danach optional Postgres via `database/docker-compose.yml` testen,
3. mobile App gegen `http://<LAN-IP>:4000` verbinden und Setup/Login/Task-Flow prüfen.

## 📦 Deployment / Builds

- **Backend**: via Docker-Compose oder beliebigem Node.js-Host deployen.
- **Mobile**: `eas build -p android` bzw. `eas build -p ios` (EAS-Project-ID in `mobile/app.config.ts` anpassen).
- **Push Notifications**: `expo-notifications` ist integriert, benötigt aber Server-Token-Konfiguration.

Viel Erfolg beim weiteren Ausbau! 🎉
