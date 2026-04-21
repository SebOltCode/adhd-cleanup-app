# REST-API Übersicht

Alle Endpunkte sind unter `http://<HOST>:<PORT>/api` erreichbar. Antworten sind JSON-kodiert.

## Authentifizierung

| Methode | Pfad              | Beschreibung                           |
|---------|-------------------|----------------------------------------|
| POST    | `/auth/register`  | Erstellt einen Account + Seed-Daten    |
| POST    | `/auth/login`     | Liefert JWT für vorhandenen Account    |

### POST `/auth/register`

```json
{
  "email": "mara@example.com",
  "password": "geheim123",
  "displayName": "Mara"
}
```

Antwort:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "email": "mara@example.com",
    "displayName": "Mara",
    "level": 1,
    "experience": 0,
    "streak": 0
  }
}
```

### POST `/auth/login`

```json
{
  "email": "mara@example.com",
  "password": "geheim123"
}
```

Antwort identisch zu `/auth/register`.

## Räume

Alle folgenden Routen erfordern den Header `Authorization: Bearer <token>`.

| Methode | Pfad            | Beschreibung                           |
|---------|----------------|----------------------------------------|
| GET     | `/rooms`       | Listet Räume inkl. Items & Tasks       |
| GET     | `/rooms/templates` | Liefert Default-Raumvorlagen        |
| POST    | `/rooms`       | Legt neuen Raum mit optionalen Tasks an |

Beispiel `POST /rooms`:

```json
{
  "name": "Büro",
  "emoji": "💻",
  "configuration": { "windows": 1, "devices": 2 },
  "items": [
    {
      "name": "Schreibtisch",
      "icon": "🪑",
      "frequencyDays": 2,
      "taskGroups": [
        {
          "title": "Quick Reset",
          "tasks": [
            { "description": "Papierstapel sortieren", "expectedDurationMinutes": 3, "rewardPoints": 12 },
            { "description": "Oberfläche abwischen", "expectedDurationMinutes": 2, "rewardPoints": 8 }
          ]
        }
      ]
    }
  ]
}
```

## Tasks

| Methode | Pfad                      | Beschreibung                                |
|---------|---------------------------|---------------------------------------------|
| GET     | `/tasks/next`             | Liefert nächsten offenen Task               |
| POST    | `/tasks/:taskId/complete` | Markiert Task als erledigt, aktualisiert XP |

`GET /tasks/next` Beispiel:

```json
{
  "task": {
    "id": "...",
    "description": "Sichtbaren Müll einsammeln",
    "expectedDurationMinutes": 3,
    "rewardPoints": 10,
    "sequence": 1,
    "group": {
      "title": "Reset",
      "item": {
        "name": "Boden",
        "room": { "name": "Wohnzimmer", "emoji": "🛋️" }
      }
    }
  },
  "pendingCount": 12
}
```

`POST /tasks/:taskId/complete` Antwort:

```json
{
  "message": "Aufgabe abgeschlossen",
  "reward": 10,
  "user": { "level": 1, "experience": 10, "streak": 1 },
  "nextTask": { ... },
  "pendingCount": 11
}
```

## Benutzer & Statistiken

| Methode | Pfad        | Beschreibung                                   |
|---------|-------------|------------------------------------------------|
| GET     | `/users/me` | Profil & Statistik (Räume, Fortschritt, Woche) |

Antwortauszug:

```json
{
  "user": {
    "displayName": "Mara",
    "level": 2,
    "experience": 140,
    "streak": 3
  },
  "stats": {
    "roomsCount": 3,
    "pendingCount": 14,
    "totalCompleted": 21,
    "completedThisWeek": 6,
    "weekOverview": [
      { "day": "2024-01-01T00:00:00.000Z", "count": 2 },
      { "day": "2024-01-02T00:00:00.000Z", "count": 1 }
    ]
  }
}
```

## Fehlercodes

- `400`: Validierungsfehler (z. B. fehlende Felder)
- `401`: Token fehlt oder ist ungültig
- `404`: Ressource existiert nicht oder gehört nicht zum User
- `500`: Unerwarteter Serverfehler
