# ADHS-Aufräum-App

Eine mobile App, die ADHS-Betroffenen, Familien und WGs hilft, Aufräumen und Organisieren in überschaubare Tasks zu zerlegen und so kognitive Überforderung zu vermeiden.

## Inhaltsverzeichnis

- [Projektüberblick](#projektüberblick)
- [Tech-Stack](#tech-stack)
- [Setup](#setup)
  - [Voraussetzungen](#voraussetzungen)
  - [Installation](#installation)
  - [Datenbank einrichten](#datenbank-einrichten)
  - [Dev-Server starten](#dev-server-starten)
- [Verwendung](#verwendung)
- [Projektstruktur](#projektstruktur)
- [Konfiguration](#konfiguration)
- [Tests](#tests)
- [Deployment](#deployment)

## Projektüberblick

Dieses Projekt bietet eine strukturierte Task-Lösung für ADHS-Betroffene, um große Aufgaben in kleine, klare Schritte zu unterteilen und mit Gamification-Elementen zu motivieren.

## Tech-Stack

- **Frontend:** React Native (Expo), Tailwind CSS
- **Backend:** Node.js, Express
- **Datenbank:** PostgreSQL (TypeORM)
- **CI/CD:** GitHub Actions, Expo Application Services (EAS)

## Setup

### Voraussetzungen

- Node.js >= 16
- npm oder Yarn
- Docker & Docker Compose
- Expo CLI

### Installation

```bash
# Repository klonen
git clone https://github.com/dein-username/adhs-cleaning-app.git
cd adhs-cleaning-app

# Root-Abhängigkeiten installieren
yarn install



## Datenbank einrichten

# PostgreSQL-Container starten
docker-compose up -d

# Beispiel-Daten laden
psql -h localhost -U postgres -d adhs_cleaning -f database/init.sql



## Dev-Server starten

# Backend
cd backend
yarn dev

# Mobile App
cd ../mobile
expo start


## Verwendung

App öffnen und Wohnung konfigurieren.

Erste Aufgabe anzeigen, erledigen und Belohnung erhalten.

Weitere Räume und Tasks hinzufügen.

Projektstruktur

(Details siehe im Repository)




## Konfiguration

Umgebungsvariablen in .env:

DATABASE_URL=postgres://postgres:password@localhost:5432/adhs_cleaning
JWT_SECRET=your_secret_key
EXPO_PUSH_TOKEN=...



## Tests

# Backend-Tests
yarn test

# Mobile E2E-Tests
npm run test:e2e

Deployment

GitHub Actions führt Lint, Tests und Builds automatisch bei Pushes aus.

EAS-CLI konfiguriert in cicd/eas.json für Android- und iOS-Builds.
```
