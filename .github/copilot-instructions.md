# REDAXO CMS Copilot Instructions

## Projektübersicht

Dies ist eine REDAXO CMS Installation (Version 5.x) in einem Docker Container. REDAXO ist ein deutsches Content Management System, das seit 2004 entwickelt wird und auf Flexibilität und Einfachheit setzt.

## Wichtige Prinzipien für Copilot

### 1. Präferiere Quellcode-Analyse vor allgemeinem Wissen

- **IMMER** zuerst die vorhandenen Dateien und Klassen in diesem Projekt analysieren
- **NICHT** auf generelles REDAXO-Wissen zurückgreifen, sondern die tatsächlich vorhandenen APIs verwenden
- Bei Unsicherheiten die entsprechenden Core-Dateien in `src/core/` untersuchen

### 2. REDAXO API-Klassen recherchieren z.B:

Wichtige Core-Klassen, die analysiert werden sollten:

- `rex_url` - URL-Generierung (in `src/core/lib/util/url.php`)
- `rex_sql` - Datenbankoperationen (in `src/core/lib/sql/sql.php`)
- `rex_fragment` - Template-Fragmente
- `rex_view` - View-Helper
- `rex_i18n` - Internationalisierung
- `rex_config` - Konfiguration
- `rex_addon` - Addon-Verwaltung

### 3. Addon-spezifische APIs erforschen

Verfügbare Addons (in `src/addons/` und Assets in `public/assets/addons/`):

- **YForm** - Formular-Builder und Tabellen-Manager
- **YRewrite** - URL-Rewriting und SEO
- **MBlock** - Flexible Content-Blöcke
- **MForm** - Erweiterte Formular-Features
- **Structure** - Seitenstruktur-Verwaltung
- **Metainfo** - Meta-Informationen
- **Mediapool** - Medienverwaltung
- **Watson** - Backend-Suche und Quick-Actions
- **CKE5** - CKEditor 5 Integration
- **UIKit Collection** - UIKit-Komponenten

## Frontend-Entwicklung

### CSS-Framework-Hierarchie

1. **Bootstrap 3.x** (Basis des REDAXO Backends)
   - Hauptframework für Backend-Komponenten
   - In `public/assets/core/` und `public/assets/addons/be_style/` zu finden

### Dark/Light Mode Unterstützung

REDAXO hat ein eingebautes Theme-System:

- **Backend-Themes** in `public/assets/addons/be_style/`
- **Dark-Mode-Unterstützung** berücksichtigen bei Custom CSS
- UIKit-Integration muss Theme-kompatibel sein

## Struktur-Verständnis

### Wichtige Verzeichnisse

```
/
├── public/                    # Öffentlich zugängliche Dateien
│   ├── index.php              # Frontend-Einstiegspunkt
│   ├── redaxo/index.php       # REDAXO Core und Backend
│   │── assets/                # Backend-Assets (CSS, JS, Bilder)
│   │  ├── core/               # Core-Assets
│   │  └── addons/             # Addon-Assets
│   └── media/                 # Hochgeladene Medien
├── src/
│   ├── addons/                # Installierte Addons
│   ├── core/                  # Core-Klassen und -Funktionen
│   ├── fragments/             # benutzerdefinierte Template-Fragmente
│   ├── modules/               # Module für Artikel-Inhalte im Backend
│   └── templates/             # Templates für Seitenstruktur, Artikel und sonstiges
├── var/
│   ├── cache/                 # Cache-Dateien
│   └── data/                  # Datenablage für Core und Addons
│      ├── addons/             # Addon-spezifische Datenablage
│      └── core/               # Core-spezifische Datenablage, z.B. Konfigurationen
├── .tools/                    # Tools und Skripte für die Entwicklung
├── assets/                    # Projekt-spezifische Frontend-Assets (CSS, JS, Bilder)
└── bin/                       # Redaxo Kommandozeilen-Skripte und -Tools
```

### Backend vs. Frontend

- **Backend**: `public/redaxo/` bzw. `src/core/boot.php` - Administration und Verwaltung
- **Frontend**: `public/` - Öffentliche Website

## Entwicklungsrichtlinien

### Bei PHP-Entwicklung

1. **Namespace-Konventionen** beachten - REDAXO core verwendet `rex_` Prefix
2. **Error Handling** - REDAXO-eigene Exception-Klassen verwenden
3. **Datenbankzugriff** - Immer über `rex_sql` Klasse, ausser bei yform Tabellen-Manager Tabellen über yORM `rex_yform_manager_table`, `rex_yform_manager_query`, `rex_yform_manager_collection` und `rex_yform_manager_dataset`
4. **Konfiguration** - `rex_config` für Einstellungen verwenden
5. **Addon-API** - `rex_addon::get()` für Addon-spezifische Funktionen
6. **Hooks** - `rex_extension` für Event-basierte Erweiterungen nutzen
7. **Cache-Management** - `rex_cache` für Caching-Strategien
8. **Dateioperationen** - `rex_file` für Datei-Handling
9. **Media-Handling** - `rex_media` für Medienoperationen
10. **Formulare** - `rex_form` für Formular-Generierung und Validierung
11. **API-Integration** - `rex_api` für RESTful APIs
12. **Routing** - `rex_router` für URL-Routing und -Management
13. **Permissions** - `rex_perm` für Rechte-Management
14. **Logging** - `rex_logger` für Protokollierung
15. **Template-Rendering** - `rex_view` für die Ausgabe von HTML-Templates
16. **Internationalisierung** - `rex_i18n` für mehrsprachige Inhalte
17. **Asset-Management** - `rex_asset` für CSS/JS-Assets
18. **Fragment-Management** - `rex_fragment` für wiederverwendbare Template-Teile
19. **Service-Container** - `rex_service` für Dependency Injection
20. **Cronjobs** - `rex_cronjob` für geplante Aufgaben
21. **Session-Management** - `rex_session` für Sitzungsdaten
22. **User-Management** - `rex_user` für Benutzerverwaltung
23. **Cache-Invalidierung** - `rex_cache::delete()` für gezielte Cache-Löschung
24. **API-Authentifizierung** - `rex_api_auth` für API-Zugriffskontrolle
25. **Custom Addon-APIs** - Eigene APIs in `src/addons/` erstellen
26. **Custom Hooks** - Eigene Hooks in `src/addons/` registrieren
27. **Custom SQL Queries** - `rex_sql::factory()` für komplexe Datenbankabfragen
28. **Custom Views** - `rex_view::factory()` für benutzerdefinierte Ansichten
29. **Custom Forms** - `rex_form::factory()` für benutzerdefinierte Formulare
30. **Custom Permissions** - `rex_perm::register()` für benutzerdefinierte Berechtigungen
31. **Custom Media Types** - `rex_media::registerType()` für benutzerdefinierte Medientypen
32. **Custom Routes** - `rex_router::addRoute()` für benutzerdefinierte Routen
33. **Custom Services** - `rex_service::register()` für benutzerdefinierte Services
34. **Custom API Endpoints** - `rex_api::register()` für benutzerdefinierte API-Endpunkte
35. **friendsofredaxo Addons\*** - Namespaces `FriendsOfRedaxo\` für Addon-spezifische Klassen verwenden
36. **Custom Configurations** - `rex_config::set()` und `rex_config::get()` für benutzerdefinierte Konfigurationen
37. **Custom SQL Tables** - `rex_sql_table` für benutzerdefinierte Datenbanktabellen
38. **Custom SQL Constraints** - `rex_sql_constraint` für benutzerdefinierte Einschränkungen
39. **Custom SQL Views** - `rex_sql_view` für benutzerdefinierte Datenbankansichten
40. **Custom SQL Triggers** - `rex_sql_trigger` für benutzerdefinierte Datenbank-Trigger
41. **Custom SQL Procedures** - `rex_sql_procedure` für benutzerdefinierte Datenbank-Prozeduren
42. **Custom SQL Functions** - `rex_sql_function` für benutzerdefinierte Datenbank-Funktionen
43. **Custom SQL Transactions** - `rex_sql_transaction` für benutzerdefinierte Transaktionen
44. **Custom SQL Migrations** - `rex_sql_migration` für benutzerdefinierte Datenbank-Migrationen

## Composer und Abhängigkeiten in REDAXO und Addons

- Composer wird für Entwicklungs-Tools `.tools` im Root und für Addons verwendet, z.B. `src/addons/developer/composer.json`
- Wenn neue Composer Pakete durch Addons benötigt werden, diese in der `composer.json` des jeweiligen Addons hinzufügen
- Core Abhängigkeiten sollten in der `composer.json` des Cores definiert sein
- Addons sollten keine Core Abhängigkeiten überschreiben, sondern nur ergänzen
- Wenn neue Composer Pakete ausschliesslich für die Entwicklung benötigt werden, ausserhalb von Redaxo, diese in der `composer.json` im Root des Projekts hinzufügen
- Es muss sicher gestellt werden, dass Core und Addon Abhängigkeiten kompatibel sind und keine Konflikte verursachen
- prüfe daher immer die composer.json des cores und der Addons
- #fetch https://github.com/FriendsOfREDAXO/rex_repo_template/blob/main/composer.json hier sieht man ein Beispiel für die replaces

## addOn assets

- Addon spezifische assets gehören in den Assets Ordner im jeweiligen Addon, sie werden bei der Installation automatisch in den `public/assets/addons/*addonname*` Ordner kopiert
- Verwende bei CSS immer CSS Custom Properties für spätere Anpassungen
- Verwende bei JavaScript immer die REDAXO API für die Interaktion mit dem Backend
- Im Backend achte darauf dass auf Jquery rex:ready gewartet wird, bevor DOM Manipulationen durchgeführt werden
- Schreibe JS möhglichst modular und nutze die REDAXO API für die Interaktion mit dem Backend
- Schreibe JS wenn immer möglich Vanilla JS, um Abhängigkeiten zu vermeiden
- Recherchiere nach passenden Vendoren, die bereits in REDAXO integriert sind, z.B. `uikit`, `bootstrap`, `jquery`
- Neue Vendoren sollten nur hinzugefügt werden, wenn sie wirklich notwendig sind und keine bestehenden Abhängigkeiten überschreiben
- Für neue Vendoren erstelle stets ein npm workflow, um die Abhängigkeiten zu verwalten und die Assets zu kompilieren und zu aktualisieren

### Bei Template-Entwicklung (Backend)

1. **Fragments verwenden** - `rex_fragment::factory()` für wiederverwendbare Komponenten
2. **i18n** - `rex_i18n::msg()` für mehrsprachige Texte
3. **URL-Generierung** - `rex_url::frontend()` und `rex_url::backend()` verwenden

### Module, Slices, Templates

1. **Module** - `rex_module` für modulare Template-Teile
2. **Slices** - `rex_slice` für wiederverw- endbare Content-Blöcke
3. **Templates** - `rex_template` für komplette Seitenlayouts
4. Werden im data Ordner des developer Addons gespeichert, z.B. `var/data/addons/developer/modules/` und `var/data/addons/developer/templates/`

### Bei Backend CSS/JavaScript

1. **Bootstrap 3.x Kompatibilität** sicherstellen
2. **Theme-Variablen** aus REDAXO-Backend respektieren
3. **Asset-Pfade** korrekt mit `rex_url::assets()` generieren

## Debugging und Entwicklung

### Verfügbare Tools

- **Debug-Addon** - Debugging-Informationen im Backend
- **Developer-Addon** - Synchronisation zwischen Dateisystem und Datenbank
- **Watson** - Schnelle Navigation und Suche im Backend
- **ydeploy** - Deployment-Tool für Redaxo Projekte basierend auf Deployer PHP 7, Dokumentation unter https://deployer.org/docs/7.x/

### Log-Dateien

- Backend-Logs in `var/data/log/`
- Eigene Logs via `rex_logger::log()` erstellen

### Performance

- REDAXO-Cache-System nutzen
- Fragment-Cache für Templates
- Asset-Komprimierung über Addons

## Empfohlenes Vorgehen bei Aufgaben

1. **Analysiere** die relevanten Core-Klassen und Addon-APIs
2. **Prüfe** vorhandene Implementierungen in `src/`
3. **Berücksichtige** die Bootstrap 3.x + UIKit Hierarchie
4. **Teste** Dark/Light Mode Kompatibilität
5. **Dokumentiere** verwendete APIs und Abhängigkeiten

## API-Referenzen

- **Offizielle Dokumentation**: https://redaxo.org/doku/main
- **API-Docs**: https://friendsofredaxo.github.io/phpdoc/
- **Community**: https://www.redaxo.org/slack/
- **Tricks & Tipps**: https://friendsofredaxo.github.io/tricks/

---

**Wichtig**: Bei jeder Entwicklungsaufgabe IMMER zuerst die tatsächlich vorhandenen Quellcode-Dateien analysieren, bevor auf externes Wissen zurückgegriffen wird!
