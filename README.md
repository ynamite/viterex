# ViteRex - _REDAXO Frontend development on speed_

- [Beschreibung](#beschreibung)
- [Features](#features)
- [Vorbereitung für ein neues Projekt](#anker-neues-projekt)

<a name="beschreibung"></a>

## Beschreibung

Super einfache Installation einer Redaxo-Instanz, samt Addons und Plugins, sowie
einer leistungsstarken lokalen Entwicklungsumgebung mit Tailwind CSS, PostCSS und
Autoprefixer und Vite JS als Bundler.
Mit Support für Live-Reloading und HMR für PHP, CSS und JS Dateien.

Deployment via [ydeploy](https://github.com/yakamara/ydeploy) von [yakamara](https://github.com/yakamara/) (basierend auf [deployer](https://deployer.org/))

<a name="features"></a>

## Features

- automatische Redaxo Installation per Terminal, inkl. Addons und Plugins
- modular konfigurierbar über eine Konfigurationsdatei
- lokale Entwicklungsumgebung mit Vite JS
- Tailwind CSS
- Vite JS bzw. RollUp als Bundler/Minifier (inkl. PostCSS mit Nesting und Autoprefixer)
- Live-Reload bzw. HMR für Templates, Struktur, URL (beliebig erweiterbar)
  - /src/templates/\*_/._
  - /src/modules/\*_/._
  - /var/cache/addons/(structure|url)\*_/._
  - /assets/\*_/._
- einfach erweiterbar
- Deployment via ydeploy bzw. deployment via [deployer](https://deployer.org/)

## Vorraussetzungen

- eine `bash` wird vorrausgesetzt
- [`yarn` muss installiert sein](https://yarnpkg.com)
- [`composer` muss für deployment installiert sein](https://getcomposer.org/)
- eine lokale PHP-Entwicklungsumgebung, wie [Laravel Herd](https://herd.laravel.com/); oder [MAMP](https://www.mamp.info)
- ein lokaler Datenbank-Server für Redaxo, wie [DBngin](https://dbngin.com/); oder [MAMP](https://www.mamp.info)
- optional: [Phpmyadmin](http://phpmyadmin.net/) für DBngin

<a name="anker-neues-projekt"></a>

## Vorbereitung für ein neues Projekt

1. Repo https://gitlab.com/ynamite/redaxo-2024 klonen
2. `setup/setup.cfg` anpassen
3. Skript `setup/presetup` im Projekt-Verzeichnis laufen lassen
4. im Redaxo Backend mit den Zugangsdaten aus setup.cfg anmelden oder Frontend aurufen
5. mit `yarn dev` den lokalen Entwicklungsserver starten
6. mit `yarn build` die produktiven Assets kompilieren
7. für automatisches Deployment (auf einem Webserver zum Beispiel) die Deployment-Host-Konfiguration in /deploy.php anpassen und im Terminal im Projekt-Ordner mit `vendor/bin/dep deploy` das Deployment starten _fingers crossed_

- wer sich mit deployer auskennt, kann das natürlich beliebig erweitern.

## Tipps

- falls eine andere Redaxo Version gewünscht ist, einfach Eintrag anpassen und SHA-Summe holen:<br/>
  `$ curl -Ls https://github.com/redaxo/redaxo/releases/download/5.15.1/redaxo_5.15.1.zip | shasum`
- Um die "Ordner ist unsicher"-Fehlermeldungen in Redaxo loszuwerden, einfach `/public/assets/core/standard.js` bei “redaxo-security-self-test” die Zeile wie folgt anpassen:<br/>
  `if (i % 2 == 0 && data.substring(0, 6) != '<br />') {`
- falls auf eurem System mysql im Shell nicht verfügbar sein sollte (wie mit Laravel Herd und DBngin der Fall), dann wie folgt vorgehen:
  - Für Mac OS und MySQL 8.0.33:
    ins Terminal gehen und folgendes eingeben und mit Enter bestätigen<br/>
    `sudo nano ~/.bash_profile`
    Folgende Zeile kopieren und dort einfügen<br/>
    `export PATH=/Users/Shared/DBngin/mysql/8.0.33/bin:$PATH`
    nun mit CTRL + O die Datei speichern und mit CTRL + X den Nano Editor verlassen
