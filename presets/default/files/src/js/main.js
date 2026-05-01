// Frontend JS entry. Stylesheets live at ../css/style.css and load via the
// Vite plugin's CSS entry — no need to import them here.

import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import morph from "@alpinejs/morph";
import persist from "@alpinejs/persist";
import Alpine from "alpinejs";

Alpine.plugin([collapse, focus, morph, persist]);

window.Alpine = Alpine;
Alpine.start();
