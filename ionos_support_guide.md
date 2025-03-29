# Einrichtungsanleitung für IONOS-Support: Menschgreifzu Affiliate-Marketing-System

Sehr geehrtes IONOS-Support-Team,

der Kunde benötigt Unterstützung bei der Einrichtung einer Node.js-Anwendung mit MySQL-Datenbankanbindung auf seinem IONOS Ultimate Hosting-Paket. Hier finden Sie eine detaillierte Anleitung für die Einrichtung.

## Projektübersicht

- **Projektname**: Menschgreifzu
- **Projekttyp**: Node.js-Anwendung mit Express und Sequelize ORM
- **Datenbank**: MySQL 8.0
- **Domain**: www.deal369.com

## Einrichtungsschritte

### 1. Dateien hochladen

1. Entpacken Sie die Datei `menschgreifzu_project.zip` in das Hauptverzeichnis des Webspace des Kunden
2. Stellen Sie sicher, dass alle Dateien und Verzeichnisse korrekt extrahiert wurden

### 2. Datenbankverbindung

Die Datenbank wurde bereits eingerichtet mit folgenden Daten:
- **Datenbankname**: dbs14064836
- **Hostname**: db5017560211.hosting-data.io
- **Port**: 3306
- **Benutzername**: dbu5589221
- **Passwort**: Sonne666%

Diese Daten sind bereits in der Datei `.env.production` konfiguriert.

### 3. Node.js-Umgebung einrichten

1. Aktivieren Sie Node.js für das Hosting-Paket des Kunden
2. Wählen Sie die neueste verfügbare Node.js-Version (idealerweise 16.x oder höher)
3. Konfigurieren Sie den Startpunkt der Anwendung:
   - Pfad zur Anwendung: `/menschgreifzu/app.js`
   - Port: `3000`

### 4. Abhängigkeiten installieren

1. Navigieren Sie zum Verzeichnis "menschgreifzu"
2. Führen Sie `npm install` aus, um alle erforderlichen Abhängigkeiten zu installieren

### 5. Datenbanktabellen erstellen

Fügen Sie temporär folgenden Code am Ende der Datei `config/database.js` hinzu:

```javascript
// Import models
const Affiliate = require('../models/Affiliate');
const LandingPage = require('../models/LandingPage');
const SocialPost = require('../models/SocialPost');
const Lead = require('../models/Lead');
const EmailTemplate = require('../models/EmailTemplate');
const EmailCampaign = require('../models/EmailCampaign');
const BufferConfig = require('../models/BufferConfig');

// Sync database
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database tables created successfully');
  })
  .catch(err => {
    console.error('Error creating database tables:', err);
  });
```

Starten Sie die Anwendung einmal, um die Tabellen zu erstellen, und entfernen Sie dann diesen Code wieder.

### 6. Domain-Konfiguration

1. Konfigurieren Sie die Domain www.deal369.com so, dass sie auf die Node.js-Anwendung verweist
2. Richten Sie einen Reverse Proxy ein, der Anfragen von www.deal369.com an localhost:3000 weiterleitet

### 7. Anwendung starten

1. Starten Sie die Node.js-Anwendung mit dem Befehl `npm start` oder über das IONOS Control Panel
2. Überprüfen Sie, ob die Anwendung korrekt läuft, indem Sie https://www.deal369.com aufrufen

## Technische Details

- Die Anwendung verwendet Express.js als Web-Framework
- Sequelize ORM wird für die Datenbankinteraktion verwendet
- EJS wird als Template-Engine verwendet
- Die Anwendung hat folgende Hauptfunktionen:
  - Affiliate-Verwaltung
  - Landing Page-Management
  - Social Media Post-Planung mit Buffer-Integration
  - Lead-Management und -Nurturing
  - E-Mail-Kampagnen

Bei Fragen oder Problemen wenden Sie sich bitte an den Kunden.

Vielen Dank für Ihre Unterstützung!
