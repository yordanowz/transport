// --- ГЛАВНА КОНФИГУРАЦИЯ (СМЕНЯШ САМО ТУК) ---
var APP_CONFIG = {
    version: "1.3.3.7",  // <--- ПРОМЕНЯШ ВЕРСИЯТА ТУК И ВСИЧКО СЕ ОБНОВЯВА
   //   apiBase: "https://188.245.57.185.nip.io/api/" // Може да сложиш и API URL-а тук
	apiBase: "https://46.224.75.86.nip.io/api/"
   // apiBase:  "https://BoredLife.pythonanywhere.com/api/"
};

// Това позволява файлът да се ползва и от Service Worker, и от нормалния Script
if (typeof self !== 'undefined') {
    self.APP_CONFIG = APP_CONFIG;
}