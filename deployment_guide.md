# Deployment-Anleitung für das Menschgreifzu-Projekt auf IONOS

Diese Anleitung führt Sie durch den Prozess der Bereitstellung des Menschgreifzu Affiliate-Marketing-Systems auf Ihrem IONOS-Hosting mit der Domain www.deal369.com.

## Voraussetzungen

- IONOS Ultimate Hosting-Paket (bereits vorhanden)
- Domain www.deal369.com (bereits mit Hosting verknüpft)
- MySQL 8.0 Datenbank (empfohlen) oder MariaDB 10
- Buffer-Konto für Social-Media-Automatisierung (Essentials-Plan für ca. 15€/Monat)

## 1. Hochladen der Projektdateien

1. Loggen Sie sich in Ihr IONOS Control Panel ein
2. Navigieren Sie zum Dateimanager oder FTP-Bereich
3. Erstellen Sie ein Verzeichnis namens "menschgreifzu" im Hauptverzeichnis Ihres Webspace
4. Laden Sie die Datei `menschgreifzu_project.zip` in dieses Verzeichnis hoch
5. Entpacken Sie die ZIP-Datei im Verzeichnis (nutzen Sie die Entpacken-Funktion im IONOS Dateimanager)

## 2. Einrichtung der MySQL-Datenbank

1. Gehen Sie im IONOS Control Panel zum Bereich "Datenbanken" oder "MySQL"
2. Erstellen Sie eine neue MySQL 8.0 Datenbank (z.B. mit dem Namen "menschgreifzu" oder "deal369")
3. Notieren Sie sich die folgenden Informationen:
   - Datenbankname
   - Datenbankbenutzer
   - Datenbankpasswort
   - Datenbank-Host (meist "localhost" oder eine spezifische Adresse)

## 3. Konfiguration der Anwendung

1. Navigieren Sie im Dateimanager zum Verzeichnis "menschgreifzu"
2. Öffnen Sie die Datei `.env.production` zur Bearbeitung
3. Aktualisieren Sie die folgenden Einstellungen:
   ```
   PORT=3000
   DB_HOST=<Ihr-Datenbank-Host>
   DB_USER=<Ihr-Datenbankbenutzer>
   DB_PASSWORD=<Ihr-Datenbankpasswort>
   DB_NAME=<Ihr-Datenbankname>
   DB_PORT=3306
   NODE_ENV=production
   EMAIL_SERVICE=gmail
   EMAIL_USER=<Ihre-Email-Adresse>
   EMAIL_PASS=<Ihr-Email-Passwort>
   BASE_URL=https://www.deal369.com
   ```
4. Speichern Sie die Datei
5. Kopieren Sie die Datei `.env.production` zu `.env` (oder benennen Sie sie um)

## 4. Einrichtung von Node.js auf IONOS

1. Gehen Sie im IONOS Control Panel zum Bereich "Hosting" oder "Webhosting"
2. Suchen Sie nach den Einstellungen für "Node.js" oder "Runtime"
3. Aktivieren Sie Node.js für Ihr Hosting-Paket (falls noch nicht geschehen)
4. Wählen Sie die neueste verfügbare Node.js-Version (idealerweise 16.x oder höher)
5. Konfigurieren Sie den Startpunkt der Anwendung:
   - Pfad zur Anwendung: `/menschgreifzu/app.js`
   - Port: `3000`

## 5. Installation der Abhängigkeiten

1. Wenn IONOS eine Konsole oder Terminal-Zugriff bietet:
   - Navigieren Sie zum Verzeichnis "menschgreifzu"
   - Führen Sie `npm install` aus
2. Wenn kein Terminal-Zugriff verfügbar ist:
   - Kontaktieren Sie den IONOS-Support und bitten Sie um Hilfe bei der Installation der npm-Pakete
   - Alternativ können Sie die `node_modules`-Verzeichnis lokal erstellen und dann hochladen:
     - Führen Sie lokal `npm install` aus
     - Komprimieren Sie das `node_modules`-Verzeichnis
     - Laden Sie es in das "menschgreifzu"-Verzeichnis auf dem Server hoch
     - Entpacken Sie es dort

## 6. Konfiguration der Domain

1. Gehen Sie im IONOS Control Panel zum Bereich "Domains" oder "DNS"
2. Konfigurieren Sie die Domain www.deal369.com so, dass sie auf Ihre Node.js-Anwendung verweist
3. Wenn IONOS einen Reverse Proxy anbietet:
   - Konfigurieren Sie ihn so, dass er Anfragen von www.deal369.com an localhost:3000 weiterleitet
4. Wenn IONOS keinen Reverse Proxy anbietet:
   - Konfigurieren Sie die Anwendung so, dass sie direkt auf Port 80 oder 443 läuft (ändern Sie PORT in der .env-Datei)

## 7. Einrichtung der Datenbank-Tabellen

Da wir Sequelize verwenden, können die Datenbanktabellen automatisch erstellt werden. Fügen Sie folgenden Code am Ende der Datei `config/database.js` hinzu:

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

Entfernen Sie diesen Code, nachdem die Tabellen erstellt wurden, um zu verhindern, dass die Datenbank bei jedem Neustart zurückgesetzt wird.

## 8. Einrichtung von Buffer für Social-Media-Automatisierung

1. Registrieren Sie sich für ein Buffer-Konto unter https://buffer.com
2. Wählen Sie den Essentials-Plan (ca. 15€/Monat)
3. Verbinden Sie Ihre Social-Media-Konten mit Buffer
4. Erstellen Sie eine Buffer-Anwendung für API-Zugriff:
   - Gehen Sie zu https://buffer.com/developers/apps
   - Erstellen Sie eine neue Anwendung
   - Notieren Sie sich Client ID und Client Secret
5. Aktualisieren Sie die `.env`-Datei mit diesen Informationen:
   ```
   BUFFER_CLIENT_ID=<Ihre-Buffer-Client-ID>
   BUFFER_CLIENT_SECRET=<Ihr-Buffer-Client-Secret>
   BUFFER_REDIRECT_URI=https://www.deal369.com/auth/buffer/callback
   ```

## 9. Starten der Anwendung

1. Wenn IONOS eine Konsole bietet:
   - Navigieren Sie zum Verzeichnis "menschgreifzu"
   - Führen Sie `npm start` aus
2. Wenn IONOS Node.js-Anwendungen automatisch startet:
   - Stellen Sie sicher, dass der Startpunkt korrekt auf app.js konfiguriert ist
   - Die Anwendung sollte automatisch starten

## 10. Überprüfung der Installation

1. Öffnen Sie einen Browser und navigieren Sie zu https://www.deal369.com
2. Sie sollten das Dashboard des Menschgreifzu-Systems sehen
3. Testen Sie die verschiedenen Funktionen:
   - Affiliate-Verwaltung
   - Landing Page-Erstellung
   - Social Media Post-Planung
   - Lead-Management

## Fehlerbehebung

Wenn Probleme auftreten:

1. Überprüfen Sie die Logs im IONOS Control Panel
2. Stellen Sie sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
3. Überprüfen Sie, ob Node.js korrekt konfiguriert ist
4. Stellen Sie sicher, dass die Datenbankverbindung funktioniert

## Nächste Schritte

Nach erfolgreicher Installation:

1. Erstellen Sie Ihre ersten Affiliates (bis zu 33 wie besprochen)
2. Richten Sie Landing Pages für jeden Affiliate ein
3. Planen Sie Social Media Posts über Buffer
4. Konfigurieren Sie E-Mail-Templates für Lead-Nurturing

Bei Fragen oder Problemen stehe ich Ihnen gerne zur Verfügung!
