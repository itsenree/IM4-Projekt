## Kurzbeschreibung des Projekts

**Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26) <br>
**Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern <br>
**Name des Projekts:** ZämeFägts: Zahnfee Tracker <br>
**Team Physical Computing:** Laura Feldmann & Stella Bollinger <br>
**Team WebApp:** Chiara Rubin & Enrico Fusaro

Wir haben ein Zahnglas gemacht, welches mit einem kleinen Oled Screen verbunden ist, welcher der zähneputzenden Person ein visuelles Feedback gibt. Die Applikation funktioniert wie folgt:
Die Person nimmt ihre Zahnbürste aus dem ihr zugewiesenen Zahnglas.
Ein Countdown beginnt auf dem Screen runterzuzählen. Währenddessen hat die Person Zeit, Zahnpasta auf die Zahnbürste zu tun (ohne Zahlen, damit Kinder die noch keine Zahlen lesen können ebenfalls verstehen, wie viel Zeit ihnen noch bleibt).
Sobald der Countdown fertig ist, beginnt die eigentliche Zahnputz Zeit. Dabei gibt es die folgenden Zustände:

1. Die Person Putzt 2 Minuten lang durch: Es erscheint ein «End Bildschirm». In der Datenbank werden 2 Punkte gespeichert.

2. Die Person bricht das Zähneputzen frühzeitig ab und stellt die Zahnbürste zurück ins Glas, ein trauriger Smiley erscheint und die Person hat 15 Sekunden Zeit, um das Zähneputzen wieder fortzusetzen. Die Person setzt das Zähneputzen fort und beendet die 2 Minuten doch noch. In der Datenbank werden trotzdem 2 Punkte gespeichert.

3. Die Person putzt nicht 2 Minuten die Zähne, jedoch über eine Minute: Es wird 1 Punkt in der Datenbank gespeichert.

4. Die Person beginnt mit dem Zähneputzen, bricht aber früher ab und lässt die 15 Sekunden verstreichen ohne weiter zu putzen. In der Datenbank werden 0 Punkte gespeichert.

Auf der WebApp wird dann eine Statsistik erstellt, wann und wie lange Zähnegeputzt wurde. Auf der Homepage gibt es eine Punkteübersicht, die vergleicht wer von der Familie am meisten Punkte hat. Individuell kann man auf der Stats-Seite den Zahnputzverlauf und die gesammelten Punkte verfolgen.

### Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst?

Unsere WebApp zusammen mit dem Physical Computing Teil soll die Kinder dazu motivieren, selbständig Zähneputzen zu wollen oder immerhin das Motivieren dazu einfacher zu gestalten. Dies wird erreicht, indem man durch das korrekte und regelmässige Zähneputzen Punkte sammeln kann. Auch gibt es dazu Streaks und den Familienvergleich, welches zusätzlich motiviert.

### Was ist der „Sinn und Zweck“ des Systems?

Das Zähneputzen und dessen Dauer zu dokumentieren und im Haushalt vergleichbar zu machen. Durch Gamification-Elemente wie Punkte und Streaks wird das Zähneputzen für die ganze Familie zu einem spielerischen Wettbewerb.

![Bild des Zahnputzgeräts](resources/assets/Bild_05.png) 
\[_Bilder / GIFs (optional)_\]

### UX & Konzeption

_In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)_

**Figma:** https://www.figma.com/design/7dbtS998A0MZJLCGunPM8A/IM4-Z%C3%A4hne-F%C3%A4gts?node-id=0-1&t=xPEeGgmB7Mtl2nYQ-1

- **User Flow \+ Screen Flow** (Screenshot aus Figma)


- ggf. weitere Ergänzungen

### Welche Features waren angedacht?

WebApp:
Angedacht waren verschiedene Funktionen, um die Motivation und Benutzerfreundlichkeit der App zu erhöhen. Dazu gehörten ein Streak-System, das die Nutzer:innen dazu motivieren soll, ihre Zähne möglichst regelmässig und korrekt zu putzen, sowie eine Champion-Anzeige, in der ersichtlich ist, welches Familienmitglied die meisten Punkte gesammelt hat.

Ausserdem war geplant, die Verwaltung von Familienmitgliedern zu ermöglichen. Nutzer:innen sollten weitere Familienmitglieder hinzufügen sowie bestehende Mitglieder hinsichtlich Name, Farbe und Position anpassen können. Ebenfalls sollte die Möglichkeit bestehen, persönliche Kontodaten wie Benutzername, E-Mail-Adresse und Passwort zu ändern.

Diese Funktionen konnten erfolgreich umgesetzt und in die Anwendung integriert werden.

### Welche Features wurden nicht umgesetzt? (Warum)

WebApp:
Wir wollten anfangs die Funktion hinzufügen, dass jeder User eine separate Familie haben kann. Doch haben wir diese Funktion weggelassen, da sie zu einem Komplexerren DB aufbau geführt hätte und für einen Prototypen mit einem Gerät nicht wirklich sinn macht.

Ein weiteres angedachtes Feature war ein zusätzliches Feld, in dem Nutzer:innen nachträglich eintragen können, wenn sie sich auswärts die Zähne geputzt haben, damit ihr Streak nicht verloren geht. Dieses Feature wurde schlussendlich jedoch nicht umgesetzt, da die Idee vom Projekt darin besteht, das Gerät zu benutzen. Andererseits könnte man so auch schummeln.

### Setup

- **WebApp:** [Link zur Website](https://im4.enrico-fusaro.ch/)
- **Video-Dokumentation:** [Link zum Video auf Youtube](http://link.zum.video)

#### Installationsanleitung WebApp

**\*verständliche** Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren\*

1. _Was benötige ich an Infrastruktur?_
Man benötigt:
- Ein Webserver mit PHP-Unterstützung (Apache)
- PHP 7.4+ (wegen PDO und json_encode/json_decode)
- MariaDB Datenbank
- einen Hosting-Anbieter der PHP + MySQL unterstützt (Infomaniak)

Der Client benötigt ein moderner Browser. 
2. _Was muss ich auf meinem Webserver installieren?_
- PHP (mit PDO und PDO_MySQL Extension aktiviert)
- MariaDB

Bereits im Code via CDN geladen (nichts installieren nötig):
- Chart.js
- Flatpickr
- Tabler Icons
- Google Fonts (Inter)

3. _Wie kann ich die Datenbank importieren?_ (Spezifisch für Infomaniak!)
- Öffne h2-phpmyadmin.infomaniak.com/
- Logge dich ein
- Erstelle eine neue Datenbank
- Klicke auf die Datenbank
- Oben auf "Importieren" klicken
- Datei auswählen → deine .sql Datei
- Unten auf "OK" klicken
4. _Wo muss ich die DB-Credentials eintragen?_
- Im config.php File. Dieses ist absichtlich nicht im Repository. Im config.php sollten folgende Werte eingetragen werden: 

<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dein_datenbankname');
define('DB_USER', 'dein_benutzer');
define('DB_PASS', 'dein_passwort');

5. _…_
6. _Wie nehme ich das physische Artefakt in Betrieb?_
- Lade dir einen FTP-Client herunter, z.B. FileZilla (kostenlos)
-Verbinde dich mit deinem Infomaniak-Server: Host: dein FTP-Hostname (im Infomaniak-Dashboard unter FTP/SSH), Benutzername + Passwort: FTP-Zugangsdaten von Infomaniak, Port: 21 (FTP) oder 22 (SFTP)
- Navigiere auf dem Server in den Web-Root-Ordner (meist web/ oder public_html/)
- Lade den gesamten Projektordner dort hoch
- Öffne die Website im Browser und teste ob alles funktioniert

#### Bauanleitung Physical Computing

- **_Was muss ich wie bauen, verbinden, installieren?_**
- _ergänze: **Komponentenplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): Schaubild enthält_
  - _die eingesetzten Komponenten_
  - _die verbundenen Sensoren und Aktoren_
  - _die Programme (mit Dateinamen)_
  - _die Kommunikationswege_
- _ergänze: **Steckplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): generiert z.B. mit Fritzing (empfohlen), Tinkercad, Wokwi_
  - _beachtet die [Fritzing Parts](https://github.com/Interaktive-Medien/im_physical_computing/tree/main/15_Intro_Projektdoku) extra für euch_
- \*ggf. **Bildmaterial\***

* **Komponentenplan** 

* *die eingesetzten Komponenten*  
  * *die eingesetzten Komponenten*  
  * *die verbundenen Sensoren und Aktoren*  
  * *die Programme (mit Dateinamen)*  
  * *die Kommunikationswege*  

## technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

- **Projektstruktur / Code-Struktur:** \[_Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten._\]

IM4-Projekt/

├── api/          # PHP-Endpunkte (brush_save.php, members_load.php, ...)

├── css/          # Stylesheets (style.css)

├── html/         # Alle HTML-Seiten (home, stats, familie, settings, ...)

├── js/           # JavaScript-Dateien (stats.js, family_edit.js, ...)

├── pages/        # Weitere Seiten

├── resources/

│   ├── assets/   # Bilder und Icons

│   └── sql/      # Datenbankschema (.sql Datei)

├── system/       # Konfiguration (config.php mit DB-Credentials)

├── index.html    # Einstiegspunkt

└── sender.html   # Arduino-Datenschnittstelle
- **Datenschnittstelle: \[\***zwischen WebApp und Physical Computing\*\]
WebApp ↔ Physical Computing

Der Arduino misst die Putzdauer und sendet die Daten per HTTP-Request 
an `brush_save.php`. Dort werden sie validiert und in der Tabelle 
`brush_data` gespeichert. Die WebApp liest diese Daten anschliessend 
aus und berechnet Punkte und Streak pro Mitglied.

Arduino → HTTP POST → brush_save.php → brush_data (DB) → WebApp

- **ERM:** \[_Erklärung und Schaubild_\]

| Tabelle | Felder |
|---|---|
| **users** | id, email, password (bcrypt), username |
| **members** | id, name, brush_nr, color |
| **brush_data** | id, members_id (FK), position, datetime, duration, fulfilled |
| **sensordata** | id, wert, zeit |

- `brush_data.members_id` → referenziert `members.id`
- `users` verwaltet den Login, `members` die Familienmitglieder

### Authentifizierung

Die Authentifizierung läuft über PHP-Sessions. Nach dem Login wird 
eine Session gesetzt. Alle geschützten API-Endpunkte prüfen via 
`protected.php` ob eine gültige Session vorhanden ist — andernfalls 
wird der Benutzer auf `login.html` weitergeleitet. Passwörter werden 
mit `bcrypt` gehasht gespeichert.
- **Authentifizierung:** \[_Erklärung_\]

## Known bugs

- Was funktioniert noch nicht einwandfrei?
Grunsätzlich sind uns keine grossen Bugs im Endprodukt aufgefallen. Die grössten Probleme konnten wir im verlaufe der Entwicklung lösen.
- Was ist uns aufgefallen bei der Entwicklung?
Das wir viele Funktionen auslassen mussten, damit wir zu einem guten Endresultat kamen. Bei der Planung hatten wir viele Ideen, doch im verlaufe der Realisation mussten wir einige Ideen verfallen lassen. Dies aus komplexität und zeitlichen gründen.
- Was könnte noch verbessert werden?
Es gibt noch viele Dinge die man machen könnte. Zum Beispiel könnte das Design überarbeitet werden, damit es ein bisschen Übersichtlicher wirkt. Auch könnte man mehr Funktionen bei den Statistiken einbauen, damit man genauere Informationen über das Zähneputzen erhält. Auch ein 'Reward' System könnte Implementiert werden, wie wir in unseren ersten Konzepten angedacht hatten. Somit könnte man mit den gesammelten Punkten neue Features freischalten.

## Umsetzungsprozess

- **Reflexion / Erfahrung / Lernfortschritt:** _Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?_
Wir haben gelernt wie man ein benutzerfreundliches Gerät baut, welches selbst funktioniert, Informationen sammelt und weiterleitet. Somit kann das Gerät als API Schnittstelle genutzt werden, wessen daten in einer Datenbank gesammelt und Systematisch angezeigt werden.
Gut gelaufen ist der ganze Prozess der Umsetzung. Wir konnten schon früh entscheiden welche Funktionen wir wie implementieren wollten wodurch wir grosse probleme verhindern konnten. Schlechtes haben wir nicht wirklich etwas grosses erlebt.
- **Herausforderungen & Lösungen:** \[_Verworfene Ansätze, Fehler, Umplanungen_\]
-- WEB --
Herausforderungen:
Kleinigkeiten beim Layout und bei der anzeige der gesammelten Daten.

Lösungen:
Wir fanden meistens eine verbesserung oder änderten das Layout um, damit es mehr sinn ergab. Auch bei der Anzeige der Daten fanden wir einige workarounds.

-- PHYSICAL --
Herausforderungen:

Lösungen:

- **KI-Einsatz:** _Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)_
KI wurde verwendet um Verständnisfragen und Probleme zu lösen. Beim erarbeiten des Codes wurde KI auch spezifische Funktionen zu erweitern und zu verfeinern.

- **Fazit:** …
Insgesammt sind wir sehr zufrieden mit dem Prototyp für ZämeFägts. Die wichtigsten Funktionen wie das sammeln der Daten, das Punkte System, die Webseite fürs die Übersicht der Einträge und zum verwalten der Members und aller wichtigen Daten.
