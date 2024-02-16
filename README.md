# ViteRex 🚀 _Supercharged REDAXO Frontend development with Vite JS_

- [Beschreibung](#beschreibung)
- [Vorraussetzungen](#requirements)
- [Features](#features)
- [Verwendung/Vorgehen für ein neues Projekt](#anker-neues-projekt)
- [automatisches Deployment auf einen Webserver](#deployment)
- [Tipps](#tips)

<a name="beschreibung"></a>

## Beschreibung

Super simple Installation einer Redaxo-Instanz, samt Addons und Plugins, sowie
einer leistungsstarken lokalen Entwicklungsumgebung mit Tailwind CSS, PostCSS und
Autoprefixer und Vite JS als Bundler.
Mit Support für Live-Reloading und HMR für Redaxo, PHP, CSS und JS Dateien.

Deployment via [ydeploy](https://github.com/yakamara/ydeploy) von [yakamara](https://github.com/yakamara/) (basierend auf [deployer](https://deployer.org/))

Basierend auf [yak](https://github.com/yakamara/yak) von Thomas Blum ([tbaddade](https://github.com/tbaddade))

<a name="features"></a>

## Features

- automatische Redaxo Installation per Terminal, inkl. gewünschter Addons und Plugins
- modular – konfigurierbar über eine Konfigurationsdatei unter /setup/setup.cfg
- lokale Entwicklungsumgebung mit Node und [Vite JS](https://vitejs.dev/)
- native JS module imports (und CSS imports per JS, oder Assets imports wie CSS, SVG, Bilder, JSON, etc., inklusive Transformationen und so)
- alles was NPM bzw. Yarn zu bieten haben
- [Tailwind CSS](https://tailwindcss.com/)
- Vite JS bzw. [rollup.js](https://rollupjs.org/) als Bundler/Minifier (inkl. PostCSS mit CSS Nesting und Autoprefixer)
- Live-Reload bzw. HMR für Templates, Struktur, URL (beliebig erweiterbar)
  - /src/templates/\*_/._
  - /src/modules/\*_/._
  - /var/cache/addons/(structure|url)\*_/._
  - /assets/\*_/._
  - einfach erweiterbar, zum Beispiel für Fragmente  
- Deployment via ydeploy bzw. deployment via [deployer](https://deployer.org/), Konfiguration unter setup/deploy.php
- einfach erweiterbar

<a name="requirements"></a>

## Vorraussetzungen

- grundlegendes Terminal-Know-how von Vorteil!
- eine `bash` wird vorrausgesetzt
- [`yarn` muss installiert sein](https://yarnpkg.com)
- [`composer` muss für deployer bzw. deployment via ydeploy installiert sein](https://getcomposer.org/)
- eine lokale PHP-Entwicklungsumgebung für Redaxo, wie [Laravel Herd](https://herd.laravel.com/); oder [MAMP](https://www.mamp.info)
- ein lokaler Datenbank-Server für Redaxo, wie [DBngin](https://dbngin.com/); oder [MAMP](https://www.mamp.info)
- optional: [Phpmyadmin](http://phpmyadmin.net/) o.Ä. für DBngin

<a name="anker-neues-projekt"></a>

## Verwendung/Vorgehen für ein neues Projekt

1. lokaler Webserver mit PHP- und MySQL-Unterstützung installieren (Empfehlung für Mac OS: [Laravel Herd](https://herd.laravel.com/) und [DBngin](https://dbngin.com/) oder [MAMP](https://www.mamp.info)
2. dieses Repo klonen – ggf. geklontes Directory umbenennen, das ist nun der Projekt-Ordner
3. Projekt-Ordner als vhost mounten (über installierten Webserver)
4. im Terminal in den Projekt-Ordner wechseln
5. `setup/setup.cfg` in einem Editor anpassen. __Wichtig:__ unbedingt REDAXO_ERROR_EMAIL ausfüllen!
   _die Einträge beginnend mit `VITE_` am besten unverändert lassen, ausser man weiss, was man tut\_ 😌
6. Skript `setup/setup` im Projekt-Verzeichnis im Terminal ausführen. __Achtung:__ falls eine DB mit dem angegebenen Namen bereits besteht, wird im setup Ordner ein Backup angelegt und die bestehende DB neu angelegt!
   _nun wird Redaxo heruntergeladen und installiert. Danach folgen die gewählten Addons und Plugins. Am Ende werden die PHP-Dependencies per Composer und per Yarn die Node-Dependencies installiert._
7. der Vite JS Dev-Server sollte nun automatisch gestartet und im Default-Browser das Front- und Backend geöffnet werden
8. im Backend mit den Zugangsdaten aus setup.cfg anmelden
9. (optional) Projekt-Ordner einem eigenen Git-Repo zuweisen, mittels `git remote set-url {dein remote name, zBsp.: origin} {deine remote URL, zBsp.:https://github.com/DEIN/REPOSITORY}. 
  _selbstverständlich kannst du GIT auch komplett aus deinem Projekt-Ordner löschen, in dem du `rm -fr .git` ausführtst_
10. Frontend einaml mit F5 reloaden und los gehts! Happy coding! 🙌🏼

**Ab sofort sollten jegliche Änderungen an Dateien (Templates & Module unter /src/ und CSS, JS Dateien unter /assets/) und sogar Anpassungen im Redaxo Backend sofort im Frontend automatisch gespiegelt werden (dank Live-Reload und HMR) – ohne nerviges, manuelles refreshen mit F5** 🍔

- mit `CTRL + C` kann der Vite JS Dev-Server im Terminal gestoppt werden
- mit `yarn dev` Vite JS Dev-Server starten

<a name="deployment"></a>

## automatisches Deployment auf einen Webserver

1. die Deployment-Host-Konfiguration in /deploy.php anpassen
2. im Terminal im Projekt-Ordner `vendor/bin/dep deploy` ausführen um das Deployment zu starten _fingers crossed_

- wer sich mit deployer auskennt, kann die Deployer-Konfig in /deploy.php beliebig erweitern

**... wer deployer nicht nutzen möchte:**
einfach im Projekt-Ordner `yarn build` ausführen und folgende Dateien und Ordner auf einem Webserver bereitstellen:

- `bin`
- `public`
- `src`
- `var`
- `.env.local`
- `inc.vite.php`
- `LICENSE.md`

_**Wichtig**: Webhosting so konfigurieren, dass der Dokumentstamm (bzw. www-Root) auf den Ordner /public zeigt_

<a name="tips"></a>

## Tipps

- falls eine andere Redaxo Version installiert werden soll, einfach Eintrag anpassen und SHA-Vergleichssumme im Terminal anzeigen lassen, in setup/setup.cfg eintragen und setup/setup starten:<br/>
  `$ curl -Ls https://github.com/redaxo/redaxo/releases/download/5.15.1/redaxo_5.15.1.zip | shasum`
- Um die "Ordner ist unsicher"-Fehlermeldungen in Redaxo loszuwerden, einfach `/public/assets/core/standard.js` bei “redaxo-security-self-test” die Zeile wie folgt anpassen:<br/>
  `if (i % 2 == 0 && data != '' && data.substring(0, 6) != '<br />') {`
- falls auf eurem System mysql im Shell nicht verfügbar sein sollte (wie mit Laravel Herd und DBngin der Fall), dann wie folgt vorgehen:
  - Für Mac OS und MySQL 8.0.33:
    ins Terminal gehen und folgendes eingeben und mit Enter bestätigen<br/>
    `sudo nano /etc/zshrc`
    System-Passwort eingeben und dann folgende Zeile ganz am Ende auf einer neuen Zeile eintragen<br/>
    `export PATH=/Users/Shared/DBngin/mysql/8.0.33/bin:$PATH`
    nun mit CTRL + O die Datei speichern und mit CTRL + X den Nano Editor verlassen
- bei deployment via ydeploy, sollte folgendes sichergestellt werden:
  - es sollte ein Unterverzeichnis als `deploymentPath` angegeben; direkt ins Webserver root zu deployen kann gefährlich sein, da ev. wichtige Dateien überschrieben werden
  - falls auf dem Webserver in der secure shell (SSH) PHP in einer älteren Version als 8.1 ausgeführt wird, funktioniert ydeploy nicht. Vor deployment sicherstellen, dass PHP >=8.1 in der Shell läuft.
