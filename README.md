## Kurzbeschreibung des Projekts

- **Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)
- **Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern
- **Name des Projekts:** ZämeFägts: Zahnfee Tracker
- **Team Physical Computing:** Laura Feldmann & Stella Bollinger
- **Team WebApp:** Chiara Rubin & Enrico Fusaro

Wir haben ein Zahnglas gemacht, welches mit einem kleinen Oled Screen verbunden ist, welcher der Zähne putzenden Person ein visuelles Feedback gibt. Die Applikation funktioniert wie folgt:
Die Person nimmt ihre Zahnbürste aus dem ihr zugewiesenen Zahnglas.
Ein Countdown beginnt auf dem Screen runterzuzählen. Währenddessen hat die Person Zeit, Zahnpasta auf die Zahnbürste zu tun (ohne Zahlen, damit Kinder die noch keine Zahlen lesen können ebenfalls verstehen, wie viel Zeit ihnen noch bleibt).
Sobald der Countdown fertig ist, beginnt die eigentliche Zahnputz Zeit. Dabei gibt es die folgenden Zustände:

1. Die Person Putzt 2 Minuten lang durch: Es erscheint ein «End Bildschirm». In der Datenbank werden 2 Punkte gespeichert.

2. Die Person bricht das Zähneputzen frühzeitig ab und stellt die Zahnbürste zurück ins Glas, ein trauriger Smiley erscheint und die Person hat 15 Sekunden Zeit, um das Zähneputzen wieder fortzusetzten. Die Person setzt das Zähneputzen fort und beendet die 2 Minuten doch noch. In der Datenbank werden trotzdem 2 Punkte gespeichert.

3. Die Person putzt nicht 2 Minuten die Zähne, jedoch über eine Minute: Es wird 1 Punkt in der Datenbank gespeichert.

4. Die Person beginnt mit dem Zähneputzen, bricht aber früher ab und lässt die 15 Sekunden verstreichen ohne weiter zu putzen. In der Datenbank werden 0 Punkte gespeichert.

Auf der WebApp wird dann eine Statsistik erstellt wann und wie Lange Zähnegeputzt wurde. Dies kann dann in verschiedenen Ansichten im Haushalt verglichen werden.

- Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst?
  Unsere WebApp zusammen mit dem Physical Computing Teil soll die Kinder dazu motivieren, selbständig Zähneputzen zu wollen oder immerhin das Motivieren dazu einfacher zu gestalten.
- Was ist der „Sinn und Zweck“ des Systems?
  Das Zähneputzen und dessen Dauer zu dokumentieren und im Haushalt vergleichbar zu machen. Durch Gamification-Elemente wie Punkte und Streaks wird das Zähneputzen für die ganze Familie zu einem spielerischen Wettbewerb.
  \[_Bilder / GIFs (optional)_\]

### UX & Konzeption

_In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)_

- **Figma:** https://www.figma.com/design/7dbtS998A0MZJLCGunPM8A/IM4-Z%C3%A4hne-F%C3%A4gts?node-id=0-1&t=xPEeGgmB7Mtl2nYQ-1
- **User Flow \+ Screen Flow** (Screenshot aus Figma)
- ggf. weitere Ergänzungen
- _Welche Features waren angedacht?_
- _Welche Features wurden nicht umgesetzt? (Warum)_

### Setup

- **WebApp:** [Link zur Website](https://im4.enrico-fusaro.ch/)
- **Video-Dokumentation:** [Link zum Video auf Youtube](http://link.zum.video)

#### Installationsanleitung WebApp

**\*verständliche** Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren\*

1. _Was benötige ich an Infrastruktur?_
2. _Was muss ich auf meinem Webserver installieren?_
3. _Wie kann ich die Datenbank importieren?_
4. _Wo muss ich die DB-Credentials eintragen?_
5. _…_
6. _Wie nehme ich das physische Artefakt in Betrieb?_

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

## technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

- **Projektstruktur / Code-Struktur:** \[_Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten._\]
- **Datenschnittstelle: \[\***zwischen WebApp und Physical Computing\*\]
- **ERM:** \[_Erklärung und Schaubild_\]
- **Authentifizierung:** \[_Erklärung_\]

## Known bugs

- Was funktioniert noch nicht einwandfrei?
- Was ist uns aufgefallen bei der Entwicklung?
- Was könnte noch verbessert werden?

## Umsetzungsprozess

- **Reflexion / Erfahrung / Lernfortschritt:** _Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?_
- **Herausforderungen & Lösungen:** \[_Verworfene Ansätze, Fehler, Umplanungen_\]
- **KI-Einsatz:** _Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)_
- **Fazit:** …
