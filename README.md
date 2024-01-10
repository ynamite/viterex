# ViteRex - _REDAXO development on speed_

- [Beschreibung](#beschreibung)
- [Features](#features)
- [Vorbereitung für ein neues Projekt](#anker-neues-projekt)

<a name="beschreibung"></a>

## Beschreibung

Super einfache Installation einer Redaxo-Instanz, samt Addons und Plugins, sowie
einer leistungsstarken lokalen Entwicklungsumgebung mit Tailwind CSS, PostCSS und
Autoprefixer und Vite JS als Bundler.
Mit Support für Live-Reloading und HMR für PHP, CSS und JS Dateien.

<a name="features"></a>

## Features

- automatische Redaxo Installation per Terminal, inkl. Addons und Plugins
- modular konfigurierbar über eine Konfigurationsdatei
- lokale Entwicklungsumgebung mit Vite JS
- Tailwind CSS
- Vite JS bzw. RollUp als Bundler/Minifier (inkl. PostCSS mit Nesting und Autoprefixer)
- Live-Reload bzw. HMR folgender Verzeichnisse
  - /src/templates/\*_/._
  - /src/modules/\*_/._
  - /assets/\*_/._
- einfach erweiterbar
- Coming soon: ydeploy bzw. deployment via [deployer](https://deployer.org/)

## Vorraussetzungen

- eine `bash` wird vorrausgesetzt
- [`yarn` muss installiert sein](https://yarnpkg.com)
- eine lokale PHP-Entwicklungsumgebung, wie [Laravel Herd](https://herd.laravel.com/)
- ein lokaler Datenbank-Server für Redaxo, wie [DBngin](https://dbngin.com/)
- optional: [Phpmyadmin](http://phpmyadmin.net/)

<a name="anker-neues-projekt"></a>

## Vorbereitung für ein neues Projekt

1. Repo https://gitlab.com/ynamite/redaxo-2024 klonen
2. `setup/setup.cfg` anpassen
3. Skript `setup/presetup` im Projekt-Verzeichnis laufen lassen
4. im Redaxo Backend mit den Zugangsdaten aus setup.cfg anmelden oder Frontend aurufen
5. mit `yarn dev` den lokalen Entwicklungsserver starten oder mit `yarn build` die produktiven Assets kompilieren

ªªTipps##

- falls eine andere Redaxo Version gewünscht ist, einfach Eintrag anpassen und SHA-Summe holen:<br/>
  `$ curl -Ls https://github.com/redaxo/redaxo/releases/download/5.15.1/redaxo_5.15.1.zip | shasum`
- Um die "Ordner ist unsicher"-Fehlermeldungen in Redaxo loszuwerden, einfach `/public/assets/core/standard.js` bei “redaxo-security-self-test” die Zeile wie folgt anpassen:<br/>
  `if (i % 2 == 0 && data.substring(0, 6) != '<br />') {`
