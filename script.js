// --- В НАЧАЛОТО НА SCRIPT.JS ---

// Взимаме конфигурацията от глобалния обект (ако го има)
const APP_VERSION = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.version : '0.0.0';
const API_BASE_URL = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG.apiBase : 'https://46.224.75.86.nip.io/api/';



// Проверка: Работим ли през сървър (http/https) или локално (file://)?
const IS_ONLINE_ENV = window.location.protocol.startsWith('http');

// --- AUTO-UPDATER LOGIC (Само за онлайн режим) ---
const CHECK_INTERVAL = 30000; 

async function checkForUpdates() {
    if (!IS_ONLINE_ENV) return; // Пропускаме ако е локално

    try {
        const response = await fetch(`config.js?t=${Date.now()}`);
        if (!response.ok) return;
        
        const text = await response.text();
        const match = text.match(/version:\s*["']([^"']+)["']/);
        if (!match) return;
        
        const serverVersion = match[1];
        const currentVersion = APP_VERSION;

        if (serverVersion !== currentVersion) {
            console.log(`🚀 New version found: ${serverVersion}. Updating...`);
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (let reg of regs) await reg.unregister();
            }
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }
            window.location.reload(true);
        }
    } catch (e) { }
}

if (IS_ONLINE_ENV) {
    checkForUpdates();
    setInterval(checkForUpdates, CHECK_INTERVAL);
}



// ... ОТ ТУК НАДОЛУ Е ОСТАНАЛИЯТ КОД ...
const SHOW_CHANGELOG_POPUP = false; // true  false

// Текстът за новостите (Добавих и извинението тук, ако искаш да се вижда)

// Текстът за новостите
const CHANGELOG_DATA = {
    bg:[
        "🅿️ Буферни паркинги: Добавена е опция за включване и изключване на паркингите на картата от менюто с филтри.",
    ],
    en:[
        "🅿️ Buffer Parking: Added an option to show or hide parking lots on the map via the filter menu.",
    ]
};

// --- ОТ ТУК НАДОЛУ НЕ ТРИЙ НИЩО (започва TRANSPORT_TYPES_CONFIG) ---


// --- CONFIG ---
const VEHICLE_MOVE_INTERVAL = 3000;   
const DATA_REFRESH_INTERVAL = 5000;   
const MIN_ZOOM_FOR_STOPS = 15;
const MAX_ARRIVAL_MINUTES = 240;      
const MAX_ACTIVE_ROUTES = 5;
const BULK_CHECK_DEBOUNCE_MS = 100;

// --- TRANSPORT CONFIG ---
// --- TRANSPORT CONFIG ---
const TRANSPORT_TYPES_CONFIG = {
    METRO:   { key: 'METRO',   code: '1',  label: 'Метро',   color: '#007DC5', img: 'stop_icon_metro.png' },
    TRAM:    { key: 'TRAM',    code: '0',  label: 'Трамвай', color: '#F7941D', img: 'stop_icon_tram.png' },
    TROLLEY: { key: 'TROLLEY', code: '11', label: 'Тролей',  color: '#27AAE1', img: 'stop_icon_trolley.png' }, 
    BUS:     { key: 'BUS',     code: '3',  label: 'Автобус', color: '#BE1E2D', img: 'stop_icon_bus.png' },
    NIGHT:   { key: 'NIGHT',   code: '3',  label: 'Нощен',   color: '#2C2C2E', img: 'stop_icon_night.png' }
};


// --- UNIQUE USER ID ---
let appUserId = localStorage.getItem('app_user_uuid');
if (!appUserId) {
    appUserId = crypto.randomUUID(); // Генерира уникално ID веднъж
    localStorage.setItem('app_user_uuid', appUserId);
}


// --- TRANSLATIONS ---
let currentLanguage = localStorage.getItem('appLanguage') || 'bg';
let favoritePlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
let currentPlaceIcon = 'place';
let uniqueStopsData = [];
let rideAlongMapBubbleText = "..."; // Глобална променлива за времето

let wasRadarActiveBeforeRideAlong = false;


















const TRANSLATIONS = {
    bg: {
// ... старите преводи ...
filter_route_search_title: "Филтри маршрути",
// ... другите ти преводи ...
        parking_free_spaces: "СВОБОДНИ МЕСТА",
        parking_working_time: "РАБОТНО ВРЕМЕ",
        parking_tariff_1_title: "Тарифа 1 (Билет 30+/60+, Дневна карта)",
        parking_tariff_1_free: "Първите 2 часа: <b>БЕЗПЛАТНО</b>",
        parking_tariff_1_after: "След 2-рия час: 0.25 € /ч.",
        parking_tariff_2_title: "Тарифа 2 (Месечна, Годишна, 72ч карта)",
        parking_tariff_2_free: "В работно време: <b>БЕЗПЛАТНО</b>",
        parking_tariff_2_night: "Нощ (00:00 - 05:00): 0.25 € /ч.",
        parking_no_transit: "Без ползване на транспорт:",
        parking_important_title: "Важни условия за безплатно паркиране:",
        parking_important_1: "1. Първо пътуване: до 30 мин. (метро) или 45 мин. (наземен) след влизане.",
        parking_important_2: "2. Напускане: до 60 мин. след последната валидация в транспорта.",
        parking_nav_btn: "НАВИГАЦИЯ ДО ТУК",
        parking_free_suffix: "свободни места",



filter_buffer_parkings: "Покажи буферни паркинги",

        settings_vehicle_style: "Стил на возилата",
        style_teardrop: "Капка",
        style_capsule: "Капсула",
        route_changes_title_main: "Маршрутни промени",
        route_changes_source: "(Източник: Център за Градска Мобилност)",
        label_valid_from: "ОТ",
        label_valid_to: "ДО",
        label_affected_lines: "ПРОМЕНЕНИ ЛИНИИ",
        source_prefix: "Източник: ",
        cgm_url: "www.sofiatraffic.bg",
        button_view_details: "ВИЖ ДЕТАЙЛИ",		
		
		        dialog_favorite_place_title: "Запази любимо място",
        placeholder_place_name: "Име (напр. Вкъщи, Работа)",
        msg_long_press_map: "Първо задръжте върху картата, за да изберете място!",
        msg_enter_name: "Моля, въведете име на мястото!",
        msg_confirm_delete_place: "Изтриване на \"%s\"?",
        add_btn: "Добави",
		// В TRANSLATIONS.bg:
		// В TRANSLATIONS.bg добавете:
filter_size_stops: "Размер на спирките:",
filter_size_vehicles: "Размер на возилата:",


		settings_group_visual: "Визуализация",
settings_group_func: "Функционалности",


// ... други преводи ...
alert_backup_saved: "Резервното копие е запазено успешно!",
alert_file_saved_auto: "Файлът беше запазен автоматично в папка 'Изтеглени' (Downloads) като: %s",
confirm_restore: "Внимание: Това ще замени всички текущи настройки и любими спирки с тези от файла. Продължи?",
alert_restore_success: "Успешно възстановяване! Приложението ще се рестартира.",
alert_restore_error: "Грешка при четене на файла. Уверете се, че е валиден backup.",
// ...



	

settings_backup_title: "Резервно копие", // Заглавие на бутона и модала
backup_modal_desc: "Направете резервно копие на вашите любими спирки и настройки, за да ги прехвърлите на друго устройство.",
action_create_backup: "Създай копие (Backup)",
desc_create_backup: "Запазва текущата конфигурация във файл на устройството.",
action_restore_backup: "Възстанови (Restore)",
desc_restore_backup: "Връща предишна конфигурация от файл.",	
		
		
action_stop: "Край",
		
		next_stop_alert: "Твоята спирка е следващата",
		 sched_missing: "Разписание / няма данни за кола", // <--- НОВИЯТ ТЕКСТ
		  sched_future: "По разписание",
		map_sel_selected: "Избрани спирки:",
        map_sel_done: "Готово",
        map_sel_hint: "Натисни спирка на картата, за да я добавиш",
		
		// В TRANSLATIONS.bg добави:
share_ride_msg_full: "В момента съм в %1$s %2$s, ще съм на %3$s след около %4$d мин. Следи ме тук: %5$s",
share_ride_msg_simple: "В момента съм в %1$s %2$s. Следи ме тук: %3$s",
		
		 // ДОБАВИ ТОВА ТУК:
        social_menu_support: "Помощ",
        social_menu_community: "Инфо",
        
        social_sheet_luggage_title: "Забравен багаж: Телефони",
        social_sheet_contact_title: "Връзка",
        social_luggage_metro: "МЕТРО",
        social_luggage_ground: "НАЗЕМЕН",
        social_item_contact: "Свържи се с мен",
        social_item_group: "Discord Група",
        yordanowz_item_hub: "YORDANOWZ HUB",
        social_item_share: "Сподели приложението",
		
		
		social_menu_support: "Помощ",
        social_menu_community: "Инфо",
        social_sheet_luggage: "Забравен багаж",
        social_sheet_contact: "Връзка с нас",
        roadmap_tab_sent: "Изпратени",
        roadmap_admin_label: "АДМИН",
        roadmap_you_label: "ВИЕ",
        roadmap_reply_hint: "Напиши отговор...",
        roadmap_reply_send: "Изпрати",
		
		settings_about: "About",
		// В TRANSLATIONS.bg:
		settings_autolocate: "Автоматично локализиране",
		
		
		rep_crowded: "Претъпкан",
		// --- НОВИ ЗА ФИЛТЪРА ---
        filter_title: "Филтри на картата",
        filter_stops: "Покажи спирки",
        filter_vehicles: "Покажи превозни средства",
        filter_appearance: "Външен вид",
        filter_icons: "Икони",
        filter_dots: "Кръгчета",
        filter_zoom_stops: "Zoom: Спирки",
        filter_zoom_distant: "Далеч",
        filter_zoom_close: "Близо",
        filter_all: "Всички",
        filter_select_lines: "Избери линии",
        filter_select_all: "Избери всички",
        filter_deselect_all: "Скрий всички",
        
        filter_deselect_all: "Скрий всички",
        filter_clear_lines: "Изчисти", // <--- ДОБАВИ ТОВА
        filter_search_placeholder: "Търси линия (напр. 20)...", // <--- НОВО
		
		
        search_placeholder: "Търсене на адрес или спирка...",
        search_stop_placeholder: "Име или номер на спирка...",
        zoom_hint: "Зуумнете, за да видите спирките",
        title_search: "Търсене",
        title_lines: "Линии",
        title_favorites: "Любими",
        title_map: "Карта",
        title_settings: "Настройки",
        loading: "Зареждане...",
        details: "Детайли",
        timetable: "Разписание",
        weekday: "Делнични",
        holiday: "Празнични",
        no_favorites: "Нямате любими спирки.",
        settings_language: "Език",
        settings_dark_mode: "Тъмна тема",
        settings_start_screen: "Начален екран",
		
		 // НОВИ ПРЕВОДИ ЗА SOCIAL И ЛЮБИМИ:
        nav_social: "Общност",
        title_social: "Общност",
        social_coming_soon: "Очаквайте скоро!",
        social_desc: "Тук ще може да подавате сигнали за нередности, катастрофи, полиция и да помагате на общността, както и да давате предложения за приложението",
        fav_search_placeholder: "Търси спирка за добавяне...",
		 // НОВИ:
        settings_sorting: "Сортиране линии",
        sort_by_time: "По време",
        sort_by_type: "По тип/номер",
		
		
		add_choice_title: "Какво искате да добавите?",
        add_choice_single: "Единични спирки",
        add_choice_group: "Комбинирана спирка",
        title_add_single: "Добави любими спирки", // Заглавие на екрана в режим Single
        btn_add_favorites: "Добави в Любими",      // Бутонът долу
		
		
		settings_sec_basic: "Основни",
settings_sec_more: "Още",
settings_sec_info: "Информация",
		
        settings_download: "Изтеглете за Android:",
		 // НОВО:
        settings_buy_coffee: "За кафе :) ", // Двоеточието е в текста
        settings_version: "Версия",
        exit: "Изход",
        nav_search: "Търсене",
        nav_lines: "Линии",
        nav_favorites: "Любими",
        nav_map: "Карта",
        nav_settings: "Настр.",
        action_map_route: "Маршрут върху карта",
        action_stops_schedule: "Спирки и разписания",
        action_track_live: "Проследи на живо",
        cancel: "Отказ",
        close: "Затвори",
		
        find_routes: "Намери маршрути", // <--- НОВО
		
        // Транспорт (за заглавия)
        metro: "Метро", tram: "Трамвай", trolley: "Тролей", bus: "Автобус", night: "Нощен",
        
        // НОВИ ИЛИ ОБНОВЕНИ:
        arriving: "Сега",
        time_min: "м",
        time_h: "ч.",
        time_after: "след",      // За балончето на картата "след 1 мин."
        code_label: "Код:",
        ra_you_are_here: "(Ти си тук)",
        ra_get_off: "слизам тук",
        ra_destination: "(дестинация)",
        line_label: "Линия",
        to_label: "към",         // Тук е "към"
        direction_prefix: "ПОСОКА", // За метрото
		 // НОВИ ЗА СПОДЕЛЯНЕ:
        settings_share: "Сподели ме с приятели",
        share_button: "Сподели връзка",
        share_msg_title: "Sofia Yrd Maps - Градски транспорт",
        share_msg_text: "Виж къде е автобусът в реално време с Sofia Yrd Maps:",
        link_copied: "Връзката е копирана в клипборда!",	
		// ... (съществуващи) ...
        add_btn: "Добави",




// ... съществуващи преводи ...
    
    // --- SOCIAL / COMMUNITY ---
    social_maintenance_title: "В процес на разработка",
    social_maintenance_desc: "Тази секция в момента се обновява и подобрява. Моля, проверете отново по-късно! 🛠️",
    
    nick_title: "Как да те наричаме?",
    nick_desc: "Избери си никнейм, за да докладваш и гласуваш. Вижда се от всички.",
    nick_placeholder: "Твоят никнейм",
    btn_save_enter: "Запази и Влез",
    
    sec_incidents: "📍 Инциденти на пътя",
    sec_bus_cond: "🚌 Състояние на автобуса",
    
    rep_crash: "Катастрофа",
    rep_police: "Полиция",
    rep_control: "Контрола",
    rep_hot: "Жега",
    rep_cold: "Студ",
    rep_dirty: "Мръсно",
    
    btn_roadmap_title: "Предложения и Проблеми",
    btn_roadmap_desc: "Гласувай за нови функции или докладвай бъг",
    
    feed_no_reports: "Няма доклади наблизо.",
    feed_loading: "Зареждане...",
    feed_live: "(НА ЖИВО)",
    feed_last_pos: "(последна поз.)",
    feed_line: "Линия",
    feed_by: "от",
    feed_ago: "преди",
    feed_dist: "на", // "на 200м"
    
    alert_voted: "Вече сте гласували за този доклад.",
    alert_too_far: "Твърде далеч сте! Можете да гласувате само в радиус от 500/200м.",
    alert_gps: "Не можем да определим вашето местоположение. Моля, включете GPS-а.",
    alert_rate_limit: "Вече докладвахте това. Моля изчакайте малко.",
    alert_success: "Докладът е изпратен успешно!",
    alert_nick_short: "Никнеймът трябва да е поне 3 символа.",
    alert_nick_success: "Името е сменено успешно!",
    
    modal_veh_search: "Търсене на автобуси наблизо...",
    modal_veh_none: "Няма превозни средства в радиус от 200м.",
    modal_loc_title: "Посочи мястото",
    modal_loc_desc: "Можеш да докладваш само в радиус от 500/200м.",
    btn_confirm: "Потвърди",
// ... (съществуващи) ...
    
    // --- ROADMAP & ALERTS ---
    txt_date: "Дата",
    status_done: "ГОТОВО",
    
    // Табове и бутони в Roadmap модала
    tab_vote: "Гласувай",
    tab_submit: "Изпрати",
    txt_roadmap_intro: "Гласувайте за функциите, които искате да видите в следващата версия!",
    sort_top: "Топ",
    sort_new: "Най-нови",
    
    lbl_msg_type: "Тип съобщение:",
    opt_feature: "Предложение",
    opt_bug: "Проблем",
    lbl_desc: "Описание:",
    btn_send: "Изпрати",
    
    // Alerts (Тоуст съобщения)
    alert_vote_success: "Гласуването е успешно!",
    alert_vote_fail: "Гласуването неуспешно.",
    alert_feedback_success: "Благодарим! Съобщението е изпратено.",
    alert_feedback_fail: "Грешка при изпращане.",
    alert_short_text: "Моля, напишете поне 5 символа.",
    alert_banned: "Вие сте БАННАТ и не можете да извършите това действие.",
    alert_no_connection: "Няма връзка със сървъра.",
    confirm_delete: "Сигурни ли сте, че искате да изтриете това?",	

settings_proximity: "Известия наблизо (Pop-up)",

share_modal_title: "Избери версия за споделяне",
        // --- НОВИ ЗА CUSTOM STOP ---
        custom_title_create: "Направи комбинирана спирка",
        custom_title_edit: "Редакция на спирка",
        custom_label_name: "Име на групата",
        custom_placeholder_name: "Напр. Вкъщи (Всички)",
        custom_placeholder_search: "Добави спирка (име или номер)...",
        custom_label_added: "Добавени спирки:",
        custom_no_added_stops: "Няма добавени спирки",
        btn_create_stop: "Създай спирка",
        btn_save_changes: "Запази промените",
        
        // Alerts & Messages
        alert_enter_name: "Моля, въведете име на групата.",
        alert_min_stops: "Моля, добавете поне 2 спирки.",
        alert_saved: "Промените са запазени!",
        alert_created: "Комбинираната спирка е създадена!",
        loading_stops: "Зареждане на спирките...",
        txt_stops_count: "спирки",
        txt_no_data_combined: "Няма данни за нито една от спирките.",
        txt_no_courses_soon: "Няма курсове скоро",
        txt_unknown: "Неизвестна",
		 // FAV MENU
        fav_menu_title: "Любими:",
        btn_fav_add: "Добави в Любими",
        btn_fav_remove: "Премахни от Любими", // Ако вече е там
        btn_fav_merge: "Създай своя обединена спирка",
        btn_merge_new: "Създай нова",
        btn_merge_existing: "Обедини със съществуваща...",
        btn_back: "Назад",
        label_select_target: "Избери с какво да обединиш:",
        prompt_new_group_name: "Име на новата обединена спирка:",
        alert_merged: "Спирките са обединени успешно!",
		 // --- ДОБАВИ ТЕЗИ ДВА РЕДА ТУК: ---
        changelog_title: "Ново във версия",
        changelog_btn: "Разбрах!",
		select_line_hint: "Избери линия...", // <--- ДОБАВИ ТОВА
		
		
		
		 // --- АЛАРМИ И УИЗАРД ---
        alarm_title_prefix: "Аларма за:",
        tracking_title_prefix: "Проследяване:",
        
        // Wizard Стъпка 1 & 2
        wizard_title: "Настрой аларма",
        wizard_select_line: "Избери линия за следене",
        wizard_active_label: "АКТИВНИ:",
        wizard_no_lines: "Няма активни линии в момента.",
        wizard_time_to_stop: "Време за стигане до спирката?",
        wizard_buffer_expl: "Ще бъдете известени, когато реалното време на пристигане стане равно на това число.",
        btn_continue: "Продължи",
        error_valid_number: "Въведете валидно число.",
        
        // Wizard Стъпка 3 (Режими)
        wizard_choose_mode: "Избери курс",
        wizard_mode_subtitle: "Търсим курсове, които са поне след %d мин.",
        mode_recent_title: "Най-скорошните",
        mode_recent_desc: "Показва следващите 3 удобни курса",
        mode_all_title: "Всички за деня",
        mode_all_desc: "Списък с всички оставащи часове",
        txt_or: "ИЛИ",
        
        // Wizard Стъпка 4 (Списък)
        wizard_screen_recent: "Най-скорошни",
        wizard_sub_recent: "Избери един от следващите курсове:",
        wizard_screen_all: "Разписание",
        wizard_sub_all: "Всички курсове до края на деня:",
        searching_courses: "Търсене на курсове...",
        no_suitable_courses: "Няма подходящи курсове (спрямо избрания буфер).",
        no_courses_soon: "Няма курсове в близките минути.",
        
        // Съобщения за алармата
        alarm_set_success: "Алармата е настроена!",
        alarm_next_course: "Следващ курс",
        alarm_specific_time: "Час",
        alarm_buffer_info: "Буфер: %d мин.",
        
		
		// В TRANSLATIONS.bg:
alarm_arrival_label: "Пристига:",
alarm_trigger_label: "Аларма:",
alarm_scheduled_hint: "(разп.)", // Съкратено от разписание
		
        // Нотификации и Плеър
        alarm_arriving_in: "Пристига след %d мин.",
        alarm_target: "Цел:",
        alarm_searching: "Търсене на сигнал...",
        alarm_remaining_more: "Остават >%d мин.",
        alarm_wait_course: "Изчаква се курс...",
        alarm_mins_to_hour: "Остават %d мин. до часа",
        
        // Trigger Alert
        alarm_alert_title: "ВРЕМЕ Е ЗА ТРЪГВАНЕ!",
        alarm_alert_body: "Време е! %s пристига след %d мин.",
        
        // My Alarms Screen
        my_alarms_title: "Моите аларми",
        no_active_alarms: "Няма активни аларми.",
        edit_alarm_title: "Редакция",
        edit_alarm_desc: "Промени времето за предизвестие (мин):",
        btn_save: "Запази"
    },
    en: {
		
	filter_route_search_title: "Route Filters",	
		// ... другите ти преводи ...
        parking_free_spaces: "FREE SPACES",
        parking_working_time: "WORKING TIME",
        parking_tariff_1_title: "Tariff 1 (Ticket 30+/60+, Day card)",
        parking_tariff_1_free: "First 2 hours: <b>FREE</b>",
        parking_tariff_1_after: "After 2nd hour: 0.25 € /h",
        parking_tariff_2_title: "Tariff 2 (Monthly, Annual, 72h card)",
        parking_tariff_2_free: "During working hours: <b>FREE</b>",
        parking_tariff_2_night: "Night (00:00 - 05:00): 0.25 € /h",
        parking_no_transit: "Without public transport:",
        parking_important_title: "Important conditions for free parking:",
        parking_important_1: "1. First trip: up to 30 min. (metro) or 45 min. (ground) after entry.",
        parking_important_2: "2. Leaving: up to 60 min. after the last validation in transport.",
        parking_nav_btn: "NAVIGATION TO HERE",
        parking_free_suffix: "free spaces",
		
		
		filter_buffer_parkings: "Show buffer parkings",
		
        settings_vehicle_style: "Vehicle Style",
        style_teardrop: "Teardrop",
        style_capsule: "Capsule",
    // ... старите преводи ...
        route_changes_title_main: "Route Changes",
        route_changes_source: "(Source: Urban Mobility Center)",
        label_valid_from: "FROM",
        label_valid_to: "TO",
        label_affected_lines: "AFFECTED LINES",
        source_prefix: "Source: ",
        cgm_url: "www.sofiatraffic.bg",
        button_view_details: "VIEW DETAILS",	
		
		
		       dialog_favorite_place_title: "Save favorite place",
        placeholder_place_name: "Name (e.g. Home, Work)",
        msg_long_press_map: "First long press on map to select a location!",
        msg_enter_name: "Please enter a name for the place!",
        msg_confirm_delete_place: "Delete \"%s\"?",
        add_btn: "Add",
		// В TRANSLATIONS.en добавете:
filter_size_stops: "Stop icon size:",
filter_size_vehicles: "Vehicle icon size:",
		
		
		settings_group_visual: "Visualization",
settings_group_func: "Functionalities",
		
	
// ... other translations ...
alert_backup_saved: "Backup saved successfully!",
alert_file_saved_auto: "File saved automatically to Downloads folder as: %s",
confirm_restore: "Warning: This will replace all current settings and favorite stops with those from the file. Continue?",
alert_restore_success: "Restore successful! The app will restart.",
alert_restore_error: "Error reading file. Please ensure it is a valid backup.",
// ...


	
settings_backup_title: "Backup & Restore",
backup_modal_desc: "Create a backup of your favorite stops and settings to transfer them to another device.",
action_create_backup: "Create Backup",
desc_create_backup: "Saves your current configuration to a file.",
action_restore_backup: "Restore Backup",
desc_restore_backup: "Roll back to a previous configuration from a file.",		
		
		
		// В TRANSLATIONS.en:
action_stop: "Stop",
		next_stop_alert: "Your stop is next",
		 sched_missing: "Schedule / no vehicle data",
		  sched_future: "Scheduled",
		map_sel_selected: "Selected stops:",
        map_sel_done: "Done",
        map_sel_hint: "Tap a stop on the map to add it",
		rep_crowded: "Crowded",
		// --- NEW FOR FILTER ---
        filter_title: "Map Filters",
        filter_stops: "Show Stops",
        filter_vehicles: "Show Vehicles",
        filter_appearance: "Appearance",
        filter_icons: "Icons",
        filter_dots: "Dots",
        filter_zoom_stops: "Zoom: Stops",
        filter_zoom_distant: "Far",
        filter_zoom_close: "Close",
        filter_all: "All",
        filter_select_lines: "Select Lines",
        filter_select_all: "Select All",
        filter_deselect_all: "Hide All",
		
		// В TRANSLATIONS.en добави:
share_ride_msg_full: "I'm currently on %1$s %2$s, will be at %3$s in about %4$d min. Track me here: %5$s",
share_ride_msg_simple: "I'm currently on %1$s %2$s. Track me here: %3$s",
		
		
		 // ADD THIS:
        social_menu_support: "Help",
        social_menu_community: "Info",
        
        social_sheet_luggage_title: "Lost Luggage: Phone",
        social_sheet_contact_title: "Contact",
        social_luggage_metro: "METRO",
        social_luggage_ground: "GROUND",
        social_item_contact: "Contact Developer",
        social_item_group: "Facebook Group",
        social_item_share: "Share App",
		
		settings_about: "About",
		
		 social_menu_support: "Help",
        social_menu_community: "Info",
        social_sheet_luggage: "Lost Luggage",
        social_sheet_contact: "Contact Us",
        roadmap_tab_sent: "Sent",
        roadmap_admin_label: "ADMIN",
        roadmap_you_label: "YOU",
        roadmap_reply_hint: "Write a reply...",
        roadmap_reply_send: "Send",
		// В TRANSLATIONS.en:
		settings_autolocate: "Auto-localization",
		
		
		
	
		
		 // ... другите преводи ...
        filter_deselect_all: "Hide All",
        filter_clear_lines: "Clear", // <--- ДОБАВИ ТОВА
		 filter_search_placeholder: "Search line (e.g. 20)...", // <--- НОВО
		
        search_placeholder: "Search for address or stop...",
        search_stop_placeholder: "Stop name or code...",
        zoom_hint: "Zoom in to see stops",
        title_search: "Search",
        title_lines: "Lines",
        title_favorites: "Favorites",
        title_map: "Map",
        title_settings: "Settings",
        loading: "Loading...",
        details: "Details",
        timetable: "Timetable",
        weekday: "Weekday",
        holiday: "Holiday",
        no_favorites: "No favorite stops.",
        settings_language: "Language",
        settings_dark_mode: "Dark Mode",
        settings_start_screen: "Start Screen",

settings_proximity: "Proximity Alerts (Pop-up)",
		
share_modal_title: "Choose version to share",
		// NEW:
        settings_sorting: "Sort Lines",
        sort_by_time: "By Time",
        sort_by_type: "By Type/Number",
		
		settings_sec_basic: "Basic",
settings_sec_more: "More",
settings_sec_info: "Information",
		
		
        settings_download: "Download for Android:",
		
		
		 // НОВИ ПРЕВОДИ ЗА SOCIAL И ЛЮБИМИ:
        nav_social: "Social",
        title_social: "Community",
        social_coming_soon: "Coming Soon!",
        social_desc: "Here you can report issues, accidents, and police to help the community, and share suggestions for the app.",
        fav_search_placeholder: "Search stop to add...",
		   // НОВО:
        settings_buy_coffee: "For a coffee :) ",
        settings_version: "Version",
        exit: "Exit",
        nav_search: "Search",
        nav_lines: "Lines",
        nav_favorites: "Favs",
        nav_map: "Map",
        nav_settings: "Settings",
        action_map_route: "Route on Map",
        action_stops_schedule: "Stops & Schedule",
        action_track_live: "Track Live",
        cancel: "Cancel",
        close: "Close",

find_routes: "Get Directions",  // <--- НОВО


        // Transport (Titles)
        metro: "Metro", tram: "Tram", trolley: "Trolley", bus: "Bus", night: "Night",

        // NEW OR UPDATED:
        arriving: "Now",
        time_min: "m",
        time_h: "h",
        time_after: "in",        // "in 1 min"
        code_label: "Code:",
        ra_you_are_here: "(You are here)",
        ra_get_off: "get off here",
        ra_destination: "(destination)",
        line_label: "Line",
        to_label: "to",          // Тук е "to"
        direction_prefix: "DIRECTION",
		  // NEW FOR SHARE:
        settings_share: "Share me with friends",
        share_button: "Share Link",
        share_msg_title: "Sofia Yrd Maps - Public Transport",
        share_msg_text: "Check real-time public transport with Sofia Yrd Maps:",
        link_copied: "Link copied to clipboard!",
		 // ... (existing) ...
        add_btn: "Add",





// ... existing translations ...

    // --- SOCIAL / COMMUNITY ---
    social_maintenance_title: "Under Construction",
    social_maintenance_desc: "This section is currently being updated. Please check back later! 🛠️",
    
    nick_title: "What should we call you?",
    nick_desc: "Choose a nickname to report and vote. Visible to everyone.",
    nick_placeholder: "Your nickname",
    btn_save_enter: "Save & Enter",
    
    sec_incidents: "📍 Road Incidents",
    sec_bus_cond: "🚌 Bus Condition",
    
    rep_crash: "Accident",
    rep_police: "Police",
    rep_control: "Inspection",
    rep_hot: "Hot",
    rep_cold: "Cold",
    rep_dirty: "Dirty",
    
    btn_roadmap_title: "Suggestions & Issues",
    btn_roadmap_desc: "Vote for features or report bugs",
    
    feed_no_reports: "No reports nearby.",
    feed_loading: "Loading...",
    feed_live: "(LIVE)",
    feed_last_pos: "(last pos.)",
    feed_line: "Line",
    feed_by: "by",
    feed_ago: "ago",
    feed_dist: "at", // "at 200m"
    
    alert_voted: "You have already voted for this report.",
    alert_too_far: "Too far! You can only vote within 200m radius.",
    alert_gps: "Cannot determine location. Please enable GPS.",
    alert_rate_limit: "You already reported this. Please wait a bit.",
    alert_success: "Report sent successfully!",
    alert_nick_short: "Nickname must be at least 3 chars.",
    alert_nick_success: "Nickname changed successfully!",
    
    modal_veh_search: "Searching for vehicles nearby...",
    modal_veh_none: "No vehicles found within 200m.",
    modal_loc_title: "Pick Location",
    modal_loc_desc: "You can only report within 500/200m radius.",
    btn_confirm: "Confirm",
// ... (existing) ...

    // --- ROADMAP & ALERTS ---
    txt_date: "Date",
    status_done: "DONE",
    
    tab_vote: "Vote",
    tab_submit: "Submit",
    txt_roadmap_intro: "Vote for the features you want to see in the next version!",
    sort_top: "Top",
    sort_new: "Newest",
    
    lbl_msg_type: "Message Type:",
    opt_feature: "Feature",
    opt_bug: "Bug",
    lbl_desc: "Description:",
    btn_send: "Send",
    
    // Alerts
    alert_vote_success: "Vote successful!",
    alert_vote_fail: "Vote failed.",
    alert_feedback_success: "Thank you! Message sent.",
    alert_feedback_fail: "Error sending message.",
    alert_short_text: "Please write at least 5 characters.",
    alert_banned: "You are BANNED and cannot perform this action.",
    alert_no_connection: "No connection to server.",
    confirm_delete: "Are you sure you want to delete this?",











 add_choice_title: "What to add?",
        add_choice_single: "Single Stops",
        add_choice_group: "Combined Stop",
        title_add_single: "Add Favorite Stops",
        btn_add_favorites: "Add to Favorites",



        // --- NEW FOR CUSTOM STOP ---
        custom_title_create: "Create Combined Stop",
        custom_title_edit: "Edit Stop Group",
        custom_label_name: "Group Name",
        custom_placeholder_name: "E.g. Home (All)",
        custom_placeholder_search: "Add stop (name or code)...",
        custom_label_added: "Added stops:",
        custom_no_added_stops: "No added stops",
        btn_create_stop: "Create Stop",
        btn_save_changes: "Save Changes",

        // Alerts & Messages
        alert_enter_name: "Please enter a group name.",
        alert_min_stops: "Please add at least 2 stops.",
        alert_saved: "Changes saved!",
        alert_created: "Combined stop created!",
        loading_stops: "Loading stops...",
        txt_stops_count: "stops",
        txt_no_data_combined: "No data for any of the stops.",
        txt_no_courses_soon: "No departures soon",
        txt_unknown: "Unknown",
		// FAV MENU
        fav_menu_title: "Favorites",
        btn_fav_add: "Add to Favorites",
        btn_fav_remove: "Remove from Favorites",
        btn_fav_merge: "Create Custom Merge Stop",
        btn_merge_new: "Create New",
        btn_merge_existing: "Merge with Existing...",
        btn_back: "Back",
        label_select_target: "Select target to merge with:",
        prompt_new_group_name: "Name for the new combined stop:",
        alert_merged: "Stops merged successfully!",
		// --- ДОБАВИ ТЕЗИ ДВА РЕДА ТУК: ---
        changelog_title: "What's new in version",
        changelog_btn: "Got it!",
		 select_line_hint: "Select a line...", // <--- ДОБАВИ ТОВА
		 
		 
		 // --- ALARMS & WIZARD ---
        alarm_title_prefix: "Alarm for:",
        tracking_title_prefix: "Tracking:",
        
        // Wizard Step 1 & 2
        wizard_title: "Set Alarm",
        wizard_select_line: "Select line to track",
        wizard_active_label: "ACTIVE:",
        wizard_no_lines: "No active lines currently.",
        wizard_time_to_stop: "Time to reach the stop?",
        wizard_buffer_expl: "You will be notified when real arrival time equals this number.",
        btn_continue: "Continue",
        error_valid_number: "Please enter a valid number.",
        
        // Wizard Step 3 (Modes)
        wizard_choose_mode: "Choose Trip",
        wizard_mode_subtitle: "Looking for trips at least %d min away.",
        mode_recent_title: "Soonest Trips",
        mode_recent_desc: "Shows the next 3 convenient trips",
        mode_all_title: "All Day",
        mode_all_desc: "List of all remaining trips",
        txt_or: "OR",
        
        // Wizard Step 4 (List)
        wizard_screen_recent: "Soonest",
        wizard_sub_recent: "Select one of the next trips:",
        wizard_screen_all: "Schedule",
        wizard_sub_all: "All trips until end of day:",
        searching_courses: "Searching trips...",
        no_suitable_courses: "No suitable trips (based on buffer).",
        no_courses_soon: "No trips in the next few minutes.",
        
        // Alarm Messages
        alarm_set_success: "Alarm set!",
        alarm_next_course: "Next trip",
        alarm_specific_time: "Time",
        alarm_buffer_info: "Buffer: %d min",
        
        // Notifications & Player
        alarm_arriving_in: "Arriving in %d min",
        alarm_target: "Target:",
        alarm_searching: "Searching signal...",
        alarm_remaining_more: "Remaining >%d min",
        alarm_wait_course: "Waiting for trip...",
        alarm_mins_to_hour: "%d min until start",
        
        // Trigger Alert
        alarm_alert_title: "TIME TO GO!",
        alarm_alert_body: "It's time! %s is arriving in %d min.",
        
		
		// В TRANSLATIONS.en:
alarm_arrival_label: "Arrival:",
alarm_trigger_label: "Alarm:",
alarm_scheduled_hint: "(sched.)",

        // My Alarms Screen
        my_alarms_title: "My Alarms",
        no_active_alarms: "No active alarms.",
        edit_alarm_title: "Edit",
        edit_alarm_desc: "Change notification buffer (min):",
        btn_save: "Save"
		
    }
};

// Функция за взимане на текст
function t(key) {
    return TRANSLATIONS[currentLanguage][key] || key;
}

// Функция за прилагане на езика върху статичния HTML
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Обновяване на селекта за Начален екран (опциите)
    const screenSelect = document.getElementById('select-start-screen');
    if(screenSelect) {
       Array.from(screenSelect.options).forEach(opt => {
           const key = opt.getAttribute('value').replace('screen-', 'title_').toLowerCase(); 
           if(key === 'title_search' || key === 'title_lines' || key === 'title_favorites' || key === 'title_map') {
               opt.text = t(key);
           }
       });
    }
    
    // Обновяване на табовете за транспорт
    renderTransportSelector();
}

// --- STATE ---
// --- FILTER STATE ---
// --- FILTER STATE ---

// 1. В DEFAULT_CONFIG добави vehicleStyle
const DEFAULT_CONFIG = {
    style: 'DYNAMIC',
    minZoomStops: 15,
    minZoomVehicles: 10,
    dotThreshold: 14,
    stopSizeMultiplier: 1.0,
    vehicleSizeMultiplier: 1.0,
    vehicleStyle: 'TEARDROP' // <--- НОВО: 'TEARDROP' или 'CAPSULE'
};



// 2. Опитваме да заредим стари настройки
let loadedConfig = null;
try {
    loadedConfig = JSON.parse(localStorage.getItem('mapFiltersConfig'));
} catch (e) {
    loadedConfig = null;
}

// 3. СЪЗДАВАНЕ НА ЧИСТА КОНФИГУРАЦИЯ
// Взимаме старите настройки, но ПРЕЗАПИСВАМЕ критичните полета с Default-ите,
// за да сме сигурни, че няма счупени данни.
// Обновете savedMapConfig за да зарежда тези стойности:
let savedMapConfig = {
    style: (loadedConfig && loadedConfig.style) ? loadedConfig.style : DEFAULT_CONFIG.style,
    minZoomStops: (loadedConfig && loadedConfig.minZoomStops) ? loadedConfig.minZoomStops : DEFAULT_CONFIG.minZoomStops,
    stopSizeMultiplier: (loadedConfig && loadedConfig.stopSizeMultiplier) ? loadedConfig.stopSizeMultiplier : 1.0,
    vehicleSizeMultiplier: (loadedConfig && loadedConfig.vehicleSizeMultiplier) ? loadedConfig.vehicleSizeMultiplier : 1.0,
    minZoomVehicles: DEFAULT_CONFIG.minZoomVehicles, 
    dotThreshold: DEFAULT_CONFIG.dotThreshold
};


// Запазваме веднага поправената версия, за да се изчисти грешката в браузъра
localStorage.setItem('mapFiltersConfig', JSON.stringify(savedMapConfig));






// --- STATE ---
let alarmLoopTimeout = null;
let activeAlarms = JSON.parse(localStorage.getItem('active_alarms_web') || '[]');
let alarmCheckInterval = null;

// Модел на Wizard-а
let alarmWizardState = {
    step: 1,
    stop: null,        // Обект Stop
    arrivals: [],      // Списък с пристигания (Live)
    selectedRoute: null, // Обект Arrival
    bufferMinutes: 10,
    mode: 'NEXT_COURSE', // 'NEXT_COURSE' | 'SPECIFIC_TIME'
    editingAlarm: null   // Ако редактираме съществуваща
};


// Функция за запазване при промяна
function saveMapConfig() {
    localStorage.setItem('mapFiltersConfig', JSON.stringify(mapFilters.appearance));
}



let isSharedTrackingActive = false; // Флаг за блокиране на GPS при споделен линк


// --- ФУНКЦИЯ ЗА АВТОМАТИЧЕН "RIDE ALONG" ОТ ЛИНК ---
// --- ОБНОВЕНА ФУНКЦИЯ ЗА ОБРАБОТКА НА ЛИНК ---
async function handleSharedTrackingLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('track');
    const stopToPin = urlParams.get('stop');

    if (!tripId) return;

    isSharedTrackingActive = true; // Маркираме, че сме в режим "преглед"

    try {
        const response = await fetch(`${API_BASE_URL}full_route_view/${tripId}`);
        if (!response.ok) throw new Error("Trip not found");
        
        const data = await response.json();
        const v = data.vehicles ? data.vehicles.find(veh => String(veh.trip_id) === String(tripId)) : null;
        
        if (v) {
            window.startRideAlong(
                v.trip_id, 
                v.next_stop_id || data.stops[0].stop_id, 
                v.route_name, 
                v.destination, 
                v.route_type,
                false // <--- ВАЖНО: isManualClick = false (защото идва от линк)
            );

            if (stopToPin) {
                rideAlongState.pinnedStopId = stopToPin;
                setTimeout(() => { renderRideAlongList(); updateRideAlongData(); }, 500);
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    } catch (e) {
        console.error("Shared Link Error:", e);
        isSharedTrackingActive = false;
    }
}


let isGuestMode = new URLSearchParams(window.location.search).has('track');



let lastVehicleNextStopId = null; // Помни коя е била следващата спирка при последното извикване
// --- SMART TRACKING STATE (НОВО) ---
let isAutoFollowEnabled = true;   // Дали картата да следи автоматично
let userInteractionTimer = null;  // Таймер за засичане на неактивност (10 сек)

let currentCreatorMode = 'GROUP'; // 'GROUP' или 'SINGLE'
let selectedTimetableLine = null; // <--- НОВО: Тук помним избраната линия

let isGoogleRouteActive = false;
let googleRouteStopIds = new Set();

let reportsCache = new Map();

let userLocationMarker = null; // <--- НОВО: Тук пазим маркера за локация
let searchMarker = null; // <--- НОВО: Тук пазим маркера от търсене/задържане

let isCustomStopSelectionMode = false; // Флаг за режим "Избор"

// В началото на script.js


let map;
let allStopsData = [];
let stopMarkersLayer = L.featureGroup(); 
let routeLayer = L.featureGroup();       
let vehicleLayer = L.featureGroup();     

let visibleMarkers = new Map();
let currentOpenStopId = null;
let selectedStopId = null;

let selectedLineForAction = null; 
let selectedStopForAction = null;

let favoriteStops = JSON.parse(localStorage.getItem('favStops') || '[]');
let favoriteLines = JSON.parse(localStorage.getItem('favLines') || '[]');
let timeDisplayMode = localStorage.getItem('timeDisplayMode') || 'RELATIVE';

// Settings State
let currentTheme = localStorage.getItem('appTheme') || 'light';
let startScreen = localStorage.getItem('startScreen') || 'screen-map';


let sortingPreference = localStorage.getItem('sortingPreference') || 'BY_TIME';

// --- UNREAD MESSAGES STATE ---
let unreadAdminCount = 0;
// --- CUSTOM STOPS STATE ---
// Структура: [{ id: 'custom_123456', name: 'Моят Хъб', subStops: ['1234', '2345'] }]
let customStopsData = JSON.parse(localStorage.getItem('customStopsData') || '[]');

let editingCustomStopId = null; // Ако е null -> Създаваме нова. Ако има ID -> Редактираме.


// Lines Tab State
let allLinesData = []; 
let currentTransportType = TRANSPORT_TYPES_CONFIG.METRO; 
let selectedLineData = null; 

// Routes (Standard)
let activeRoutesList = []; 
let focusedRouteTripId = null;

// Full Line Map State
let currentFullLineData = null;
let currentLineShapes = []; // <--- НОВО: Тук ще пазим координатите на маршрута
let isShowingVehiclesOnMap = false;
let fullLineVehicleTimer = null;

// Timers
let routeVehicleTimer = null;
let dataRefreshTimer = null;

let vehicleMarkersMap = new Map(); 
let activeRouteArrivalsMap = new Map(); 

// Cache
let stopsStatusCache = JSON.parse(localStorage.getItem('stopsStatusCache') || '{}');
let bulkFetchTimeout = null;
const iconCache = new Map(); 

let pastStopResetTimer = null; // Таймер за връщане от минала спирка



// По подразбиране е TRUE, ако не е зададено друго
let isAutoLocateEnabled = localStorage.getItem('settings_auto_locate') !== 'false';




// Функция за автоматично локализиране (използваме твоята логика от GPS бутона)
// 1. ЗАБРАНА В triggerAutoLocation
function triggerAutoLocation() {
    // АБСОЛЮТНА ЗАБРАНА: Ако е споделен линк, спираме дотук
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('track') || isSharedTrackingActive) return;

    if (!isAutoLocateEnabled || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            userLocation = { lat, lng };
            if (map) map.setView([lat, lng], 16);
            // ... (тук е твоя код за маркера)
        },
        (err) => console.log("GPS error"),
        { enableHighAccuracy: true, timeout: 5000 }
    );
}


// Зареждаме списъка със скрити доклади от паметта на телефона, за да помни и след рефреш
// Глобална променлива за скритите поп-ъпи
let shownProximityAlerts;
try {
    // Опитваме да заредим от паметта
    shownProximityAlerts = new Set(JSON.parse(localStorage.getItem('hidden_popups') || '[]'));
} catch (e) {
    // Ако има грешка в данните, започваме на чисто
    shownProximityAlerts = new Set();
}

let proxMap = null; // Картата в попъпа


// По подразбиране е TRUE, освен ако изрично не е 'false' в паметта
let areProximityAlertsEnabled = localStorage.getItem('settings_proximity_alerts') !== 'false';

// --- ANTI-SPAM MEMORY (Глобални променливи) ---
let sessionLastReports = {}; // Пази в RAM паметта за текущата сесия
const REPORT_COOLDOWN_MS = 30 * 60 * 1000; // 30 минути








// --- ГЛОБАЛЕН ДИСПЕЧЕР ЗА ЕКРАНА (LOCK SCREEN) ---
let lockScreenState = {
    ride: null,  // Тук ще пазим текста от "Проследи на живо"
    alarm: null  // Тук ще пазим текста от "Алармите"
};

// Тази функция заменя старата updateMediaSessionInfo
function updateGlobalLockScreen(source, title, subtitle) {
    if (source === 'RIDE') lockScreenState.ride = { title, subtitle };
    else if (source === 'ALARM') lockScreenState.alarm = { title, subtitle };
    else if (source === 'CLEAR_ALARM') lockScreenState.alarm = null; 
    else if (source === 'CLEAR_RIDE') lockScreenState.ride = null;

    let finalTitle = "";
    let finalArtist = "";
    const hasRide = lockScreenState.ride !== null;
    const hasAlarm = lockScreenState.alarm !== null;

    if (hasRide && hasAlarm) {
        // Почистваме префикса ("Аларма за:", "Alarm for:") за да е по-кратко
        // Използваме replace с преводния стринг
        let alarmCleanTitle = lockScreenState.alarm.title
            .replace(t('alarm_title_prefix'), "") 
            .trim();
            
        finalTitle = `${lockScreenState.ride.title} | 🔔 ${alarmCleanTitle}`;
        finalArtist = `${lockScreenState.ride.subtitle} | ${lockScreenState.alarm.subtitle}`;
    } 
    else if (hasRide) {
        finalTitle = lockScreenState.ride.title;
        finalArtist = lockScreenState.ride.subtitle;
    } 
    else if (hasAlarm) {
        finalTitle = lockScreenState.alarm.title;
        finalArtist = lockScreenState.alarm.subtitle;
    } 
    else {
        finalTitle = "Sofia Yrd Maps";
        finalArtist = "...";
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: finalTitle,
            artist: finalArtist,
            album: 'Sofia Yrd Maps',
            artwork: [
                { src: 'sofia_traffic_icon2.png', sizes: '96x96', type: 'image/png' },
                { src: 'sofia_traffic_icon2.png', sizes: '128x128', type: 'image/png' },
            ]
        });
        
        const keepAlive = () => {
            const audio = document.getElementById('background-audio');
            if(audio && audio.paused) audio.play().catch(()=>{});
        };

        try {
            navigator.mediaSession.setActionHandler('play', keepAlive);
            navigator.mediaSession.setActionHandler('pause', keepAlive);
            navigator.mediaSession.setActionHandler('stop', keepAlive);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('seekbackward', null);
            navigator.mediaSession.setActionHandler('seekforward', null);
        } catch(e) {}
    }
}







// --- ПОМОЩНА ФУНКЦИЯ 1: Проверява кога за последно си пуснал такъв репорт ---
function getLastUserReportTime(typeKey) {
    let maxTime = 0;

    // 1. Проверка в RAM (най-сигурно за току-що изпратени)
    if (sessionLastReports[typeKey]) {
        maxTime = Math.max(maxTime, sessionLastReports[typeKey]);
    }

    // 2. Проверка в LocalStorage (ако си рестартирал приложението)
    const localStr = localStorage.getItem(`last_report_${typeKey}`);
    if (localStr) {
        maxTime = Math.max(maxTime, parseInt(localStr, 10));
    }

    // 3. Проверка в данните от сървъра (ако си сменил устройството/кеша е чист)
    if (serverReportsList && serverReportsList.length > 0) {
        serverReportsList.forEach(r => {
            const isMine = (String(r.userId) === String(appUserId) || r.reporter === currentUserNick);
            
            // Ако е мой и е от същия тип
            if (isMine && r.type === typeKey) {
                if (r.timestamp > maxTime) {
                    maxTime = r.timestamp;
                }
            }
        });
    }

    return maxTime;
}

// --- ПОМОЩНА ФУНКЦИЯ 2: Маркира репорта като изпратен ---
function markReportAsSent(typeKey) {
    const now = Date.now();
    sessionLastReports[typeKey] = now; // Запис в RAM
    localStorage.setItem(`last_report_${typeKey}`, now); // Запис в телефона
}
// --- НОВА ЦЕНТРАЛНА ФУНКЦИЯ ЗА ИЗПРАЩАНЕ (HANDLES ALL LOGIC) ---
async function processReportSubmission(reportData) {
    const typeKey = reportData.type;
    const now = Date.now();
    const cooldown = 30 * 60 * 1000; // 30 минути

    // Проверка за администратор
    const isAdmin = localStorage.getItem('IS_ADMIN_USER') === 'true';

    if (!isAdmin) {
        // Проверяваме дали потребителят вече е докладвал ТОЧНО ТОЗИ ТИП за ТОЗИ РЕЙС
        const existing = serverReportsList.find(r => 
            (String(r.userId) === String(appUserId) || r.reporter === currentUserNick) && 
            r.type === typeKey && 
            String(r.tripId) === String(reportData.tripId)
        );

        if (existing) {
            alert("⚠️ Вече сте изпратили такъв сигнал за този автобус.");
            return false;
        }
    }

    // Изпращане към сървъра
    submitSocialReportToServer(reportData);
    
    // Добавяме го локално за мигновен ефект
    serverReportsList.push({
        ...reportData,
        id: "temp_" + now,
        timestamp: now,
        userId: appUserId,
        upvotes: 0,
        downvotes: 0,
        usersVoted: []
    });

    return true;
}
// --- AUTO USERNAME LOGIC ---
function ensureAutoNickname() {
    // 1. Проверяваме дали вече имаме име
    let currentNick = localStorage.getItem('userNickname');
    
    if (!currentNick) {
        // 2. Генерираме рандъм име: User + 4 цифри
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const newNick = `User${randomNum}`;
        
        // 3. Запазваме го веднага
        localStorage.setItem('userNickname', newNick);
        currentUserNick = newNick;
        
        console.log("Auto-generated nickname:", newNick);
        
        // 4. Синхронизираме го със сървъра (ТИХО)
        backgroundSyncUser(newNick);
    }
}

// Тиха синхронизация (без алерти)
async function backgroundSyncUser(nick) {
    if(!appUserId) return;
    try {
        await fetch(`${API_BASE_URL}social/sync_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: appUserId, newNick: nick })
        });
    } catch(e) { console.log("Background sync failed (minor issue)"); }
}

// Проверка дали сме изтрити от сървъра
async function verifyUserStatus() {
    if(!appUserId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}user/check/${appUserId}`);
        
        if (response.status === 404) {
            console.log("User deleted from server. Resetting local data...");
            // Сървърът не ни познава -> Трием локалното име
            localStorage.removeItem('userNickname');
            
            // Генерираме ново веднага
            ensureAutoNickname();
            
            // Обновяваме UI ако сме в Social таба
            updateHeaderNickname();
        }
    } catch (e) {
        // Ако няма нет, не правим нищо, караме със старите данни
    }
}


function updateHeaderNickname() {
    const el = document.getElementById('current-user-display');
    // ТУК Е ПРОМЯНАТА: Добавяме "Username: "
    if (el && currentUserNick) {
        el.textContent = `Username: ${currentUserNick}`;
    }
}
// --- LIVE TRACKING BACKGROUND UTILS ---
let currentWakeLock = null;

// 1. ПОДОБРЕН WAKE LOCK (ЕКРАНЪТ ДА НЕ ГАСНЕ)
async function activateWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            // Ако вече имаме активен, не правим нищо
            if (currentWakeLock !== null && !currentWakeLock.released) return;

            currentWakeLock = await navigator.wakeLock.request('screen');
            console.log('>>> Screen Wake Lock acquired');

            currentWakeLock.addEventListener('release', () => {
                console.log('>>> Screen Wake Lock released');
                // Опит за незабавно възстановяване, ако сме още в Ride Along
                if (rideAlongState.active && document.visibilityState === 'visible') {
                    activateWakeLock();
                }
            });
        } catch (err) {
            console.error(`Wake Lock Error: ${err.name}, ${err.message}`);
        }
    }
}

// Възстановяване при връщане в таба
// Слушател за връщане в приложението (светване на екран / смяна на таб)
// --- UNIFIED VISIBILITY HANDLER (ОБЩ СЛУШАТЕЛ ЗА СЪБУЖДАНЕ) ---
// --- СЛУШАТЕЛ ЗА ОТВАРЯНЕ НА ПРИЛОЖЕНИЕТО ---
document.addEventListener('visibilitychange', async () => {
    
    // Ако приложението е станало видимо (потребителят го е отворил)
    if (document.visibilityState === 'visible') {
        console.log(">>> App resumed/opened.");

        // 1. АВТОМАТИЧНО ОТИВАНЕ В ЕКРАНА С АЛАРМИ
        // Проверяваме дали има активни аларми
        if (typeof activeAlarms !== 'undefined' && activeAlarms.length > 0) {
            // Ако сме били на друг екран, превключваме
            // Търсим функцията за отваряне на екрана (ако я има в Settings логиката)
            // Или просто симулираме отваряне:
            
            // Скриваме настройките
            const settingsScreen = document.getElementById('screen-settings');
            if (settingsScreen) {
                settingsScreen.classList.remove('active');
                settingsScreen.classList.add('hidden');
            }
            
            // Показваме екрана с аларми
            const alarmsScreen = document.getElementById('screen-active-alarms');
            if (alarmsScreen) {
                // Зареждаме списъка
                if(typeof openActiveAlarmsScreen === 'function') {
                    openActiveAlarmsScreen();
                }
            }
        }

        // 2. Възстановяване на процесите
        if (activeAlarms.length > 0 || (typeof rideAlongState !== 'undefined' && rideAlongState.active)) {
            activateWakeLock();
        }
        
        // 3. Рестарт на таймерите
        if (alarmLoopTimeout) clearTimeout(alarmLoopTimeout);
        if (typeof checkActiveAlarmsLoop === 'function') checkActiveAlarmsLoop();
        
        if (typeof performAutoRefresh === 'function') await performAutoRefresh();
        
        // 4. GPS (ако е настроен)
        if (typeof isAutoLocateEnabled !== 'undefined' && isAutoLocateEnabled) {
             // Само ако нямаме активна аларма, за да не пречим
             if (activeAlarms.length === 0) {
                 if (typeof triggerAutoLocation === 'function') triggerAutoLocation();
             }
        }
    }
});


// 2. ПОМОЩНА ФУНКЦИЯ ЗА ИКОНАТА
function getNotificationIconPath(typeCode) {
    const t = String(typeCode);
    if (t === '0') return 'stop_icon_tram.png';
    if (t === '11') return 'stop_icon_trolley.png';
    if (t === '1' || t === '2' || t === '4') return 'stop_icon_metro.png';
    return 'stop_icon_bus.png'; // По подразбиране за автобус и нощен
}

// 3. ОБНОВЕНА НОТИФИКАЦИЯ
function updateTrackingNotification(lineName, bodyText, routeType) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    navigator.serviceWorker.ready.then(registration => {
        const iconPath = getNotificationIconPath(routeType);
        const typeName = getTransportTypeName(routeType); 
        const title = `${typeName} ${lineName}`;

        registration.showNotification(title, {
            body: bodyText,
            icon: iconPath,
            tag: 'ride-along-status',
            renotify: false,
            silent: true,
            ongoing: true,
            // Слагаме линк към текущата страница, за да знае SW какво да отвори
            data: {
                url: window.location.origin + window.location.pathname
            },
            // ДОБАВЯМЕ БУТОН "КРАЙ"
            actions: [
                {
                    action: 'stop-tracking',
                    title: t('action_stop'),
                    icon: 'close_icon.png' // опционално, ако имаш такава иконка
                }
            ]
        });
    });
}



// Слушаме за съобщения от Service Worker-а
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'STOP_RIDE_ALONG') {
            console.log(">>> Stop command received from notification");
            if (typeof window.closeRideAlong === 'function') {
                window.closeRideAlong();
            }
        }
    });
}


function deactivateWakeLock() {
    if (currentWakeLock !== null) {
        currentWakeLock.release().then(() => {
            currentWakeLock = null;
        });
    }
}





// 3. Функция за СКРИВАНЕ НА НОТИФИКАЦИЯТА
// В script.js -> намери и замени clearTrackingNotification:

function clearTrackingNotification() {
    if (!("Notification" in window)) return;
    
    navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
            notifications.forEach(notification => {
                // Чистим всичко свързано с проследяването
                if (notification.tag === 'ride-along-status' || notification.tag === 'ride-along-alert') {
                    notification.close();
                }
            });
        });
    });
}


// --- НОВА ФУНКЦИЯ: Маршрут, заключен към конкретен автобус (Ride Along Mode) ---
async function showFixedRouteOnMap(tripId, routeName, routeType, destination, originStopId) {
    // 1. Подготовка на екрана (не крием картата, защото Ride Along е отгоре)
    document.querySelector('[data-target="screen-map"]').click();
    document.getElementById('active-routes-container').classList.remove('hidden');

    // 2. Изчистване на стари маршрути, ако има
    activeRoutesList = []; 
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();
    
    // 3. Теглене на данните
    try {
        const [shapeData, stopsData] = await Promise.all([
            fetch(`${API_BASE_URL}shape/${tripId}`).then(r => r.json()),
            fetch(`${API_BASE_URL}stops_for_trip/${tripId}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json())
        ]);

        // 4. Създаване на маршрутния обект със специални флагове
        const newRoute = { 
            tripId: tripId, 
            routeName: routeName, 
            routeType: routeType, 
            originStopId: originStopId, 
            shape: shapeData, 
            stops: stopsData, 
            color: getTransportColor(routeType, routeName),
            
            // ВАЖНО: Тези флагове променят логиката на рисуване
            isRideAlong: true,         // Режим "Проследяване"
            fixedVehicleId: tripId,    // Винаги следи ТОЗИ tripId
            lastNextStopId: null 
        };
        
        activeRoutesList.push(newRoute);
        focusedRouteTripId = tripId;
        selectedStopId = originStopId; // Маркираме началната спирка

        // 5. Стартиране на процесите
        updateRadarZIndex();
        
        // Първоначално обновяване на данните
        await updateRouteArrivals(newRoute);
        
        // Рисуване
        renderRouteChips();
        redrawAllActiveRoutes();
        updateVisibleMarkers();
        
        // Центриране (ако имаме спирката)
        const stopObj = allStopsData.find(s => s.stop_id == originStopId);
        if(stopObj) {
            map.setView([stopObj.stop_lat, stopObj.stop_lon], 16, { animate: true });
            // Балончето показваме само първия път
            selectStopWithTooltip(stopObj);
        }

        // Пускаме цикъла за движение на колите
        fetchAndDrawVehicles();
        if (routeVehicleTimer) clearInterval(routeVehicleTimer);
        routeVehicleTimer = setInterval(fetchAndDrawVehicles, VEHICLE_MOVE_INTERVAL);
        
    } catch (e) { 
        console.error("Fixed Route Error:", e); 
    }
}


// --- RIDE ALONG STATE ---
// --- RIDE ALONG STATE ---
let rideAlongState = {
    active: false,
    tripId: null,
    originStopId: null,
    originStopCode: null, 
    pinnedStopId: null,
    timer: null,
    shape: [],
    stops: [],
    routeDetails: null,
    hasNotifiedApproaching: false, // ВАЖНО: Добавено тук
    cachedRealTimes: new Map()      // ВАЖНО: Добавено тук
};

// --- INIT ---
console.log(">>> SCRIPT.JS: Start loading...");





// Създаваме бърз индекс за търсене на спирки
let stopsByIdMap = new Map();

function buildStopsMap() {
    stopsByIdMap.clear();
    allStopsData.forEach(s => stopsByIdMap.set(String(s.stop_id), s));
}

// Извикай buildStopsMap() вътре в fetchAllStops() след като заредиш данните

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ НА ПАМЕТТА И ФИЛТРИТЕ (НАЙ-ГОРЕ)
// ==========================================

// ==========================================
// БЕЗОПАСНО ЗАРЕЖДАНЕ НА НАСТРОЙКИ
// ==========================================

// 1. Дефинираме чист обект по подразбиране
const DEFAULT_FILTERS = {
    stops: { enabled: true, types: { 'METRO': true, 'TRAM': true, 'TROLLEY': true, 'BUS': true, 'NIGHT': true } },
    vehicles: { enabled: false, types: { 'METRO': true, 'TRAM': true, 'TROLLEY': true, 'BUS': true, 'NIGHT': true } },
    specificLines: [],
	showBufferParkings: true, // Променено на true
    appearance: { vehicleStyle: 'TEARDROP', stopSizeMultiplier: 1.0, vehicleSizeMultiplier: 1.0, minZoomStops: 15 }
};

// 2. Опит за безопасно четене от паметта
let storedFiltersData;
try {
    const raw = localStorage.getItem('mapFilters_Full');
    const parsed = raw ? JSON.parse(raw) : null;

    // ПРОВЕРКА: Проверяваме дали обекта е валиден и дали има критичното поле 'appearance'
    // Ако липсва (както е при Андроид импорт), използваме дефолтните, за да не гръмне кода
    if (parsed && parsed.appearance && typeof parsed.appearance === 'object') {
        storedFiltersData = parsed;
    } else {
        storedFiltersData = DEFAULT_FILTERS;
    }
} catch (e) {
    console.error("Грешка в паметта! Ресет на филтрите.");
    storedFiltersData = DEFAULT_FILTERS;
    localStorage.removeItem('mapFilters_Full'); // Чистим счупеното
}

// 3. Инициализиране на глобалните променливи
let mapFilters = storedFiltersData;

// По-стабилна функция за проверка на true/false (поддържа и булеви, и стрингове от Андроид)
function getSafeBool(key, fallback) {
    const val = localStorage.getItem(key);
    if (val === null) return fallback;
    return val === 'true' || val === true; // Разпознава и двата формата
}

let isRadarActive = getSafeBool('isRadarActive', false);
let isTrafficActive = getSafeBool('isTrafficActive', false);




// --- ПОМОЩНА: Синхронизация на Филтрите към Картата ---
function getRouteTypeByNameInternal(code) {
    if (code === '0') return 'TRAM';
    if (code === '11') return 'TROLLEY';
    if (code === '1' || code === '2' || code === '4') return 'METRO';
    return 'BUS';
}

async function syncSpecificLinesToRoutes() {
    const targetFilters = mapFilters.specificLines ||[];
    
    // Ако филтърът е празен, трием пълните линии
    if (targetFilters.length === 0) {
        activeRoutesList = activeRoutesList.filter(r => !r.isFullLineFilter);
        if (activeRoutesList.length === 0) {
            closeRouteView();
        } else {
            renderRouteChips();
            redrawAllActiveRoutes();
            updateVisibleMarkers();
        }
        return;
    }

    // Трием линиите, които вече не са във филтъра
    activeRoutesList = activeRoutesList.filter(r => {
        if (!r.isFullLineFilter) return true;
        const typeName = getRouteTypeByNameInternal(r.routeType);
        const id = `${typeName}_${r.routeName}`;
        return targetFilters.includes(id);
    });

    document.getElementById('active-routes-container').classList.remove('hidden');

    // Теглим новите линии
    for (const uniqueId of targetFilters) {
        const parts = uniqueId.split('_');
        const transportType = parts[0];
        const lineName = parts[1];
        
        let typeCode = '3';
        if (transportType === 'TRAM') typeCode = '0';
        else if (transportType === 'TROLLEY') typeCode = '11';
        else if (transportType === 'METRO') typeCode = '1';

        // Проверяваме дали вече я нямаме
        if (!activeRoutesList.some(r => r.routeName === lineName && r.routeType === typeCode && r.isFullLineFilter)) {
            try {
                const response = await fetch(`${API_BASE_URL}line_details/${lineName}/${typeCode}`, { headers: { 'Accept-Language': currentLanguage } });
                if (!response.ok) continue;
                const variations = await response.json();
                
                let multiShapes =[];
                let allStopsMap = new Map();
                
                variations.forEach(variation => {
                    if (variation.shape && variation.shape.length > 0) {
                        multiShapes.push(variation.shape.map(p => [p[0], p[1]]));
                    }
                    if (variation.stops) {
                        variation.stops.forEach(s => allStopsMap.set(s.stop_id, s));
                    }
                });
                
                if (multiShapes.length > 0) {
                    const stopsArray = Array.from(allStopsMap.values());
                    const color = getTransportColor(typeCode, lineName);
                    
                    activeRoutesList.push({
                        tripId: `FILTER_${uniqueId}`,
                        routeName: lineName,
                        routeType: typeCode,
                        originStopId: stopsArray.length > 0 ? stopsArray[0].stop_id : "",
                        shape: multiShapes, 
                        stops: stopsArray,
                        color: color,
                        isRideAlong: false,
                        isFullLineFilter: true // Флаг, че това е от филтъра!
                    });
                }
            } catch(e) { console.error(e); }
        }
    }
    
    renderRouteChips();
    redrawAllActiveRoutes();
    updateVisibleMarkers();
    fetchAndDrawVehicles();
}




function saveFullFilters() {
    localStorage.setItem('mapFilters_Full', JSON.stringify(mapFilters));
    localStorage.setItem('isRadarActive', isRadarActive);
    localStorage.setItem('isTrafficActive', isTrafficActive);
    localStorage.setItem('settings_auto_locate', isAutoLocateEnabled);
    localStorage.setItem('settings_proximity_alerts', areProximityAlertsEnabled);
    
    // ВАЖНО: Този ред тегли данните от сървъра и ги слага на картата!
    if (typeof syncSpecificLinesToRoutes === 'function') {
        syncSpecificLinesToRoutes(); 
    }
}










let parkingLayer = L.featureGroup();
let bufferParkingsData = [];
let isLayersMenuOpen = false;



async function initParkingSystem() {
    if (!map) return;
    parkingLayer.addTo(map); 
    
    // ВАЖНО: Теглим данни само ако филтърът е включен
    if (mapFilters.showBufferParkings) {
        await fetchBufferParkings();
    } else {
        parkingLayer.clearLayers(); // Гарантираме, че е празно, ако е изключено
    }
    
    setupLayersMenu();
    setupScrollArrows();
}

async function fetchBufferParkings() {
    try {
        const res = await fetch(`https://46.224.75.86.nip.io/news/buffer_parkings.json?t=${Date.now()}`);
        if (!res.ok) return;
        bufferParkingsData = await res.json();
        renderParkingMarkers(); // Слагаме иконите на картата
        renderParkingSelectionBar(); // Пълним хоризонталния бар
    } catch (e) { console.error(e); }
}

function setupLayersMenu() {
    const btnLayers = document.getElementById('btn-layers-main');
    const menu = document.getElementById('layers-expansion-menu');
    const icon = document.getElementById('layers-icon-main');

    btnLayers.onclick = (e) => {
        e.stopPropagation();
        isLayersMenuOpen = !isLayersMenuOpen;
        if (isLayersMenuOpen) {
            menu.classList.remove('menu-hidden');
            icon.textContent = 'close';
            btnLayers.classList.add('active-layers-btn');
        } else {
            menu.classList.add('menu-hidden');
            document.getElementById('parking-selection-container').classList.add('hidden');
            document.getElementById('btn-toggle-parking').classList.remove('active');
            icon.textContent = 'layers';
            btnLayers.classList.remove('active-layers-btn');
        }
    };

    document.getElementById('btn-toggle-parking').onclick = (e) => {
        e.stopPropagation();
        const container = document.getElementById('parking-selection-container');
        const btn = document.getElementById('btn-toggle-parking');
        container.classList.toggle('hidden');
        btn.classList.toggle('active');
        if (!container.classList.contains('hidden')) updateScrollArrowsVisibility();
    };
}

function renderParkingMarkers() {
    parkingLayer.clearLayers();
    const pIcon = L.icon({
        iconUrl: 'ic_buffer_parking.png',
        iconSize: [38, 38],
        iconAnchor: [19, 19]
    });

    bufferParkingsData.forEach(p => {
        const marker = L.marker([p.lat, p.lon], { icon: pIcon }).addTo(parkingLayer);
        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            openParkingDetails(p);
        });
    });
}

function renderParkingSelectionBar() {
    const bar = document.getElementById('parking-selection-bar');
    if(!bar) return;
    bar.innerHTML = '';
    
    bufferParkingsData.forEach(p => {
        const shortName = p.name.replace("Буферен паркинг", "").replace("„", "").replace("“", "").trim();
        const freeColor = p.free > 10 ? "#2E7D32" : "#D32F2F";
        
        const card = document.createElement('div');
        card.className = 'parking-chip-card';
        card.innerHTML = `
            <div class="chip-name">${shortName}</div>
            <div class="chip-free" style="color:${freeColor}">${p.free} ${t('parking_free_suffix')}</div>
        `;
        
        card.onclick = () => {
            map.setView([p.lat, p.lon], 16);
            openParkingDetails(p);
        };
        bar.appendChild(card);
    });
}




function openParkingDetails(p) {
    // 1. Проверка на типа паркинг спрямо таблицата от 2026
    const isCentral = p.name.includes("Васил Левски") || p.name.includes("Джеймс Баучер");
    
    // ОФИЦИАЛНИ ТАРИФИ В ЕВРО (ВАЛИДНИ ОТ 01.01.2026)
    const hourlyRate = isCentral ? "2.00 €" : "1.50 €";
    const overtimeRate = "0.25 €"; // Остатъчна цена за Park & Ride
    
    // Месечни абонаменти
    let monthlyRate = "77.00 €";
    if (p.name.includes("Васил Левски")) monthlyRate = "184.00 €";
    if (p.name.includes("Джеймс Баучер")) monthlyRate = "140.00 €";
    if (p.name.includes("Връбница")) monthlyRate = "няма";

    const workingTime = isCentral ? "00:00 - 24:00" : "05:00 - 00:00";
    const freeColor = p.free > 10 ? "#2E7D32" : "#D32F2F";
    const bpLabel = currentLanguage === 'bg' ? (isCentral ? 'Паркинг' : 'Буферен паркинг') : (isCentral ? 'Parking' : 'Buffer Parking');

    document.getElementById('parking-name').textContent = `${bpLabel} ${p.name.replace("Буферен паркинг", "").replace("„", "").replace("“", "").trim()}`;
    
    const content = document.getElementById('parking-content');

    let tariffsHtml = "";

    if (isCentral) {
        // --- ЛОГИКА ЗА СТАДИОН В. ЛЕВСКИ И ДЖ. БАУЧЕР (БЕЗ ОТСТЪПКИ ЗА ТРАНСПОРТ) ---
        tariffsHtml = `
            <div class="no-transit-box" style="background: rgba(28, 117, 188, 0.05); border-color: #1C75BC; padding: 25px; margin-bottom: 12px;">
                <div style="font-size: 13px; color: gray; margin-bottom: 5px; font-weight: normal;">${currentLanguage === 'bg' ? 'Почасово паркиране:' : 'Hourly parking:'}</div>
                <div style="font-size: 26px; font-weight: 900; color: #1C75BC;">${hourlyRate} / ч.</div>
            </div>

            <div class="no-transit-box" style="border-style: dashed; padding: 15px; margin-bottom: 15px;">
                <div style="font-size: 11px; color: gray; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">
                    ${currentLanguage === 'bg' ? 'Предплатен месечен абонамент:' : 'Prepaid monthly subscription:'}
                </div>
                <div style="font-size: 18px; font-weight: 800; color: var(--parking-text);">${monthlyRate}</div>
            </div>
            
            <div class="warning-card" style="background: rgba(0,0,0,0.03); border-color: #ccc; color: var(--parking-text);">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-icons-round" style="font-size:20px;">info</span>
                    <div style="font-size:12px; font-weight:500; line-height:1.4;">
                        ${currentLanguage === 'bg' 
                            ? 'Този паркинг не предлага безплатни часове срещу ползване на градски транспорт.' 
                            : 'This parking does not offer free hours for public transport users.'}
                    </div>
                </div>
            </div>
        `;
    } else {
        // --- ЛОГИКА ЗА ЦАРИГРАДСКО, БЕЛИ ДУНАВ (С ОТСТЪПКИ ЗА ТРАНСПОРТ) ---
        tariffsHtml = `
            <div class="tariff-card green">
                <div style="font-weight:900; font-size:14px; margin-bottom:6px;">${currentLanguage === 'bg' ? 'Тарифа 1 (с билет/карта за пътуване)' : 'Tariff 1 (with travel ticket/card)'}</div>
                <div style="font-size:13px; line-height:1.5;">
                    • Първите 2 часа: <b>БЕЗПЛАТНО</b><br>
                    • След 2-рия час: <b>${overtimeRate} / ч.</b>
                </div>
            </div>

            <div class="tariff-card blue">
                <div style="font-weight:900; font-size:14px; margin-bottom:6px;">${currentLanguage === 'bg' ? 'Тарифа 2 (с абонаментна карта)' : 'Tariff 2 (with subscription card)'}</div>
                <div style="font-size:13px; line-height:1.5;">
                    • В работно време на метрото: <b>БЕЗПЛАТНО</b><br>
                    • Извън работно време: <b>${overtimeRate} / ч.</b>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div class="no-transit-box" style="flex: 1; margin-bottom: 0; padding: 10px;">
                    <div style="font-size: 9px; color: gray; text-transform: uppercase;">${currentLanguage === 'bg' ? 'Почасово:' : 'Hourly:'}</div>
                    <div style="color:#1C75BC; font-size: 16px; font-weight: 800;">${hourlyRate}</div>
                </div>
                <div class="no-transit-box" style="flex: 1; margin-bottom: 0; padding: 10px;">
                    <div style="font-size: 9px; color: gray; text-transform: uppercase;">${currentLanguage === 'bg' ? 'Абонамент:' : 'Monthly:'}</div>
                    <div style="color: var(--parking-text); font-size: 16px; font-weight: 800;">${monthlyRate}</div>
                </div>
            </div>

            <div class="warning-card">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <span class="material-icons-round" style="font-size:20px;">warning</span>
                    <b style="font-size:12px; text-transform:uppercase;">Условия за Park & Ride:</b>
                </div>
                <div style="font-size:12px; font-weight:500; line-height:1.4; padding-left:2px;">
                    • Използвайте документ за транспорт до 30/45 мин. след влизане.<br>
                    • Напуснете до 60 мин. след последното пътуване.
                </div>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="parking-info-row">
            <div style="text-align:center;">
                <div style="color:gray; font-size:11px; font-weight:800; text-transform:uppercase;">${t('parking_free_spaces')}</div>
                <div style="font-size:52px; font-weight:900; color:${freeColor}; line-height:1;">${p.free}</div>
            </div>
            <div style="width:1px; height:45px; background:rgba(128,128,128,0.2);"></div>
            <div style="text-align:left;">
                <div style="display:flex; align-items:center; gap:5px; color:gray; font-weight:bold; font-size:11px; text-transform:uppercase;">
                    <span class="material-icons-round" style="font-size:16px;">access_time</span> ${t('parking_working_time')}
                </div>
                <div style="font-size:18px; font-weight:900; margin-top:4px; color:var(--parking-text);">${workingTime}</div>
            </div>
        </div>

        ${tariffsHtml}

        <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}', '_blank')" 
                style="width:100%; height:58px; background:#1C75BC; color:white; border:none; border-radius:18px; font-weight:900; font-size:16px; cursor:pointer; box-shadow:0 6px 15px rgba(28,117,188,0.4); text-transform:uppercase;">
            ${t('parking_nav_btn')}
        </button>
        <div style="height:30px;"></div>
    `;

    const sheet = document.getElementById('parking-details-sheet');
    sheet.classList.remove('hidden');
    setTimeout(() => { sheet.style.transform = 'translateY(0)'; }, 10);
}

function closeParkingSheet() {
    const sheet = document.getElementById('parking-details-sheet');
    sheet.style.transform = 'translateY(100%)';
    setTimeout(() => { sheet.classList.add('hidden'); }, 300);
}

function setupScrollArrows() {
    const bar = document.getElementById('parking-selection-bar');
    if(!bar) return;
    document.getElementById('parking-scroll-left').onclick = () => bar.scrollBy({ left: -250, behavior: 'smooth' });
    document.getElementById('parking-scroll-right').onclick = () => bar.scrollBy({ left: 250, behavior: 'smooth' });
    bar.onscroll = updateScrollArrowsVisibility;
}

function updateScrollArrowsVisibility() {
    const bar = document.getElementById('parking-selection-bar');
    const left = document.getElementById('parking-scroll-left');
    const right = document.getElementById('parking-scroll-right');
    if(!bar || !left || !right) return;
    left.classList.toggle('hidden', bar.scrollLeft <= 5);
    right.classList.toggle('hidden', bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 5);
}













// --- ФУНКЦИИ ЗА ГЕНЕРИРАНЕ НА ИКОНИ (CANVAS) ---

// 1. Генериране на КАПКА (Teardrop)
function getVehicleHTML(v, color, bearing, mult, style, isRadar) {
    const scale = `transform: scale(${mult});`;
    const badgeHtml = generateReportBadges(v.trip_id, isRadar, v.hasDeviation);
    
    // Ако bearing е null, означава че превозното средство току-що се е появило и нямаме посока
    const isInitialState = (bearing === null);
    const noDirClass = isInitialState ? 'no-direction' : '';
    
    // Ако няма посока, не въртим нищо (0), иначе ползваме изчислената
    const rotation = isInitialState ? 0 : bearing;

    if (style === 'CAPSULE') {
        const arrowOpacity = isInitialState ? 'opacity: 0;' : 'opacity: 1;';
        let iconChar = v.route_type == '0' ? 'tram' : (v.route_type == '1' ? 'subway' : 'directions_bus');
        return `
            <div class="veh-scale-node" style="${scale}">
                <div class="capsule-wrapper" style="background-color: ${color};">
                    <div class="capsule-arrow" style="transform: rotate(${rotation}deg); ${arrowOpacity}"></div>
                    <span class="material-icons-round capsule-icon">${iconChar}</span>
                    <span class="capsule-label">${v.route_name}</span>
                </div>
                ${badgeHtml}
            </div>`;
    } else {
        // TEARDROP
        return `
            <div class="veh-scale-node" style="${scale}">
                <div class="teardrop-wrapper" style="transform: rotate(${rotation}deg);">
                    <div class="teardrop-shape ${noDirClass}" style="background-color: ${color};">
                        <div class="teardrop-label" style="transform: rotate(${-rotation - 135}deg);">${v.route_name}</div>
                    </div>
                </div>
                ${badgeHtml}
            </div>`;
    }
}



let radarTimer = null; 
// Помним статуса на Радара и Трафика
isRadarActive = localStorage.getItem('isRadarActive') === 'true';
isTrafficActive = localStorage.getItem('isTrafficActive') === 'true';







// --- SETTINGS LOGIC ---
// --- SETTINGS LOGIC ---
function setupSettings() {
    // --- 1. DARK MODE TOGGLE ---
    const themeRow = document.getElementById('btn-toggle-theme');
    const themeSwitchVisual = themeRow ? themeRow.querySelector('.theme-switch') : null;

    if (themeRow) {
        if (currentTheme === 'dark') {
            themeSwitchVisual.classList.add('active');
        } else {
            themeSwitchVisual.classList.remove('active');
        }

        themeRow.onclick = () => {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            themeSwitchVisual.classList.toggle('active', newTheme === 'dark');
            saveFullFilters();
        };
    }

    // --- 2. PROXIMITY ALERTS TOGGLE ---
    const proxRow = document.getElementById('btn-toggle-proximity');
    const proxSwitchVisual = document.getElementById('prox-switch-visual');

    if (proxRow && proxSwitchVisual) {
        if (areProximityAlertsEnabled) {
            proxSwitchVisual.classList.add('active');
        } else {
            proxSwitchVisual.classList.remove('active');
        }

        proxRow.onclick = () => {
            areProximityAlertsEnabled = !areProximityAlertsEnabled;
            localStorage.setItem('settings_proximity_alerts', areProximityAlertsEnabled);
            proxSwitchVisual.classList.toggle('active', areProximityAlertsEnabled);
            saveFullFilters();
        };
    }

    // --- 3. СТАНДАРТНИ СЕЛЕКТИ (Sorting, Start Screen, Language) ---
    const selectSorting = document.getElementById('select-sorting');
    if (selectSorting) {
        selectSorting.value = sortingPreference;
        selectSorting.onchange = (e) => {
            sortingPreference = e.target.value;
            localStorage.setItem('sortingPreference', sortingPreference);
            saveFullFilters();
        };
    }

    const selectStart = document.getElementById('select-start-screen');
    if (selectStart) {
        selectStart.value = startScreen;
        selectStart.onchange = (e) => {
            startScreen = e.target.value;
            localStorage.setItem('startScreen', startScreen);
            saveFullFilters();
        };
    }

    const selectLang = document.getElementById('select-language');
    if (selectLang) {
        selectLang.value = currentLanguage;
        selectLang.onchange = (e) => {
            const newLang = e.target.value;
            if (newLang !== currentLanguage) {
                localStorage.setItem('appLanguage', newLang);
                location.reload();
            }
        };
    }

    // --- 4. НОВАТА ЧАСТ: СТИЛ И СЛАЙДЕРИ (В ГРУПА ВИЗУАЛИЗАЦИЯ) ---
    const visualGroup = document.getElementById('group-visual');
    if (visualGroup) {
        // --- А. ИЗБОР НА СТИЛ (ПОСТАВЯ СЕ НАД СЛАЙДЕРИТЕ) ---
        const styleItem = document.createElement('div');
        styleItem.className = 'settings-item';
        styleItem.style.cssText = "flex-direction:column; align-items:stretch; border-bottom:none; padding-top:15px;";
        
        styleItem.innerHTML = `
            <div class="slider-header-row" style="margin-bottom:8px;">
                <span class="slider-label" style="font-size:11px; font-weight:800; color:var(--on-surface-variant); text-transform:uppercase;">${t('settings_vehicle_style')}</span>
            </div>
            <div class="vehicle-style-row">
                <div class="style-select-btn" id="s-teardrop">
                    <div class="teardrop-shape" style="background:#F7941D; transform:rotate(135deg) scale(0.6);">
                        <span style="transform:rotate(-135deg); color:white; font-size:10px; font-weight:900;">27</span>
                    </div>
                    <span class="style-btn-label">${t('style_teardrop')}</span>
                </div>
                <div class="style-select-btn" id="s-capsule">
                    <div class="capsule-wrapper" style="background:#F7941D; border:none; transform:scale(0.8); height:24px; padding:0 8px;">
                        <div class="capsule-arrow" style="transform:rotate(90deg);"></div>
                        <span class="material-icons-round" style="font-size:14px; color:white; margin-right:4px;">tram</span>
                        <span class="capsule-label" style="font-size:12px; color:white; font-weight:900;">27</span>
                    </div>
                    <span class="style-btn-label">${t('style_capsule')}</span>
                </div>
            </div>`;
        
        visualGroup.appendChild(styleItem);

        const btnT = styleItem.querySelector('#s-teardrop');
        const btnC = styleItem.querySelector('#s-capsule');

        const refreshUI = () => {
            const cur = mapFilters.appearance.vehicleStyle;
            btnT.classList.toggle('active', cur === 'TEARDROP');
            btnC.classList.toggle('active', cur === 'CAPSULE');
        };

        const reloadMap = () => {
            if(vehicleLayer) vehicleLayer.clearLayers();
            vehicleMarkersMap.clear();
            if(isRadarActive) fetchGlobalRadarVehicles();
            if(activeRoutesList.length > 0) fetchAndDrawVehicles();
        };

        btnT.onclick = () => { mapFilters.appearance.vehicleStyle = 'TEARDROP'; saveFullFilters(); refreshUI(); reloadMap();

 // ФОРСИРАНЕ НА ОБНОВЯВАНЕТО ВЕДНАГА
    fetchGlobalRadarVehicles(); 
    fetchAndDrawVehicles(); 

		};
        btnC.onclick = () => { mapFilters.appearance.vehicleStyle = 'CAPSULE'; saveFullFilters(); refreshUI(); reloadMap(); 
		
		
		
		
		    // ФОРСИРАНЕ НА ОБНОВЯВАНЕТО ВЕДНАГА
    fetchGlobalRadarVehicles(); 
    fetchAndDrawVehicles(); 
	};
        refreshUI();

// Б. СЛАЙДЕРИ (Синхронизирани)
        const addSliderRow = (label, key, isStop) => {
            // Проверка за дублиране на слайдера
            if (document.querySelector(`.slider-${key}`)) return;

            const div = document.createElement('div');
            div.className = 'settings-item';
            div.style.cssText = "flex-direction:column; align-items:stretch; padding-top:10px; border-top: 1px solid rgba(0,0,0,0.05);";
            
            // ПРЕДАВАМЕ key КАТО 7-ми ПАРАМЕТЪР за синхронизация
            div.appendChild(createSlider(label, 0.5, 1.5, mapFilters.appearance[key], (v) => {
                mapFilters.appearance[key] = v; 
                saveFullFilters();
                if(isStop) {
                    if(typeof iconCache !== 'undefined') iconCache.clear();
                    if(stopMarkersLayer) stopMarkersLayer.clearLayers();
                    visibleMarkers.clear();
                    updateVisibleMarkers();
                } else {
                    // МИГНОВЕНО ОБНОВЯВАНЕ НА ВОЗИЛАТА
                    fetchGlobalRadarVehicles();
                    fetchAndDrawVehicles();
                }
            }, 0.1, key)); 
            visualGroup.appendChild(div);
        };

        addSliderRow(t('filter_size_stops'), 'stopSizeMultiplier', true);
        addSliderRow(t('filter_size_vehicles'), 'vehicleSizeMultiplier', false);
    }

    // --- 5. SHARE BUTTONS ---
    const btnShare = document.getElementById('btn-share-app');
    if (btnShare) {
        btnShare.onclick = () => {
            const modal = document.getElementById('modal-share-options');
            modal.classList.remove('hidden');
            requestAnimationFrame(() => modal.classList.add('active'));
        };
    }
    const btnWeb = document.getElementById('btn-share-web-link');
    if (btnWeb) {
        btnWeb.onclick = () => {
            const url = "https://yordanowz.com/";
            performShare(url, "Sofia Yrd Maps (Web/iOS)");
            closeShareModal();
        };
    }

    // --- 6. AUTO-LOCATE TOGGLE ---
    const autolocateRow = document.getElementById('btn-toggle-autolocate');
    const autolocateSwitchVisual = document.getElementById('autolocate-switch-visual');

    if (autolocateRow && autolocateSwitchVisual) {
        autolocateSwitchVisual.classList.toggle('active', isAutoLocateEnabled);

        autolocateRow.onclick = () => {
            isAutoLocateEnabled = !isAutoLocateEnabled;
            localStorage.setItem('settings_auto_locate', isAutoLocateEnabled);
            autolocateSwitchVisual.classList.toggle('active', isAutoLocateEnabled);
            saveFullFilters();
        };
    }
	

// --- 7. BACKUP & RESTORE LISTENERS (ФИКС) ---
    const btnExport = document.getElementById('btn-trigger-export');
    if (btnExport) {
        btnExport.onclick = (e) => {
            e.preventDefault();
            exportUserData();
        };
    }

    const btnImport = document.getElementById('btn-trigger-import');
    const fileInput = document.getElementById('import-file-input');
    if (btnImport && fileInput) {
        btnImport.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };
        fileInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                importUserData(e.target.files[0]);
            }
        };
    }
}








function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('appTheme', theme);
    
    const icon = document.getElementById('icon-theme-toggle');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if(icon) {
            icon.textContent = 'toggle_on';
            icon.style.color = 'var(--primary)';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if(icon) {
            icon.textContent = 'toggle_off';
            icon.style.color = 'var(--on-surface-variant)';
        }
    }
}

// --- TIMETABLE LOGIC ---
let currentTimetableStop = null;
let currentTimetableData = null;
let currentTimetableTab = 'weekday'; // 'weekday' or 'holiday'

function initTimetable() {
    document.getElementById('btn-back-timetable').onclick = () => {
        document.getElementById('screen-timetable').classList.remove('active');
        document.getElementById('screen-timetable').classList.add('hidden');
        
        // Restore bottom sheet if we came from stop
        if(currentOpenStopId) {
            document.getElementById('bottom-sheet').classList.remove('hidden');
            document.getElementById('bottom-sheet').style.transform = '';
        }
    };

    // Tabs
    document.getElementById('tab-weekday').onclick = () => switchTimetableTab('weekday');
    document.getElementById('tab-holiday').onclick = () => switchTimetableTab('holiday');
    
    // Bind button in bottom sheet
    document.getElementById('btn-timetable').onclick = () => {
        if(currentOpenStopId) {
            const stop = allStopsData.find(s => s.stop_id === currentOpenStopId);
            if(stop && stop.stop_code) {
                openTimetableScreen(stop);
            } else {
                alert("Няма код за тази спирка.");
            }
        }
    };
}




// Добави това в setupActionListeners() или създай initRoutesSheet() и го извикай в началото
// --- SNAP LOGIC ЗА МАРШРУТИТЕ (25%, 50%, 75%, 100%) ---
function initRoutesSheet() {
    const sheet = document.getElementById('routes-sheet');
    const dragZone = document.getElementById('routes-drag-zone');
    const backBtn = document.getElementById('btn-routes-back');

    let startY = 0;
    let startHeight = 0;
    let isDragging = false;

    // Взимане на Y координата (тъч или мишка)
    const getClientY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

    // 1. START
    const onStart = (e) => {
        if (e.target.closest('button')) return; // Игнорираме бутони
        
        isDragging = true;
        startY = getClientY(e);
        startHeight = sheet.offsetHeight; // Текуща височина в пиксели
        
        // ВАЖНО: Слагаме клас dragging, за да спрем CSS анимацията
        sheet.classList.add('dragging');
        
        // Ако има бутони на картата, спираме и тяхната анимация
        const btnGroup = document.getElementById('map-buttons-container');
        if (btnGroup) btnGroup.style.transition = 'none';
    };

    // 2. MOVE
    const onMove = (e) => {
        if (!isDragging) return;
        
        const currentY = getClientY(e);
        const delta = startY - currentY; // Положително = нагоре, Отрицателно = надолу
        
        // Нова височина = Стара + Разлика
        // Ограничаваме: минимум 90px (хедъра), максимум височината на екрана
        let newHeight = Math.max(90, Math.min(window.innerHeight, startHeight + delta));
        
        // Прилагаме веднага (без лаг заради class dragging)
        sheet.style.height = `${newHeight}px`;
        
        // Местим бутоните на картата заедно с панела
        updateMapButtons(newHeight);
        
        if(e.cancelable && e.type === 'touchmove') e.preventDefault();
    };

    // 3. END (SNAPPING LOGIC)
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        // Махаме класа, за да се включи "мазната" анимация (cubic-bezier)
        sheet.classList.remove('dragging');
        
        // Връщаме анимацията на бутоните
        const btnGroup = document.getElementById('map-buttons-container');
        if (btnGroup) btnGroup.style.transition = 'bottom 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)';

        // Логика за залепване (Snapping)
        const currentHeight = sheet.offsetHeight;
        const windowHeight = window.innerHeight;
        const percentage = (currentHeight / windowHeight) * 100;

        let targetVh = 25; // По подразбиране (минимум)

        // Определяме най-близката точка
        if (percentage > 85) targetVh = 100;
        else if (percentage > 60) targetVh = 75;
        else if (percentage > 35) targetVh = 50;
        else targetVh = 25; // Ако е под 35%, отива на 25% (или 90px за заглавието)

        // Ако е много малко (под 15%), го правим минимално (само хедър)
        if (percentage < 15) {
            sheet.style.height = "90px";
            updateMapButtons(90);
        } else {
            sheet.style.height = `${targetVh}vh`;
            // Преизчисляваме пикселите за бутоните
            const pixelHeight = (targetVh / 100) * windowHeight;
            updateMapButtons(pixelHeight);
        }
    };

    // Закачане на слушатели
    dragZone.addEventListener('touchstart', onStart, { passive: false });
    dragZone.addEventListener('mousedown', onStart);

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mousemove', onMove);

    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);

    // Логика за бутона НАЗАД (непроменена)
    backBtn.onclick = (e) => {
        e.stopPropagation();
        document.getElementById('routes-list-content').classList.remove('hidden');
        document.getElementById('routes-details-content').classList.add('hidden');
        backBtn.classList.add('hidden');
        document.getElementById('routes-sheet-title').innerText = "Маршрути";
    };
}








// Помощна функция за "залепване"
function snapSheetTo(percent) {
    const sheet = document.getElementById('routes-sheet');
    const wh = window.innerHeight;
    const targetH = (percent / 100) * wh;
    
    sheet.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    sheet.style.height = (percent <= 15 ? 90 : targetH) + "px";
    updateMapButtons(percent <= 15 ? 90 : targetH);
}




// ФУНКЦИЯ: Показва детайлите на маршрута без да затваря панела
function renderRouteDetails(route) {
    const listContent = document.getElementById('routes-list-content');
    const detailsContent = document.getElementById('routes-details-content');
    const backBtn = document.getElementById('btn-routes-back');
    const title = document.getElementById('routes-sheet-title');
    const sheet = document.getElementById('routes-sheet');

    listContent.classList.add('hidden');
    detailsContent.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    title.innerText = t('details');

    detailsContent.innerHTML = '';
    const leg = route.legs[0];

    leg.steps.forEach(step => {
        const isTransit = step.travel_mode === 'TRANSIT';
        const icon = isTransit ? 'directions_bus' : 'directions_walk';
        const color = isTransit ? '#1c75bc' : '#666';
        
        const div = document.createElement('div');
        div.className = 'list-item-container';
        div.style.padding = '12px';
        div.style.borderLeft = `5px solid ${color}`;
        div.style.marginBottom = '8px';

        div.innerHTML = `
            <div style="display:flex; gap:12px;">
                <span class="material-icons-round" style="color:${color}">${icon}</span>
                <div>
                    <div style="font-size:14px; color:var(--on-surface); font-weight:500;">${step.instructions}</div>
                    <div style="font-size:12px; color:gray; margin-top:4px;">${step.distance.text} • ${step.duration.text}</div>
                </div>
            </div>
        `;
        detailsContent.appendChild(div);
    });

    // Снапваме на 50%, за да се вижда и картата, и началото на инструкциите
    sheet.style.height = "50vh";
    updateMapButtons(window.innerHeight * 0.5);
}
// document.addEventListener('DOMContentLoaded', async () => { ... initRoutesSheet(); ... });


function closeRoutesSheet() {
    const sheet = document.getElementById('routes-sheet');
    sheet.classList.add('hidden');
    sheet.classList.remove('sheet-minimized');
    sheet.style.transform = '';
    
    // 1. Спираме режима
    isGoogleRouteActive = false;
    googleRouteStopIds.clear();

    // 2. Чистим картата
    routeLayer.clearLayers(); 
    vehicleLayer.clearLayers();
    
    // 3. Връщаме нормалните цветове
    updateVisibleMarkers();
	updateMapButtons(0);
    
    document.querySelector('.sheet-actions-row').style.display = 'flex';
}




async function openTimetableScreen(stop) {
	
	// --- НОВО: Забравяме старата избрана линия при отваряне на нова спирка ---
    selectedTimetableLine = null; 
	
    document.getElementById('bottom-sheet').classList.add('hidden');
    
    const screen = document.getElementById('screen-timetable');
    screen.classList.remove('hidden');
    screen.classList.add('active');
    
    document.getElementById('timetable-stop-title').textContent = stop.stop_name;
    
    // ТУК: Ползваме t('code_label')
    document.getElementById('timetable-stop-code').textContent = `${t('code_label')} ${stop.stop_code}`;
    
    const container = document.getElementById('timetable-content');
    container.innerHTML = '<div style="text-align:center; padding:40px;"><span class="rotating material-icons-round">refresh</span></div>';
    
    currentTimetableStop = stop;
    
    try {
        // API Request with Language Header
        const response = await fetch(`${API_BASE_URL}schedule_for_stop/${stop.stop_code}`, { headers: { 'Accept-Language': currentLanguage } });
        currentTimetableData = await response.json();
        switchTimetableTab('weekday');
    } catch(e) {
        container.innerHTML = '<p style="color:red; text-align:center;">Грешка при зареждане на разписанието.</p>';
    }
}


function switchTimetableTab(tab) {
    currentTimetableTab = tab;
    document.querySelectorAll('.tt-tab').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    renderTimetable();
}


function renderTimetable() {
    const container = document.getElementById('timetable-content');
    container.innerHTML = '';
    
    if(!currentTimetableData) return;
    
    const data = currentTimetableData[currentTimetableTab]; 
    
    if(!data || Object.keys(data).length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">Няма курсове за този ден.</p>';
        return;
    }
    
    // Сортиране на линиите
    const sortedLines = Object.keys(data).sort((a,b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 999;
        const numB = parseInt(b.replace(/\D/g, '')) || 999;
        return numA - numB;
    });

    // --- ПОМОЩНИ ФУНКЦИИ ---
    const getLineTypeAndColor = (lineName) => {
        const destinations = data[lineName];
        const firstDestKey = Object.keys(destinations)[0];
        const routeType = destinations[firstDestKey].route_type; 
        
        let typeName = t('bus');
        let color = TRANSPORT_TYPES_CONFIG.BUS.color;

        if (lineName.startsWith('N') || lineName.startsWith('n')) {
            typeName = t('night');
            color = TRANSPORT_TYPES_CONFIG.NIGHT.color;
        } 
        else {
            const rt = String(routeType);
            if (rt === '0') { typeName = t('tram'); color = TRANSPORT_TYPES_CONFIG.TRAM.color; }
            else if (rt === '11') { typeName = t('trolley'); color = TRANSPORT_TYPES_CONFIG.TROLLEY.color; }
            else if (rt === '1' || rt === '2') { typeName = t('metro'); color = TRANSPORT_TYPES_CONFIG.METRO.color; }
        }
        
        return { label: `${typeName} ${lineName}`, color: color };
    };

    // Функция, която оцветява менюто и показва данните
    const applyLineSelection = (lineName) => {
        const info = getLineTypeAndColor(lineName);
        const color = info.color;

        // Оцветяване на селекта
        lineSelect.style.borderColor = color;
        lineSelect.style.color = color;
        lineSelect.style.backgroundColor = color + '15'; 
        
        const arrowColor = encodeURIComponent(color);
        lineSelect.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg fill="${arrowColor}" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`;

        // Рисуване на часовете
        scheduleContainer.innerHTML = '';
        const destinations = data[lineName];
        
        Object.keys(destinations).forEach(dest => {
            const schedule = destinations[dest];
            const times = schedule.times; 
            
            if(times && times.length > 0) {
                const lineCard = document.createElement('div');
                lineCard.className = 'tt-line-container';
                
                lineCard.innerHTML = `
                    <div class="tt-line-header" style="border-left: 5px solid ${color}; background-color: var(--surface);">
                        <span style="font-size:18px; font-weight:800; color:${color}; margin-right:6px;">${lineName}</span> 
                        <span style="font-weight:normal; font-size:14px; color:var(--on-surface);">към ${dest}</span>
                    </div>
                    <div class="tt-grid">
                        ${renderTimeGrid(times)}
                    </div>
                `;
                scheduleContainer.appendChild(lineCard);
            }
        });
    };

    // --- СЪЗДАВАНЕ НА МЕНЮТО ---
    const selectWrapper = document.createElement('div');
    selectWrapper.style.marginBottom = '16px';
    selectWrapper.style.padding = '0 8px';

    const lineSelect = document.createElement('select');
    lineSelect.className = 'settings-select';
    
    // Стилове
    lineSelect.style.width = '100%';
    lineSelect.style.padding = '14px';
    lineSelect.style.fontSize = '16px';
    lineSelect.style.fontWeight = 'bold';
    lineSelect.style.borderRadius = '12px';
    lineSelect.style.border = '2px solid #ccc'; 
    lineSelect.style.background = 'var(--surface)';
    lineSelect.style.color = 'var(--on-surface)';
    lineSelect.style.outline = 'none';
    lineSelect.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    lineSelect.style.appearance = 'none'; 
    lineSelect.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg fill="%23555" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`;
    lineSelect.style.backgroundRepeat = 'no-repeat';
    lineSelect.style.backgroundPosition = 'right 10px center';

    // Дефолт опция
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = t('select_line_hint') || "Избери линия...";
    defaultOption.disabled = true;
    defaultOption.selected = true; 
    lineSelect.appendChild(defaultOption);

    // Пълнене с линиите
    sortedLines.forEach(lineName => {
        const info = getLineTypeAndColor(lineName);
        const option = document.createElement('option');
        option.value = lineName;
        option.text = info.label; 
        
        option.style.color = info.color;
        option.style.fontWeight = 'bold';
        
        lineSelect.appendChild(option);
    });

    selectWrapper.appendChild(lineSelect);
    container.appendChild(selectWrapper);

    const scheduleContainer = document.createElement('div');
    container.appendChild(scheduleContainer);

    // --- ЛОГИКА ЗА СЪБИТИЯТА ---
    
    lineSelect.onchange = (e) => {
        const val = e.target.value;
        // 1. Запазваме избора в глобалната променлива
        selectedTimetableLine = val;
        // 2. Прилагаме го
        applyLineSelection(val);
    };

    // --- АВТОМАТИЧНО ВЪЗСТАНОВЯВАНЕ НА ИЗБОРА ---
    // Проверяваме дали имаме запазена линия И дали тя съществува в текущия ден (делник/празник)
    if (selectedTimetableLine && sortedLines.includes(selectedTimetableLine)) {
        lineSelect.value = selectedTimetableLine; // Нагласяме селекта
        applyLineSelection(selectedTimetableLine); // Показваме разписанието
    }
}


function renderTimeGrid(timesArray) {
    // Group by hour
    const grouped = {};
    timesArray.forEach(t => {
        const [h, m] = t.split(':');
        if(!grouped[h]) grouped[h] = [];
        grouped[h].push(m);
    });
    
    // Sort hours
    const hours = Object.keys(grouped).sort((a,b) => {
        let ha = parseInt(a); let hb = parseInt(b);
        if(ha < 4) ha += 24; if(hb < 4) hb += 24; // Night hours sorting
        return ha - hb;
    });
    
    let html = '';
    hours.forEach(h => {
        html += `
            <div class="tt-hour-row">
                <div class="tt-hour">${h}</div>
                <div class="tt-minutes">
                    ${grouped[h].map(m => `<span class="tt-min">${m}</span>`).join('')}
                </div>
            </div>
        `;
    });
    return html;
}



// --- НОВА ФУНКЦИЯ: Обновява всички разпънати спирки в Любими/Търсене ---
// --- ПОПРАВЕНА ФУНКЦИЯ: Обновява списъците (поддържа и CUSTOM спирки) ---
async function refreshAllExpandedLists() {
    const openItems = document.querySelectorAll('.list-arrivals-content.visible');
    
    if (openItems.length === 0) return;

    openItems.forEach(container => {
        const wrapper = container.closest('.list-item-container');
        if (wrapper) {
            const stopId = wrapper.getAttribute('data-stop-id');
            if (stopId) {
                
                // 1. ПРОВЕРКА ЗА КОМБИНИРАНА СПИРКА
                if (stopId.startsWith('custom_')) {
                    // Намираме данните за групата от глобалния масив
                    const customObj = customStopsData.find(c => c.id === stopId);
                    if (customObj) {
                        // Викаме специалната функция за групи
                        // (Тя вътрешно ще изтегли данните за всички под-спирки)
                        loadCombinedArrivals(customObj, container);
                    }
                } 
                // 2. ОБИКНОВЕНА СПИРКА
                else {
                    loadArrivals(stopId, container, true);
                }
            }
        }
    });
}



// --- 1. MAP ---

function initMap() {
	 if (map) return; 
    map = L.map('map', { zoomControl: false, minZoom: 10 }).setView([42.6977, 23.3219], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    
    // --- ПОДРЕДБА НА СЛОЕВЕТЕ (Z-INDEX) ---
    map.createPane('grayStopsPane');
    map.getPane('grayStopsPane').style.zIndex = 390;
    
    map.createPane('routeShapePane');
    map.getPane('routeShapePane').style.zIndex = 400;
    
    map.createPane('radarPane');
    map.getPane('radarPane').style.zIndex = 650; 

    map.createPane('activeVehiclePane');
    map.getPane('activeVehiclePane').style.zIndex = 800; 
    
    stopMarkersLayer.addTo(map);
    routeLayer.addTo(map);
    vehicleLayer.addTo(map);
    
    if (typeof radarLayer !== 'undefined') radarLayer.addTo(map);





    // Стандартни слушатели
    map.on('moveend', () => {
        updateVisibleMarkers(); 
        if(activeRoutesList.length === 0) triggerBulkStatusCheck(); 
        if (typeof isRadarActive !== 'undefined' && isRadarActive) {
            fetchGlobalRadarVehicles();
        }
    });
    
    map.on('zoomend', () => {
        const zoom = map.getZoom();
        const hint = document.getElementById('zoom-hint');
        if(hint) hint.classList.toggle('visible', zoom < mapFilters.appearance.minZoomStops);
        
        updateVisibleMarkers();
        if (isRadarActive) fetchGlobalRadarVehicles();
    });

    map.on('click', () => {
        if (currentFullLineData) return;
        if (activeRoutesList.length > 0) {
            map.closePopup();
            return;
        }
        if (selectedStopId || currentOpenStopId) {
            deselectStop();
        }
    });
    
    updateRadarZIndex();
     


    map.on('contextmenu', (e) => {
        handleMapLongPress(e.latlng.lat, e.latlng.lng);
    });

    // --- НОВО: ЛОГИКА ЗА УМНО СЛЕДЕНЕ (SMART FOLLOW) ---


// 3. УПРАВЛЕНИЕ НА ФЛАГА ЗА АВТОМАТИЧНО СЛЕДЕНЕ
// (Това е важно, за да можеш да разглеждаш картата без тя да "дърпа" обратно веднага)

if (typeof map !== 'undefined') {
    // Когато пипнеш картата -> спираме следенето
    map.on('mousedown touchstart dragstart', () => {
        if (activeRoutesList.length > 0 || (typeof rideAlongState !== 'undefined' && rideAlongState.active)) {
            isAutoFollowEnabled = false;
            if (typeof userInteractionTimer !== 'undefined' && userInteractionTimer) clearTimeout(userInteractionTimer);
        }
    });

    // Когато пуснеш -> пускаме таймер за възстановяване
    map.on('mouseup touchend dragend moveend', () => {
        if (activeRoutesList.length > 0 || (typeof rideAlongState !== 'undefined' && rideAlongState.active)) {
            if (typeof userInteractionTimer !== 'undefined' && userInteractionTimer) clearTimeout(userInteractionTimer);
            
            // След 10 секунди бездействие, картата пак ще се центрира сама
            userInteractionTimer = setTimeout(() => {
                isAutoFollowEnabled = true;
                if (typeof rideAlongState !== 'undefined' && rideAlongState.active) {
                    updateRideAlongData();
                }
            }, 10000); 
        }
    });
}
// --- 3. УПРАВЛЕНИЕ НА ФЛАГА ЗА АВТОМАТИЧНО СЛЕДЕНЕ ---
// Добави/Провери дали тези редове са в initMap():

// Когато потребителят започне да влачи картата (натискане)
map.on('mousedown touchstart dragstart', () => {
    // Спираме автоматичното движение
    if (activeRoutesList.length > 0 || (typeof rideAlongState !== 'undefined' && rideAlongState.active)) {
        isAutoFollowEnabled = false;
        if (userInteractionTimer) clearTimeout(userInteractionTimer);
    }
});

// Когато потребителят пусне картата (край на местенето)
map.on('mouseup touchend dragend moveend', () => {
    if (activeRoutesList.length > 0 || (typeof rideAlongState !== 'undefined' && rideAlongState.active)) {
        if (userInteractionTimer) clearTimeout(userInteractionTimer);
        
        // След 10 секунди бездействие, възстановяваме следенето
        userInteractionTimer = setTimeout(() => {
            isAutoFollowEnabled = true;
            // Ако сме в RideAlong режим, извикваме обновяване веднага, за да центрираме
            if (typeof rideAlongState !== 'undefined' && rideAlongState.active) {
                updateRideAlongData();
            }
        }, 10000); 
    }
});


// ... (съществуващия код на initMap) ...
    
    // Инициализация на слоя за инциденти
    if (typeof initSocialMapLayer === 'function') {
        initSocialMapLayer();
    }
}

// НОВА ФУНКЦИЯ: Обработка на задържане върху картата
async function handleMapLongPress(lat, lng) {
    // 1. Ако имаме активен стар маркер, го махаме
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }

    // 2. СЪЗДАВАНЕ НА ПИНЧЕ (КАТО В GOOGLE MAPS)
    // Използваме иконата 'place' в червения цвят на Google (#EA4335)
    // Слагаме и сянка (drop-shadow), за да изглежда 3D
    const iconHtml = `
        <div style="display: flex; justify-content: center;">
            <span class="material-icons-round" 
                  style="font-size: 40px; color: #EA4335; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
                place
            </span>
        </div>`;

    const icon = L.divIcon({ 
        className: '', // Махаме стандартните стилове на Leaflet
        html: iconHtml, 
        iconSize: [40, 40],   // Размер на контейнера
        iconAnchor: [20, 40], // ВАЖНО: [X, Y] -> 20 е средата, 40 е дъното (върха на иглата)
        popupAnchor: [0, -40] // Балончето да се отваря над иглата
    });

    // Добавяме маркера с новата икона
    searchMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 2000 }).addTo(map);

    // ... (Останалата част от кода надолу си остава същата) ...
    
    // 3. Запазваме локацията за маршрутизация
    currentSearchedLocation = { lat, lng };

    const input = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('btn-search-clear');
    const routeBtn = document.getElementById('btn-find-routes');
    
    input.value = "Зареждане на адрес...";
    clearBtn.classList.remove('hidden');
    routeBtn.classList.remove('hidden');

    try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        
        if (response.results && response.results[0]) {
            const address = response.results[0].formatted_address;
            input.value = address;
            searchMarker.bindPopup(`<div style="text-align:center; max-width:200px;"><b>${address}</b></div>`, {
                className: 'custom-popup',
                closeButton: false,
                offset: [0, -10]
            }).openPopup();
        } else {
            input.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    } catch (e) {
        console.error("Geocoding failed:", e);
        input.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

// --- ПОМОЩНИ ФУНКЦИИ ЗА МАРШРУТИ ---

// 1. Намира най-близката спирка от твоята база данни спрямо координати от Google
// Helper: Намира най-близкия код на спирка до координати
function findClosestStopCode(lat, lng) {
    if (!allStopsData || allStopsData.length === 0) return null;
    let closest = null;
    let minDist = Infinity;
    const threshold = 0.002; // Около 200 метра

    for (const stop of allStopsData) {
        if (!stop.stop_lat) continue;
        const dLat = stop.stop_lat - lat;
        const dLng = stop.stop_lon - lng;
        
        if (Math.abs(dLat) > threshold || Math.abs(dLng) > threshold) continue;

        const dist = dLat*dLat + dLng*dLng;
        if (dist < minDist) {
            minDist = dist;
            closest = stop;
        }
    }
    return closest ? closest.stop_code : null;
}

// Helper: Пита сървъра за линии между две спирки
async function fetchDirectRoutes(startCode, endCode) {
    try {
        const response = await fetch(`${API_BASE_URL}direct_route/${startCode}/${endCode}`, { 
            headers: { 'Accept-Language': currentLanguage } 
        });
        const data = await response.json();
        return data.direct_routes || [];
    } catch (e) {
        return [];
    }
}



// 2. Пита твоя сървър за всички линии между две спирки
async function fetchDirectRoutes(startCode, endCode) {
    try {
        const response = await fetch(`${API_BASE_URL}direct_route/${startCode}/${endCode}`, { 
            headers: { 'Accept-Language': currentLanguage } 
        });
        const data = await response.json();
        // Връщаме списък с линиите (напр. [{line_name: "M1"}, {line_name: "M4"}])
        return data.direct_routes || [];
    } catch (e) {
        console.warn("Direct route fetch failed:", e);
        return [];
    }
}




async function fetchAllStops() {
    // ПРОМЯНА: Добавяме currentLanguage към ключа на кеша!
    // Така cached_all_stops_v2_strict_bg ще е различно от cached_all_stops_v2_strict_en
    const cacheKey = `cached_all_stops_v2_strict_${currentLanguage}`;
    
    const cachedStops = localStorage.getItem(cacheKey); 
    
    // Ако имаме кеш за ТЕКУЩИЯ език, ползваме го
    if (cachedStops) {
        allStopsData = JSON.parse(cachedStops);
        processUniqueStops(); 
        updateVisibleMarkers();
        return;
    }

    // Ако нямаме, теглим от сървъра
    try {
        const response = await fetch(`${API_BASE_URL}all_stops`, { headers: { 'Accept-Language': currentLanguage } });
        allStopsData = await response.json();
        
        try {
            // Записваме в ключа СЪС езика
            localStorage.setItem(cacheKey, JSON.stringify(allStopsData));
            
            // Опционално: Можем да изчистим кеша на другия език, за да пестим място, 
            // но не е задължително.
        } catch(e) { console.log("Storage full"); }
        
        processUniqueStops();
        updateVisibleMarkers();
    } catch (e) { console.error(e); }
}



// --- ТАЗИ ФУНКЦИЯ ЛИПСВАШЕ ---
function processUniqueStops() {
    const seenKeys = new Set();
    uniqueStopsData = [];

    // 1. СОРТИРАНЕ: Най-важните спирки (с линии) отиват най-отпред
    const sortedData = [...allStopsData].sort((a, b) => {
        const aHasTypes = a.service_types && a.service_types.length > 0;
        const bHasTypes = b.service_types && b.service_types.length > 0;
        
        const aHasCode = a.stop_code && a.stop_code.length > 0;
        const bHasCode = b.stop_code && b.stop_code.length > 0;

        // Даваме точки: 2 за линии, 1 за код
        const scoreA = (aHasTypes ? 2 : 0) + (aHasCode ? 1 : 0);
        const scoreB = (bHasTypes ? 2 : 0) + (bHasCode ? 1 : 0);

        return scoreB - scoreA; 
    });

    // 2. ФИЛТРИРАНЕ И ГРУПИРАНЕ
    sortedData.forEach(stop => {
        // Ако няма линии И няма код -> БОКЛУК (не го добавяме)
        const hasTypes = stop.service_types && stop.service_types.length > 0;
        const hasCode = stop.stop_code && stop.stop_code.length > 0;

        if (!hasTypes && !hasCode) {
            return; 
        }

        // Уникалност по КОД + ИМЕ (Android Logic)
        const codeStr = (stop.stop_code === null || stop.stop_code === undefined) ? "null" : stop.stop_code;
        const key = `${codeStr}-${stop.stop_name.trim()}`;

        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueStopsData.push(stop);
        }
    });
    
    console.log(`Original stops: ${allStopsData.length}, Unique/Cleaned stops: ${uniqueStopsData.length}`);
}

// --- LINES CONTROLLER ---

function initLinesTab() {
    renderTransportSelector();
    fetchAllLines();
    
    // Back button details
    document.getElementById('btn-back-lines').onclick = () => {
        document.getElementById('screen-line-details').classList.remove('active');
        document.getElementById('screen-line-details').classList.add('hidden');
        document.getElementById('screen-lines').classList.remove('hidden');
        document.getElementById('screen-lines').classList.add('active');
    };

    // Action Sheet buttons
    document.getElementById('btn-close-line-action').onclick = closeLineActionSheet;
    
    document.getElementById('btn-action-map').onclick = () => {
        if(!selectedLineData) return;
        closeLineActionSheet();
        showFullLineOnMap(selectedLineData);
    };

    document.getElementById('btn-action-schedule').onclick = () => {
        if(!selectedLineData) return;
        closeLineActionSheet();
        openLineDetailsScreen(selectedLineData);
    };

    // Map controls
    document.getElementById('btn-map-close').onclick = closeFullLineView;
    document.getElementById('btn-map-vehicles').onclick = toggleFullLineVehicles;
}

function renderTransportSelector() {
    const container = document.getElementById('transport-types-row');
    container.innerHTML = '';

    Object.values(TRANSPORT_TYPES_CONFIG).forEach(type => {
        const wrapper = document.createElement('div');
        wrapper.className = `type-icon-wrapper ${type.key === currentTransportType.key ? 'active' : ''}`;
        wrapper.onclick = () => {
            document.querySelectorAll('.type-icon-wrapper').forEach(el => el.classList.remove('active'));
            wrapper.classList.add('active');
            currentTransportType = type;
            renderLinesGrid(); 
        };

        const circle = document.createElement('div');
        circle.className = 'type-icon-circle';
        
        // Махаме Material Icon и слагаме <img> таг
        circle.innerHTML = `<img src="${type.img}" class="type-select-img" alt="${type.label}">`;

        let labelKey = type.key.toLowerCase();
        const labelText = t(labelKey);

        const label = document.createElement('div');
        label.className = 'type-label';
        label.style.color = type.color;
        label.innerText = labelText;

        wrapper.appendChild(circle);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}



async function fetchAllLines() {
    const grid = document.getElementById('lines-grid');
    try {
        const response = await fetch(`${API_BASE_URL}all_lines_structured`, { headers: { 'Accept-Language': currentLanguage } });
        allLinesData = await response.json();
        renderLinesGrid();
    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="color:red; text-align:center;">Грешка при зареждане.</p>';
    }
}

function renderLinesGrid() {
    const grid = document.getElementById('lines-grid');
    grid.innerHTML = '';

    if (allLinesData.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">Зареждане...</p>';
        return;
    }

    let filteredLines = allLinesData.filter(line => {
        let serverType = line.transport_type; 
        return serverType === currentTransportType.key;
    });

    filteredLines.sort((a, b) => {
        const numA = parseInt(a.line_name.replace(/\D/g, '')) || 9999;
        const numB = parseInt(b.line_name.replace(/\D/g, '')) || 9999;
        return numA - numB;
    });

    if(filteredLines.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; padding:20px;">Няма линии от този тип.</p>';
        return;
    }

    filteredLines.forEach(line => {
        const btn = document.createElement('button');
        btn.className = 'line-btn';
        btn.style.backgroundColor = currentTransportType.color;
        btn.innerText = line.line_name;
        
        btn.onclick = () => {
            selectedLineData = line;
            openLineActionSheet(line);
        };

        grid.appendChild(btn);
    });
}


function openLineActionSheet(line) {
    const sheet = document.getElementById('line-action-sheet');
    
    // ПРОМЯНА: Взимаме превода на типа транспорт
    // currentTransportType.key е например 'TRAM', 'BUS'
    const typeKey = currentTransportType.key.toLowerCase(); // 'tram', 'bus'
    const translatedType = t(typeKey); // 'Трамвай' или 'Tram'
    
    document.getElementById('line-action-title').innerText = `${translatedType} ${line.line_name}`;
    
    sheet.classList.remove('hidden');
    requestAnimationFrame(() => { sheet.style.transform = 'translateY(0)'; });
}


function closeLineActionSheet() {
    const sheet = document.getElementById('line-action-sheet');
    sheet.style.transform = ''; 
    sheet.classList.add('hidden');
}

async function openLineDetailsScreen(line) {
    document.getElementById('screen-lines').classList.remove('active');
    document.getElementById('screen-lines').classList.add('hidden');
    
    const detailsScreen = document.getElementById('screen-line-details');
    detailsScreen.classList.remove('hidden');
    detailsScreen.classList.add('active'); 
    
    document.getElementById('line-details-title').innerText = `${t('line_label')} ${line.line_name}`;
    const container = document.getElementById('line-variations-list');
    container.innerHTML = '<div style="text-align:center; padding:40px;"><span class="rotating material-icons-round">refresh</span></div>';

    const routeTypeCode = getRouteTypeCodeInternal(line.transport_type);
    try {
        const variations = await fetch(`${API_BASE_URL}line_details/${line.line_name}/${routeTypeCode}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
        renderVariations(variations, line.line_name);
    } catch(e) {
        container.innerHTML = '<p style="color:red; text-align:center;">Грешка при зареждане.</p>';
    }
}

// Глобална променлива за текущите спирки в детайлния преглед
let currentLineVariationsStops = [];

function renderVariations(variations, lineName) {
    const container = document.getElementById('line-variations-list');
    container.innerHTML = '';

    if(variations.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Няма намерени маршрути.</p>';
        return;
    }

    variations.forEach((variation, vIndex) => {
        // Запазваме спирките за този вариант (за ползване при клик)
        // За простота, ако има само 1 вариация, ще презапишем масива.
        // При повече вариации, ще ползваме уникален индекс.
        currentLineVariationsStops = variation.stops; 

        const startStop = variation.stops[0]?.stop_name || "Start";
        const endStop = variation.stops[variation.stops.length - 1]?.stop_name || "End";

        const card = document.createElement('div');
        card.className = 'variation-card';
        
        card.innerHTML = `
            <div class="variation-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="variation-title">
                    от <strong>${startStop}</strong><br>
                    до <strong>${endStop}</strong>
                </div>
                <span class="material-icons-round variation-expand-icon">expand_more</span>
            </div>
            <div class="variation-content">
                ${renderStaticTimeline(variation.stops)}
            </div>
        `;
        
        container.appendChild(card);
    });
}


function renderStaticTimeline(stops) {
    return stops.map((stop, index) => {
        const uniqueId = `ls-${stop.stop_id}-${index}`;
        
        // Проверяваме дали спирката е любима, за да сложим правилната икона/цвят
        const isFav = favoriteStops.includes(stop.stop_id);
        const starIcon = isFav ? 'star' : 'star_border';
        const starStyle = isFav ? 'color: #FFD700;' : ''; // Златисто ако е любима

        return `
            <div class="line-detail-row-wrapper" id="row-${uniqueId}">
                <div class="static-timeline-item" onclick="expandLineStop('${stop.stop_id}', '${uniqueId}')">
                    
                    <div class="static-timeline-line"></div>
                    <div class="static-timeline-dot"></div>
                    
                    <div class="static-stop-info">
                        <div class="static-stop-name">${stop.stop_name}</div>
                        <div class="static-stop-code">${stop.stop_code || ''}</div>
                    </div>

                    <span class="material-icons-round static-expand-icon" id="expand-icon-${uniqueId}">expand_more</span>

                    <!-- НОВ БУТОН ЗА ЛЮБИМИ -->
                    <button class="icon-btn inline-map-btn" onclick="event.stopPropagation(); window.toggleStopFavFromLine('${stop.stop_id}', this)">
                        <span class="material-icons-round" style="${starStyle}">${starIcon}</span>
                    </button>

                    <!-- БУТОН ЗА КАРТА -->
                    <button class="icon-btn inline-map-btn" onclick="event.stopPropagation(); locateFromFav('${stop.stop_id}')">
                        <span class="material-icons-round">map</span>
                    </button>
                </div>

                <div class="line-detail-actions" id="actions-${uniqueId}"></div>
                <div class="list-arrivals-content" id="arrivals-${uniqueId}"></div>
            </div>
        `;
    }).join('');
}

// --- MAP FULL LINE LOGIC ---
async function showFullLineOnMap(line) {
    document.querySelector('[data-target="screen-map"]').click();
    
    document.getElementById('map-search-container').classList.add('hidden');
    document.getElementById('map-line-controls').classList.remove('hidden');
     document.getElementById('map-line-title').innerText = `${t('line_label')} ${line.line_name}`;
    
    isShowingVehiclesOnMap = false;
    updateVehicleBtnState();

    activeRoutesList = [];
    currentLineShapes = []; // <--- НОВО: Нулираме формите
    
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();
    stopMarkersLayer.clearLayers(); 
    visibleMarkers.clear();         
    
    if(fullLineVehicleTimer) clearInterval(fullLineVehicleTimer);

    currentFullLineData = line; 
    const routeTypeCode = getRouteTypeCodeInternal(line.transport_type);

    try {
        const variations = await fetch(`${API_BASE_URL}line_details/${line.line_name}/${routeTypeCode}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
        
        if(!variations || variations.length === 0) {
            alert("Няма маршрут за тази линия.");
            closeFullLineView();
            return;
        }

        const bounds = L.latLngBounds([]);
        
        variations.forEach(variation => {
             if (variation.stops.length > 0) {
                 const shape = variation.shape.map(pt => [pt[0], pt[1]]);
                 
                 // <--- НОВО: Запазваме формата за изчисление на ъглите
                 currentLineShapes.push(shape); 
                 
                 const color = getTransportColor(routeTypeCode, line.line_name); 
                 
                 L.polyline(shape, { color: color, weight: 5, opacity: 0.8 }).addTo(routeLayer);
                 
                 variation.stops.forEach(stop => {
                     const html = `<div class="stop-circle-blue" style="border-color: white; background-color: ${color}"></div>`;
                     const icon = L.divIcon({ className: '', html: html, iconSize: [14, 14], iconAnchor: [7, 7] });
                     const marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: icon, zIndexOffset: 500 }).addTo(routeLayer);
                     
                     marker.bindPopup(`
                        <div class="stop-tooltip-container">
                            <span class="stop-tooltip-title">${stop.stop_name}</span>
                            <span class="stop-tooltip-code">${stop.stop_code || ''}</span>
                        </div>`, 
                        { className: 'custom-popup', closeButton: false }
                     );
                     bounds.extend([stop.stop_lat, stop.stop_lon]);
                 });
             }
        });
        map.fitBounds(bounds, {padding: [50, 50]});
    } catch(e) {
        console.error(e);
        alert("Грешка при зареждане.");
        closeFullLineView();
    }
}



function closeFullLineView() {
    document.getElementById('map-line-controls').classList.add('hidden');
    document.getElementById('map-search-container').classList.remove('hidden');
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();
    currentFullLineData = null;
    if(fullLineVehicleTimer) clearInterval(fullLineVehicleTimer);
    updateVisibleMarkers();
}

function updateVehicleBtnState() {
    const btn = document.getElementById('btn-map-vehicles');
    if(isShowingVehiclesOnMap) {
        btn.classList.remove('bg-surface');
        btn.classList.add('bg-active');
    } else {
        btn.classList.remove('bg-active');
        btn.classList.add('bg-surface');
    }
}

function toggleFullLineVehicles() {
    if(!currentFullLineData) return;
    isShowingVehiclesOnMap = !isShowingVehiclesOnMap;
    updateVehicleBtnState();
    if(isShowingVehiclesOnMap) {
        fetchFullLineVehicles(); 
        fullLineVehicleTimer = setInterval(fetchFullLineVehicles, 5000); 
    } else {
        if(fullLineVehicleTimer) clearInterval(fullLineVehicleTimer);
        vehicleLayer.clearLayers(); 
    }
}


async function fetchFullLineVehicles() {
    if(!currentFullLineData) return;
    try {
        const vehicles = await fetch(`${API_BASE_URL}vehicles_for_routes/${currentFullLineData.line_name}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
        vehicleLayer.clearLayers(); 
        
        const targetType = getRouteTypeCodeInternal(currentFullLineData.transport_type);
        const color = getTransportColor(targetType, currentFullLineData.line_name);

        vehicles.forEach(v => {
            if(String(v.route_type) === String(targetType)) {
                
                // 1. Изчисляваме ъгъла спрямо най-близкия сегмент от маршрута
                // Използваме запазените форми в currentLineShapes
                const heading = getBestHeading(v.latitude, v.longitude, currentLineShapes);
                
                const iconHtml = `
                    <div class="vehicle-marker-wrapper" style="transform: rotate(${heading}deg);">
                        <!-- Човката (зелена от CSS) -->
                        <div class="vehicle-direction-arrow"></div>
                        <!-- Кръгчето се завърта обратно, за да е числото право -->
                        <div class="vehicle-circle-number" style="background-color: ${color}; transform: rotate(-${heading}deg);">
                            ${v.route_name}
                        </div>
                    </div>`;
                
                const icon = L.divIcon({ 
                    className: '', 
                    html: iconHtml, 
                    iconSize: [40, 40], 
                    iconAnchor: [20, 20] 
                });
                
                L.marker([v.latitude, v.longitude], {icon: icon, zIndexOffset: 1000})
                 .bindPopup(`<b>Курс към:</b><br>${v.destination}`)
                 .addTo(vehicleLayer);
            }
        });
    } catch(e) { console.error("Error fetching vehicles", e); }
}

function getRouteTypeCodeInternal(serverType) {
    switch(serverType) {
        case 'METRO': return '1';
        case 'TRAM': return '0';
        case 'TROLLEY': return '11';
        default: return '3'; 
    }
}

// --- MARKER INTERACTION ---

function createMarker(stop) {
    const isFav = favoriteStops.includes(stop.stop_id);
    const marker = L.marker([stop.stop_lat, stop.stop_lon], { 
        // --- ПРОМЯНАТА Е ТУК ---
        icon: createIcon(getIconFileName(stop), false, isFav) 
    });
    marker.on('click', (e) => handleMarkerClick(stop, e));
    return marker;
}


async function handleMarkerClick(stop, e) {
    L.DomEvent.stopPropagation(e);

    // 1. Режим "Избор на спирки" (Custom Creator)
    if (isCustomStopSelectionMode) {
        toggleStopInSelection(stop);
        return;
    }

    // 2. Режим "Пълен преглед на линия" (Static Map)
    if (currentFullLineData) {
        map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: true });
        return;
    }

    // 3. --- ЛОГИКА ЗА АКТИВНИ МАРШРУТИ ---
    if (activeRoutesList.length > 0) {
        // Търсим маршрут, който съдържа тази спирка
        let targetRoute = activeRoutesList.find(r => r.tripId === focusedRouteTripId && r.stops.some(s => s.stop_id === stop.stop_id));
        if (!targetRoute) {
            targetRoute = activeRoutesList.find(r => r.stops.some(s => s.stop_id === stop.stop_id));
        }

        if (targetRoute) {
            // =================================================
            // СЛУЧАЙ А: RIDE ALONG (ПРОСЛЕДЯВАНЕ НА ЖИВО)
            // =================================================
            if (targetRoute.isRideAlong) {
                // Тук всичко работи, не го пипаме
                if (String(selectedStopId) === String(stop.stop_id)) {
                    openStopSheet(stop); // Втори клик
                } else {
                    selectRideAlongStop(stop.stop_id); // Първи клик
                }
                return;
            }

            // =================================================
            // СЛУЧАЙ Б: СТАНДАРТЕН МАРШРУТ (NORMAL ROUTE VIEW)
            // =================================================
            
            // 1. Проверка за ВТОРИ клик (Отваряне на разписанието)
            if (String(selectedStopId) === String(stop.stop_id)) {
                openStopSheet(stop);
                return;
            }

            // 2. Първи клик (Маркиране на спирката)
            console.log(`>> Standard route focus change: ${stop.stop_name}`);
            
            // Нагласяме променливите
            focusedRouteTripId = targetRoute.tripId;
            targetRoute.originStopId = stop.stop_id;
            selectedStopId = stop.stop_id;
            
            // Спираме всякакви автоматики, защото това е ръчен режим
            targetRoute.trackedVehicleId = null;
            targetRoute.lastNextStopId = null;
            isAutoFollowEnabled = false;

            // 3. ОБНОВЯВАМЕ ВИЗИЯТА ВЕДНАГА (за да излезе голямата икона и балончето)
            renderRouteChips();      
            redrawAllActiveRoutes(); // Това прави иконата голяма
            
            // Местим картата
            map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: true });
            
            // Показваме балончето (вече има голяма икона, към която да се закачи)
            selectStopWithTooltip(stop);
            
            // 4. ТЕГЛИМ ДАННИТЕ НА ЗАДЕН ПЛАН
            // Не слагаме await, за да не блокираме интерфейса
            activeRouteArrivalsMap.clear();
            updateRouteArrivals(targetRoute).then(() => {
                fetchAndDrawVehicles(); // Рисуваме автобусите като дойдат данните
            });
            
            return; 
        }
    }

    // 4. Стандартна логика (Клик на спирка без маршрут)
    selectedStopId = stop.stop_id;
    updateVisibleMarkers(); 
    map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: true });
    openStopSheet(stop);
}

function selectStopWithTooltip(stop) {
    selectedStopId = stop.stop_id;
    
    // Обновяваме маркерите (за да светне избрания)
    updateVisibleMarkers();
    
    // Ако има маршрути, прерисуваме ги, за да се покаже голямата точка на избраната спирка
    if(activeRoutesList.length > 0) {
        redrawAllActiveRoutes();
    }

    // 1. Опитваме се да намерим маркера в стандартния слой
    let marker = visibleMarkers.get(stop.stop_id);
    
    // 2. Ако го няма (напр. при Zoom Out), търсим в слоя на маршрута (routeLayer)
    if (!marker && activeRoutesList.length > 0) {
        routeLayer.eachLayer(layer => {
            // Проверка дали слоят е маркер и дали е на същата позиция
            if (layer instanceof L.Marker) {
                const latLng = layer.getLatLng();
                // Сравняваме координатите (с малък толеранс за всеки случай)
                if (latLng.lat === stop.stop_lat && latLng.lng === stop.stop_lon) {
                    marker = layer;
                }
            }
        });
    }

    // Подготовка на HTML съдържанието
    const stopCodeText = stop.stop_code ? `(${stop.stop_code})` : '';
    const content = `
        <div class="stop-tooltip-container" onclick="window.openStopSheetFromPopup('${stop.stop_id}')">
            <span class="stop-tooltip-title">${stop.stop_name} <span class="stop-tooltip-code">${stopCodeText}</span></span>
            <span class="stop-tooltip-hint">(натисни за повече информация)</span>
        </div>`;

    if (marker) {
        // ВАРИАНТ А: Имаме маркер - закачаме балончето за него
        marker.unbindPopup();
        marker.bindPopup(content, { 
            closeButton: false, 
            offset: [0, -5], 
            autoPan: true, 
            className: 'custom-popup'
        }).openPopup();
    } else {
        // ВАРИАНТ Б (FIX): Няма маркер (заради Zoom Out) - отваряме балонче директно на картата
        L.popup({
            closeButton: false,
            offset: [0, -5],
            autoPan: true,
            className: 'custom-popup'
        })
        .setLatLng([stop.stop_lat, stop.stop_lon])
        .setContent(content)
        .openOn(map);
    }
}



// --- MARKERS RENDER ---
function updateVisibleMarkers() {
    // 1. Основни проверки
    if (!map || allStopsData.length === 0) return;
    if (currentFullLineData) return; // Не пипаме, ако сме отворили маршрут на цяла линия

    // 2. Проверка дали слоят е включен от филтрите
    if (!mapFilters.stops.enabled) {
        stopMarkersLayer.clearLayers();
        visibleMarkers.clear();
        return;
    }

    // 3. ЗАЩИТЕНА ПРОВЕРКА ЗА ZOOM
    // Взимаме настройката от слайдера. Ако е счупена (undefined/null), ползваме 15.
    const safeMinZoom = (mapFilters.appearance && mapFilters.appearance.minZoomStops) 
                        ? mapFilters.appearance.minZoomStops 
                        : 15;
    
    const currentZoom = map.getZoom();

    // Ако сме твърде далеч -> крием всичко и спираме
    if (currentZoom < safeMinZoom) { 
        stopMarkersLayer.clearLayers(); 
        visibleMarkers.clear(); 
        return; 
    }
    
    const bounds = map.getBounds();
    
    // 4. Филтриране на спирките (по Видимост и по Тип)
    const stopsToShow = allStopsData.filter(stop => {
        // А) Дали е в екрана на картата
        const isInBounds = (stop.stop_lat && stop.stop_lon && bounds.contains(L.latLng(stop.stop_lat, stop.stop_lon))) || stop.stop_id === selectedStopId;
        if (!isInBounds) return false;

        // Б) Филтър по ТИП (Метро, Автобус и т.н.)
        if (!stop.service_types || stop.service_types.length === 0) return true;

        const matchesFilter = stop.service_types.some(type => {
            let checkKey = type;
            if (type === 'subway') checkKey = 'METRO';
            // Проверка в mapFilters
            return mapFilters.stops.types[checkKey] === true;
        });

        return matchesFilter;
    });
    
    // 5. Синхронизация с картата (Добавяне/Премахване)
    const newVisibleIds = new Set(stopsToShow.map(s => s.stop_id));
    const allActiveRouteStopIds = new Set();
    
    // Ако има активен маршрут, пазим спирките му да не се трият от тази функция
    activeRoutesList.forEach(route => route.stops.forEach(s => allActiveRouteStopIds.add(s.stop_id)));

    // А) Премахване на излишните
    for (const [id, marker] of visibleMarkers) {
        if (!newVisibleIds.has(id)) {
            stopMarkersLayer.removeLayer(marker);
            visibleMarkers.delete(id);
        } else if (activeRoutesList.length > 0 && allActiveRouteStopIds.has(id) && id !== selectedStopId) {
            // Ако спирката е част от активен маршрут, я оставяме на маршрутния слой, махаме я от тук
            stopMarkersLayer.removeLayer(marker);
            visibleMarkers.delete(id);
        }
    }

    // Б) Добавяне/Обновяване на новите
    stopsToShow.forEach(stop => {
        // Пропускаме, ако спирката се рисува от активния маршрут
        if (activeRoutesList.length > 0 && allActiveRouteStopIds.has(stop.stop_id) && stop.stop_id !== selectedStopId) return;
        
        let marker = visibleMarkers.get(stop.stop_id);
        if (marker) {
            updateMarkerStyle(marker, stop);
        } else {
            marker = createMarker(stop); // Тук се вика createMarker, който ползва createIcon
            marker.addTo(stopMarkersLayer);
            visibleMarkers.set(stop.stop_id, marker);
            updateMarkerStyle(marker, stop);
        }
    });
    
    // Обновяваме тикчетата, ако сме в режим на избиране (Custom Stop Creator)
    refreshMapSelectionVisuals();
}

// В script.js
function createIcon(fileName, isSelected, isFavorite, isCustom) { 
    const styleMode = mapFilters.appearance.style; 
    // Взимаме множителя за размер от настройките
    const stopMult = mapFilters.appearance.stopSizeMultiplier || 1.0;
    
    const key = `${fileName}_${isSelected}_${isFavorite}_${isCustom}_${styleMode}_${stopMult}`;
    
    if (iconCache.has(key)) return iconCache.get(key);
    
    let htmlContent = '';
    let size = (isSelected ? 38 : 28) * stopMult; // Прилагаме мащаба
    let anchor = size / 2;

    // Подготовка на значките (Звезда и Група)
    const badgeClass = (styleMode === 'SIMPLE' && !isSelected) ? 'marker-fav-star simple-badge-adjust' : 'marker-fav-star';
    const groupBadgeClass = (styleMode === 'SIMPLE' && !isSelected) ? 'marker-custom-badge simple-badge-adjust' : 'marker-custom-badge';

    // Динамичен стил за размерите на значките спрямо мащаба
    const badgeStyle = `width: ${18 * stopMult}px; height: ${18 * stopMult}px; font-size: ${13 * stopMult}px;`;

    const starHtml = isFavorite 
        ? `<span class="material-icons-round ${badgeClass}" style="${badgeStyle}">star</span>` 
        : '';

    const customHtml = isCustom
        ? `<span class="material-icons-round ${groupBadgeClass}" style="${badgeStyle}">merge_type</span>`
        : '';

    // Генериране на съдържанието
    if (styleMode === 'SIMPLE' && !isSelected) {
        size = 14 * stopMult; 
        anchor = size / 2;
        
        htmlContent = `
            <div class="map-marker-wrapper">
                <div class="stop-marker-simple" style="width:${size}px; height:${size}px;"></div>
                ${starHtml}
                ${customHtml}
            </div>
        `;
    } 
    else {
        const wrapperClass = isSelected ? 'map-marker-wrapper selected' : 'map-marker-wrapper';
        
        htmlContent = `
            <div class="${wrapperClass}" style="width:${size}px; height:${size}px;">
                <img src="${fileName}" class="map-marker-img" style="width:100%; height:100%;">
                ${starHtml}
                ${customHtml}
            </div>
        `;
    }
    
    const icon = L.divIcon({ 
        className: '', 
        html: htmlContent,
        iconSize: [size, size], 
        iconAnchor: [anchor, anchor], 
        popupAnchor: [0, -anchor] 
    });

    iconCache.set(key, icon); 
    return icon;
}

let cachedGrayIcon = null;
function getGrayIcon() { 
    if (!cachedGrayIcon) cachedGrayIcon = L.divIcon({ className: '', html: '<div class="stop-circle-gray"></div>', iconSize: [12, 12], iconAnchor: [6, 6] }); 
    return cachedGrayIcon; 
}


function updateMarkerStyle(marker, stop) {
    const isSelected = (stop.stop_id === selectedStopId);
    const isFav = favoriteStops.includes(stop.stop_id);
    
    // --- НОВО: Проверка дали спирката участва в някоя група ---
    // customStopsData е глобалният масив с групите
    const isCustom = customStopsData.some(group => group.subStops.includes(stop.stop_id));
    // -----------------------------------------------------------

    let opacity = 1.0; 

    // Проверка за прозрачност (ако няма данни на живо)
    const status = stopsStatusCache[stop.stop_code];
    if (status) {
        const validArrivals = Array.isArray(status) ? status.filter(a => a.eta_minutes <= MAX_ARRIVAL_MINUTES) : [];
        if (validArrivals.length === 0) opacity = 0.4; 
    }

    // Логика за "сивите" спирки (когато има активен маршрут и спирката не е част от него)
    const isGrayMode = (activeRoutesList.length > 0 && !isSelected) || 
                       (isGoogleRouteActive && !googleRouteStopIds.has(stop.stop_id) && !isSelected);

    if (isGrayMode) { 
        marker.setIcon(getGrayIcon());
        marker.setOpacity(opacity);
        marker.setZIndexOffset(0);

        if (marker.options.pane !== 'grayStopsPane') {
            stopMarkersLayer.removeLayer(marker);
            marker.options.pane = 'grayStopsPane';
            stopMarkersLayer.addLayer(marker);
        }
        return; 
    }

    // Връщане в нормален режим (markerPane)
    if (marker.options.pane !== 'markerPane') {
        stopMarkersLayer.removeLayer(marker);
        marker.options.pane = 'markerPane';
        stopMarkersLayer.addLayer(marker);
    }

    // Определяне на вида икона (автобус, трамвай и т.н.)
    let forceRouteType = null;
    if (activeRoutesList.length > 0) {
        const activeRoute = activeRoutesList.find(r => r.stops.some(s => s.stop_id === stop.stop_id));
        if (activeRoute) forceRouteType = activeRoute.routeType;
    }

    const iconUrl = getIconFileName(stop, forceRouteType);
    
    // --- ПРОМЯНАТА Е ТУК: Подаваме isCustom като 4-ти аргумент ---
    const newIcon = createIcon(iconUrl, isSelected, isFav, isCustom);
    
    if (marker.options.icon !== newIcon) {
        marker.setIcon(newIcon);
    }

    marker.setOpacity(isSelected ? 1.0 : opacity);
    
    // Z-Index: Селектираните са най-горе (1000), Любимите и Групите са под тях (500), Обикновените най-долу (0)
    marker.setZIndexOffset(isSelected ? 1000 : (isFav || isCustom ? 500 : 0)); 
}


function triggerBulkStatusCheck() {
    // Използваме настройките за СПИРКИ, за да не теглим данни, ако не се виждат
    if (map.getZoom() < mapFilters.appearance.minZoomStops) return;
    
    clearTimeout(bulkFetchTimeout);
    bulkFetchTimeout = setTimeout(async () => {
        const visibleStopCodes = Array.from(visibleMarkers.keys())
            .map(id => allStopsData.find(s => s.stop_id === id)?.stop_code)
            .filter(c => c);
            
        if (visibleStopCodes.length === 0) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}bulk_detailed_arrivals`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLanguage
                }, 
                body: JSON.stringify({ stop_codes: visibleStopCodes }) 
            });
            
            if (!response.ok) return;
            const newData = await response.json();
            
            let hasChanges = false;
            visibleStopCodes.forEach(code => {
                const newArrivals = newData[code] || [];
                const oldArrivals = stopsStatusCache[code];
                if (JSON.stringify(newArrivals) !== JSON.stringify(oldArrivals)) {
                    stopsStatusCache[code] = newArrivals;
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                saveStatusCache();
                updateVisibleMarkers();
            }
            
        } catch (e) {}
    }, BULK_CHECK_DEBOUNCE_MS);
}
// --- AUTO REFRESH ---

function checkAndManageTimers() {
    // Проверяваме дали има ОТВОРЕНА спирка в списъците
    const hasExpandedListItems = document.querySelectorAll('.list-arrivals-content.visible').length > 0;

    // Таймерът трябва да работи ако:
    // 1. Има отворена спирка на картата (currentOpenStopId)
    // 2. ИЛИ има активен маршрут
    // 3. ИЛИ има разпъната спирка в Любими/Търсене
    const shouldRefreshData = (currentOpenStopId !== null) || 
                              (activeRoutesList.length > 0) || 
                              hasExpandedListItems;

    if (shouldRefreshData) {
        if (!dataRefreshTimer) {
            console.log(">>> Starting Auto-Refresh Timer");
            performAutoRefresh(); // Извикваме веднъж веднага
            dataRefreshTimer = setInterval(performAutoRefresh, DATA_REFRESH_INTERVAL); // 5000ms
        }
    } else {
        if (dataRefreshTimer) {
            console.log(">>> Stopping Auto-Refresh Timer");
            clearInterval(dataRefreshTimer);
            dataRefreshTimer = null;
        }
    }
}



async function performAutoRefresh() {
    // 1. Обновяване на спирката от КАРТАТА (Bottom Sheet)
    if (currentOpenStopId) {
        const container = document.getElementById('sheet-arrivals-list');
        // Проверка дали контейнерът е видим, за да не правим излишни заявки
        if (container && !document.getElementById('bottom-sheet').classList.contains('hidden')) {
            await loadArrivals(currentOpenStopId, container, true);
        }
    }

    // 2. Обновяване на активните МАРШРУТИ
    if (activeRoutesList.length > 0) {
        for (const route of activeRoutesList) {
            await updateRouteArrivals(route);
        }
        fetchAndDrawVehicles();
    }

    // 3. НОВО: Обновяване на списъците (Любими / Търсене / Линии)
    await refreshAllExpandedLists();
	// НОВО: Проверка на алармите
    if (typeof checkActiveAlarmsLoop === "function") {
        checkActiveAlarmsLoop();
    }
}



// --- ROUTE LOGIC (OLD ARRIVALS CLICK) ---
async function showRouteOnMap(arrival, overrideStopId = null, focusVehicle = false) {
    const tripId = arrival.trip_id;
    const routeName = arrival.route_name;
    const routeType = arrival.route_type;
    
    let originStopId = overrideStopId || currentOpenStopId || arrival.stop_id;

    // Ресет на глобалното следене
    isAutoFollowEnabled = true; 
    if (userInteractionTimer) clearTimeout(userInteractionTimer);
    
    // Ако маршрутът вече е активен -> сменяме фокуса
    if (activeRoutesList.some(r => r.tripId === tripId)) { 
        document.querySelector('[data-target="screen-map"]').click();
        
        const existingRoute = activeRoutesList.find(r => r.tripId === tripId);
        
        if (focusVehicle) {
             shouldAutoCenterVehicle = true; 
             isAutoFollowEnabled = true;
             focusedRouteTripId = tripId;
             existingRoute.trackedVehicleId = tripId; 
             fetchAndDrawVehicles();         
        } 
        else if(originStopId) {
             existingRoute.originStopId = originStopId;
             selectedStopId = originStopId;
             isAutoFollowEnabled = false;
             existingRoute.trackedVehicleId = null; 
             
             // Ресетваме паметта, за да не прескочи веднага
             existingRoute.lastNextStopId = null;

             redrawAllActiveRoutes();
             await updateRouteArrivals(existingRoute);
             fetchAndDrawVehicles();
             
             const stop = allStopsData.find(s => s.stop_id === originStopId);
             if(stop) {
                 map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: true });
                 selectStopWithTooltip(stop);
             }
        }
        return; 
    }
    
    if (activeRoutesList.length >= MAX_ACTIVE_ROUTES) activeRoutesList.shift();

    closeModal();
    closeBottomSheet();
    document.querySelector('[data-target="screen-map"]').click();
    document.getElementById('active-routes-container').classList.remove('hidden');

    try {
        const [shapeData, stopsData] = await Promise.all([
            fetch(`${API_BASE_URL}shape/${tripId}`).then(r => r.json()),
            fetch(`${API_BASE_URL}stops_for_trip/${tripId}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json())
        ]);

        let correctOriginId = originStopId;
        if (originStopId) {
             const exists = stopsData.find(s => s.stop_id === originStopId);
             if (!exists) {
                 const originalStop = allStopsData.find(s => s.stop_id === originStopId);
                 if (originalStop) {
                     const match = stopsData.find(s => s.stop_code === originalStop.stop_code);
                     if (match) correctOriginId = match.stop_id;
                 }
             }
        }
        if (!correctOriginId && stopsData.length > 0) correctOriginId = stopsData[0].stop_id;

        const newRoute = { 
            tripId, 
            routeName, 
            routeType, 
            originStopId: correctOriginId, 
            shape: shapeData, 
            stops: stopsData, 
            color: getTransportColor(routeType, routeName),
            trackedVehicleId: focusVehicle ? tripId : null,
            
            // ВАЖНО: Памет за последната спирка на автобуса (за този маршрут)
            lastNextStopId: null 
        };
        
        activeRoutesList.push(newRoute);
        
        if (!focusVehicle) selectedStopId = correctOriginId;
        focusedRouteTripId = tripId;
        
        updateRadarZIndex();
        checkAndManageTimers();

        await updateRouteArrivals(newRoute);
        renderRouteChips();
        redrawAllActiveRoutes();
        updateVisibleMarkers();
        
        const stopObj = allStopsData.find(s => s.stop_id === correctOriginId);
        
        if (focusVehicle) {
            shouldAutoCenterVehicle = true; 
            isAutoFollowEnabled = true;
        } else {
            if(stopObj) {
                map.setView([stopObj.stop_lat, stopObj.stop_lon], 17, { animate: true });
                selectStopWithTooltip(stopObj);
                isAutoFollowEnabled = false; 
            }
        }

        fetchAndDrawVehicles();
        if (routeVehicleTimer) clearInterval(routeVehicleTimer);
        routeVehicleTimer = setInterval(fetchAndDrawVehicles, VEHICLE_MOVE_INTERVAL);
        
    } catch (e) { console.error(e); }
}

function redrawAllActiveRoutes() {
    routeLayer.clearLayers();
    
    const sortedRoutes = [...activeRoutesList].sort((a, b) => {
        if (a.tripId === focusedRouteTripId) return 1;
        if (b.tripId === focusedRouteTripId) return -1;
        return 0;
    });
    
    sortedRoutes.forEach(route => {
        const isFocused = (route.tripId === focusedRouteTripId) || route.isFullLineFilter;
        const weight = isFocused ? 8 : 5;
        const opacity = isFocused ? 0.9 : 0.5;
        
        if (route.shape && route.shape.length > 0) {
            L.polyline(route.shape, { color: route.color, weight, opacity, pane: 'routeShapePane' }).addTo(routeLayer);
        }

        if (route.deviationPath && route.deviationPath.length > 0) {
            L.polyline(route.deviationPath, {
                color: '#D50000', weight: weight, opacity: 0.9,
                dashArray: '12, 12', className: 'deviation-path-line', pane: 'routeShapePane'
            }).addTo(routeLayer);
        }
        
        route.stops.forEach(stop => {
            if(!stop.stop_lat) return;
            
            const isSelected = (stop.stop_id === selectedStopId);
            const isFav = favoriteStops.includes(stop.stop_id);
            const isCustom = customStopsData.some(group => group.subStops.includes(stop.stop_id));
            
            if (isSelected) {
                const icon = createIcon(getIconFileName(stop, route.routeType), true, isFav, isCustom);
                const marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: icon, zIndexOffset: 9000 }).addTo(routeLayer);
                marker.on('click', (e) => handleMarkerClick(stop, e)); 
            } else {
                const html = `<div class="stop-circle-blue" style="border-color: white; background-color: #3388ff; width:14px; height:14px; border-width:2px; transform:none; border-radius:50%; box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`;
                const icon = L.divIcon({ className: '', html: html, iconSize:[14, 14], iconAnchor:[7, 7] });
                const marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: icon, zIndexOffset: 8000, opacity: isFocused ? 1.0 : 0.6 }).addTo(routeLayer);
                marker.on('click', (e) => handleMarkerClick(stop, e)); 
            }
        });
    });
}


async function changeRouteFocus(stop, shouldOpenSheet = true) {
    selectedStopId = stop.stop_id;
    if (shouldOpenSheet) openStopSheet(stop);
    
    let affected = false;
    let newFocusId = null; // Тук ще запазим ID-то на новия маршрут за фокусиране

    if (activeRoutesList.length > 0) {
        // 1. Проверяваме дали ТЕКУЩО фокурисаният маршрут съдържа тази спирка
        const currentFocusedRoute = activeRoutesList.find(r => r.tripId === focusedRouteTripId);
        const currentHasStop = currentFocusedRoute && currentFocusedRoute.stops.some(s => s.stop_id === stop.stop_id);

        activeRoutesList.forEach(route => {
            const match = route.stops.find(s => s.stop_id === stop.stop_id);
            if (match) { 
                // Обновяваме "Ти си тук" (originStopId) за всички маршрути, които минават оттам
                route.originStopId = stop.stop_id; 
                affected = true; 

                // FIX: Логика за смяна на фокуса (удебеляване)
                // Ако текущият удебелен маршрут НЕ минава през тази спирка,
                // маркираме първия намерен маршрут, който минава, като нов фокус.
                if (!currentHasStop && !newFocusId) {
                    newFocusId = route.tripId;
                }
            }
        });

        // Ако сме намерили по-подходящ маршрут за фокус, го прилагаме
        if (newFocusId) {
            focusedRouteTripId = newFocusId;
            renderRouteChips(); // Обновяваме горните бутони (чиповете)
        }

        if(affected) {
            redrawAllActiveRoutes(); // Прерисуваме линиите (тук се случва удебеляването)
            
            activeRouteArrivalsMap.clear();
            for (const r of activeRoutesList) { await updateRouteArrivals(r); }
            fetchAndDrawVehicles();
        }
    }
}

// --- НОВА ФУНКЦИЯ: Клик в долното меню (Ride Along) ---
async function selectRideAlongStop(stopId) {
    // 1. Чистим таймера
    if (pastStopResetTimer) clearTimeout(pastStopResetTimer);

    const route = activeRoutesList.find(r => r.tripId === rideAlongState.tripId);
    if (!route) return;

    route.originStopId = stopId;
    selectedStopId = stopId;
    
    shouldAutoCenterVehicle = false; 

    activeRouteArrivalsMap.clear();
    await updateRouteArrivals(route);
    redrawAllActiveRoutes();
    updateVisibleMarkers();
    fetchAndDrawVehicles(); 
    renderRideAlongList();

    // 2. Центриране (БЕЗ ЗУУМВАНЕ)
    const stopObj = allStopsData.find(s => s.stop_id == stopId);
    if (stopObj) {
        // Извикваме новата бърза функция (запазва текущия зуум)
        panMapWithOffset(stopObj.stop_lat, stopObj.stop_lon);
        
        const stopCodeText = stopObj.stop_code ? `(${stopObj.stop_code})` : '';
        const content = `
            <div class="stop-tooltip-container" onclick="window.openStopSheetFromPopup('${stopObj.stop_id}')">
                <span class="stop-tooltip-title">${stopObj.stop_name} <span class="stop-tooltip-code">${stopCodeText}</span></span>
                <span class="stop-tooltip-hint">(натисни за повече информация)</span>
            </div>`;

        L.popup({
            closeButton: false, offset: [0, -5], autoPan: false, className: 'custom-popup'
        }).setLatLng([stopObj.stop_lat, stopObj.stop_lon]).setContent(content).openOn(map);
        
        startAutoFollowCooldown(10000);
    }

    // 3. Проверка за минала спирка
    const stopsList = rideAlongState.stops || [];
    const selectedIndex = stopsList.findIndex(s => s.stop_id == stopId);
    const realIndex = rideAlongState.realBusIndex !== undefined ? rideAlongState.realBusIndex : 0;

    if (selectedIndex < realIndex) {
        console.log("Selected past stop. Will auto-reset in 10s.");
        pastStopResetTimer = setTimeout(() => {
            if (rideAlongState.realBusIndex !== undefined && stopsList[rideAlongState.realBusIndex]) {
                const actualNextStopId = stopsList[rideAlongState.realBusIndex].stop_id;
                selectRideAlongStop(actualNextStopId);
            }
        }, 10000);
    }
}

async function updateRouteArrivals(route) {
    try {
        const arrivals = await fetch(`${API_BASE_URL}vehicles_for_stop/${route.originStopId}`, { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
        
        // Филтрираме само пристиганията за НАШИЯ маршрут
        const relevantArrivals = arrivals.filter(a => a.route_name === route.routeName);
        
        relevantArrivals.forEach(a => {
            // Ако сме в Ride Along, ни интересува конкретния tripId
            // Ако сме в нормален режим, взимаме всички
            activeRouteArrivalsMap.set(a.trip_id, a.eta_minutes);
        });
    } catch(e) {}
}


// В script.js -> намери и замени fetchAndDrawVehicles:
// --- RADAR LOGIC С ФИЛТЪР ЗА ТРЕПТЕНЕ ---
async function fetchGlobalRadarVehicles() {
    if (!map) return; 

    if (!isRadarActive || !mapFilters.vehicles.enabled) { 
        radarLayer.clearLayers(); 
        radarMarkers.clear(); 
        return; 
    }
    
    const zoom = map.getZoom();
    const app = mapFilters.appearance;
    const vehMult = app.vehicleSizeMultiplier || 1.0;
    const style = app.vehicleStyle || 'TEARDROP';
    
    if (zoom < (app.minZoomVehicles || 10)) { 
        radarLayer.clearLayers(); 
        radarMarkers.clear(); 
        return; 
    }
    
    const isDotsDefault = (zoom <= (app.dotThreshold || 13));

    let routeNamesToFetch = "";
    const hasSpecificFilters = mapFilters.specificLines.length > 0;
    if (hasSpecificFilters) {
        routeNamesToFetch = mapFilters.specificLines.map(id => id.split('_')[1]).join(',');
    } else {
        routeNamesToFetch = [...new Set(allLinesData.map(l => l.line_name))].join(',') + ",GARAGE";
    }

    try {
        const res = await fetch(`${API_BASE_URL}vehicles_for_routes/${routeNamesToFetch}`);
        const vehicles = await res.json();
        const bounds = map.getBounds().pad(0.1);
        const activeIds = new Set();
        
        vehicles.forEach(v => {
            let typeKey = v.route_name.startsWith('N') ? 'NIGHT' : (v.route_type == '0' ? 'TRAM' : (v.route_type == '11' ? 'TROLLEY' : (v.route_type == '1' ? 'METRO' : 'BUS')));
            const isLineMatch = mapFilters.specificLines.includes(`${typeKey}_${v.route_name}`);
            const isCategoryMatch = mapFilters.vehicles.types[typeKey] === true;

            if (hasSpecificFilters && !isLineMatch) return; 
            if (!hasSpecificFilters && !isCategoryMatch) return; 

            if (!v.latitude || !v.longitude) return;
            const newLatLng = L.latLng(v.latitude, v.longitude);
            if (!bounds.contains(newLatLng)) return;
            
            activeIds.add(v.trip_id);
            let color = v.is_revenue === false ? '#555555' : getTransportColor(v.route_type, v.route_name);

            // --- ЛОГИКА ЗА ТОЧКИТЕ: Забраняваме ги за филтрирани линии ---
            let isDots = isDotsDefault;
            if (hasSpecificFilters && isLineMatch) {
                isDots = false; // Никога не е точка, ако сме го избрали изрично!
            }

            if (radarMarkers.has(v.trip_id)) {
                const mData = radarMarkers.get(v.trip_id);
                const oldLatLng = mData.marker.getLatLng();
                const distMeters = oldLatLng.distanceTo(newLatLng);

                let bearingToDraw = mData.lastBearing; 

                if (distMeters >= 5) {
                    bearingToDraw = getBearing(oldLatLng.lat, oldLatLng.lng, newLatLng.lat, newLatLng.lng);
                    mData.marker.setLatLng(newLatLng);
                    mData.lastBearing = bearingToDraw; 
                }

                const sizeChanged = (mData.wasMult !== vehMult);
                const styleChanged = (mData.wasStyle !== style || mData.wasDots !== isDots);

                if (sizeChanged || styleChanged || distMeters >= 5) {
                    if (isDots) {
                        mData.marker.setIcon(L.divIcon({className: '', html: `<div class="vehicle-dot-simple" style="background-color:${color}; width:${10*vehMult}px; height:${10*vehMult}px;"></div>`, iconSize: [10*vehMult, 10*vehMult]}));
                    } else {
                        mData.marker.setIcon(L.divIcon({
                            className: 'radar-smooth-icon', 
                            html: getVehicleHTML(v, color, bearingToDraw, vehMult, style, true), 
                            iconSize: [40*vehMult, 40*vehMult], 
                            iconAnchor:[20*vehMult, 20*vehMult]
                        }));
                    }
                    mData.wasMult = vehMult; mData.wasStyle = style; mData.wasDots = isDots;
                }
            } else {
                let html = isDots ? 
                    `<div class="vehicle-dot-simple" style="background-color:${color}; width:${10*vehMult}px; height:${10*vehMult}px;"></div>` : 
                    getVehicleHTML(v, color, null, vehMult, style, true);

                const marker = L.marker(newLatLng, {
                    icon: L.divIcon({
                        className: 'radar-smooth-icon', 
                        html: html, 
                        iconSize: [40*vehMult, 40*vehMult], 
                        iconAnchor:[20*vehMult, 20*vehMult]
                    }), 
                    pane: 'radarPane'
                }).addTo(radarLayer);

                marker.on('click', () => openLineModal({trip_id: v.trip_id, route_name: v.route_name, route_type: v.route_type, destination: v.destination}, v.next_stop_id, true));

                radarMarkers.set(v.trip_id, {
                    marker, lastBearing: null, wasMult: vehMult, wasStyle: style, wasDots: isDots
                });
            }
        });
        
        radarMarkers.forEach((d, id) => { if (!activeIds.has(id)) { radarLayer.removeLayer(d.marker); radarMarkers.delete(id); }});
    } catch (e) { console.error("Radar Error:", e); }
}




// --- ROUTE VEHICLES С ФИЛТЪР ЗА ТРЕПТЕНЕ ---
async function fetchAndDrawVehicles() {
    if (activeRoutesList.length === 0) return;
    
    const app = mapFilters.appearance;
    const vehMult = app.vehicleSizeMultiplier || 1.0;
    const style = app.vehicleStyle || 'TEARDROP';
    // ЗАБЕЛЕЖКА: Тук нарочно НЕ изчисляваме isDots, защото искаме винаги икони
    
    const names = [...new Set(activeRoutesList.map(r => r.routeName))].join(',');

    try {
        const res = await fetch(`${API_BASE_URL}vehicles_for_routes/${names}`, {headers: {'Accept-Language': currentLanguage}});
        const vehicles = await res.json();
        const currentIds = new Set();
        
        for (const route of activeRoutesList) {
            let toDraw = route.isRideAlong 
                ? vehicles.filter(v => String(v.trip_id) === String(route.fixedVehicleId)) 
                : vehicles.filter(v => v.route_name === route.routeName && activeRouteArrivalsMap.has(v.trip_id));
            
            toDraw.forEach(v => {
                currentIds.add(v.trip_id);
                const [sLat, sLon] = snapToShape(v.latitude, v.longitude, route.shape);
                const newLatLng = L.latLng(sLat, sLon);
                
                let m = vehicleMarkersMap.get(v.trip_id);
                
                // Проверки за обновяване (Стил или преместване над 5 метра)
                let styleChanged = m ? (m.wasStyle !== style) : true;
                let distMeters = m ? m.getLatLng().distanceTo(newLatLng) : 999;
                let sizeChanged = m ? (m.wasMult !== vehMult) : true;

                if (styleChanged || sizeChanged || distMeters >= 5) {
                    let brng = (distMeters >= 5) ? getHeadingFromShape(v.latitude, v.longitude, route.shape) : (m ? m.lastKnownBearing : 0);
                    
                    let eta = activeRouteArrivalsMap.get(v.trip_id);
                    let etaTxt = (eta !== undefined && !route.isRideAlong) 
                        ? (eta < 1 ? t('arriving') : `${t('time_after')} ${eta} ${t('time_min')}`) 
                        : null;
                    
                    // ВИНАГИ генерираме HTML за икона (Капка/Капсула), без значение от зуума
                    let html = `
                        <div class="vehicle-marker-container">
                            ${etaTxt ? `<div class="vehicle-time-bubble" style="bottom:${40*vehMult}px; display:block;">${etaTxt}</div>` : ""}
                            ${getVehicleHTML(v, route.color, brng, vehMult, style, false)}
                        </div>`;

                    const icon = L.divIcon({ 
                        className: 'radar-smooth-icon', 
                        html: html, 
                        iconSize: [40*vehMult, 40*vehMult], 
                        iconAnchor: [20*vehMult, 20*vehMult] 
                    });

                    if (m) {
                        m.setLatLng([sLat, sLon]);
                        m.setIcon(icon);
                        m.wasStyle = style;
                        m.wasMult = vehMult;
                        m.lastKnownBearing = brng;
                    } else {
                        const nm = L.marker([sLat, sLon], {icon: icon, pane: 'activeVehiclePane'}).addTo(vehicleLayer);
                        nm.wasStyle = style;
                        nm.wasMult = vehMult;
                        nm.lastKnownBearing = brng;
                        vehicleMarkersMap.set(v.trip_id, nm);
                    }
                }
            });
        }
        
        // Почистване на изчезнали превозни средства
        vehicleMarkersMap.forEach((m, id) => { 
            if (!currentIds.has(id)) { 
                vehicleLayer.removeLayer(m); 
                vehicleMarkersMap.delete(id); 
            }
        });
        
    } catch (e) { 
        console.error("Error drawing route vehicles:", e); 
    }
}

// Помощна функция: Центрира точка в ГОРНАТА част на екрана (25% от върха)






function snapToShape(lat, lon, shape) {
    if (!shape || shape.length < 2) return [lat, lon];
    let minSqDist = Infinity;
    let snapped = [lat, lon];
    for (let i = 0; i < shape.length - 1; i++) {
        const a = shape[i];
        const b = shape[i+1];
        const closest = getClosestPointOnSegment({lat: lat, lng: lon}, {lat: a[0], lng: a[1]}, {lat: b[0], lng: b[1]});
        const dx = lat - closest[0];
        const dy = lon - closest[1];
        const sqDist = dx*dx + dy*dy;
        if (sqDist < minSqDist) {
            minSqDist = sqDist;
            snapped = closest;
        }
    }
    return snapped;
}

function getClosestPointOnSegment(p, a, b) {
    const x = p.lat, y = p.lng, x1 = a.lat, y1 = a.lng, x2 = b.lat, y2 = b.lng;
    const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D; const len_sq = C * C + D * D;
    let param = -1; if (len_sq !== 0) param = dot / len_sq;
    let xx, yy; if (param < 0) { xx = x1; yy = y1; } else if (param > 1) { xx = x2; yy = y2; } else { xx = x1 + param * C; yy = y1 + param * D; }
    return [xx, yy];
}

function renderRouteChips() {
    const container = document.getElementById('active-routes-container'); 
    container.innerHTML = '';
    
    if(activeRoutesList.length === 0) { 
        container.classList.add('hidden'); 
        document.getElementById('map-top-controls-wrapper').classList.remove('pushed-down');
        return; 
    } 
    container.classList.remove('hidden');
    
    const fullLines = activeRoutesList.filter(r => r.isFullLineFilter);
    const specificTrips = activeRoutesList.filter(r => !r.isFullLineFilter);
    
    const uniqueLinesMap = new Map();
    fullLines.forEach(r => uniqueLinesMap.set(`${r.routeType}_${r.routeName}`, r));
    
    const pillsToShow = Array.from(uniqueLinesMap.values()).concat(specificTrips);
    
    pillsToShow.forEach(route => {
        const chip = document.createElement('div');
        const isFocused = (route.tripId === focusedRouteTripId || route.isFullLineFilter);
        chip.className = `route-chip ${isFocused ? 'focused' : ''}`;
        
        let iconName = 'directions_bus'; 
        if(route.routeType === '0') iconName = 'tram'; 
        if(route.routeType === '11') iconName = 'directions_bus';
        
        chip.innerHTML = `
            <span class="material-icons-round chip-icon" style="color:${route.color}">${iconName}</span>
            <span class="chip-text" style="color:${route.color}; font-weight: bold;">${route.routeName}</span>
            <span class="material-icons-round chip-close">close</span>
        `;
        
        chip.onclick = () => { 
            if (!route.isFullLineFilter) { 
                focusedRouteTripId = route.tripId; 
                renderRouteChips(); 
                redrawAllActiveRoutes(); 
            } 
        };
        
        chip.querySelector('.chip-close').onclick = (e) => { 
            e.stopPropagation(); 
            if (route.isFullLineFilter) {
                const typeName = getRouteTypeByNameInternal(route.routeType);
                mapFilters.specificLines = mapFilters.specificLines.filter(id => id !== `${typeName}_${route.routeName}`);
                saveFullFilters(); 
                checkRadarStateAfterFilterChange(); // <--- УМНОТО ИЗКЛЮЧВАНЕ
            } else {
                removeRoute(route.tripId); 
            }
        };
        container.appendChild(chip);
    });
}


function removeRoute(tripId) {
    activeRoutesList = activeRoutesList.filter(r => r.tripId !== tripId);
    activeRouteArrivalsMap.clear(); activeRoutesList.forEach(r => updateRouteArrivals(r));
	
	updateRadarZIndex();
	
    if (activeRoutesList.length === 0) closeRouteView();
    else { if (focusedRouteTripId === tripId) focusedRouteTripId = activeRoutesList[activeRoutesList.length - 1].tripId; renderRouteChips(); redrawAllActiveRoutes(); updateVisibleMarkers(); fetchAndDrawVehicles(); }
}

function closeRouteView() {
    activeRoutesList = []; 
    vehicleMarkersMap.clear(); 
    activeRouteArrivalsMap.clear();
    
    // ВРЪЩАМЕ АВТОЛОКАЦИЯТА
    isSharedTrackingActive = false; 

    if (routeVehicleTimer) clearInterval(routeVehicleTimer);
    routeLayer.clearLayers(); 
    vehicleLayer.clearLayers();
    document.getElementById('active-routes-container').classList.add('hidden');
    // --- ДОБАВИ ТОЗИ РЕД ---
    document.getElementById('map-top-controls-wrapper').classList.remove('pushed-down');
    updateRadarZIndex();
    checkAndManageTimers();
    updateVisibleMarkers();
}
// --- HELPERS ---
function getIconFileName(stop, forceRouteType = null) {
    // 1. АКО ИМАМЕ ПРИНУДИТЕЛЕН ТИП (от активен маршрут)
    if (forceRouteType !== null) {
        const t = String(forceRouteType);
        if (t === '0') return 'stop_icon_tram.png';       // Трамвай
        if (t === '11') return 'stop_icon_trolley.png';   // Тролей
        if (t === '1' || t === '2' || t === '4') return 'stop_icon_metro.png'; // Метро
        // Всичко останало (3) е автобус. Дори нощните ще излязат като автобус в този контекст,
        // но ако искаш черна икона за нощен маршрут:
        // if (activeRoutesList.some(r => r.routeName.startsWith('N'))) return 'stop_icon_night.png';
        return 'stop_icon_bus.png';
    }

    // --- ОТ ТУК НАДОЛУ Е СТАРАТА ЛОГИКА ЗА СМЕСЕНИ СПИРКИ ---
    
    // Безопасност
    if (!stop.stop_code) return 'stop_icon_metro.png';
    
    // Метро (Винаги с топ приоритет)
    const serviceTypes = stop.service_types || [];
    if (serviceTypes.includes('METRO') || serviceTypes.includes('subway')) return 'stop_icon_metro.png';
    if (String(stop.stop_code).length < 4) return 'stop_icon_metro.png';

    const status = stopsStatusCache[stop.stop_code];
    if (status && Array.isArray(status)) {
        if (status.some(a => a.route_name.startsWith('M'))) return 'stop_icon_metro.png';
    }

    let hasNight = false;
    let hasTram = false;
    let hasTrolley = false;
    let hasBus = false;

    // А) Проверка на ЖИВИ данни (Кеш)
    if (status && Array.isArray(status) && status.length > 0) {
        status.forEach(arrival => {
            const rName = arrival.route_name.trim().toUpperCase();
            const t = String(arrival.route_type);

            if (rName.startsWith('N')) {
                hasNight = true;
            } else {
                if (t === '0') hasTram = true;
                else if (t === '11') hasTrolley = true;
                else hasBus = true;
            }
        });
    } 
    // Б) Статични данни
    else {
        if (serviceTypes.includes('NIGHT')) hasNight = true;
        if (serviceTypes.includes('TRAM')) hasTram = true;
        if (serviceTypes.includes('TROLLEY')) hasTrolley = true;
        if (serviceTypes.includes('BUS')) hasBus = true;
    }

    const isBusLike = (hasBus || hasNight);

    if (hasTram && hasTrolley && isBusLike) return 'stop_icon_mixed.png';
    if (hasTram && hasTrolley) return 'stop_icon_trolleytram.png';
    if (hasTram && isBusLike) return 'stop_icon_bustram.png';
    if (hasTrolley && isBusLike) return 'stop_icon_bustrolley.png';
    if (hasTram) return 'stop_icon_tram.png';
    if (hasTrolley) return 'stop_icon_trolley.png';
    if (hasBus) return 'stop_icon_bus.png';
    if (hasNight) return 'stop_icon_night.png';
    
    return 'stop_icon_bus.png';
}


// Помощна функция: Паузира следенето за определено време (напр. 10 сек)
function startAutoFollowCooldown(ms) {
    // 1. Веднага спираме автоматичното следене на автобуса
    isAutoFollowEnabled = false; 
    
    // Чистим стария таймер, ако има такъв (за да не се застъпват)
    if (userInteractionTimer) clearTimeout(userInteractionTimer);

    console.log(`Auto-follow paused for ${ms/1000}s`);

    // 2. Нагласяме таймер за възобновяване
    userInteractionTimer = setTimeout(() => {
        // Когато времето изтече:
        isAutoFollowEnabled = true;      // Разрешаваме следенето
        shouldAutoCenterVehicle = true;  // Форсираме еднократно центриране към автобуса
        
        console.log("Auto-follow resumed");
        
        // По желание: Веднага извикваме прерисуване, за да скочи картата при автобуса
        fetchAndDrawVehicles(); 
    }, ms);
}

function getTransportColor(type, routeName = '') { 
    const t = String(type);
    
    // ПРОВЕРКА ЗА НОЩНА ЛИНИЯ: Ако започва с N или n -> Черно
    if (routeName && (routeName.startsWith('N') || routeName.startsWith('n'))) {
        return '#2C2C2E';
    }

    if (t === '0') return '#F7941D'; 
    if (t === '11') return '#27AAE1'; 
    if (t === '3') return '#BE1E2D'; 
    if (t === '1' || t === '2' || t === '4') return '#007DC5';
    
    // Основен цвят по подразбиране
    return '#1c75bc'; 
}

function getMetroColor(routeName) {
    switch(routeName) {
        case "M1": return "#d6261d"; 
        case "M2": return "#007dc5"; 
        case "M3": return "#00965e"; 
        case "M4": return "#ffc709"; 
        default: return "#007dc5";
    }
}




function getMetroDirectionKey(arrival) {
    const r = arrival.route_name;
    const d = arrival.destination.toLowerCase(); // Правим всичко с малки букви за по-лесно сравнение

    // --- МЕТРО ЛИНИИ 1 и 4 (M1, M4) ---
    if (r === 'M1' || r === 'M4') {
        // ГРУПА А: Посока Младост / Летище / Бизнес Парк
        // Проверяваме: Български, Английски и Транслитериран Български (Latinka)
        if (d.includes('летище') || d.includes('airport') || d.includes('letishte') || 
            d.includes('бизнес парк') || d.includes('business park') || d.includes('biznes park') || 
            d.includes('младост') || d.includes('mladost')) {
            return 'DIR_A';
        }
        // ГРУПА Б: Посока Люлин / Сливница / Обеля (Всичко останало)
        return 'DIR_B'; 
    }

    // --- МЕТРО ЛИНИЯ 2 (M2) ---
    if (r === 'M2') {
        // ГРУПА А: Към Витоша / Лозенец
        if (d.includes('витоша') || d.includes('vitosha') || d.includes('james') || d.includes('lozenets')) {
            return 'DIR_A';
        }
        // ГРУПА Б: Към Обеля / Надежда / Ломско шосе
        return 'DIR_B';
    }

    // --- МЕТРО ЛИНИЯ 3 (M3) ---
    if (r === 'M3') {
        // ГРУПА А: Към Хаджи Димитър / Левски Г
        if (d.includes('хаджи димитър') || d.includes('hadzhi dimitar') || 
            d.includes('левски') || d.includes('levski')) {
            return 'DIR_A';
        }
        // ГРУПА Б: Към Горна баня / Овча купел
        return 'DIR_B';
    }

    return 'UNKNOWN';
}


function saveStatusCache() { try { localStorage.setItem('stopsStatusCache', JSON.stringify(stopsStatusCache)); } catch (e) {} }














// --- GLOBAL EXPORTS ---
window.locateFromFav = function(stopId) {
    const stop = allStopsData.find(s => s.stop_id === stopId);
    if(stop) {
        document.getElementById('screen-line-details').classList.remove('active');
        document.getElementById('screen-line-details').classList.add('hidden');
        
        document.querySelector('[data-target="screen-map"]').click();
        setTimeout(() => {
            map.invalidateSize();
            map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: false });
            selectStopWithTooltip(stop);
        }, 100);
    }
};
window.openStopSheetFromPopup = function(stopId) {
    const stop = allStopsData.find(s => s.stop_id === stopId);
    if (stop) { map.closePopup(); openStopSheet(stop); changeRouteFocus(stop); }
};


window.removeFavorite = function(stopId) {
    if(confirm("Сигурни ли сте?")) { 
        const idx = favoriteStops.indexOf(stopId); 
        if (idx > -1) { 
            favoriteStops.splice(idx, 1); 
            localStorage.setItem('favStops', JSON.stringify(favoriteStops)); 
            
            // Ако е къстъм, може да я изтрием и от дефинициите, за да не се трупат боклуци
            if (stopId.startsWith('custom_')) {
                customStopsData = customStopsData.filter(c => c.id !== stopId);
                localStorage.setItem('customStopsData', JSON.stringify(customStopsData));
            }
            
            loadFavoritesScreen(); 
        } 
    }
};

window.toggleLineFav = function(name, dest, btn, stopId, specificContainerId) {
    // 1. Определяме дали е Метро (по името)
    const isMetro = name.startsWith('M');
    
    // 2. Генерираме ключа според условието
    let key;
    if (isMetro) {
        // МЕТРО: Ключът е уникален за спирката (Локален)
        // Формат: METRO|StopID|LineName|Destination
        key = `METRO|${stopId}|${name}|${dest}`;
    } else {
        // НАЗЕМЕН: Ключът е само линия и посока (Глобален)
        // Формат: LineName-Destination (стария формат)
        key = `${name}-${dest}`;
    }

    const idx = favoriteLines.indexOf(key); 
    const icon = btn.querySelector('span');
    
    if (idx > -1) { 
        favoriteLines.splice(idx, 1); 
        icon.textContent = 'star_border'; 
        btn.classList.remove('active'); 
    } else { 
        favoriteLines.push(key); 
        icon.textContent = 'star'; 
        btn.classList.add('active'); 
    }
    
    localStorage.setItem('favLines', JSON.stringify(favoriteLines));
    
    // 3. РЕФРЕШ ЛОГИКА
    if (specificContainerId) {
        const container = document.getElementById(specificContainerId);
        if (container) {
            loadArrivals(stopId, container);
            return;
        }
    }

    if(stopId) { 
        if (currentOpenStopId === stopId) { 
            const sheetContainer = document.getElementById('sheet-arrivals-list');
            if(sheetContainer) loadArrivals(stopId, sheetContainer); 
        } 
        
        const listContainer = document.getElementById(`arrivals-${stopId}`); 
        if (listContainer && listContainer.classList.contains('visible')) { 
            loadArrivals(stopId, listContainer); 
        }
        
        const searchContainer = document.getElementById(`search-arrivals-${stopId}`);
        if (searchContainer && searchContainer.classList.contains('visible')) {
            loadArrivals(stopId, searchContainer);
        }
    }
};


let liveModalTimer = null; // Таймер за динамично обновяване на модала

// В script.js -> Намери и замени window.closeModal
window.closeModal = function() { 
    // 1. СПИРАМЕ ДИНАМИЧНОТО ОБНОВЯВАНЕ
    if (liveModalTimer) {
        clearInterval(liveModalTimer);
        liveModalTimer = null;
    }

    const modal = document.getElementById('line-modal'); 
    modal.classList.remove('active'); 
    setTimeout(() => modal.classList.add('hidden'), 200); 
};
// Глобална променлива за проследяване на източника на клика
let isActionFromVehicle = false;
let shouldAutoCenterVehicle = false; // Флаг за центриране

// Глобална променлива за проследяване на текущия активен доклад в модала
let currentModalReportId = null;

// В script.js -> Намери и замени openLineModal
function openLineModal(arrival, fromStopId, fromVehicle = false) { 
    isActionFromVehicle = fromVehicle; 
    selectedLineForAction = arrival; 
    selectedStopForAction = fromStopId; 
    
    // --- ПРОМЯНА: Динамично добавяне на заглавие + бутон Аларма ---
    const headerTitle = document.getElementById('modal-line-title');
    const headerBadge = document.getElementById('modal-header-badge'); // Този DIV е празен контейнер до заглавието
    
    headerTitle.textContent = `${arrival.route_name} към ${arrival.destination}`; 
    
    // Проверяваме дали има активна аларма за този курс
    const hasAlarm = activeAlarms.some(a => a.stopId === fromStopId && a.routeName === arrival.route_name);
    const alarmColor = hasAlarm ? '#4CAF50' : 'var(--on-surface-variant)';
    
    // Вмъкваме бутона за аларма в десния ъгъл (modal-header-badge)
    // Използваме 'stopId' от параметъра, за да знаем коя е спирката
    headerBadge.innerHTML = `
        <button class="icon-btn" id="btn-alarm-line" style="color:${alarmColor}; background:transparent;">
            <span class="material-icons-round">alarm</span>
        </button>
    `;
    
    // Свързваме клика
// Свързваме клика
    document.getElementById('btn-alarm-line').onclick = (e) => {
        e.stopPropagation();
        if (fromStopId) {
             if ("Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            // --- ПРОМЯНАТА Е ТУК ---
            // Подаваме arrival обекта като втори аргумент!
            openAlarmWizard(fromStopId, arrival); 
            // -----------------------
        } else {
            alert("Тази функция работи само когато сте избрали спирка.");
        }
    };


  // -------------------------------------------------------------
    
    // Оранжевo каре (Отклонение)
    const deviationBox = document.getElementById('modal-deviation-container');
    if (deviationBox) {
        if (arrival.deviation && arrival.deviation.active) {
            deviationBox.innerHTML = `
                <div class="modal-deviation-box" onclick="showRouteOnMap(selectedLineForAction, null, true)">
                    <span class="material-icons-round" style="font-size: 32px; color: #E65100;">warning</span>
                    <div>
                        <div class="deviation-title">Временно променен маршрут</div>
                        <div class="deviation-desc">
                            ${arrival.deviation.description || 'Засечено е отклонение от маршрута.'}
                            <br><span style="text-decoration:underline; font-weight:bold;">Натисни за карта</span>
                        </div>
                    </div>
                </div>
            `;
            deviationBox.classList.remove('hidden');
        } else {
            deviationBox.classList.add('hidden');
            deviationBox.innerHTML = '';
        }
    }
    
    const voteSection = document.getElementById('modal-vote-section');
    voteSection.innerHTML = ""; 

    if (liveModalTimer) clearInterval(liveModalTimer);
    refreshVehicleLiveData(arrival); 
    liveModalTimer = setInterval(() => refreshVehicleLiveData(arrival), 3000);

    const modal = document.getElementById('line-modal'); 
    modal.classList.remove('hidden'); 
    requestAnimationFrame(() => modal.classList.add('active')); 
}






function generateReportBadges(tripId, isSmallRadar = false) {
    if (!serverReportsList || serverReportsList.length === 0) return '';
    let stats = { HOT: 0, COLD: 0, CROWDED: 0, DIRTY: 0 }; // Ред: Жега/Студ -> Претъпкан -> Мръсно
    
    const reportsForTrip = serverReportsList.filter(r => String(r.tripId) === String(tripId));
    reportsForTrip.forEach(r => { if (stats.hasOwnProperty(r.type)) stats[r.type]++; });

    if (Object.values(stats).every(v => v < 1)) return '';

    let html = '';
    const size = isSmallRadar ? 12 : 16; 

    // 1. ЖЕГА / СТУД (Горе-ляво)
    if (stats.HOT >= 1 || stats.COLD >= 1) {
        let img = stats.HOT >= stats.COLD ? 'hot.png' : 'cold.png';
        html += `<div class="vehicle-condition-badge" style="top:-8px; left:-8px; width:${size}px; height:${size}px;"><img src="${img}" class="badge-icon-img"></div>`;
    }
    
    // 2. ПРЕТЪПКАН (Долу-център) - Преместено от ляво в център долу
    if (stats.CROWDED >= 1) {
        html += `<div class="vehicle-condition-badge" style="bottom:-8px; left: 50%; transform: translateX(-50%); width:${size}px; height:${size}px;"><img src="crowded.png" class="badge-icon-img"></div>`;
    }

    // 3. МРЪСНО (Горе-дясно)
    if (stats.DIRTY >= 1) {
        html += `<div class="vehicle-condition-badge" style="top:-8px; right:-8px; width:${size}px; height:${size}px;"><img src="stain.png" class="badge-icon-img"></div>`;
    }

    return html;
}


function renderArrivals(arrivals, container, stopId) { 
    container.innerHTML = ''; 
    const seenTimesPerLine = new Map();
    const validArrivals = arrivals.filter(arr => {
        if (arr.eta_minutes > MAX_ARRIVAL_MINUTES) return false;
        const key = `${arr.route_name}_${arr.route_type}_${arr.eta_minutes}`;
        if (seenTimesPerLine.has(key)) return false;
        seenTimesPerLine.set(key, true);
        return true;
    }).slice(0, 40);

    if(validArrivals.length === 0) { 
        container.innerHTML = `<p style="text-align:center; color:#888; padding:10px;">${t('txt_no_courses_soon') || 'Няма курсове скоро.'}</p>`; 
        return; 
    } 

    let htmlBuffer = ''; 
    const favSet = new Set(favoriteLines);

    const buildCardHtml = (main, others, sId) => {
        const isM = main.route_name.startsWith("M");
        const favKey = isM ? `METRO|${sId}|${main.route_name}|${main.destination}` : `${main.route_name}-${main.destination}`;
        const isFav = favSet.has(favKey);
        
        let getOnHtml = "";
        if (!isM && main.prediction_source !== 'schedule' && main.eta_minutes <= 2 && userLocation) {
            const radarData = radarMarkers.get(String(main.trip_id));
            if (radarData && radarData.marker) {
                const busPos = radarData.marker.getLatLng();
                const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, busPos.lat, busPos.lng);
                if (dist <= 0.2) {
                    const label = (currentLanguage === 'bg') ? 'КАЧИ СЕ' : 'GET ON';
                    // --- ДОБАВЕНО: onclick ЛОГИКА ЗА СТАРТИРАНЕ ---
                    getOnHtml = `<div class="btn-get-on" style="background:#20E354; color:black; font-size:10px; font-weight:900; padding:2px 8px; border-radius:10px; margin-left:8px; display:inline-block; vertical-align:middle; box-shadow:0 1px 3px rgba(0,0,0,0.3); line-height:1.2; cursor:pointer;" 
                        onclick="event.stopPropagation(); window.startRideAlong('${main.trip_id}', '${sId}', '${main.route_name}', '${main.destination}', '${main.route_type}', true)">${label}</div>`;
                }
            }
        }

        let delayHtml = '';
        if (main.delay_minutes !== null && main.delay_minutes !== undefined) {
            const d = main.delay_minutes;
            const dC = d > 0 ? '#D32F2F' : (d < 0 ? '#1976D2' : '#2E7D32');
            const dT = d > 0 ? `+${d} м` : (d < 0 ? `${d} м` : `±0 м`);
            delayHtml = `<span style="background-color: white; color: ${dC}; border: 1px solid ${dC}80; font-size: 11px; font-weight: 800; padding: 0px 3px; border-radius: 3px; display: inline-block; line-height: 1.3; vertical-align: middle; margin-right: 6px; margin-bottom: 2px;">${dT}</span>`;
        }

        let oHtml = '';
        if (others.length > 0) {
            const timesStr = others.map(o => {
                let tStr = formatTime(o.eta_minutes);
                if (o.destination !== main.destination) tStr = `<span class="accent-text">${tStr}</span>`;
                return tStr;
            }).join(", ");
            oHtml = `<span class="subsequent-times" style="display: inline; white-space: normal;">${delayHtml ? '|| ' : ''}(${timesStr})</span>`;
        }

        let typeCls = 'bg-bus', textCls = 'color-bus', iconNm = 'directions_bus';
        if (main.route_name.startsWith('N')) { typeCls = 'bg-night'; textCls = 'color-night'; iconNm = 'nights_stay'; } 
        else if (main.route_type == '0') { typeCls = 'bg-tram'; textCls = 'color-tram'; iconNm = 'tram'; } 
        else if (main.route_type == '11') { typeCls = 'bg-trolley'; textCls = 'color-trolley'; iconNm = 'directions_bus'; } 
        
        const cardBg = isM ? getMetroColor(main.route_name) : '';
        const cardStyle = isM ? `style="background-color: ${cardBg}; color: white;"` : '';
        const sigHtml = main.prediction_source === 'schedule' ? `<span class="material-icons-round signal-icon schedule">event_note</span>` : `<span class="material-icons-round signal-icon live">rss_feed</span>`;
        const isTrk = (typeof VoiceTracker !== 'undefined' && VoiceTracker.activeTripId === main.trip_id);
        const badgeHtml = generateReportBadges(main.trip_id, false, (main.deviation && main.deviation.active));

        return `<div class="arrival-card ${isM ? '' : typeCls}" ${cardStyle} onclick="if(!event.target.closest('.line-fav-btn') && !event.target.closest('.voice-btn') && !event.target.closest('.btn-get-on')) openLineModalFromData('${main.route_name}', '${main.destination}', '${main.trip_id}', '${sId}', '${main.route_type}')">
            <div class="route-box" style="position:relative; ${isM ? 'background: rgba(255,255,255,0.2);' : ''}"><span class="material-icons-round route-icon ${isM ? 'color-white' : textCls}">${isM ? 'subway' : iconNm}</span><span class="route-number ${isM ? 'color-white' : textCls}">${main.route_name}</span>${badgeHtml}</div>
            <div class="arrival-content">
                <div class="time-row" style="display:flex; align-items:center;">${sigHtml}<span class="main-time" style="${isM ? 'color:white;' : ''}">${formatTime(main.eta_minutes)}</span>${getOnHtml}</div>
                <div style="display: block; margin-top: 2px; line-height: 1.2; white-space: normal; word-break: break-word;">${delayHtml}${oHtml}</div>
                <div class="dest-group" style="margin-top:2px; ${isM ? 'color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.3);' : ''}"><div class="dest-name">${t('to_label')} ${main.destination}</div></div>
            </div>
            <button class="voice-btn" style="background:none; border:none; color:${isTrk ? '#FFEB3B' : 'rgba(255,255,255,0.6)'}; padding:10px; cursor:pointer;" onclick="event.stopPropagation(); VoiceTracker.start('${main.trip_id}', '${sId}', '${main.route_name}', '${main.route_type}', '${main.destination}')"><span class="material-icons-round" style="font-size:24px;">${isTrk ? 'volume_up' : 'volume_mute'}</span></button>
            <button class="line-fav-btn ${isFav ? 'active' : ''}" style="${isM ? 'color:white;' : ''}" onclick="toggleLineFav('${main.route_name}', '${main.destination}', this, '${sId}', '${container.id}')"><span class="material-icons-round">${isFav ? 'star' : 'star_border'}</span></button>
        </div>`;
    };

    const metroArr = validArrivals.filter(a => a.route_name.startsWith("M"));
    const groundArr = validArrivals.filter(a => !a.route_name.startsWith("M"));

    if (metroArr.length > 0) {
        const directions = {};
        metroArr.forEach(a => { const dK = getMetroDirectionKey(a); if (!directions[dK]) directions[dK] = []; directions[dK].push(a); });
        const sortedD = Object.keys(directions).sort((a, b) => {
            const fA = directions[a].some(x => favSet.has(`METRO|${stopId}|${x.route_name}|${x.destination}`));
            const fB = directions[b].some(x => favSet.has(`METRO|${stopId}|${x.route_name}|${x.destination}`));
            return fA === fB ? a.localeCompare(b) : (fA ? -1 : 1);
        });
        sortedD.forEach(dk => {
            const group = directions[dk];
            const uniqueDests = [...new Set(group.map(a => a.destination.toUpperCase()))].sort();
            htmlBuffer += `<div style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; font-weight: bold; margin-bottom: 8px;">${t('direction_prefix')} ${uniqueDests.join(" / ")}</div>`;
            const lines = {};
            group.forEach(a => { if(!lines[a.route_name]) lines[a.route_name] = []; lines[a.route_name].push(a); });
            Object.values(lines).forEach(la => { la.sort((a, b) => a.eta_minutes - b.eta_minutes); htmlBuffer += buildCardHtml(la[0], la.slice(1, 4), stopId); });
        });
    }
    if (groundArr.length > 0) {
        const lineGroups = {};
        groundArr.forEach(a => { const key = `${a.route_name}_${a.route_type}`; if (!lineGroups[key]) lineGroups[key] = []; lineGroups[key].push(a); });
        const sortedGroups = Object.values(lineGroups).map(g => { g.sort((a, b) => (a.is_live === b.is_live ? a.eta_minutes - b.eta_minutes : (a.is_live ? -1 : 1))); return g; });
        sortedGroups.sort((a, b) => {
            const favA = favSet.has(`${a[0].route_name}-${a[0].destination}`);
            const favB = favSet.has(`${b[0].route_name}-${b[0].destination}`);
            if (favA !== favB) return favA ? -1 : 1;
            if (sortingPreference === 'BY_TYPE') {
                const order = { '0': 1, '3': 2, '11': 3 };
                const tA = order[a[0].route_type] || 4, tB = order[b[0].route_type] || 4;
                if (tA !== tB) return tA - tB;
                return (parseInt(a[0].route_name.replace(/\D/g, '')) || 999) - (parseInt(b[0].route_name.replace(/\D/g, '')) || 999);
            }
            return a[0].eta_minutes - b[0].eta_minutes;
        });
        sortedGroups.forEach(g => { htmlBuffer += buildCardHtml(g[0], g.slice(1, 4), stopId); });
    }
    container.innerHTML = htmlBuffer;
}




async function refreshVehicleLiveData(arrival) {
    const reportSection = document.getElementById('modal-report-section');
    const voteSection = document.getElementById('modal-vote-section');
    const distWarning = document.getElementById('modal-dist-warning');

    try {
        const response = await fetch(`${API_BASE_URL}vehicles_for_routes/${arrival.route_name}`);
        const vehicles = await response.json();
        const liveBus = vehicles.find(v => String(v.trip_id) === String(arrival.trip_id));

        if (!liveBus) return;

        selectedLineForAction.lat = liveBus.latitude;
        selectedLineForAction.lng = liveBus.longitude;
        selectedLineForAction.vehicle_id = liveBus.vehicle_id;

        // --- ФИКС: Проверка дали имаме GPS локация на потребителя ---
        let distKm = 999; // По подразбиране далеч (извън радиус)
        if (userLocation && userLocation.lat && userLocation.lng) {
            distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, liveBus.latitude, liveBus.longitude);
        }

        const inRadius = distKm <= 0.2; // 200 метра радиус

        const activeReports = serverReportsList.filter(r => String(r.tripId) === String(arrival.trip_id));
        const hasHot = activeReports.some(r => r.type === 'HOT');
        const hasCold = activeReports.some(r => r.type === 'COLD');
        const hasDirty = activeReports.some(r => r.type === 'DIRTY');
        const hasCrowded = activeReports.some(r => r.type === 'CROWDED');

        // Логика за гласуване
        if (activeReports.length > 0) {
            voteSection.classList.remove('hidden');
            if (!inRadius) {
                let infoHtml = `<div style="font-size:11px; color:var(--on-surface-variant); margin-bottom:8px; font-weight:bold; text-transform:uppercase;">Текущо състояние:</div>`;
                activeReports.forEach(r => {
                    const config = REPORT_TYPES[r.type];
                    infoHtml += `<div style="padding:10px; background:var(--background); color:var(--on-surface); border-radius:12px; margin-bottom:8px; border:1px solid var(--outline); border-left:4px solid ${config.color}; display:flex; align-items:center; gap:10px;">
                        <img src="${config.icon}" style="width:20px; height:20px; object-fit:contain;">
                        <span class="report-label">Докладвано: <b>${t(config.label)}</b></span>
                    </div>`;
                });
                voteSection.innerHTML = infoHtml;
            } else {
                let voteHtml = `<div style="font-size:11px; color:var(--on-surface-variant); margin-bottom:8px; font-weight:bold; text-transform:uppercase;">Активни сигнали (Гласувай):</div>`;
                activeReports.forEach(r => {
                    const config = REPORT_TYPES[r.type];
                    const myVote = r.usersVoted.find(u => u.nick === currentUserNick);
                    voteHtml += `
                        <div style="background:var(--background); padding:12px; border-radius:14px; margin-bottom:10px; border:1px solid var(--outline); color:var(--on-surface);">
                            <div style="font-size:13px; margin-bottom:10px; font-weight:500;">Вярно ли е: <b style="color:${config.color}">${t(config.label)}</b>?</div>
                            <div style="display:flex; gap:10px;">
                                <button class="vote-btn upvote ${myVote?.vote==='up'?'active':''}" onclick="voteReport('${r.id}','up')" style="flex:1; justify-content:center; padding:10px;">👍 ${r.upvotes}</button>
                                <button class="vote-btn downvote ${myVote?.vote==='down'?'active':''}" onclick="voteReport('${r.id}','down')" style="flex:1; justify-content:center; padding:10px;">👎 ${r.downvotes}</button>
                            </div>
                        </div>`;
                });
                voteSection.innerHTML = voteHtml;
            }
        } else {
            voteSection.classList.add('hidden');
        }

        // Логика за ново докладване
        if (inRadius) {
            reportSection.style.display = 'block';
            let btnsHtml = `<div style="font-size:11px; color:var(--on-surface-variant); margin-bottom:8px; font-weight:bold; text-transform:uppercase;">Докладвай ново:</div>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">`;
            if (!hasHot && !hasCold) {
                btnsHtml += renderCompactReportBtn('HOT', t('rep_hot'), 'hot.png', '#f57c00', '#fff3e0');
                btnsHtml += renderCompactReportBtn('COLD', t('rep_cold'), 'cold.png', '#0288d1', '#e1f5fe');
            }
            if (!hasCrowded) btnsHtml += renderCompactReportBtn('CROWDED', t('rep_crowded'), 'crowded.png', '#7b1fa2', '#f3e5f5');
            if (!hasDirty) btnsHtml += renderCompactReportBtn('DIRTY', t('rep_dirty'), 'stain.png', '#5d4037', '#efebe9');
            btnsHtml += `</div>`;
            reportSection.innerHTML = btnsHtml;
            distWarning.innerHTML = `<span style="color:#2e7d32; font-weight:bold; font-size:12px;">✅ В радиус сте (${Math.round(distKm*1000)}m)</span>`;
        } else {
            reportSection.style.display = 'none';
            distWarning.innerHTML = `<div style="color:var(--on-surface-variant); font-size:12px; padding:10px; background:var(--background); border-radius:8px; border:1px solid var(--outline);">ℹ️ Дистанция: ${userLocation ? Math.round(distKm*1000) + 'm' : 'неизвестна'}. <br>Трябва да сте под 200m за докладване.</div>`;
        }
    } catch (e) {
        console.error("Error refreshing modal data:", e);
    }
}

function renderCompactReportBtn(type, label, img, color, bg) {
    return `
        <button class="report-compact-btn" onclick="submitReport('${type}')" 
            style="background:${bg}; color:${color}; border:1px solid ${color}44; flex: 1 1 45%; cursor:pointer;">
            <img src="${img}" style="width:20px; height:20px;">
            <span>${label}</span>
        </button>
    `;
}

async function submitReport(type) {
    if (!selectedLineForAction) return;
    const distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, selectedLineForAction.lat, selectedLineForAction.lng);
    if (distKm > 2.0) {
        alert("Твърде далеч сте за докладване!");
        return;
    }
    
    const reportData = {
        type: type,
        tripId: selectedLineForAction.trip_id,
        vehicleId: selectedLineForAction.vehicle_id,
        routeName: selectedLineForAction.route_name,
        lat: selectedLineForAction.lat,
        lng: selectedLineForAction.lng,
        reporter: currentUserNick
    };

    const success = await processReportSubmission(reportData);
    if (success) refreshVehicleLiveData(selectedLineForAction);
}




// Помощна функция за генериране на бутон
function renderReportButton(type, label, img, color, bg) {
    return `
        <button class="report-compact-btn" onclick="submitReport('${type}')" 
            style="background:${bg}; color:${color}; border:1px solid ${color}44; flex: 1 1 45%; cursor:pointer;">
            <img src="${img}" style="width:20px; height:20px;">
            <span>${label}</span>
        </button>
    `;
}


// Помощна функция за ред с гласуване
function renderVoteRow(report, inRadius) {
    const config = REPORT_TYPES[report.type];
    const myVote = report.usersVoted.find(u => u.nick === currentUserNick);
    const btnStyle = `padding: 6px 12px; border-radius: 8px; border: 1px solid #ccc; background: white; font-size: 12px; cursor: pointer; flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;`;
    
    return `
        <div style="background:#f9f9f9; padding:8px; border-radius:10px; margin-bottom:8px; border:1px solid #eee;">
            <div style="font-size:12px; margin-bottom:6px;">Сигнал за <b>${t(config.label)}</b>?</div>
            <div style="display:flex; gap:8px;">
                <button style="${btnStyle} ${myVote?.vote==='up'?'border-color:green; color:green; background:#e8f5e9;':''}" 
                    onclick="voteReport('${report.id}','up')" ${!inRadius?'disabled':''}>👍 ${report.upvotes}</button>
                <button style="${btnStyle} ${myVote?.vote==='down'?'border-color:red; color:red; background:#ffebee;':''}" 
                    onclick="voteReport('${report.id}','down')" ${!inRadius?'disabled':''}>👎 ${report.downvotes}</button>
            </div>
        </div>
    `;
}

// Добави тази функция някъде в script.js (например след openLineModal)
// В script.js -> Намери и замени refreshVehicleLiveData

// Помощна функция за рендиране на списък за гласуване в модала
function renderModalVotes(reports, canVote) {
    const container = document.getElementById('modal-vote-section');
    container.innerHTML = reports.map(r => {
        const config = REPORT_TYPES[r.type];
        const myVote = r.usersVoted.find(u => u.nick === currentUserNick);
        return `
            <div style="margin-bottom:10px; padding:8px; background:var(--surface); border-radius:8px; border:1px solid #eee;">
                <div style="font-size:12px; font-weight:bold; margin-bottom:5px;">Сигнал: ${t(config.label)}</div>
                <div style="display:flex; gap:8px;">
                    <button class="vote-btn upvote ${myVote?.vote==='up'?'active':''}" onclick="voteReport('${r.id}','up')" ${!canVote?'disabled':''}>👍 ${r.upvotes}</button>
                    <button class="vote-btn downvote ${myVote?.vote==='down'?'active':''}" onclick="voteReport('${r.id}','down')" ${!canVote?'disabled':''}>👎 ${r.downvotes}</button>
                </div>
            </div>
        `;
    }).join('');
}


// --- Ride Along & Main Listeners ---

function closeRideAlong() {
    rideAlongState.active = false;
    if (rideAlongState.timer) clearInterval(rideAlongState.timer);
    const raScreen = document.getElementById('screen-ride-along');
    const backdrop = document.getElementById('ride-along-backdrop');
    raScreen.classList.remove('active'); raScreen.classList.add('hidden');
    if(backdrop) backdrop.classList.remove('active');
    document.querySelector('[data-target="screen-map"]').click();
}



function setupActionListeners() { 
    // 1. Затваряне на долния панел (Bottom Sheet)
    document.getElementById('btn-close-sheet').onclick = closeBottomSheet; 
    
    // 2. Бутон Рефреш (в панела на спирката)
    document.getElementById('btn-refresh').onclick = () => { 
        if (currentOpenStopId) { 
            const container = document.getElementById('sheet-arrivals-list'); 
            container.innerHTML = '<div style="text-align:center; padding:30px;"><span class="rotating material-icons-round">refresh</span></div>'; 
            loadArrivals(currentOpenStopId, container); 
        }
    }; 
    
    // 3. Бутон Любими (Звездата) - Отваря новото меню
    document.getElementById('btn-fav-stop').onclick = () => { 
        if (!currentOpenStopId) return; 
        openFavMenu(currentOpenStopId);
    }; 
    
    // 4. Бутон Режим на времето (Часовника - Абсолютно/Оставащо)
    document.getElementById('btn-time-mode').onclick = () => { 
        timeDisplayMode = timeDisplayMode === 'RELATIVE' ? 'ABSOLUTE' : 'RELATIVE'; 
        localStorage.setItem('timeDisplayMode', timeDisplayMode); 
        updateTimeIconState(); 
        if(currentOpenStopId) { 
            const container = document.getElementById('sheet-arrivals-list'); 
            loadArrivals(currentOpenStopId, container); 
        } 
    }; 
    
    // 5. Бутон Разписание (Timetable) - В долния панел
    document.getElementById('btn-timetable').onclick = () => {
        if(currentOpenStopId) {
            const stop = allStopsData.find(s => s.stop_id === currentOpenStopId);
            if(stop && stop.stop_code) openTimetableScreen(stop);
            else alert("Няма код за тази спирка.");
        }
    };

    // --- МОДАЛЕН ПРОЗОРЕЦ (Когато цъкнеш на линия/автобус) ---

    // 6. Действие: Маршрут върху карта
    document.getElementById('action-show-route').onclick = () => { 
        // Подаваме флага isActionFromVehicle
        showRouteOnMap(selectedLineForAction, selectedStopForAction, isActionFromVehicle); 
        closeModal(); 
    }; 
    
    // 7. Действие: Проследи на живо (Ride Along)
    document.getElementById('action-track-live').onclick = () => { 
        closeModal(); 
        
        // Логика: Ако модалът е отворен от спирка (isActionFromVehicle == false), 
        // значи потребителят е "на спирката".
        // Ако е отворен от картата/радара (isActionFromVehicle == true), 
        // значи потребителят просто гледа.
        const isUserAtStop = !isActionFromVehicle; 

        startRideAlong(
            selectedLineForAction.trip_id, 
            selectedStopForAction,
            selectedLineForAction.route_name,
            selectedLineForAction.destination,
            selectedLineForAction.route_type,
            isUserAtStop // <--- ВАЖНО: Предаваме правилното състояние
        ); 
    };
    
	
	// Alarm Button
document.getElementById('btn-alarm-stop').onclick = () => {
    if (currentOpenStopId) {
        // Искаме разрешение за нотификации при първия клик
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        openAlarmWizard(currentOpenStopId);
    }
};
	
	
	
    // 8. Бутон за изход от Ride Along
    const btnStop = document.getElementById('btn-stop-ride-along'); 
    if(btnStop) btnStop.onclick = closeRideAlong;

    // 9. Клик върху заглавната част на панела (за възстановяване ако е минимизиран)
    const dragZone = document.getElementById('sheet-drag-zone');
    if(dragZone) {
        dragZone.addEventListener('click', (e) => {
            if (e.target.closest('#btn-close-sheet')) return;
            const sheet = document.getElementById('bottom-sheet');
            if (sheet.classList.contains('sheet-minimized')) {
                sheet.style.transform = ''; 
                sheet.classList.remove('sheet-minimized');
            }
        });
    }
}



function updateTimeIconState() { const btn = document.getElementById('btn-time-mode'); if(timeDisplayMode === 'ABSOLUTE') btn.classList.add('active'); else btn.classList.remove('active'); }
function updateFavIconState(stopId) { const btn = document.getElementById('btn-fav-stop'); const icon = btn.querySelector('span'); if (favoriteStops.includes(stopId)) { icon.textContent = 'star'; btn.style.color = '#FFD700'; } else { icon.textContent = 'star_border'; btn.style.color = '#49454f'; } }
function deselectStop() { selectedStopId = null; currentOpenStopId = null; document.getElementById('bottom-sheet').classList.add('hidden'); map.closePopup(); updateVisibleMarkers(); if(activeRoutesList.length > 0) redrawAllActiveRoutes(); checkAndManageTimers(); }


function closeBottomSheet() { 
    const sheet = document.getElementById('bottom-sheet'); 
    sheet.classList.add('hidden'); 
    sheet.style.transform = ''; 
    
    // Почистване
    sheet.classList.remove('sheet-minimized');
    
    selectedStopId = null; 
    currentOpenStopId = null; 
    updateVisibleMarkers(); 
    if(activeRoutesList.length > 0) redrawAllActiveRoutes(); 
    checkAndManageTimers(); 
	updateMapButtons(0);
}

// --- ПОДОБРЕНА ЛОГИКА ЗА ВЛАЧЕНЕ (SWIPE) ---
function setupSwipeGestures() { 
    const sheet = document.getElementById('bottom-sheet'); 
    const dragZone = document.getElementById('sheet-drag-zone');
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;

    // Помощна функция за Y координата
    const getClientY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

    // 1. НАЧАЛО НА ВЛАЧЕНЕТО
    const onStart = (e) => {
        // Игнорираме ако се натисне бутон (напр. X за затваряне) вътре в хедъра
        if (e.target.closest('button')) return;
        
        isDragging = true;
        startY = getClientY(e);
        startTime = Date.now();
        
        // Добавяме клас, който спира анимацията (transition), за да следва пръста мигновено
        sheet.classList.add('dragging');
    };

    // 2. ДВИЖЕНИЕ
    const onMove = (e) => {
        if (!isDragging) return;
        
        currentY = getClientY(e);
        const delta = currentY - startY;

        // Логика:
        // Ако delta > 0 -> влачим надолу (положително число) -> скриваме
        // Ако delta < 0 -> влачим нагоре (отрицателно) -> правим "ластичен" ефект
        
        if (delta > 0) {
            // Движение надолу: 1:1 следва пръста
            sheet.style.transform = `translateY(${delta}px)`;
        } else {
            // Движение нагоре (Resistance): Движи се по-бавно, за да покаже, че не може повече
            // Делим на 4 за съпротивление
            sheet.style.transform = `translateY(${delta / 4}px)`;
        }
        
        // Спираме стандартния скрол/презареждане на страницата
        if (e.cancelable && e.type === 'touchmove') {
            e.preventDefault(); 
        }
    };

    // 3. КРАЙ (ПУСКАНЕ)
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        // Махаме класа, за да се включи CSS анимацията за "snap" ефекта
        sheet.classList.remove('dragging');
        
        const delta = currentY - startY;
        const timeElapsed = Date.now() - startTime;
        
        // Определяме дали е било бързо плъзване (flick)
        const isFlick = timeElapsed < 250 && Math.abs(delta) > 50;
        
        // УСЛОВИЯ ЗА ЗАТВАРЯНЕ:
        // 1. Ако сме дръпнали надолу повече от 120px
        // 2. ИЛИ ако е било бързо плъзване надолу
        if ((delta > 120) || (isFlick && delta > 0)) {
            // Затваряме
            closeBottomSheet();
        } else {
            // Връщаме обратно в изходна позиция (Bounce back)
            sheet.style.transform = '';
        }
        
        // Ресет на променливите
        startY = 0;
        currentY = 0;
    };

    // Закачане на слушателите
    // passive: false е важно за да работи preventDefault при iOS
    dragZone.addEventListener('touchstart', onStart, { passive: false });
    dragZone.addEventListener('mousedown', onStart);

    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mousemove', onMove);

    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);
}
// --- NAVIGATION ---
// Глобална променлива (по подразбиране е включено)
// --- NAVIGATION SETUP ---
// Глобална променлива за състоянието
let IS_SOCIAL_ENABLED = true;

function setupNavigation() { 
    // 1. Питаме сървъра за глобалните настройки (за скриване/показване на бутона)
    fetch(`${API_BASE_URL}config`)
        .then(r => r.json())
        .then(config => {
            IS_SOCIAL_ENABLED = config.social_enabled;
            
            // Запазваме режима на поддръжка
            if (config.maintenance_mode !== undefined) {
                localStorage.setItem('SOCIAL_MAINTENANCE_MODE', config.maintenance_mode ? 'TRUE' : 'FALSE');
            }

            // Управление на бутона в менюто
            const socialBtn = document.querySelector('.nav-item[data-target="screen-social"]');
            
            if (socialBtn) {
                if (IS_SOCIAL_ENABLED) {
                    socialBtn.style.display = 'flex';
                } else {
                    socialBtn.style.display = 'none';
                    // Ако потребителят е в скрития екран, го местим
                    const socialScreen = document.getElementById('screen-social');
                    if (socialScreen && socialScreen.classList.contains('active')) {
                        document.querySelector('[data-target="screen-map"]').click();
                    }
                }
            }
        })
        .catch(err => {
            console.log("Config fetch error, using default", err);
            IS_SOCIAL_ENABLED = true; 
        });

    // 2. Логика за превключване на табовете
    const navBtns = document.querySelectorAll('.nav-item'); 
    
    navBtns.forEach(btn => { 
        btn.addEventListener('click', () => { 
            const targetId = btn.dataset.target; 
            
            // ЗАЩИТА: Ако е спрян глобално
            if (targetId === 'screen-social' && !IS_SOCIAL_ENABLED) return;

            // Визуална смяна на бутоните
            navBtns.forEach(b => b.classList.remove('active')); 
            btn.classList.add('active'); 
            
            // Скриване на всички екрани
            document.querySelectorAll('.screen').forEach(s => { 
                s.classList.remove('active'); 
                s.classList.add('hidden'); 
            }); 
            
            // ПОКАЗВАНЕ НА ЦЕЛЕВИЯ ЕКРАН
            const targetScreen = document.getElementById(targetId);
            targetScreen.classList.remove('hidden'); 
            targetScreen.classList.add('active'); 
            
            // Специфични действия за всеки екран:

            // КАРТА: Опресняване на размера (Leaflet fix)
            if (targetId === 'screen-map') {
                setTimeout(() => map.invalidateSize(), 100); 
            }

            // ОБЩНОСТ: Инициализация (Рисува веднага, ако има данни)
            if (targetId === 'screen-social') {
                if (typeof initSocialTab === 'function') initSocialTab();
            }
            
            // ЛЮБИМИ: Зареждане на списъка
            if (targetId === 'screen-favorites') {
                loadFavoritesScreen(); 
                if (typeof refreshFavoritesLiveStatus === 'function') refreshFavoritesLiveStatus(); 
            }
            
            // ТЪРСЕНЕ: Зареждане (ако е празно)
            if (targetId === 'screen-search') {
                // Може да подадем празен стринг или да оставим каквото е било
                const searchInput = document.getElementById('global-search-input');
                if (searchInput && searchInput.value === "") renderSearchList(""); 
            } 
        }); 
    }); 
    
    // 3. Логика за GPS бутона (Locate)
    const btnLocate = document.getElementById('btn-locate');
    if (btnLocate) {
        // Клонираме бутона, за да изчистим стари слушатели (ако има)
        const newBtn = btnLocate.cloneNode(true);
        btnLocate.parentNode.replaceChild(newBtn, btnLocate);
        
        newBtn.addEventListener('click', () => { 
            if (!navigator.geolocation) {
                alert("Геолокацията не се поддържа от това устройство.");
                return;
            }
            newBtn.style.opacity = '0.5';
            
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    newBtn.style.opacity = '1';
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    // Запазваме локацията глобално
                    userLocation = { lat, lng };
                    
                    // Местим картата
                    map.setView([lat, lng], 16);
                    
                    // Рисуваме маркера
                    if (userLocationMarker) map.removeLayer(userLocationMarker);
                    
                    const customIcon = L.divIcon({
                        className: 'user-location-icon',
                        html: `<div class="user-loc-pulse"></div><div class="user-loc-dot"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });
                    
                    userLocationMarker = L.marker([lat, lng], {
                        icon: customIcon,
                        zIndexOffset: 10000
                    }).addTo(map);
                },
                (err) => {
                    newBtn.style.opacity = '1';
                    console.error(err);
                    alert("Неуспешно локализиране. Проверете GPS настройките.");
                },
                { enableHighAccuracy: true, timeout: 5000 }
            ); 
        });
    }
}


// --- НОВА ФУНКЦИЯ ЗА МАСОВО ОБНОВЯВАНЕ НА ЛЮБИМИ ---
async function refreshFavoritesLiveStatus() {
    const favStopsData = favoriteStops.map(id => allStopsData.find(s => s.stop_id === id)).filter(s => s);
    const codesToCheck = favStopsData.map(s => s.stop_code).filter(c => c);

    if (codesToCheck.length === 0) return;

    try {
        const response = await fetch(`${API_BASE_URL}bulk_detailed_arrivals`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json', 'Accept-Language': currentLanguage}, 
            body: JSON.stringify({ stop_codes: codesToCheck }) 
        });

        if (!response.ok) return;
        const newData = await response.json();
        let hasGlobalChanges = false;

        favStopsData.forEach(stop => {
            const code = stop.stop_code;
            const newArrivals = newData[code];

            if (newArrivals) {
                const cachedArrivals = stopsStatusCache[code];
                
                // Проверяваме за промяна в данните
                if (JSON.stringify(newArrivals) !== JSON.stringify(cachedArrivals)) {
                    stopsStatusCache[code] = newArrivals;
                    hasGlobalChanges = true;
                }

                // --- ТУК Е ПРОМЯНАТА ---
                // Независимо дали данните са нови, обновяваме вида на иконата
                
                const img = document.querySelector(`.list-item-container[data-stop-id="${stop.stop_id}"] .list-header-row img`);
                if (img) {
                    // 1. Сменяме картинката (ако трябва)
                    const newIcon = getIconFileName(stop);
                    if (img.src !== newIcon) img.src = newIcon;

                    // 2. Сменяме прозрачността (НОВО)
                    updateIconOpacity(img, code);
                }
            }
        });

        if (hasGlobalChanges) {
            saveStatusCache();
            updateVisibleMarkers();
        }
    } catch (e) { console.error(e); }
}


let searchLiveUpdateTimer = null; // Таймер за забавяне на заявките

async function refreshSearchResultsLiveStatus() {
    clearTimeout(searchLiveUpdateTimer);
    searchLiveUpdateTimer = setTimeout(async () => {
        const visibleItems = document.querySelectorAll('#global-search-results .list-item-container');
        if (visibleItems.length === 0) return;

        const stopsMap = new Map();
        const codesToCheck = [];

        visibleItems.forEach(item => {
            const id = item.getAttribute('data-stop-id');
            const stop = allStopsData.find(s => s.stop_id == id);
            if (stop && stop.stop_code) {
                stopsMap.set(stop.stop_code, stop);
                codesToCheck.push(stop.stop_code);
            }
        });

        if (codesToCheck.length === 0) return;

        try {
            const response = await fetch(`${API_BASE_URL}bulk_detailed_arrivals`, { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json', 'Accept-Language': currentLanguage}, 
                body: JSON.stringify({ stop_codes: codesToCheck }) 
            });

            if (!response.ok) return;
            const newData = await response.json();
            let hasChanges = false;

            codesToCheck.forEach(code => {
                const stop = stopsMap.get(code);
                const newArrivals = newData[code];

                if (newArrivals) {
                    const cachedArrivals = stopsStatusCache[code];
                    if (JSON.stringify(newArrivals) !== JSON.stringify(cachedArrivals)) {
                        stopsStatusCache[code] = newArrivals;
                        hasChanges = true;
                    }

                    // --- ПРОМЯНАТА ЗА ТЪРСЕНЕ ---
                    const img = document.querySelector(`#global-search-results .list-item-container[data-stop-id="${stop.stop_id}"] img`);
                    if (img) {
                        const newIcon = getIconFileName(stop);
                        if (img.src !== newIcon) img.src = newIcon;
                        
                        // Слагаме прозрачност
                        updateIconOpacity(img, code);
                    }
                }
            });

            if (hasChanges) {
                saveStatusCache();
                updateVisibleMarkers();
            }
        } catch (e) { console.error(e); }
    }, 800);
}

// --- ПОМОЩНА ФУНКЦИЯ ЗА ПРОЗРАЧНОСТ ---
function updateIconOpacity(imgElement, stopCode) {
    if (!imgElement || !stopCode) return;
    
    const status = stopsStatusCache[stopCode];
    let opacity = 1.0; // По подразбиране е плътно

    if (status) {
        // Проверяваме дали има поне едно пристигане в рамките на лимита (напр. 4 часа)
        const validArrivals = Array.isArray(status) ? status.filter(a => a.eta_minutes <= MAX_ARRIVAL_MINUTES) : [];
        
        // Ако няма нищо скоро -> става прозрачно (0.4)
        if (validArrivals.length === 0) {
            opacity = 0.4;
        }
    }
    
    // Прилагаме стила
    imgElement.style.opacity = opacity;
}


// --- ОБНОВЕНА ТЪРСАЧКА (РАБОТИ НАВСЯКЪДЕ) ---
// --- ТЪРСАЧКА И ТАЙНИ КОДОВЕ ---
function setupSearch() {
    
    // Помощна функция за проверка на кода
    const checkSecretCode = (val) => {
        const cleanVal = val.trim(); // Махаме интервалите

        // 1. Активиране на режим без лимити
        if (cleanVal === 'devmode_on') {
            localStorage.setItem('IS_ADMIN_USER', 'true');
            alert('✅ АДМИН РЕЖИМ ВКЛЮЧЕН!\nВече нямаш лимит за доклади.');
            location.reload(); // Рестарт за да хване настройките
            return true;
        }
        
        // 2. Деактивиране
        if (cleanVal === 'devmode_off') {
            localStorage.removeItem('IS_ADMIN_USER');
            alert('❌ АДМИН РЕЖИМ ИЗКЛЮЧЕН.');
            location.reload();
            return true;
        }
        
        // 3. Отваряне на Админ Панела (за банване/триене)
        if (cleanVal === 'admin_on') { 
            openAdminSuggestions();
            return true;
        }
        
        return false;
    };

    // 1. Търсачка в таб "Търсене" (Глобална)
    const globalInput = document.getElementById('global-search-input');
    if (globalInput) {
        globalInput.addEventListener('input', (e) => {
            const val = e.target.value;
            
            // Ако е код -> изпълняваме и чистим полето
            if (checkSecretCode(val)) {
                e.target.value = ''; 
                return;
            }
            
            // Иначе си търсим спирки
            renderSearchList(val); 
        });
    }

    // 2. Търсачка в таб "Карта" (Google Maps Input)
    const mapInput = document.getElementById('map-search-input');
    if (mapInput) {
        mapInput.addEventListener('input', (e) => {
            const val = e.target.value;
            
            if (checkSecretCode(val)) {
                e.target.value = '';
                // Скриваме X бутона, ако е останал
                const clearBtn = document.getElementById('btn-search-clear');
                if(clearBtn) clearBtn.classList.add('hidden');
                return;
            }
            // Тук не правим нищо друго, Google Autocomplete си работи сам
        });
    }
}




function renderSearchList(query, targetContainerId = 'global-search-results') { 
    const container = document.getElementById(targetContainerId); 
    container.innerHTML = ''; 
    
    if (allStopsData.length === 0) { 
        container.innerHTML = `<div class="empty-message">${t('loading')}</div>`; 
        return; 
    } 
    
    const lowerQuery = query.toLowerCase().trim(); 
    let filtered = !lowerQuery ? allStopsData.slice(0, 50) : allStopsData.filter(s => s.stop_name.toLowerCase().includes(lowerQuery) || (s.stop_code && s.stop_code.includes(lowerQuery))).slice(0, 50); 
    
    const unique = []; const seen = new Set(); 
    filtered.forEach(s => { 
        const key = s.stop_code ? s.stop_code : s.stop_id;
        if(!seen.has(key)) { 
            seen.add(key); 
            unique.push(s); 
        } 
    });
    const displayList = unique.slice(0, 50); 
    
    if (displayList.length === 0) { 
        container.innerHTML = '<div class="empty-message">Няма резултати.</div>'; return; 
    } 
    
    displayList.forEach(stop => { 
        const wrapper = document.createElement('div');
        wrapper.className = 'list-item-container';
        wrapper.setAttribute('data-stop-id', stop.stop_id); 

        const iconFileName = getIconFileName(stop);
        const codePart = stop.stop_code ? `<span class="list-code-span">(${stop.stop_code})</span>` : '';

        let opacityStyle = 'opacity: 1.0;';
        if (stop.stop_code && stopsStatusCache[stop.stop_code]) {
             const cached = stopsStatusCache[stop.stop_code];
             const hasActiveVehicles = Array.isArray(cached) && cached.some(a => a.eta_minutes <= MAX_ARRIVAL_MINUTES);
             if (!hasActiveVehicles) opacityStyle = 'opacity: 0.4;';
        }

        const headerDiv = document.createElement('div');
        headerDiv.className = 'list-header-row';
        headerDiv.innerHTML = `
            <img src="${iconFileName}" alt="icon" style="width: 32px; height: 32px; margin-right: 12px; flex-shrink: 0; object-fit: contain; ${opacityStyle}">
            <div class="list-title-text">${stop.stop_name} ${codePart}</div>
            <span class="material-icons-round list-expand-icon" id="search-expand-${stop.stop_id}">expand_more</span>
        `;

        const actionsBar = document.createElement('div');
        actionsBar.className = 'list-actions-bar';
        actionsBar.id = `search-actions-${stop.stop_id}`;

        // --- НОВО: БУТОН ЗА АЛАРМА ---
        const alarmBtn = makeIconBtn('alarm', null, () => {
            if ("Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
            openAlarmWizard(stop.stop_id);
        });
        // Проверка дали има активна аларма за тази спирка
        if (typeof activeAlarms !== 'undefined' && activeAlarms.some(a => a.stopId === stop.stop_id)) {
            alarmBtn.style.color = '#4CAF50';
        }
        actionsBar.appendChild(alarmBtn);
        // -----------------------------

        // Бутон Карта
        actionsBar.appendChild(makeIconBtn('map', null, () => locateFromFav(stop.stop_id)));

        // Бутон Любими
        const isFav = favoriteStops.includes(stop.stop_id);
        const favBtn = makeIconBtn(isFav ? 'star' : 'star_border', null, () => {
             openFavMenu(stop.stop_id);
        });
        if(isFav) favBtn.style.color = '#FFD700';
        actionsBar.appendChild(favBtn);

        const arrivalsDiv = document.createElement('div');
        arrivalsDiv.className = 'list-arrivals-content';
        arrivalsDiv.id = `search-arrivals-${stop.stop_id}`; 
		
        headerDiv.onclick = () => toggleExpandedListCard(stop, headerDiv, actionsBar, arrivalsDiv, 'SEARCH');

        wrapper.appendChild(headerDiv);
        wrapper.appendChild(actionsBar);
        wrapper.appendChild(arrivalsDiv);
        container.appendChild(wrapper);
    });

    refreshSearchResultsLiveStatus();
}




// ВАЖНО: Замени цялата функция loadFavoritesScreen с тази обновена версия
function loadFavoritesScreen() { 
    const container = document.getElementById('favorites-list'); 
    container.innerHTML = ''; 
    
    if (favoriteStops.length === 0) { 
        container.innerHTML = `<div class="empty-message">${t('no_favorites')}</div>`; 
        return; 
    } 
    
    if(allStopsData.length === 0) { 
        container.innerHTML = '<div class="empty-message">Зареждане...</div>'; 
        setTimeout(loadFavoritesScreen, 500); 
        return; 
    } 
    
    const aliases = JSON.parse(localStorage.getItem('favAliases') || '{}');
    
    favoriteStops.forEach((favId) => { 
        const isCustom = favId.startsWith('custom_');
        let stopData = null;
        let displayName = "";
        let codeDisplay = "";
        let iconHtml = "";

        if (isCustom) {
            const customObj = customStopsData.find(c => c.id === favId);
            if (!customObj) return; 
            
            stopData = { stop_id: favId, stop_name: customObj.name }; 
            displayName = customObj.name;
            codeDisplay = `<span class="list-code-span">(${customObj.subStops.length} ${t('txt_stops_count')})</span>`;
            iconHtml = `<div class="list-icon-box" style="background:#e0f7fa; color:#006064;"><span class="material-icons-round">merge_type</span></div>`;
        } else {
            const realStop = allStopsData.find(s => s.stop_id === favId);
            if (!realStop) return;
            
            stopData = realStop;
            displayName = aliases[realStop.stop_id] || realStop.stop_name;
            codeDisplay = realStop.stop_code ? `<span class="list-code-span">(${realStop.stop_code})</span>` : '';
            
            const iconUrl = getIconFileName(realStop);
            let opacityStyle = 'opacity: 1.0;';
            if (realStop.stop_code && stopsStatusCache[realStop.stop_code]) {
                 const cached = stopsStatusCache[realStop.stop_code];
                 const hasActiveVehicles = Array.isArray(cached) && cached.some(a => a.eta_minutes <= 240); 
                 if (!hasActiveVehicles) opacityStyle = 'opacity: 0.4;';
            }
            iconHtml = `<img src="${iconUrl}" alt="icon" style="width: 32px; height: 32px; margin-right: 12px; flex-shrink: 0; object-fit: contain; ${opacityStyle}">`;
        }

        const wrapper = document.createElement('div'); 
        wrapper.className = 'list-item-container'; 
        wrapper.setAttribute('data-stop-id', stopData.stop_id);
        
        const headerRow = document.createElement('div');
        headerRow.className = 'list-header-row';
        
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '<span class="material-icons-round">swap_vert</span>';
        setupDragEvents(dragHandle, wrapper, container);
        
        const clickArea = document.createElement('div');
        clickArea.className = 'header-click-area';
        
        clickArea.innerHTML = `
            ${iconHtml}
            <div class="list-title-text">
                ${displayName} ${codeDisplay}
            </div>
            <span class="material-icons-round list-expand-icon" id="expand-icon-${stopData.stop_id}">expand_more</span>
        `;
        
        headerRow.appendChild(dragHandle);
        headerRow.appendChild(clickArea);

        const actionsBar = document.createElement('div');
        actionsBar.className = 'list-actions-bar';
        actionsBar.id = `actions-${stopData.stop_id}`;
        
        const buttonsRight = document.createElement('div');
        buttonsRight.className = 'list-buttons-right'; 
        actionsBar.appendChild(buttonsRight);

        // --- НОВО: БУТОН ЗА АЛАРМА (САМО ЗА СТАНДАРТНИ СПИРКИ) ---
        if (!isCustom) {
            const alarmBtn = makeIconBtn('alarm', null, () => {
                if ("Notification" in window && Notification.permission !== "granted") {
                    Notification.requestPermission();
                }
                openAlarmWizard(stopData.stop_id);
            });
            if (typeof activeAlarms !== 'undefined' && activeAlarms.some(a => a.stopId === stopData.stop_id)) {
                alarmBtn.style.color = '#4CAF50';
            }
            buttonsRight.appendChild(alarmBtn);
        }
        // --------------------------------------------------------

        if (!isCustom) {
            buttonsRight.appendChild(makeIconBtn('map', null, () => locateFromFav(stopData.stop_id)));
            buttonsRight.appendChild(makeIconBtn('edit', null, () => renameFavorite(stopData.stop_id, stopData.stop_name.replace(/'/g, "\\'"))));
        } else {
            buttonsRight.appendChild(makeIconBtn('edit', null, () => openCustomStopCreator(stopData.stop_id)));
        }
        
        const delBtn = makeIconBtn('delete', null, () => removeFavorite(stopData.stop_id));
        delBtn.classList.add('btn-delete');
        buttonsRight.appendChild(delBtn);

        const arrivalsDiv = document.createElement('div');
        arrivalsDiv.className = 'list-arrivals-content';
        arrivalsDiv.id = `arrivals-${stopData.stop_id}`;
        
        clickArea.onclick = () => {
            if (isCustom) {
                 toggleExpandedCustomStop(favId, headerRow, arrivalsDiv);
            } else {
                 toggleExpandedListCard(stopData, headerRow, actionsBar, arrivalsDiv, 'FAVORITES');
            }
        };

        wrapper.appendChild(headerRow);
        wrapper.appendChild(actionsBar); 
        wrapper.appendChild(arrivalsDiv);
        
        container.appendChild(wrapper); 
    }); 
}

async function toggleExpandedItem(stop, container, icon) { 
    if (container.classList.contains('visible')) { 
        container.classList.remove('visible'); 
        icon.classList.remove('expanded'); 
        container.innerHTML = ''; 
    } else { 
        container.classList.add('visible'); 
        icon.classList.add('expanded'); 
        
        // Създаваме Toolbar-а
        const toolbar = document.createElement('div'); 
        toolbar.className = 'fav-toolbar'; 
        
        // Помощна функция за бутони
        const createToolBtn = (iconName, text, onClick) => { 
            const btn = document.createElement('button'); 
            btn.className = 'fav-tool-btn'; 
            
            if (iconName === 'schedule' && timeDisplayMode === 'ABSOLUTE') {
                btn.classList.add('active'); 
            }
            
            if(text) {
                // Бутон с текст (Time Table)
                btn.innerHTML = `<div class="btn-text-stack"><span>${text.split(' ')[0]}</span><span>${text.split(' ')[1]}</span></div>`; 
            } else {
                // Бутон с икона
                btn.innerHTML = `<span class="material-icons-round">${iconName}</span>`; 
            }
            
            btn.onclick = (e) => {
                e.stopPropagation(); // Спираме клика да не затвори контейнера
                onClick();
            };
            return btn; 
        }; 
        
        // 1. REFRESH БУТОН - Вече работи
        toolbar.appendChild(createToolBtn('refresh', null, () => {
            arrivalsContainer.innerHTML = '<div style="text-align:center; padding:10px;"><span class="rotating material-icons-round">refresh</span></div>';
            loadArrivals(stop.stop_id, arrivalsContainer);
        })); 
        
        // 2. TIME MODE (Часовник)
        toolbar.appendChild(createToolBtn('schedule', null, () => { 
            timeDisplayMode = timeDisplayMode === 'RELATIVE' ? 'ABSOLUTE' : 'RELATIVE'; 
            localStorage.setItem('timeDisplayMode', timeDisplayMode); 
            
            // Презареждаме данните с новия формат
            loadArrivals(stop.stop_id, arrivalsContainer); 
            
            // Обновяваме визуално бутона (активен/неактивен)
            const allScheduleBtns = document.querySelectorAll('.fav-tool-btn .material-icons-round');
            // Това е малко грубо, но върши работа за обновяване на UI-а локално
            if(timeDisplayMode==='ABSOLUTE') 
                toolbar.children[1].classList.add('active'); 
            else 
                toolbar.children[1].classList.remove('active'); 
        })); 
        
        // 3. TIMETABLE (РАЗПИСАНИЕ) - НОВО: Свързваме го с openTimetableScreen
        toolbar.appendChild(createToolBtn('', 'Time Table', () => {
            if(stop.stop_code) {
                openTimetableScreen(stop);
            } else {
                alert("Няма код за тази спирка.");
            }
        })); 
        
        container.appendChild(toolbar); 
        
        // Контейнер за пристигащите
        const arrivalsContainer = document.createElement('div'); 
        arrivalsContainer.innerHTML = '<div style="text-align:center; padding:10px;"><span class="rotating material-icons-round">refresh</span></div>'; 
        container.appendChild(arrivalsContainer); 
        
        // Зареждаме данните
        await loadArrivals(stop.stop_id, arrivalsContainer); 
    } 
}

async function openStopSheet(stop) { 
    currentOpenStopId = stop.stop_id; 
    const sheet = document.getElementById('bottom-sheet'); 
    
    // --- ВАЖНО: Изчистваме "маршрутния" режим ---
    sheet.classList.remove('sheet-minimized'); 
    // --------------------------------------------
    
    document.getElementById('sheet-stop-name').textContent = stop.stop_code ? `${stop.stop_name} (${stop.stop_code})` : stop.stop_name; 
    updateFavIconState(stop.stop_id); 
    // НОВО: Оцветяване на камбанката ако има аларма
    updateAlarmButtonState(stop.stop_id);
	
	// --- ДОБАВИ ТОЗИ РЕД ТУК: ---
    updateTimeIconState(); // <--- Това ще провери режима и ще оцвети бутона веднага
    // ----------------------------
    // Връщаме и нормалните бутони (ако са били скрити от маршрута)
    document.querySelector('.sheet-actions-row').style.display = 'flex';

    const container = document.getElementById('sheet-arrivals-list'); 
    container.innerHTML = '<div style="text-align:center; padding:30px;"><span class="rotating material-icons-round" style="font-size:32px;">refresh</span></div>'; 
    
    sheet.classList.remove('hidden'); 
    sheet.style.transform = ''; 
    
    checkAndManageTimers();
    await loadArrivals(stop.stop_id, container); 
}

// --- 1. УНИВЕРСАЛНА ФУНКЦИЯ ЗА ЗАРЕЖДАНЕ ---
async function loadArrivals(stopId, targetContainer, isAutoRefresh = false) { 
    try { 
        const response = await fetch(`${API_BASE_URL}vehicles_for_stop/${stopId}`, { 
            headers: { 'Accept-Language': currentLanguage },
            priority: 'high'
        }); 
        if (!response.ok) throw new Error("Network error");
        const arrivals = await response.json(); 
        const isStillOpen = targetContainer && (targetContainer.classList.contains('visible') || targetContainer.id === 'sheet-arrivals-list');
        if (isStillOpen || isAutoRefresh) {
            requestAnimationFrame(() => { renderArrivals(arrivals, targetContainer, stopId); });
        }
    } catch (e) { 
        console.error("LoadArrivals failed:", e);
        if (!isAutoRefresh) {
            targetContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--on-surface-variant);"><span class="material-icons-round" style="font-size:32px; margin-bottom:8px; opacity:0.5;">wifi_off</span><div style="font-size:14px; font-weight:bold;">${currentLanguage === 'bg' ? 'Няма връзка.' : 'No connection.'}</div></div>`;
        }
    } 
}

// --- 2. ЛОГИКА ЗА КЛИК ВЪРХУ "КАЧИ СЕ" (ФЕТЧВА ДЕСТИНАЦИИ) ---
window.handleGetOnClick = async function(tripId, stopId, routeName, destination, routeType) {
    const loader = document.getElementById('app-loader');
    if (loader) { loader.style.display = 'flex'; loader.querySelector('p').textContent = currentLanguage === 'bg' ? "Зареждане на дестинации..." : "Loading destinations..."; }
    try {
        const res = await fetch(`${API_BASE_URL}stops_for_trip/${tripId}`, { headers: { 'Accept-Language': currentLanguage } });
        const stops = await res.json();
        if (loader) loader.style.display = 'none';
        // Отваряме модала за избор на дестинация
        openDestinationPicker(stops, stopId, tripId, routeName, destination, routeType);
    } catch (e) {
        if (loader) loader.style.display = 'none';
        window.startRideAlong(tripId, stopId, routeName, destination, routeType, true);
    }
};

// --- 3. ДИАЛОГ ЗА ИЗБОР НА ДЕСТИНАЦИЯ ---
function openDestinationPicker(stops, currentStopId, tripId, routeName, destination, routeType) {
    const modal = document.getElementById('modal-select-vehicle');
    const list = document.getElementById('vehicle-select-list');
    const title = modal.querySelector('div[style*="font-weight: bold"]');
    
    title.textContent = currentLanguage === 'bg' ? "Къде ще слизате?" : "Where to get off?";
    list.innerHTML = '';
    modal.classList.remove('hidden');
    modal.classList.add('active');

    // Намираме индекса на текущата спирка
    const currentStop = allStopsData.find(s => s.stop_id == currentStopId);
    const currentIndex = stops.findIndex(s => s.stop_code === currentStop?.stop_code);
    const remainingStops = (currentIndex !== -1) ? stops.slice(currentIndex + 1) : stops;

    remainingStops.forEach(stop => {
        const div = document.createElement('div');
        div.className = 'vehicle-select-item';
        div.innerHTML = `<div><span style="font-weight:bold; font-size:15px;">${stop.stop_name}</span><div style="font-size:11px; color:gray;">${stop.stop_code || ''}</div></div><span class="material-icons-round" style="color:var(--primary);">push_pin</span>`;
        div.onclick = () => {
            closeSelectVehicleModal();
            window.startRideAlong(tripId, currentStopId, routeName, destination, routeType, true);
            setTimeout(() => { if (typeof window.toggleRideAlongPin === 'function') window.toggleRideAlongPin(stop.stop_id); }, 500);
        };
        list.appendChild(div);
    });

    // Добавяме опция "Само проследяване"
    const skipDiv = document.createElement('div');
    skipDiv.className = 'vehicle-select-item';
    skipDiv.style.background = 'var(--background)';
    skipDiv.innerHTML = `<span style="font-weight:900; font-size:13px; color:var(--primary); text-transform:uppercase;">${currentLanguage === 'bg' ? 'Само проследяване' : 'Just track me'}</span>`;
    skipDiv.onclick = () => {
        closeSelectVehicleModal();
        window.startRideAlong(tripId, currentStopId, routeName, destination, routeType, true);
    };
    list.prepend(skipDiv);
}

// --- 4. ОСНОВНОТО РЕНДИРАНЕ НА СПИСЪКА ---
function renderArrivals(arrivals, container, stopId) {
    container.innerHTML = '';
    const validArrivals = arrivals.filter(arr => {
        if (arr.eta_minutes > MAX_ARRIVAL_MINUTES) return false;
        return true;
    }).slice(0, 40);
    if(validArrivals.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#888; padding:10px;">${t('txt_no_courses_soon') || 'Няма курсове.'}</p>`;
        return;
    }
    let htmlBuffer = '';
    const favSet = new Set(favoriteLines);
    const buildCardHtml = (main, others, sId) => {
        const isM = main.route_name.startsWith("M");
        const favKey = isM ? `METRO|${sId}|${main.route_name}|${main.destination}` : `${main.route_name}-${main.destination}`;
        const isFav = favSet.has(favKey);
        let secondaryHighlightColor = '#FFEB3B';
        if (String(main.route_type) === '0') { secondaryHighlightColor = '#8B0000'; }
        let getOnHtml = "";
        if (!isM && main.prediction_source !== 'schedule' && main.eta_minutes <= 2 && userLocation) {
            const radarData = radarMarkers.get(String(main.trip_id));
            if (radarData && radarData.marker) {
                const busPos = radarData.marker.getLatLng();
                const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, busPos.lat, busPos.lng);
                if (dist <= 0.2) {
                    const label = (currentLanguage === 'bg') ? 'КАЧИ СЕ' : 'GET ON';
                    getOnHtml = `<button class="btn-get-on" style="background:#20E354; color:black; font-size:11px; font-weight:900; padding:4px 12px; border-radius:12px; margin-left:10px; border:none; box-shadow:0 2px 5px rgba(0,0,0,0.4); cursor:pointer; display:inline-flex; align-items:center; height:24px; vertical-align:middle;" onclick="event.stopPropagation(); window.handleGetOnClick('${main.trip_id}', '${sId}', '${main.route_name}', '${main.destination}', '${main.route_type}')">${label}</button>`;
                }
            }
        }
        let delayHtml = '';
        if (main.delay_minutes !== null && main.delay_minutes !== undefined) {
            const d = main.delay_minutes;
            const dC = d > 0 ? '#D32F2F' : (d < 0 ? '#1976D2' : '#2E7D32');
            const dT = d > 0 ? `+${d} м` : (d < 0 ? `${d} м` : `±0 м`);
            delayHtml = `<span style="background-color: white; color: ${dC}; border: 1px solid ${dC}80; font-size: 11px; font-weight: 800; padding: 0px 3px; border-radius: 3px; display: inline-block; line-height: 1.3; vertical-align: middle; margin-right: 6px; margin-bottom: 2px;">${dT}</span>`;
        }
        let oHtml = '';
        let secDests = [];
        if (others.length > 0) {
            const timesStr = others.map(o => {
                let tStr = formatTime(o.eta_minutes);
                if (o.destination !== main.destination) {
                    tStr = `<span class="accent-text" style="color:${secondaryHighlightColor}; font-weight:700;">${tStr}</span>`;
                    if (!secDests.includes(o.destination)) secDests.push(o.destination);
                }
                return tStr;
            }).join(", ");
            oHtml = `<span class="subsequent-times" style="display: inline; white-space: normal;">${delayHtml ? '|| ' : ''}(${timesStr})</span>`;
        }
        let destHtml = `<div class="dest-name">${t('to_label')} ${main.destination}</div>`;
        secDests.forEach(d => {
            destHtml += `<div class="dest-name" style="color: ${secondaryHighlightColor}; font-weight: 700;">${t('to_label')} ${d}</div>`;
        });
        let typeCls = 'bg-bus', textCls = 'color-bus', iconNm = 'directions_bus';
        if (main.route_name.startsWith('N')) { typeCls = 'bg-night'; textCls = 'color-night'; iconNm = 'nights_stay'; }
        else if (main.route_type == '0') { typeCls = 'bg-tram'; textCls = 'color-tram'; iconNm = 'tram'; }
        else if (main.route_type == '11') { typeCls = 'bg-trolley'; textCls = 'color-trolley'; iconNm = 'directions_bus'; }
        const cardBg = isM ? getMetroColor(main.route_name) : '';
        const cardStyle = isM ? `style="background-color: ${cardBg}; color: white;"` : '';
        const sigHtml = main.prediction_source === 'schedule' ? `<span class="material-icons-round signal-icon schedule">event_note</span>` : `<span class="material-icons-round signal-icon live">rss_feed</span>`;
        const isTrk = (typeof VoiceTracker !== 'undefined' && VoiceTracker.activeTripId === main.trip_id);
        const badgeHtml = generateReportBadges(main.trip_id, false, (main.deviation && main.deviation.active));
        return `<div class="arrival-card ${isM ? '' : typeCls}" ${cardStyle} onclick="if(!event.target.closest('.line-fav-btn') && !event.target.closest('.voice-btn') && !event.target.closest('.btn-get-on')) openLineModalFromData('${main.route_name}', '${main.destination}', '${main.trip_id}', '${sId}', '${main.route_type}')">
            <div class="route-box" style="position:relative; ${isM ? 'background: rgba(255,255,255,0.2);' : ''}"><span class="material-icons-round route-icon ${isM ? 'color-white' : textCls}">${isM ? 'subway' : iconNm}</span><span class="route-number ${isM ? 'color-white' : textCls}">${main.route_name}</span>${badgeHtml}</div>
            <div class="arrival-content">
                <div class="time-row" style="display:flex; align-items:center;">${sigHtml}<span class="main-time" style="${isM ? 'color:white;' : ''}">${formatTime(main.eta_minutes)}</span>${getOnHtml}</div>
                <div style="display: block; margin-top: 2px; line-height: 1.2; white-space: normal; word-break: break-word;">${delayHtml}${oHtml}</div>
                <div class="dest-group" style="margin-top:2px; ${isM ? 'color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.3);' : ''}">${destHtml}</div>
            </div>
            <button class="voice-btn" style="background:none; border:none; color:${isTrk ? '#FFEB3B' : 'rgba(255,255,255,0.6)'}; padding:10px; cursor:pointer;" onclick="event.stopPropagation(); VoiceTracker.start('${main.trip_id}', '${sId}', '${main.route_name}', '${main.route_type}', '${main.destination}')"><span class="material-icons-round" style="font-size:24px;">${isTrk ? 'volume_up' : 'volume_mute'}</span></button>
            <button class="line-fav-btn ${isFav ? 'active' : ''}" style="${isM ? 'color:white;' : ''}" onclick="toggleLineFav('${main.route_name}', '${main.destination}', this, '${sId}', '${container.id}')"><span class="material-icons-round">${isFav ? 'star' : 'star_border'}</span></button>
        </div>`;
    };
    const metroArr = validArrivals.filter(a => a.route_name.startsWith("M"));
    const groundArr = validArrivals.filter(a => !a.route_name.startsWith("M"));
    if (metroArr.length > 0) {
        const directions = {};
        metroArr.forEach(a => { const dK = getMetroDirectionKey(a); if (!directions[dK]) directions[dK] = []; directions[dK].push(a); });
        Object.keys(directions).forEach(dk => {
            const group = directions[dk];
            const uniqueDests = [...new Set(group.map(a => a.destination.toUpperCase()))].sort();
            htmlBuffer += `<div style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 12px; font-weight: bold; margin-bottom: 8px;">${t('direction_prefix')} ${uniqueDests.join(" / ")}</div>`;
            const lines = {};
            group.forEach(a => { if(!lines[a.route_name]) lines[a.route_name] = []; lines[a.route_name].push(a); });
            Object.values(lines).forEach(la => { la.sort((a, b) => a.eta_minutes - b.eta_minutes); htmlBuffer += buildCardHtml(la[0], la.slice(1, 4), stopId); });
        });
    }
    if (groundArr.length > 0) {
        const lineGroups = {};
        groundArr.forEach(a => { const key = `${a.route_name}_${a.route_type}`; if (!lineGroups[key]) lineGroups[key] = []; lineGroups[key].push(a); });
        const sortedGroups = Object.values(lineGroups).map(g => { g.sort((a, b) => (a.is_live === b.is_live ? a.eta_minutes - b.eta_minutes : (a.is_live ? -1 : 1))); return g; });
        sortedGroups.sort((a, b) => {
            const favA = favSet.has(`${a[0].route_name}-${a[0].destination}`);
            const favB = favSet.has(`${b[0].route_name}-${b[0].destination}`);
            if (favA !== favB) return favA ? -1 : 1;
            return a[0].eta_minutes - b[0].eta_minutes;
        });
        sortedGroups.forEach(g => { htmlBuffer += buildCardHtml(g[0], g.slice(1, 4), stopId); });
    }
    container.innerHTML = htmlBuffer;
}




function formatTime(minutes) { 
    if (timeDisplayMode === 'ABSOLUTE') { 
        const now = new Date(); 
        now.setMinutes(now.getMinutes() + minutes); 
        return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`; 
    } 
    
    const suffixMin = t('time_min');
    const suffixHour = t('time_h');

    // Тук ползваме превода за Пристига
    if (minutes < 1) return t('arriving'); 
    
    if (minutes >= 60) {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}${suffixHour}${m}${suffixMin}`;
    }
    
    return `${minutes} ${suffixMin}`; 
}





window.openLineModalFromData = function(rName, dest, tripId, stopId, rType) {
    const arrival = { route_name: rName, destination: dest, trip_id: tripId, route_type: rType };
    openLineModal(arrival, stopId);
};



// --- RIDE ALONG LOGIC (FROM WORKING VERSION) ---
const GeoUtil = {
    EARTH_RADIUS: 6371009, 
    toRadians: function(degrees) { return degrees * Math.PI / 180; },
    computeDistanceBetween: function(lat1, lon1, lat2, lon2) {
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.EARTH_RADIUS * c;
    },
    findClosestPointOnSegment: function(p, a, b) {
        const x = p.lat, y = p.lng, x1 = a.lat, y1 = a.lng, x2 = b.lat, y2 = b.lng;
        if (x1 === x2 && y1 === y2) return { lat: x1, lng: y1 };
        const A = x - x1, B = y - y1, C = x2 - x1, D = y2 - y1;
        const dot = A * C + B * D; const len_sq = C * C + D * D;
        let param = -1; if (len_sq !== 0) param = dot / len_sq;
        let xx, yy; if (param < 0) { xx = x1; yy = y1; } else if (param > 1) { xx = x2; yy = y2; } else { xx = x1 + param * C; yy = y1 + param * D; }
        return { lat: xx, lng: yy };
    },
    getDistanceAlongShapeToPoint: function(point, shape) {
        let minDistance = Infinity; let bestProjection = { lat: shape[0][0], lng: shape[0][1] }; let bestSegmentIndex = 0;
        for (let i = 0; i < shape.length - 1; i++) {
            const segmentStart = { lat: shape[i][0], lng: shape[i][1] }; const segmentEnd = { lat: shape[i+1][0], lng: shape[i+1][1] };
            const proj = this.findClosestPointOnSegment({lat: point.lat, lng: point.lng}, segmentStart, segmentEnd);
            const dist = this.computeDistanceBetween(point.lat, point.lng, proj.lat, proj.lng);
            if (dist < minDistance) { minDistance = dist; bestProjection = proj; bestSegmentIndex = i; }
        }
        let totalDist = 0;
        for (let i = 0; i < bestSegmentIndex; i++) { totalDist += this.computeDistanceBetween(shape[i][0], shape[i][1], shape[i+1][0], shape[i+1][1]); }
        totalDist += this.computeDistanceBetween(shape[bestSegmentIndex][0], shape[bestSegmentIndex][1], bestProjection.lat, bestProjection.lng);
        return totalDist;
    }
};

function calculateVehicleProgressJS(vehicle, stops, shape, arrivalsMap, tripId) {
    if (!vehicle || shape.length < 2 || stops.length === 0) return { progress: 0, nextStopIndex: 0, eta: null };
    const vehicleLoc = { lat: vehicle.latitude, lng: vehicle.longitude };
    const distTraveled = GeoUtil.getDistanceAlongShapeToPoint(vehicleLoc, shape);
    let nextStopIndex = -1;
    for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        if (!stop.stop_lat) continue;
        const stopLoc = { lat: stop.stop_lat, lng: stop.stop_lon };
        const stopDist = GeoUtil.getDistanceAlongShapeToPoint(stopLoc, shape);
        if (stopDist > distTraveled - 20.0) { nextStopIndex = i; break; }
    }
    if (nextStopIndex === -1) nextStopIndex = stops.length;
    let finalProgress = 0.0;
    if (nextStopIndex >= stops.length) { finalProgress = 1.0; } 
    else if (nextStopIndex <= 0) {
        const firstStop = stops[0];
        const firstStopLoc = { lat: firstStop.stop_lat, lng: firstStop.stop_lon };
        const distToFirst = GeoUtil.getDistanceAlongShapeToPoint(firstStopLoc, shape) || 1.0;
        finalProgress = (Math.max(0, Math.min(1, distTraveled / distToFirst))) / Math.max(1, stops.length - 1);
    } else {
        const prevIndex = nextStopIndex - 1;
        const prevStop = stops[prevIndex];
        const nextStop = stops[nextStopIndex];
        const prevLoc = { lat: prevStop.stop_lat, lng: prevStop.stop_lon };
        const nextLoc = { lat: nextStop.stop_lat, lng: nextStop.stop_lon };
        const distToPrev = GeoUtil.getDistanceAlongShapeToPoint(prevLoc, shape);
        const distToNext = GeoUtil.getDistanceAlongShapeToPoint(nextLoc, shape);
        const segmentLen = distToNext - distToPrev;
        const distInSegment = distTraveled - distToPrev;
        let progressInSegment = 0;
        if (segmentLen > 0) { progressInSegment = Math.max(0, Math.min(1, distInSegment / segmentLen)); }
        finalProgress = (prevIndex + progressInSegment) / Math.max(1, stops.length - 1);
    }
    return { progress: finalProgress, nextStopIndex, eta: null };
}


window.startRideAlong = async function(tripId, stopId, routeNameHint = null, destHint = null, routeTypeHint = null, isManualClick = true) {
    
	
	
	
	// --- НОВО: АВТОМАТИЧНО ИЗКЛЮЧВАНЕ НА РАДАРА ---
    wasRadarActiveBeforeRideAlong = isRadarActive; // Запомняме дали е бил пуснат
    if (isRadarActive) {
        isRadarActive = false;
        stopRadar(); // Спираме изтеглянето на данни
        const rBtn = document.getElementById('btn-live-radar');
        if (rBtn) rBtn.classList.remove('active'); // Махаме синьото от бутона
    }
    // --- 1. АКТИВИРАНЕ НА АУДИОТО ЗА IOS (Ако е ръчен клик) ---
    if (isManualClick) {
        // Отключваме аудиото (за да можем да свирим тишина)
        if (typeof unlockiOSAudio === 'function') unlockiOSAudio();
        // ВАЖНО: Стартираме плеъра веднага - това ще е нашата "постоянна нотификация"
        if (typeof startBackgroundMode === 'function') startBackgroundMode();
        
        // Искаме и разрешение за нотификации (за финала)
        try {
            if (typeof Notification !== 'undefined' && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        } catch (e) {}
    }
    // ----------------------------------------------------------

    closeBottomSheet(); 
    closeModal();
    
    document.querySelector('[data-target="screen-map"]').click();
    document.getElementById('active-routes-container').classList.remove('hidden');

    const raScreen = document.getElementById('screen-ride-along');
    raScreen.classList.remove('hidden'); 
    raScreen.style.height = '50vh';
    raScreen.style.transform = 'translateY(0)';
    
    if (typeof initRideAlongDrag === 'function') initRideAlongDrag();

    const listContainer = document.getElementById('ride-along-list');
    listContainer.innerHTML = '<div style="padding:40px; text-align:center;"><span class="rotating material-icons-round" style="font-size:32px; color:var(--primary);">refresh</span><br>Зареждане...</div>';
    document.getElementById('ride-along-vehicle').classList.add('hidden');

    activeRoutesList = []; 
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();

    rideAlongState.active = true;
    rideAlongState.tripId = String(tripId);
    rideAlongState.originStopId = stopId; 
    rideAlongState.hasNotifiedApproaching = false;
    rideAlongState.notifiedArrival = false;
    rideAlongState.originStopCode = null; 
    rideAlongState.pinnedStopId = null; 
    rideAlongState.cachedRealTimes = new Map();
    shouldAutoCenterVehicle = true; 
    selectedStopId = stopId;

    let typeCode = '3'; 
    if (routeNameHint) {
        if (routeTypeHint !== null && routeTypeHint !== undefined) typeCode = String(routeTypeHint);
        else if (allLinesData.length > 0) {
            const lineData = allLinesData.find(l => l.line_name === routeNameHint);
            if (lineData) {
                if (lineData.transport_type === 'TRAM') typeCode = '0';
                else if (lineData.transport_type === 'TROLLEY') typeCode = '11';
                else if (lineData.transport_type === 'METRO') typeCode = '1';
            }
        }
        
        rideAlongState.routeDetails = { 
            routeName: routeNameHint, 
            destination: destHint || '...', 
            type: typeCode, 
            color: getTransportColor(typeCode, routeNameHint) 
        };
        updateRideAlongHeader();
    }

    try {
        let shapeData = [];
        let stopsData = [];

        try {
            const shapeRes = await fetch(`${API_BASE_URL}shape/${tripId}`);
            if (shapeRes.ok) shapeData = await shapeRes.json();
        } catch (e) { console.warn("Shape fetch failed", e); }

        const stopsRes = await fetch(`${API_BASE_URL}stops_for_trip/${tripId}`, { 
            headers: { 'Accept-Language': currentLanguage } 
        });
        
        if (!stopsRes.ok) throw new Error("Stops fetch failed");
        stopsData = await stopsRes.json();

        const newRoute = { 
            tripId: tripId, 
            routeName: rideAlongState.routeDetails.routeName, 
            routeType: rideAlongState.routeDetails.type, 
            originStopId: stopId, 
            shape: shapeData, 
            stops: stopsData, 
            color: rideAlongState.routeDetails.color,
            isRideAlong: true,         
            fixedVehicleId: tripId,    
            lastNextStopId: null 
        };
        
        activeRoutesList.push(newRoute);
        focusedRouteTripId = tripId;
        
        updateRadarZIndex();
        await updateRouteArrivals(newRoute);
        renderRouteChips();
        redrawAllActiveRoutes();
        updateVisibleMarkers();
        
        const stopObj = allStopsData.find(s => s.stop_id == stopId);
        if(stopObj) {
            map.setView([stopObj.stop_lat, stopObj.stop_lon], 16, { animate: true });
            selectStopWithTooltip(stopObj);
        }

        fetchAndDrawVehicles();
        if (routeVehicleTimer) clearInterval(routeVehicleTimer);
        routeVehicleTimer = setInterval(fetchAndDrawVehicles, VEHICLE_MOVE_INTERVAL);

        rideAlongState.shape = shapeData;
        rideAlongState.stops = stopsData;
        
        const globalOriginNode = allStopsData.find(s => s.stop_id == stopId);
        if (globalOriginNode) rideAlongState.originStopCode = globalOriginNode.stop_code;
        else {
            const tripOriginNode = stopsData.find(s => s.stop_id == stopId); 
            if (tripOriginNode) rideAlongState.originStopCode = tripOriginNode.stop_code; 
        }

        renderRideAlongList();
        
        setTimeout(() => {
            const originIndex = rideAlongState.stops.findIndex(s => s.stop_id == selectedStopId);
            if (originIndex !== -1) { scrollToItem(originIndex); }
        }, 100);

        updateRideAlongData();
        
        if (rideAlongState.timer) clearInterval(rideAlongState.timer);
        rideAlongState.timer = setInterval(updateRideAlongData, 5000);
        
        activateWakeLock();
        
    } catch (e) { 
        console.error("RideAlong Error:", e);
        if (rideAlongState.timer) clearInterval(rideAlongState.timer);
        const errText = e.message || String(e);
        listContainer.innerHTML = `<div style="padding:20px; text-align:center; color:#d32f2f;">Грешка при зареждане: ${errText}<br><br><button onclick="closeRideAlong()" style="background:#eee; border:none; padding:10px; border-radius:10px;">Затвори</button></div>`;
    }

    const btnGroup = document.getElementById('map-buttons-container');
    if (btnGroup) {
        const windowHeight = window.innerHeight;
        btnGroup.style.bottom = `${(windowHeight * 0.5) + 10}px`;
    }
};


// Намери съществуващата функция window.closeRideAlong и я обнови:
window.closeRideAlong = function() {
    rideAlongState.active = false;
    isSharedTrackingActive = false; 
    
    if (rideAlongState.timer) clearInterval(rideAlongState.timer);
    deactivateWakeLock();
    
    // --- ПРОМЯНА: ИНФОРМИРАМЕ ДИСПЕЧЕРА ---
    // Махаме само Ride Along частта от екрана
    if (typeof updateGlobalLockScreen === 'function') {
        updateGlobalLockScreen('CLEAR_RIDE');
    }
    
    // Спираме аудиото САМО ако няма активни аларми И няма нищо друго в диспечера
    if (typeof activeAlarms !== 'undefined' && activeAlarms.length === 0) {
        // Допълнителна проверка: ако няма аларма в Lock Screen стейта
        if (typeof lockScreenState !== 'undefined' && !lockScreenState.alarm) {
            if (typeof stopBackgroundMode === 'function') stopBackgroundMode();
        }
    }
    // ---------------------------------------
    
    if (typeof clearTrackingNotification === 'function') clearTrackingNotification();
    
    const raScreen = document.getElementById('screen-ride-along');
    raScreen.classList.add('hidden');
    raScreen.classList.remove('active');
    
    document.getElementById('minimized-live-widget').classList.add('hidden');
    
    const btnGroup = document.getElementById('map-buttons-container');
    if (btnGroup) {
        btnGroup.style.bottom = 'calc(80px + var(--safe-bottom))';
    }


   // --- НОВО: АВТОМАТИЧНО ВЪЗСТАНОВЯВАНЕ НА РАДАРА ---
    if (wasRadarActiveBeforeRideAlong) {
        isRadarActive = true;
        const rBtn = document.getElementById('btn-live-radar');
        if (rBtn) rBtn.classList.add('active'); // Правим бутона отново син
        
        fetchGlobalRadarVehicles(); // Пускаме радара веднага
        if (radarTimer) clearInterval(radarTimer);
        radarTimer = setInterval(fetchGlobalRadarVehicles, 2000); // Рестартираме таймера
    }
    wasRadarActiveBeforeRideAlong = false; // Изчистваме паметта
    // --------------------------------------------------


    setTimeout(() => {
        raScreen.style.height = ''; 
        raScreen.style.transition = '';
    }, 300);
    
    closeRouteView(); 
	updateMapButtons(0);
    document.querySelector('[data-target="screen-map"]').click();
};

// --- FIX: DRAG LOGIC FOR RESIZABLE BOTTOM SHEET ---
// --- RIDE ALONG DRAG (25%, 50%, 75%, 100% + Minimize) ---
function initRideAlongDrag() {
    const sheet = document.getElementById('screen-ride-along');
    const dragZone = document.getElementById('ra-drag-zone');
    
    let startY = 0;
    let startHeight = 0;
    let isDragging = false;
    let startTime = 0;

    const getClientY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

    const onStart = (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startY = getClientY(e);
        startHeight = sheet.offsetHeight;
        startTime = Date.now();
        
        sheet.classList.add('dragging');
        const btnGroup = document.getElementById('map-buttons-container');
        if (btnGroup) btnGroup.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!isDragging) return;
        const currentY = getClientY(e);
        const delta = startY - currentY; // + нагоре, - надолу
        
        let newHeight = startHeight + delta;
        // Позволяваме да става много малко, за да се усети минимизирането
        newHeight = Math.max(50, Math.min(window.innerHeight, newHeight));
        
        sheet.style.height = `${newHeight}px`;
        updateMapButtons(newHeight);
        
        if(e.cancelable && e.type === 'touchmove') e.preventDefault();
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        sheet.classList.remove('dragging');
        const btnGroup = document.getElementById('map-buttons-container');
        if (btnGroup) btnGroup.style.transition = 'bottom 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)';

        const currentHeight = sheet.offsetHeight;
        const windowHeight = window.innerHeight;
        const percentage = (currentHeight / windowHeight) * 100;
        
        // Отчитаме бързо плъзгане надолу (Flick)
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const totalDelta = clientY - startY; // Положително значи надолу
        const timeElapsed = Date.now() - startTime;
        const isFlickDown = (timeElapsed < 300 && totalDelta > 50);

        // --- ЛОГИКА ЗА СТЪПКИТЕ ---
        
        // 1. МИНИМИЗИРАНЕ (под 25% или бързо надолу)
        if (percentage < 25 || isFlickDown) {
            minimizeRideAlong();
        } 
        // 2. СТЪПКА 25%
        else if (percentage < 40) {
            sheet.style.height = `25vh`;
            updateMapButtons(windowHeight * 0.25);
        }
        // 3. СТЪПКА 50%
        else if (percentage < 65) {
            sheet.style.height = `50vh`;
            updateMapButtons(windowHeight * 0.50);
        }
        // 4. СТЪПКА 75%
        else if (percentage < 85) {
            sheet.style.height = `75vh`;
            updateMapButtons(windowHeight * 0.75);
        }
        // 5. СТЪПКА 100% (Full Screen)
        else {
            sheet.style.height = `100vh`;
            updateMapButtons(windowHeight); // Бутоните отиват най-горе (или се скриват зад хедъра)
        }
    };

    dragZone.addEventListener('touchstart', onStart, { passive: false });
    dragZone.addEventListener('mousedown', onStart);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);
}





function updateRideAlongHeader() {
    // Проверка за всеки случай, за да не гърми, ако няма данни
    if (!rideAlongState.routeDetails) return;

    const d = rideAlongState.routeDetails;
    
    // Взимаме елементите
    const titleEl = document.getElementById('ride-along-title');
    const subtitleEl = document.getElementById('ride-along-subtitle');
    const labelEl = document.getElementById('vehicle-marker-label'); // ТОВА Е ПРАВИЛНОТО ИМЕ

    // 1. Само номера (без думата "Линия")
    if (titleEl) {
        titleEl.textContent = d.routeName;
        // 2. Оцветяваме номера в цвета на транспорта
        titleEl.style.color = d.color; 
    }
    
    // 3. Дестинацията
    if (subtitleEl) {
        subtitleEl.textContent = `${t('to_label')} ${d.destination}`;
    }
    
    // 4. Етикетът върху автобусчето на графиката
    // ПОПРАВКАТА Е ТУК: Използваме labelEl, а не lbl
    if (labelEl) {
        labelEl.textContent = d.routeName;
    }
}


function renderRideAlongList() {
    const container = document.getElementById('ride-along-list');
    container.innerHTML = '';
    
    const routeColor = rideAlongState.routeDetails ? rideAlongState.routeDetails.color : '#999';
    const isEn = (currentLanguage === 'en');
    const minSuffix = isEn ? "min" : "мин";

    const lineBg = document.createElement('div'); 
    lineBg.className = 'timeline-line-bg'; 
    lineBg.style.backgroundColor = routeColor; 
    container.appendChild(lineBg);

    const linePassed = document.createElement('div'); 
    linePassed.id = 'timeline-line-passed'; 
    linePassed.className = 'timeline-line-passed'; 
    container.appendChild(linePassed);

    rideAlongState.stops.forEach((stop, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-stop-item';
        item.id = `ra-stop-${index}`;
        
        const isSelected = (String(stop.stop_id) === String(selectedStopId));
        const isUserStart = (rideAlongState.userStartStopId && String(stop.stop_id) === String(rideAlongState.userStartStopId));
        const isPinned = (stop.stop_id == rideAlongState.pinnedStopId);
        
        if (isPinned) item.classList.add('pinned');
        if (isSelected) item.classList.add('selected-stop');

        let metaHtml = '';
        if (isUserStart) { 
            metaHtml += `<span class="meta-label" style="font-weight:900; color:${routeColor};">${t('ra_you_are_here')}</span>`; 
        }
        
        let pinText = t('ra_get_off'); 
        let pinIconClass = "material-icons-round pin-icon"; 
        let pinStyle = ""; 

        if (isPinned) { 
            metaHtml += ` <span class="meta-label" style="color:${routeColor}; font-weight:bold;">${t('ra_destination')}</span>`; 
            pinText = t('ra_get_off'); 
            pinIconClass += " filled"; 
            pinStyle = `color: ${routeColor};`; 
        } 
        else if (isUserStart) { pinText = ""; }
        
        // --- НОВО: ВЗИМАМЕ ВРЕМЕТО ОТ КЕША ВЕДНАГА ---
        let initialTimeText = "";
        if (rideAlongState.cachedRealTimes && rideAlongState.cachedRealTimes.has(stop.stop_id)) {
            let realEta = rideAlongState.cachedRealTimes.get(stop.stop_id);
            initialTimeText = (realEta === 0) ? (isEn ? "Now" : "Сега") : `${realEta} ${minSuffix}`;
        }
        // ----------------------------------------------

        item.innerHTML = `
            <div class="stop-dot" style="border-color: ${routeColor};"></div>
            
            <div class="stop-info-box" onclick="selectRideAlongStop('${stop.stop_id}')">
                <div class="timeline-stop-name">${stop.stop_name}</div>
                <div class="timeline-stop-code">(${stop.stop_code || ''})</div>
                <div class="stop-meta-info">${metaHtml}</div>
            </div>
            
            <div id="ra-eta-${index}" class="list-row-eta" style="color: ${routeColor};">${initialTimeText}</div>
            
            <div class="pin-container" onclick="toggleRideAlongPin('${stop.stop_id}')">
                <span class="${pinIconClass}" style="${pinStyle}">${isPinned ? 'push_pin' : 'push_pin'}</span>
                <span class="pin-text" style="${pinStyle}">${pinText}</span>
            </div>`;
            
        container.appendChild(item);
    });
}

window.toggleRideAlongPin = function(stopId) {
    if (window.event) window.event.stopPropagation();

    // Ресетваме флаговете за новата цел
    rideAlongState.hasNotifiedApproaching = false;
    rideAlongState.notifiedArrival = false;

    if (rideAlongState.pinnedStopId == stopId) {
        rideAlongState.pinnedStopId = null;
    } else {
        rideAlongState.pinnedStopId = stopId;
        selectRideAlongStop(stopId);
    }
    renderRideAlongList();
    updateRideAlongData();
};








function sendTransportNotification(title, body) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        try {
            // Опитваме се да пратим Service Worker нотификация (за Android/PWA работи по-добре)
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    reg.showNotification(title, {
                        body: body,
                        icon: 'sofia_traffic_icon2.png', // Увери се, че името на файла е правилно
                        vibrate: [200, 100, 200]
                    });
                } else {
                    // Fallback към обикновена нотификация
                    new Notification(title, { body: body, icon: 'sofia_traffic_icon2.png' });
                }
            });
        } catch (e) {
            new Notification(title, { body: body });
        }
    }
}

function getTransportTypeName(typeCode) {
    const t = String(typeCode);
    if (t === '0') return currentLanguage === 'bg' ? 'Трамвай' : 'Tram';
    if (t === '11') return currentLanguage === 'bg' ? 'Тролей' : 'Trolley';
    if (t === '1' || t === '2' || t === '4') return currentLanguage === 'bg' ? 'Метро' : 'Metro';
    return currentLanguage === 'bg' ? 'Автобус' : 'Bus';
}


function updateTimelineUI(progress, nextStopIndex, bubbleHtml) {
    const items = document.querySelectorAll('.timeline-stop-item');
    if (items.length === 0) return;
    
    // Оцветяване на миналите
    items.forEach((item, index) => { 
        if (index < nextStopIndex) { item.classList.add('passed'); } 
        else { item.classList.remove('passed'); } 
    });

    const contentArea = document.querySelector('.ra-content'); 
    
    const firstItem = items[0]; 
    const lastItem = items[items.length - 1];
    
    const firstTop = firstItem.offsetTop + (firstItem.offsetHeight / 2); 
    const lastTop = lastItem.offsetTop + (lastItem.offsetHeight / 2);
    
    const totalHeight = lastTop - firstTop; 
    const currentY = firstTop + (totalHeight * progress);

    // Местене на маркера
    const vehicleMarker = document.getElementById('ride-along-vehicle');
    vehicleMarker.classList.remove('hidden'); 
    vehicleMarker.style.top = `${currentY}px`;
    
    const core = vehicleMarker.querySelector('.ra-vehicle-core');
    if(core && rideAlongState.routeDetails && rideAlongState.routeDetails.color) { 
        core.style.backgroundColor = rideAlongState.routeDetails.color; 
    }

    const passedLine = document.getElementById('timeline-line-passed'); 
    passedLine.style.height = `${currentY}px`;

    // Скролване
    if (contentArea) {
        if (shouldAutoCenterVehicle) { 
            const targetScroll = currentY - (contentArea.clientHeight / 2); 
            contentArea.scrollTo({ top: targetScroll, behavior: 'smooth' }); 
            shouldAutoCenterVehicle = false; 
        } 
        else { 
            const scrollTop = contentArea.scrollTop; 
            const viewHeight = contentArea.clientHeight; 
            if (currentY < scrollTop + 20 || currentY > scrollTop + viewHeight - 20) { 
                const targetScroll = currentY - (viewHeight / 2); 
                contentArea.scrollTo({ top: targetScroll, behavior: 'smooth' }); 
            } 
        }
    }

    // --- ВЪРНАТО: ПОКАЗВАНЕ НА БАЛОНЧЕТО В ДОЛНОТО МЕНЮ ---
    const bubble = document.getElementById('vehicle-eta-bubble');
    if (bubble) { 
        if (bubbleHtml) {
            bubble.innerHTML = bubbleHtml;
            bubble.style.display = 'block'; // ПОКАЗВАМЕ ГО!
        } else {
            bubble.style.display = 'none';
        }
    }
}


function scrollToItem(index) {
    const el = document.getElementById(`ra-stop-${index}`);
    const contentArea = document.querySelector('.ra-content');
    if (el && contentArea) { const topPos = el.offsetTop; const visibleHeight = contentArea.clientHeight; const targetScroll = topPos - (visibleHeight / 2) + (el.offsetHeight / 2); contentArea.scrollTo({ top: targetScroll, behavior: 'smooth' }); }
}









// Функция за изчисляване на посоката спрямо линията (Shape)
function getHeadingFromShape(lat, lon, shape) {
    if (!shape || shape.length < 2) return 0;

    let minDistance = Infinity;
    let bestIndex = 0;

    // 1. Намираме най-близкия сегмент от линията
    for (let i = 0; i < shape.length - 1; i++) {
        const p1 = { lat: shape[i][0], lng: shape[i][1] };
        const p2 = { lat: shape[i+1][0], lng: shape[i+1][1] };
        
        // Проста евклидова дистанция (достатъчно точна за зуумнати карти)
        const closest = getClosestPointOnSegment({lat: lat, lng: lon}, p1, p2);
        
        const dx = lat - closest[0];
        const dy = lon - closest[1];
        const dist = (dx*dx + dy*dy);

        if (dist < minDistance) {
            minDistance = dist;
            bestIndex = i;
        }
    }

    // 2. Изчисляваме ъгъла на този сегмент (от точка i към точка i+1)
    const pA = shape[bestIndex];
    const pB = shape[bestIndex + 1];

    // Формула за ъгъл между две точки
    const dLon = (pB[1] - pA[1]);
    const y = Math.sin(dLon * Math.PI / 180) * Math.cos(pB[0] * Math.PI / 180);
    const x = Math.cos(pA[0] * Math.PI / 180) * Math.sin(pB[0] * Math.PI / 180) -
              Math.sin(pA[0] * Math.PI / 180) * Math.cos(pB[0] * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);

    let brng = Math.atan2(y, x);
    brng = brng * 180 / Math.PI; // Radian to Degree
    brng = (brng + 360) % 360;   // Normalize to 0-360
    
    return brng;
}


// Изчислява ъгъл между две точки (в градуси)
function getBearing(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => deg * Math.PI / 180;
    const toDeg = (rad) => rad * 180 / Math.PI;
    
    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    
    let brng = Math.atan2(y, x);
    return (toDeg(brng) + 360) % 360;
}

// Намира най-близкия сегмент от всички форми и връща ъгъла му
function getBestHeading(lat, lon, allShapes) {
    if (!allShapes || allShapes.length === 0) return 0;

    let minDistance = Infinity;
    let bestHeading = 0;

    // Обикаляме всички вариации на маршрута (посока А, посока Б)
    for (let s = 0; s < allShapes.length; s++) {
        const shape = allShapes[s];
        if (!shape || shape.length < 2) continue;

        // Обикаляме точките в конкретния маршрут
        for (let i = 0; i < shape.length - 1; i++) {
            const p1 = { lat: shape[i][0], lng: shape[i][1] };
            const p2 = { lat: shape[i+1][0], lng: shape[i+1][1] };

            const closest = getClosestPointOnSegment({lat: lat, lng: lon}, p1, p2);
            
            const dx = lat - closest[0];
            const dy = lon - closest[1];
            const distSq = dx*dx + dy*dy;

            // Ако този сегмент е по-близо до автобуса от предишния намерен
            if (distSq < minDistance) {
                minDistance = distSq;
                // Изчисляваме ъгъла на сегмента (от точка i към i+1)
                bestHeading = getBearing(p1.lat, p1.lng, p2.lat, p2.lng);
            }
        }
    }
    return bestHeading;
}




// --- GLOBAL SEARCH STATE ---
let currentSearchedLocation = null; // Пазим координатите на намереното място









// Функция за преименуване на любима спирка
window.renameFavorite = function(stopId, currentName) {
    // Взимаме текущите псевдоними
    let aliases = JSON.parse(localStorage.getItem('favAliases') || '{}');
    
    // Питаме потребителя за ново име
    const newName = prompt("Въведете име за тази спирка (напр. 'Вкъщи'):", aliases[stopId] || currentName);
    
    if (newName !== null) { // Ако не е натиснал Cancel
        if (newName.trim() === "") {
            delete aliases[stopId]; // Ако е празно, трием псевдонима (връща оригиналното име)
        } else {
            aliases[stopId] = newName.trim(); // Запазваме новото име
        }
        
        localStorage.setItem('favAliases', JSON.stringify(aliases));
        loadFavoritesScreen(); // Презареждаме екрана
    }
};



function makeIconBtn(iconName, textStack, onClick) {
    const btn = document.createElement('button');
    btn.className = 'icon-btn'; // Ползва глобалния клас от style.css
    
    if (textStack) {
        // Бутон с две думи една под друга (Time Table)
        btn.innerHTML = `<div class="btn-text-stack"><span>${textStack[0]}</span><span>${textStack[1]}</span></div>`;
    } else {
        // Нормален икона-бутон
        btn.innerHTML = `<span class="material-icons-round">${iconName}</span>`;
    }
    
    btn.onclick = (e) => {
        e.stopPropagation();
        if(onClick) onClick();
    };
    return btn;
}


async function toggleExpandedListCard(stop, header, actionsBar, arrivalsContent, mode) {
    let icon = header.querySelector('.list-expand-icon') || header.querySelector('.static-expand-icon');
    const isExpanded = icon.classList.contains('expanded');
    
    // Fallback за контейнера с бутони
    let buttonsContainer = actionsBar.querySelector('.list-buttons-right');
    if (!buttonsContainer) buttonsContainer = actionsBar; 

    if (isExpanded) {
        // --- ЗАТВАРЯНЕ ---
        icon.classList.remove('expanded');
        header.classList.remove('row-open'); 
        
        arrivalsContent.classList.remove('visible');
        
        // Изчистваме съдържанието
        setTimeout(() => { arrivalsContent.innerHTML = ''; }, 300);

        if (mode === 'LINE_DETAIL') {
            actionsBar.classList.remove('visible');
            actionsBar.innerHTML = ''; 
        } else {
            // Премахваме само динамичните бутони
            const dynamicBtns = buttonsContainer.querySelectorAll('.dynamic-btn');
            dynamicBtns.forEach(b => b.remove());
        }
        
    } else {
        // --- ОТВАРЯНЕ ---
        icon.classList.add('expanded');
        header.classList.add('row-open');
        
        // Лоудър
        arrivalsContent.innerHTML = '<div style="text-align:center; padding:10px;"><span class="rotating material-icons-round">refresh</span></div>';
        arrivalsContent.classList.add('visible');

        // --- СПЕЦИФИКА ЗА LINE DETAILS ---
        if (mode === 'LINE_DETAIL') {
            actionsBar.classList.add('visible');
            
            // Бутон Карта
            actionsBar.appendChild(makeIconBtn('map', null, () => locateFromFav(stop.stop_id)));
            
            // --- ТУК Е ПРОМЯНАТА ЗА ЗВЕЗДАТА (LINE DETAIL) ---
            const isFav = favoriteStops.includes(stop.stop_id);
            const favBtn = makeIconBtn(isFav ? 'star' : 'star_border', null, () => {
                // Отваряме менюто
                openFavMenu(stop.stop_id);
            });
            if(isFav) favBtn.style.color = '#FFD700';
            actionsBar.appendChild(favBtn);
            // -------------------------------------------------
        }

        // --- ДИНАМИЧНИ БУТОНИ (Refresh, Time, Table) ---
        
        // 1. Refresh
        const btnRefresh = makeIconBtn('refresh', null, () => {
            arrivalsContent.innerHTML = '<div style="text-align:center; padding:10px;"><span class="rotating material-icons-round">refresh</span></div>';
            loadArrivals(stop.stop_id, arrivalsContent);
        });
        btnRefresh.classList.add('dynamic-btn');

        // 2. Time Mode
        const btnTime = makeIconBtn('schedule', null, () => {
            timeDisplayMode = timeDisplayMode === 'RELATIVE' ? 'ABSOLUTE' : 'RELATIVE';
            localStorage.setItem('timeDisplayMode', timeDisplayMode);
            arrivalsContent.innerHTML = '<div style="text-align:center; padding:10px;"><span class="rotating material-icons-round">refresh</span></div>';
            loadArrivals(stop.stop_id, arrivalsContent);
            
            if(timeDisplayMode === 'ABSOLUTE') btnTime.classList.add('active');
            else btnTime.classList.remove('active');
        });
        btnTime.classList.add('dynamic-btn');
        if(timeDisplayMode === 'ABSOLUTE') btnTime.classList.add('active');

        // 3. Timetable
        const btnTable = makeIconBtn('', ['Time', 'Table'], () => {
             if(stop.stop_code) openTimetableScreen(stop);
             else alert("Няма код за тази спирка.");
        });
        btnTable.classList.add('dynamic-btn');

        // ДОБАВЯНЕ НА БУТОНИТЕ
        if (mode === 'LINE_DETAIL') {
            // При Line Details: Table -> Time -> Refresh -> (Map/Fav са вече там)
            actionsBar.insertBefore(btnTable, actionsBar.lastChild); // Before Fav
            actionsBar.insertBefore(btnTime, btnTable);
            actionsBar.insertBefore(btnRefresh, btnTime);
        } else {
            // В Любими и Търсене: Най-отпред
            buttonsContainer.prepend(btnTable);   
            buttonsContainer.prepend(btnTime);    
            buttonsContainer.prepend(btnRefresh); 
        }
        
        // Зареждаме данните
        await loadArrivals(stop.stop_id, arrivalsContent);
    }

    // --- НОВО: ПРОВЕРКА ЗА АВТОМАТИЧНО ОБНОВЯВАНЕ ---
    // Това гарантира, че ако имаме отворена спирка в списък, таймерът за опресняване ще тръгне
    setTimeout(checkAndManageTimers, 100);
}



window.expandLineStop = function(stopId, uniqueId) {
    // 1. Намираме спирката от глобалните данни (най-сигурният начин)
    const stop = allStopsData.find(s => s.stop_id == stopId);
    
    if (!stop) {
        console.error("Спирката не е намерена:", stopId);
        return;
    }

    const header = document.querySelector(`#expand-icon-${uniqueId}`).parentElement; 
    const actionsBar = document.getElementById(`actions-${uniqueId}`);
    const arrivalsContent = document.getElementById(`arrivals-${uniqueId}`);

    // Извикваме логиката за отваряне
    toggleExpandedListCard(stop, header, actionsBar, arrivalsContent, 'LINE_DETAIL');
};



// --- GLOBAL LIVE RADAR LOGIC ---
let radarMarkers = new Map(); // Пазим маркерите по trip_id
// ПРАВИЛНО: Само дефинираме променливата, ще я заредим по-късно
let radarLayer = L.featureGroup();

// 1. Инициализация (извикай това в initMap или setupActionListeners)
// В script.js
function setupRadarButton() {
    const btn = document.getElementById('btn-live-radar');
    if (!btn) return;

    btn.onclick = () => {
        isRadarActive = !isRadarActive;
        
        // 1. Синхронизираме главния суич
        mapFilters.vehicles.enabled = isRadarActive;
        
        // 2. ВАЖНО: Синхронизираме ВСИЧКИ под-категории!
        const types =['BUS', 'TROLLEY', 'TRAM', 'METRO', 'NIGHT'];
        types.forEach(k => {
            mapFilters.vehicles.types[k] = isRadarActive;
        });
        
        saveFullFilters();

        if (isRadarActive) {
            btn.classList.add('active');
            radarLayer.clearLayers();
            radarMarkers.clear();
            fetchGlobalRadarVehicles();
            if (radarTimer) clearInterval(radarTimer);
            radarTimer = setInterval(fetchGlobalRadarVehicles, 3000);
        } else {
            btn.classList.remove('active');
            stopRadar();
        }
        
        // 3. Ако менюто с филтрите е отворено, го прерисуваме, за да светнат/изгаснат бутоните
        const filterModal = document.getElementById('modal-centered-filter');
        if (filterModal && filterModal.classList.contains('active')) {
            renderFilterView('MAIN');
        }
    };
}





// Спри радара
function stopRadar() {
    if (radarTimer) clearInterval(radarTimer);
    radarLayer.clearLayers();
    radarMarkers.clear();
}


// В script.js -> намери и замени fetchGlobalRadarVehicles:




// --- DRAG AND DROP (SIMPLE & ROBUST) ---
function setupDragEvents(handle, item, container) {
    let isDragging = false;
    let startY = 0;
    let initialTransformY = 0;

    const getClientY = (e) => {
        return e.touches ? e.touches[0].clientY : e.clientY;
    };

    const onStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        e.preventDefault(); // Спираме селектиране и "ghost" image
        e.stopPropagation(); // Спираме клика

        isDragging = true;
        startY = getClientY(e);
        
        item.classList.add('dragging');
        
        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        } else {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
        }
    };

    const onMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        const currentY = getClientY(e);
        const delta = currentY - startY;

        // Визуално местене
        item.style.transform = `translateY(${delta}px)`;

        // Проверка за размяна
        const siblings = [...container.children].filter(c => c !== item);
        const sibling = siblings.find(s => {
            const box = s.getBoundingClientRect();
            return currentY > box.top && currentY < box.bottom;
        });

        if (sibling) {
            const box = sibling.getBoundingClientRect();
            const mid = box.top + box.height / 2;
            
            // Разменяме в DOM-а
            if (currentY < mid) {
                container.insertBefore(item, sibling);
            } else {
                container.insertBefore(item, sibling.nextSibling);
            }

            // Ресетваме координатите, за да няма скок
            startY = currentY;
            item.style.transform = 'translateY(0px)';
        }
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        item.classList.remove('dragging');
        item.style.transform = '';

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // Запазване
        const newOrderIds = Array.from(container.children).map(child => child.getAttribute('data-stop-id'));
        favoriteStops = newOrderIds;
        localStorage.setItem('favStops', JSON.stringify(favoriteStops));
    };

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
}



// --- ФУНКЦИЯ ЗА УПРАВЛЕНИЕ НА СЛОЕВЕТЕ ---
function updateRadarZIndex() {
    const radarPane = map.getPane('radarPane');
    if (!radarPane) return;

    if (activeRoutesList.length > 0) {
        // СЦЕНАРИЙ: ИМА ПУСНАТ МАРШРУТ
        // Слагаме радара на 500.
        // Така е НАД линията (400) и сивите спирки (390), 
        // но е ПОД активните спирки (600) и активния автобус (800).
        radarPane.style.zIndex = 500;
    } else {
        // СЦЕНАРИЙ: НЯМА МАРШРУТ (Свободно разглеждане)
        // Слагаме радара на 650.
        // Така е НАД стандартните спирки (които са на 600).
        radarPane.style.zIndex = 650;
    }
}


function setupSearchUI() {
    const input = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('btn-search-clear');
    const routeBtn = document.getElementById('btn-find-routes');
    const routePanel = document.getElementById('route-panel');
    const searchContainer = document.getElementById('map-search-container');
    const fromInput = document.getElementById('route-from-input');
    const toInput = document.getElementById('route-to-input');
    const btnGo = document.getElementById('btn-route-go');
    const btnCancel = document.getElementById('btn-route-cancel');
    const btnMyLoc = document.getElementById('btn-use-my-loc');

    if (!input || !routePanel) return;

    input.addEventListener('input', () => {
        if (input.value.trim().length > 0) {
            clearBtn.classList.remove('hidden');
            routeBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
            routeBtn.classList.add('hidden');
        }
    });

    clearBtn.onclick = () => {
        input.value = '';
        clearBtn.classList.add('hidden');
        routeBtn.classList.add('hidden');
        currentSearchedLocation = null;
        if (map) map.closePopup();
        if (searchMarker) {
            map.removeLayer(searchMarker);
            searchMarker = null;
        }
        const resultsDiv = document.getElementById('photon-results-main');
        if (resultsDiv) resultsDiv.style.display = 'none';
        input.focus();
    };

    routeBtn.onclick = () => {
        searchContainer.classList.add('hidden');
        routeBtn.classList.add('hidden');
        routePanel.classList.remove('hidden');
        document.getElementById('map-top-controls-wrapper').classList.add('pushed-down');
        toInput.value = input.value;
        if (fromInput.value === "") {
            fromInput.focus();
        }
    };

    btnMyLoc.onclick = () => {
        fromInput.value = "Определяне...";
        fromInput.disabled = true;
        if (!navigator.geolocation) {
            alert("Геолокацията не се поддържа от този браузър.");
            fromInput.value = "";
            fromInput.disabled = false;
            return;
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            fromInput.disabled = false;
            fromInput.value = "Моето местоположение";
            fromInput.dataset.useGps = "true";
            fromInput.dataset.lat = pos.coords.latitude;
            fromInput.dataset.lng = pos.coords.longitude;
        }, () => {
            fromInput.disabled = false;
            fromInput.value = "";
            alert("Грешка при определяне на местоположението. Моля, включете GPS.");
        }, { enableHighAccuracy: true, timeout: 5000 });
    };

    let fromResultsDiv = document.getElementById('photon-results-from');
    if (!fromResultsDiv) {
        fromResultsDiv = document.createElement('div');
        fromResultsDiv.id = 'photon-results-from';
        fromResultsDiv.style.cssText = "position:absolute; top:45px; left:0; right:0; background:var(--surface); border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.2); z-index:3000; max-height:200px; overflow-y:auto; display:none;";
        fromInput.parentNode.style.position = 'relative';
        fromInput.parentNode.appendChild(fromResultsDiv);
    }

    fromInput.addEventListener('input', (e) => {
        const val = e.target.value;
        fromInput.dataset.useGps = "false";
        delete fromInput.dataset.lat;
        delete fromInput.dataset.lng;
        performPhotonSearch(val, fromResultsDiv, (feature) => {
            const coords = feature.geometry.coordinates;
            fromInput.value = feature.properties.name || feature.properties.street;
            fromInput.dataset.lat = coords[1];
            fromInput.dataset.lng = coords[0];
            fromInput.dataset.useGps = "true";
            fromResultsDiv.style.display = 'none';
        });
    });

    btnCancel.onclick = () => {
        routePanel.classList.add('hidden');
        document.getElementById('bottom-sheet').classList.add('hidden');
        const sheetActions = document.querySelector('.sheet-actions-row');
        if (sheetActions) sheetActions.style.display = 'flex';
        searchContainer.classList.remove('hidden');
        document.getElementById('map-top-controls-wrapper').classList.remove('pushed-down');
        if (input.value.trim().length > 0) {
            routeBtn.classList.remove('hidden');
        }
        document.getElementById('btn-live-radar').classList.remove('hidden');
        document.getElementById('btn-locate').classList.remove('hidden');
        routeLayer.clearLayers();
    };

    btnGo.onclick = () => {
        const proceed = (oLat, oLng) => {
            let destLat, destLng;
            if (currentSearchedLocation) {
                destLat = currentSearchedLocation.lat;
                destLng = currentSearchedLocation.lng;
                calculateAndDisplayRoute(oLat, oLng, destLat, destLng);
            } else {
                alert("Моля, първо намерете крайна точка на картата.");
            }
        };

        if (fromInput.dataset.useGps === "true" && fromInput.dataset.lat) {
            proceed(parseFloat(fromInput.dataset.lat), parseFloat(fromInput.dataset.lng));
        } else if (fromInput.value === "Моето местоположение") {
            navigator.geolocation.getCurrentPosition((pos) => {
                proceed(pos.coords.latitude, pos.coords.longitude);
            }, () => alert("Моля, разрешете достъп до местоположението си."));
        } else {
            if (fromInput.value.trim() === "") {
                fromInput.focus();
                return;
            }
            alert("Моля, изберете начален адрес от списъка с предложения.");
        }
    };
}


// --- GOOGLE PLACES AUTOCOMPLETE (SOFIA ONLY) ---


// --- НОВА ЛОГИКА ЗА МАРШРУТИЗАЦИЯ ---
async function calculateAndDisplayRoute(originLat, originLng, destLat, destLng) {
    const sheet = document.getElementById('routes-sheet');
    const content = document.getElementById('routes-list-content');
    const title = document.getElementById('routes-sheet-title');
    
    document.getElementById('bottom-sheet').classList.add('hidden');

    sheet.classList.remove('hidden');
    sheet.classList.remove('sheet-minimized');
    sheet.style.transform = ''; 
    
    title.textContent = "Търсене на маршрут...";
    content.innerHTML = '<div style="text-align:center; padding:20px;"><span class="rotating material-icons-round">refresh</span></div>';

    try {
        const directionsService = new google.maps.DirectionsService();
        
        const request = {
            origin: { lat: originLat, lng: originLng },
            destination: { lat: destLat, lng: destLng },
            travelMode: google.maps.TravelMode.TRANSIT,
            provideRouteAlternatives: true,
            transitOptions: {
                modes: [
                    google.maps.TransitMode.BUS, 
                    google.maps.TransitMode.TRAIN, 
                    google.maps.TransitMode.TRAM,
                    // ВАЖНО: ТОВА ЛИПСВАШЕ! Без него Google не търси метро.
                    google.maps.TransitMode.SUBWAY 
                ],
                routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
            }
        };

        directionsService.route(request, async (result, status) => {
            // --- DEBUG ЗАЯВКА КЪМ GOOGLE ---
            console.log(">>> GOOGLE MAPS STATUS:", status);
            
            if (status === 'OK') {
                console.log(">>> GOOGLE MAPS RAW RESULT:", result);
                
                // Ще изпишем в конзолата какви типове е върнал, за проверка
                console.log("--- ANALYSIS OF ROUTES ---");
                result.routes.forEach((r, idx) => {
                    const leg = r.legs[0];
                    const stepsInfo = leg.steps.map(s => {
                        if (s.travel_mode === 'TRANSIT') {
                            return `[${s.transit.line.vehicle.type}] ${s.transit.line.short_name || s.transit.line.name}`;
                        }
                        return `[${s.travel_mode}]`;
                    }).join(" -> ");
                    console.log(`Route ${idx}: ${stepsInfo}`);
                });
                console.log("--------------------------");

                title.textContent = "Избери маршрут";
                renderRouteResultsToSheet(result.routes);
            } else {
                console.error("Google Routing Failed:", status);
                content.innerHTML = '<p style="text-align:center;">Няма намерени маршрути.</p>';
            }
        });

    } catch (e) {
        console.error(e);
        content.innerHTML = '<p style="text-align:center; color:red;">Грешка при търсене.</p>';
    }
}


// Тази функция замества старата renderRouteResultsToSheet
// Тази функция замества старата renderRouteResultsToSheet
async function renderRouteResultsToSheet(routes) {
    const content = document.getElementById('routes-list-content');
    if (!content) return;
    
    content.innerHTML = ''; // Изчистваме старото съдържание

    // 1. Сортираме маршрутите по продължителност (най-бързите най-отгоре)
    routes.sort((a, b) => (a.legs[0].duration.value - b.legs[0].duration.value));

    if (routes.length === 0) {
        content.innerHTML = `<p style="text-align:center; padding:20px;">${t('no_suitable_courses') || 'Няма намерени маршрути.'}</p>`;
        return;
    }

    // Показваме лоудър, докато обработваме (заради асинхронните заявки за сливане на линии)
    content.innerHTML = '<div style="text-align:center; padding:20px;"><span class="rotating material-icons-round">refresh</span></div>';
    
    const cardsBuffer = document.createDocumentFragment();
    const seenStructures = new Set();

    for (const route of routes) {
        const leg = route.legs[0];

        // --- ГЕНЕРИРАНЕ НА ПОДПИС (Signature) за премахване на дубликати ---
        let routeSignature = "";
        for (const step of leg.steps) {
            if (step.travel_mode === 'TRANSIT') {
                const startLoc = step.transit.departure_stop.location;
                const endLoc = step.transit.arrival_stop.location;
                const sCode = findClosestStopCode(startLoc.lat(), startLoc.lng()) || "UNKNOWN_START";
                const eCode = findClosestStopCode(endLoc.lat(), endLoc.lng()) || "UNKNOWN_END";
                routeSignature += `|TRANSIT_${sCode}_${eCode}`;
            } else if (step.travel_mode === 'WALKING') {
                const distChunk = Math.round(step.distance.value / 300);
                routeSignature += `|WALK_${distChunk}`;
            }
        }

        if (seenStructures.has(routeSignature)) continue; 
        seenStructures.add(routeSignature);

        // --- ЛОГИКА ЗА ИМЕНАТА НА СПИРКИТЕ ---
        let displayNameStart = leg.start_address.split(',')[0];
        let displayNameEnd = leg.end_address.split(',')[0];
        
        const transitSteps = leg.steps.filter(s => s.travel_mode === 'TRANSIT');
        if (transitSteps.length > 0) {
            displayNameStart = transitSteps[0].transit.departure_stop.name;
            displayNameEnd = transitSteps[transitSteps.length - 1].transit.arrival_stop.name;
        }

        const durationText = leg.duration.text
            .replace("mins", t('time_min')).replace("min", t('time_min'))
            .replace("hours", t('time_h')).replace("hour", t('time_h'));

        // СЪЗДАВАНЕ НА КАРТАТА (UI)
        const card = document.createElement('div');
        card.className = 'list-item-container';
        card.style.padding = '16px';
        card.style.cursor = 'pointer';
        card.style.marginBottom = '8px';

        let segmentsHtml = '';

        // Обхождаме стъпките, за да нарисуваме иконите (chips) в картата
        for (let i = 0; i < leg.steps.length; i++) {
            const step = leg.steps[i];
            if (i > 0) segmentsHtml += `<span class="material-icons-round" style="font-size:14px; color:#aaa; margin:0 4px;">chevron_right</span>`;

            if (step.travel_mode === 'TRANSIT') {
                const googleLine = step.transit.line;
                const vType = googleLine.vehicle.type;
                let displayNames = googleLine.short_name || googleLine.name;
                
                let color = '#BE1E2D'; 
                let icon = 'directions_bus';

                if (vType === 'TRAM') { color = '#F7941D'; icon = 'tram'; }
                else if (vType === 'SUBWAY') { color = '#007DC5'; icon = 'subway'; }
                else if (vType === 'TROLLEYBUS') { color = '#27AAE1'; icon = 'directions_bus'; }

                // Логика за обединяване на линии (проверка дали и други наши линии минават оттук)
                const startCode = findClosestStopCode(step.transit.departure_stop.location.lat(), step.transit.departure_stop.location.lng());
                const endCode = findClosestStopCode(step.transit.arrival_stop.location.lat(), step.transit.arrival_stop.location.lng());

                if (startCode && endCode) {
                    try {
                        const directRoutes = await fetchDirectRoutes(startCode, endCode);
                        if (directRoutes && directRoutes.length > 0) {
                            const uniqueNames = [...new Set(directRoutes.map(r => r.line_name))];
                            uniqueNames.sort((a, b) => (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0));
                            if (uniqueNames.length > 0) displayNames = uniqueNames.join(" / ");
                        }
                    } catch (e) { console.warn("Line merge failed", e); }
                }

                segmentsHtml += `
                    <div style="display:inline-flex; align-items:center; background:${color}; color:white; padding:4px 8px; border-radius:6px; margin:2px 0;">
                        <span class="material-icons-round" style="font-size:14px; margin-right:4px;">${icon}</span> 
                        <span style="font-weight:bold; font-size:13px;">${displayNames}</span>
                    </div>`;
            } else {
                segmentsHtml += `<span class="material-icons-round" style="font-size:18px; color:#666;">directions_walk</span>`;
            }
        }

        const arrivalTime = leg.arrival_time ? leg.arrival_time.text : '';

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:18px; font-weight:bold; color:var(--on-surface);">${durationText}</span>
                <span style="font-size:14px; font-weight:bold; color:var(--primary);">${arrivalTime}</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:2px;">
                ${segmentsHtml}
            </div>
            <div style="font-size:12px; color:var(--on-surface-variant); margin-top:8px; padding-top:8px; border-top:1px solid var(--outline);">
                ${displayNameStart} &rarr; ${displayNameEnd}
            </div>
        `;

        // ФИКСЪТ Е ТУК: Използваме 'route' (локалната променлива от цикъла)
        card.onclick = () => {
            drawColoredRouteOnMap(route); // Твоята функция за чертане
            renderRouteDetails(route);    // Новата функция за показване на стъпките
        };

        cardsBuffer.appendChild(card);
    }

    content.innerHTML = ''; // Махаме лоудъра
    content.appendChild(cardsBuffer);
}




function drawColoredRouteOnMap(route) {
    // 1. Активираме режима
    isGoogleRouteActive = true;
    googleRouteStopIds.clear();
    
    // 2. Изчистване
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();

    const leg = route.legs[0];
    const bounds = new L.LatLngBounds();

    // --- НОВО: Тук ще пазим къде вече сме сложили етикет, за да няма дублаж ---
    const labeledLocations = new Set();

    leg.steps.forEach(step => {
        const pathCoords = step.path.map(p => [p.lat(), p.lng()]);
        pathCoords.forEach(c => bounds.extend(c));

        if (step.travel_mode === 'TRANSIT') {
            const vType = step.transit.line.vehicle.type;
            
            let color = '#BE1E2D'; 
            let iconName = 'directions_bus';

            if (vType === 'TRAM') { color = '#F7941D'; iconName = 'tram'; }
            else if (vType === 'SUBWAY') { color = '#007DC5'; iconName = 'subway'; }
            else if (vType === 'TROLLEYBUS') { color = '#27AAE1'; iconName = 'directions_bus'; }
            
            // Рисуваме линията
            L.polyline(pathCoords, {
                color: color, weight: 6, opacity: 0.8, pane: 'routeShapePane'
            }).addTo(routeLayer);

            // --- ОБРАБОТКА НА СПИРКИТЕ ---
            const startLoc = step.transit.departure_stop.location;
            const endLoc = step.transit.arrival_stop.location;
            const startName = step.transit.departure_stop.name;
            const endName = step.transit.arrival_stop.name;
            
            // Намираме реалния обект на спирката от нашата база
            const stopObj = findClosestStopObj(startLoc.lat(), startLoc.lng());
            if (stopObj) googleRouteStopIds.add(stopObj.stop_id);
            
            const endStopObj = findClosestStopObj(endLoc.lat(), endLoc.lng());
            if (endStopObj) googleRouteStopIds.add(endStopObj.stop_id);

            // Генерираме уникален ключ за локацията (с точност до 4 знака, което е ~10 метра)
            const startKey = `${startLoc.lat().toFixed(4)}_${startLoc.lng().toFixed(4)}`;
            const endKey = `${endLoc.lat().toFixed(4)}_${endLoc.lng().toFixed(4)}`;

            // --- МАРКЕР ЗА НАЧАЛО (Качване) ---
            const startIconHtml = `<div class="map-marker-wrapper" style="transform: scale(0.9);"><div class="stop-circle-blue" style="background-color:${color}; border: 2px solid white; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 4px rgba(0,0,0,0.3);"><span class="material-icons-round" style="font-size:18px; color:white;">${iconName}</span></div></div>`;
            
            const startMarker = L.marker([startLoc.lat(), startLoc.lng()], {
                icon: L.divIcon({ className: '', html: startIconHtml, iconSize: [30, 30], iconAnchor: [15, 15] }), 
                zIndexOffset: 1000
            }).addTo(routeLayer);

            // НОВО: Проверка за дублиране на етикета
            if (!labeledLocations.has(startKey)) {
                startMarker.bindTooltip(startName, {
                    permanent: true,
                    direction: 'top',
                    className: 'route-stop-tooltip',
                    offset: [0, -18]
                });
                labeledLocations.add(startKey);
            }

            if (stopObj) {
                startMarker.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    openStopSheet(stopObj);
                });
            } else {
                startMarker.bindPopup(`Качване: ${startName}`, {className: 'custom-popup'});
            }

            // --- МАРКЕР ЗА КРАЙ (Слизане) ---
            const endIconHtml = `<div class="stop-circle-blue" style="background-color:white; border: 4px solid ${color}; width:20px; height:20px;"></div>`;
            const endMarker = L.marker([endLoc.lat(), endLoc.lng()], {
                icon: L.divIcon({ className: '', html: endIconHtml, iconSize: [20, 20], iconAnchor: [10, 10] }), 
                zIndexOffset: 900
            }).addTo(routeLayer);

            // НОВО: Проверка за дублиране на етикета и тук
            if (!labeledLocations.has(endKey)) {
                endMarker.bindTooltip(endName, {
                    permanent: true,
                    direction: 'top',
                    className: 'route-stop-tooltip',
                    offset: [0, -10]
                });
                labeledLocations.add(endKey);
            }
            
            if (endStopObj) {
                 endMarker.on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    openStopSheet(endStopObj);
                });
            } else {
                endMarker.bindPopup(`Слизане: ${endName}`, {className: 'custom-popup'});
            }

        } else if (step.travel_mode === 'WALKING') {
            L.polyline(pathCoords, { color: '#777', weight: 4, dashArray: '10, 10', opacity: 0.8, className: 'walking-path-dash' }).addTo(routeLayer);
        }
    });

    map.fitBounds(bounds, { paddingTopLeft: [20, 20], paddingBottomRight: [20, 100] });
    updateVisibleMarkers();
}




function findClosestStopObj(lat, lng) {
    if (!allStopsData || allStopsData.length === 0) return null;
    let closest = null;
    let minInfo = Infinity;
    
    // Търсим в радиус ~200м
    const threshold = 0.003; 

    for (const stop of allStopsData) {
        if (!stop.stop_lat) continue;
        const dLat = stop.stop_lat - lat;
        const dLng = stop.stop_lon - lng;
        
        if (Math.abs(dLat) > threshold || Math.abs(dLng) > threshold) continue;

        const dist = dLat*dLat + dLng*dLng;
        if (dist < minInfo) {
            minInfo = dist;
            closest = stop;
        }
    }
    return closest;
}

// Функция за обновяване на цифрите в бутоните
// Функция за обновяване на цифрите в бутоните (Safe Version)
function updateReportButtonsUI() {
    if (!selectedLineForAction) return;
    const tripId = selectedLineForAction.trip_id;
    
    // Взимаме текущата статистика или празен обект
    let stats = reportsCache.get(tripId) || { HOT: 0, COLD: 0, DIRTY: 0, INSPECTOR: 0 };
    if (stats.type) stats = { HOT: 0, COLD: 0, DIRTY: 0, INSPECTOR: 0 };

    // --- ПОПРАВКА: Проверяваме дали елементите съществуват ---
    const elHot = document.getElementById('count-hot');
    const elCold = document.getElementById('count-cold');
    const elDirty = document.getElementById('count-dirty');

    if (elHot) elHot.textContent = stats.HOT || 0;
    if (elCold) elCold.textContent = stats.COLD || 0;
    if (elDirty) elDirty.textContent = stats.DIRTY || 0;
}



// Помощна функция за рисуване (подобна на fetchAndDrawVehicles, но приема готов масив)
function drawRouteVehiclesGeneric(vehicles) {
    // Изчистваме ако е празно
    if (vehicles.length === 0) {
        vehicleLayer.clearLayers();
        return;
    }
    
    const currentIds = new Set();

    vehicles.forEach(v => {
        // За колите от vehicles_for_stop, API-то понякога не връща точни координати (lat/lon), 
        // а само ETA. Трябва ни endpoint, който връща координати.
        // vehicles_for_stop ВРЪЩА координати в новите версии на API-то ти?
        // АКО НЕ ВРЪЩА: Трябва да ползваме vehicles_for_routes, но да филтрираме.
        
        // --- КОРЕКЦИЯ: Тъй като vehicles_for_stop може да няма lat/lon, 
        // нека ползваме съществуващата логика с global radar, но филтрирана ---
        // (Оставям горния код, но ако API-то vehicles_for_stop няма lat/lon, няма да се нарисуват).
        
        if (!v.latitude || !v.longitude) return; 

        const markerId = `goog_${v.trip_id}`;
        currentIds.add(markerId);

        // Стандартно рисуване на стрелка (без snap-to-shape, защото нямаме shape-а на линията тук)
        // Но пък имаме bearing от API-то обикновено.
        const bearing = v.bearing || 0;
        
        const iconHtml = `
            <div class="vehicle-marker-container">
                <div class="vehicle-time-bubble">${formatTime(v.eta_minutes)}</div>
                <div class="radar-vehicle-wrapper" style="transform: rotate(${bearing}deg);">
                    <div class="radar-vehicle-arrow" style="border-bottom-color: ${v.color};"></div>
                    <div class="radar-vehicle-circle" style="border-color: ${v.color}; transform: rotate(${-bearing}deg);">
                        ${v.route_name}
                    </div>
                </div>
            </div>`;

        const icon = L.divIcon({ 
            className: 'radar-smooth-icon', 
            html: iconHtml, 
            iconSize: [40, 40], 
            iconAnchor: [20, 20] 
        });

        const latLng = [v.latitude, v.longitude];

        // Добавяне/Обновяване
        let marker = null;
        // Търсим в слоя
        vehicleLayer.eachLayer(layer => {
            if (layer.options.markerId === markerId) marker = layer;
        });

        if (marker) {
            marker.setLatLng(latLng);
            marker.setIcon(icon);
        } else {
            marker = L.marker(latLng, { 
                icon: icon, 
                zIndexOffset: 1000,
                markerId: markerId // Custom property
            }).addTo(vehicleLayer);
        }
    });
    
    // Чистене на изчезнали
    vehicleLayer.eachLayer(layer => {
        if (layer.options.markerId && layer.options.markerId.startsWith('goog_') && !currentIds.has(layer.options.markerId)) {
            vehicleLayer.removeLayer(layer);
        }
    });
}





async function renderRouteResults(routes) {
    const content = document.getElementById('sheet-arrivals-list');
    content.innerHTML = '';

    // Сортираме по време
    routes.sort((a, b) => (a.legs[0].duration.value - b.legs[0].duration.value));

    const uniqueRoutesMap = new Map();

    // 1. ГРУПИРАНЕ
    for (const route of routes) {
        const leg = route.legs[0];
        let routeSignature = "";
        let displaySegments = [];

        for (const step of leg.steps) {
            if (step.travel_mode === 'TRANSIT') {
                const googleLine = step.transit.line;
                const startLocation = step.transit.departure_stop.location;
                const endLocation = step.transit.arrival_stop.location;
                
                const startCode = findClosestStopCode(startLocation.lat(), startLocation.lng());
                const endCode = findClosestStopCode(endLocation.lat(), endLocation.lng());

                let mergedLineNames = googleLine.short_name || googleLine.name;
                let color = googleLine.color || '#333';
                let vType = googleLine.vehicle.type; 

                if (startCode && endCode) {
                    const serverLines = await fetchDirectRoutes(startCode, endCode);
                    if (serverLines.length > 0) {
                        const uniqueNames = [...new Set(serverLines.map(l => l.line_name))];
                        const sortedNames = uniqueNames.sort(new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}).compare);
                        mergedLineNames = sortedNames.join(" / ");
                    }
                }
                
                if (vType === 'TRAM') { color = '#F7941D'; }
                else if (vType === 'SUBWAY') { color = '#007DC5'; }
                else if (vType === 'TROLLEYBUS') { color = '#27AAE1'; }
                else { color = '#BE1E2D'; } 

                displaySegments.push({
                    type: 'TRANSIT',
                    text: mergedLineNames,
                    color: color,
                    icon: vType
                });
                
                routeSignature += `|TRANSIT_${startCode}_${endCode}`;

            } else if (step.travel_mode === 'WALKING') {
                displaySegments.push({ type: 'WALKING' });
                const distChunk = Math.round(step.distance.value / 300); 
                routeSignature += `|WALK_${distChunk}`;
            }
        }

        if (!uniqueRoutesMap.has(routeSignature)) {
            uniqueRoutesMap.set(routeSignature, {
                routeData: route,
                segments: displaySegments,
                duration: leg.duration.text
            });
        }
    }

    // 2. РЕНДИРАНЕ
    if (uniqueRoutesMap.size === 0) {
        content.innerHTML = '<p style="text-align:center;">Няма намерени маршрути.</p>';
        return;
    }

    uniqueRoutesMap.forEach((data) => {
        const durationBg = data.duration
            .replace("mins", "мин").replace("min", "мин")
            .replace("hours", "ч").replace("hour", "ч");

        const card = document.createElement('div');
        card.className = 'list-item-container';
        card.style.padding = '16px';
        card.style.cursor = 'pointer';

        let html = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                <div style="font-size:20px; font-weight:bold; color:var(--on-surface);">${durationBg}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px;">
        `;

        data.segments.forEach((seg, index) => {
            if (index > 0) {
                html += `<span class="material-icons-round" style="font-size:14px; color:#aaa;">chevron_right</span>`;
            }

            if (seg.type === 'WALKING') {
                html += `<span class="material-icons-round" style="font-size:18px; color:#666;">directions_walk</span>`;
            } else {
                let iconChar = 'directions_bus';
                if (seg.icon === 'TRAM') iconChar = 'tram';
                if (seg.icon === 'SUBWAY') iconChar = 'subway';
                
                html += `
                    <div style="display:flex; align-items:center; background:${seg.color}; color:white; padding:4px 8px; border-radius:6px; box-shadow:0 1px 2px rgba(0,0,0,0.2);">
                        <span class="material-icons-round" style="font-size:14px; margin-right:4px;">${iconChar}</span>
                        <span style="font-weight:bold; font-size:14px;">${seg.text}</span>
                    </div>
                `;
            }
        });

        html += `</div>`;
        
        const leg = data.routeData.legs[0];
        const startAddr = leg.start_address.split(',')[0];
        const endAddr = leg.end_address.split(',')[0];
        
        html += `<div style="margin-top:10px; font-size:12px; color:var(--on-surface-variant); border-top:1px solid var(--outline); padding-top:4px;">${startAddr} &rarr; ${endAddr}</div>`;

        card.innerHTML = html;
        
        // --- ТУК Е ПОПРАВКАТА ЗА ПРИБИРАНЕТО ---
// Намери този блок вътре в renderRouteResultsToSheet и го замени:
card.onclick = () => {
    drawRouteOnMap(data.routeData); // Чертае линията на картата
    
    // Показваме детайлите вместо да минимизираме
    renderRouteDetails(data.routeData);
};

        content.appendChild(card);
    });
}




function renderRouteDetails(route) {
    const listContent = document.getElementById('routes-list-content');
    const detailsContent = document.getElementById('routes-details-content');
    const backBtn = document.getElementById('btn-routes-back');
    const title = document.getElementById('routes-sheet-title');
    const sheet = document.getElementById('routes-sheet');

    listContent.classList.add('hidden');
    detailsContent.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    title.innerText = t('details') || "Детайли";

    detailsContent.innerHTML = '';
    const leg = route.legs[0];

    leg.steps.forEach((step, index) => {
        const isTransit = step.travel_mode === 'TRANSIT';
        let color = '#666';
        let icon = 'directions_walk';
        let stopObj = null;

        if (isTransit) {
            const vType = step.transit.line.vehicle.type;
            color = getTransportColor(vType, step.transit.line.short_name);
            icon = (vType === 'SUBWAY') ? 'subway' : 'directions_bus';
            
            // Търсим спирката в нашата база по координати от Google
            const lat = step.transit.departure_stop.location.lat();
            const lng = step.transit.departure_stop.location.lng();
            stopObj = findClosestStopObj(lat, lng);
        }

        const stepDiv = document.createElement('div');
        stepDiv.className = 'list-item-container';
        stepDiv.style.cssText = `border-left: 5px solid ${color}; margin-bottom: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px;`;

        // ГОРЕН РЕД: Икона + Инструкция
        let html = `
            <div style="display:flex; gap:12px; align-items:flex-start;">
                <span class="material-icons-round" style="color:${color}">${icon}</span>
                <div style="flex:1;">
                    <div style="font-size:14px; font-weight:600; color:var(--on-surface);">${step.instructions}</div>
                    <div style="font-size:12px; color:gray;">${step.distance.text} • ${step.duration.text}</div>
                </div>
            </div>
        `;

        // ДОЛЕН РЕД: Бутони (само за Транзит/Спирки)
        if (isTransit && stopObj) {
            html += `
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
                    <button class="icon-btn-small" style="background:var(--background); padding:4px 12px; border-radius:15px; display:flex; align-items:center; gap:5px; border:1px solid #ddd;" 
                        onclick="zoomToRouteStop(${stopObj.stop_lat}, ${stopObj.stop_lon})">
                        <span class="material-icons-round" style="font-size:16px;">map</span>
                        <span style="font-size:11px; font-weight:bold;">КАРТА</span>
                    </button>
                    <button class="icon-btn-small" style="background:var(--primary); color:white; padding:4px 12px; border-radius:15px; display:flex; align-items:center; gap:5px; border:none;" 
                        onclick="openStopFromRoute('${stopObj.stop_id}')">
                        <span class="material-icons-round" style="font-size:16px;">list</span>
                        <span style="font-size:11px; font-weight:bold;">ВИЖ СПИРКА</span>
                    </button>
                </div>
            `;
        }

        stepDiv.innerHTML = html;
        detailsContent.appendChild(stepDiv);
    });

    // Снапваме на 50% автоматично
    snapSheetTo(50);
}

// Функции за бутоните в стъпките
window.zoomToRouteStop = function(lat, lng) {
    map.setView([lat, lng], 18, { animate: true });
    snapSheetTo(25); // Сваляме панела малко, за да се види спирката
};

window.openStopFromRoute = function(stopId) {
    const stop = allStopsData.find(s => s.stop_id == stopId);
    if(stop) openStopSheet(stop);
};



// Функция за чертане на пътя върху картата
function drawRouteOnMap(route) {
    routeLayer.clearLayers();

    const latLngs = [];
    route.legs[0].steps.forEach(step => {
        if(step.path) {
            step.path.forEach(p => latLngs.push([p.lat(), p.lng()]));
        }
    });

    if(latLngs.length > 0) {
         const polyline = L.polyline(latLngs, { color: '#4285F4', weight: 6, opacity: 0.7 }).addTo(routeLayer);
         
         // ВАЖНО: paddingBottomRight осигурява мястото отдолу (за минимизираното меню)
         map.fitBounds(polyline.getBounds(), { 
             paddingTopLeft: [50, 50],
             paddingBottomRight: [50, 150] 
         });
    }
}




// --- PHOTON SEARCH LOGIC (Замества Google Places) ---

// --- PHOTON SEARCH LOGIC (FIXED) ---

// 1. Глобална променлива за таймера (Важно!)
let photonDebounceTimer = null;

function initPhotonSearch() {
    const input = document.getElementById('map-search-input');
    const clearBtn = document.getElementById('btn-search-clear');
    const routeBtn = document.getElementById('btn-find-routes'); // Бутонът за маршрути
    
    if (!input) {
        console.error("Photon Search: Input field not found!");
        return;
    }

    console.log(">>> Photon Search Initialized"); // За проверка в конзолата

    // 2. Създаваме (или намираме) контейнера за резултати
    let resultsDiv = document.getElementById('photon-results-main');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'photon-results-main';
        
        // Добавяме го към контейнера на търсачката
        const parent = document.getElementById('map-search-container');
        if (parent) {
            parent.appendChild(resultsDiv);
        } else {
            document.body.appendChild(resultsDiv);
        }
    }

    // 3. Слушател за писане (INPUT)
    input.addEventListener('input', (e) => {
        const val = e.target.value.trim();

        // Управление на бутоните
        if (val.length > 0) {
            if(clearBtn) clearBtn.classList.remove('hidden');
            if(routeBtn) routeBtn.classList.remove('hidden');
        } else {
            if(clearBtn) clearBtn.classList.add('hidden');
            if(routeBtn) routeBtn.classList.add('hidden');
            resultsDiv.style.display = 'none';
            return;
        }

        // Тайни кодове (ако ползваш devmode)
        if (val === 'devmode_on' || val === 'devmode_off') {
             input.value = ''; 
             return;
        }

        // Изпълнение на търсенето
        performPhotonSearch(val, resultsDiv, (feature) => {
            handlePhotonSelection(feature, input, resultsDiv);
        });
    });

    // 4. Слушател за фокус (ако има текст, покажи пак резултатите)
    input.addEventListener('focus', () => {
        if (input.value.trim().length > 1 && resultsDiv.children.length > 0) {
            resultsDiv.style.display = 'block';
        }
    });

    // 5. Управление на бутона за изчистване (X)
    if (clearBtn) {
        clearBtn.onclick = () => {
            input.value = '';
            clearBtn.classList.add('hidden');
            if(routeBtn) routeBtn.classList.add('hidden');
            resultsDiv.style.display = 'none';
            
            // Чистим маркера от картата
            if (typeof searchMarker !== 'undefined' && searchMarker) {
                map.removeLayer(searchMarker);
                searchMarker = null;
            }
            map.closePopup();
            input.focus();
        };
    }
    
    // 6. Скриване при клик извън
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.style.display = 'none';
        }
    });
}

// Извиква API-то на Photon
// Замени старата функция performPhotonSearch с тази:

// Глобална променлива за последната заявка
let lastSearchQuery = "";

function performPhotonSearch(query, container, onSelect) {
    if (photonDebounceTimer) clearTimeout(photonDebounceTimer);

    if (!query || query.length < 2) {
        container.style.display = 'none';
        return;
    }

    // Намаляваме времето на 150ms за бърза реакция
    photonDebounceTimer = setTimeout(async () => {
        // Запазваме какво търсим в момента
        const currentQueryAtFetch = query;
        
        const lat = 42.6977;
        const lon = 23.3219;
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=15`;

        try {
            const response = await fetch(url);
            
            // ПРОВЕРКА: Ако междувременно потребителят е продължил да пише
            // и текстът в полето е различен от този, за който е тази заявка -> спираме.
            const currentInputVal = document.getElementById('map-search-input').value.trim();
            if (currentQueryAtFetch !== currentInputVal && currentInputVal.length > 0) {
                 // Това е стар резултат, игнорираме го
                 return;
            }

            if (!response.ok) return;

            const data = await response.json();
            
            container.innerHTML = '';
            
            if (!data.features || data.features.length === 0) {
                container.innerHTML = '<div style="padding:12px; color:#888; text-align:center; font-style:italic;">Няма резултати.</div>';
                container.style.display = 'block';
                return;
            }

            data.features.forEach(f => {
                const props = f.properties;
                const name = props.name || props.street || "Без име";
                
                let detailsParts = [];
                if (props.street && props.street !== name) detailsParts.push(props.street);
                if (props.housenumber) detailsParts.push("№" + props.housenumber);
                if (props.district) detailsParts.push(props.district);
                if (props.city) detailsParts.push(props.city);
                
                const fullText = (props.city || "") + (props.country || "");
                // Филтър за София (по желание може да се махне)
                if (!fullText.includes("Sofia") && !fullText.includes("София") && !fullText.includes("Bulgaria")) {
                   // return; 
                }

                const detailsText = detailsParts.join(", ");

                const div = document.createElement('div');
                div.className = 'photon-item'; 
                div.style.cssText = "padding:12px 16px; border-bottom:1px solid #eee; cursor:pointer; display:flex; align-items:center;";
                
                div.innerHTML = `
                    <span class="material-icons-round" style="color:#777; margin-right:12px; font-size:20px;">location_on</span>
                    <div>
                        <div style="font-weight:bold; color:var(--on-surface); font-size:14px; line-height:1.2;">${name}</div>
                        ${detailsText ? `<div style="font-size:11px; color:#666; margin-top:2px;">${detailsText}</div>` : ''}
                    </div>`;
                
                div.onclick = (e) => {
                    e.stopPropagation();
                    onSelect(f);
                };
                
                container.appendChild(div);
            });
            
            container.style.display = 'block';

        } catch(e) {
            console.error("Photon API error:", e);
        }
    }, 150); // <-- БЪРЗА РЕАКЦИЯ
}



// Обработка на избора (Местене на картата и слагане на пинче)
function handlePhotonSelection(feature, input, resultsDiv) {
    const coords = feature.geometry.coordinates; // [lng, lat]
    const lat = coords[1];
    const lng = coords[0];
    const props = feature.properties;
    
    let displayName = props.name || props.street || "Избран адрес";
    if (props.housenumber) displayName += ` ${props.housenumber}`;
    
    input.value = displayName;
    resultsDiv.style.display = 'none';
    
    // Показваме бутона за маршрути
    const routeBtn = document.getElementById('btn-find-routes');
    if(routeBtn) routeBtn.classList.remove('hidden');
    
    if (typeof map !== 'undefined') {
        map.setView([lat, lng], 17);
        
        // Запазваме за маршрутизация
        if (typeof currentSearchedLocation !== 'undefined') {
            currentSearchedLocation = { lat, lng };
        } else {
            window.currentSearchedLocation = { lat, lng };
        }

        // Червено пинче
        if (typeof searchMarker !== 'undefined' && searchMarker) {
            map.removeLayer(searchMarker);
        }
        
        const iconHtml = `<div style="display: flex; justify-content: center;"><span class="material-icons-round" style="font-size: 40px; color: #EA4335; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">place</span></div>`;
        const icon = L.divIcon({ className: '', html: iconHtml, iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] });
        
        searchMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 2000 }).addTo(map);
        
        searchMarker.bindPopup(`<div style="text-align:center; font-family:sans-serif;"><b>${displayName}</b></div>`, { 
            className: 'custom-popup', 
            closeButton: false 
        }).openPopup();
    }
    
    input.blur();
}



// Функция за бързо добавяне/махане на спирка от любими (за списъка с линии)
window.toggleStopFavFromLine = function(stopId, btn) {
    // 1. Проверяваме дали е в любими
    const idx = favoriteStops.indexOf(stopId);
    const icon = btn.querySelector('span');

    if (idx > -1) {
        // Има я -> Махаме я
        favoriteStops.splice(idx, 1);
        icon.textContent = 'star_border';
        icon.style.color = ''; // Връщаме стандартния цвят
    } else {
        // Няма я -> Добавяме я
        favoriteStops.push(stopId);
        icon.textContent = 'star';
        icon.style.color = '#FFD700'; // Златисто жълто
    }
    
    // 2. Запазваме в паметта
    localStorage.setItem('favStops', JSON.stringify(favoriteStops));
    
    // 3. Ако сме в екран "Любими", го обновяваме (за всеки случай)
    if (document.getElementById('screen-favorites').classList.contains('active')) {
        loadFavoritesScreen();
    }
};


// --- CUSTOM STOPS LOGIC ---
function unlockiOSAudio() {
    const alarmAudio = document.getElementById('alarm-sound');
    const bgAudio = document.getElementById('background-audio');

    // 1. Пускаме тишината (за да върви таймерът във фонов режим)
    if (bgAudio && bgAudio.paused) {
        bgAudio.volume = 0.05;
        bgAudio.play().catch(e => {});
    }

    // 2. "Подгряваме" ТВОЯТА аларма за кратко (iOS Unlock)
    if (alarmAudio) {
        // Намаляваме звука леко, за да не стресне, ако си със слушалки
        alarmAudio.volume = 0.1; 
        
        alarmAudio.play().then(() => {
            console.log(">>> iOS Alarm Unlocked (Brief play) 🔓");
            
            // СПИРАМЕ Я СЛЕД 200 милисекунди (много кратко)
            setTimeout(() => {
                alarmAudio.pause();
                alarmAudio.currentTime = 0;
                alarmAudio.volume = 1.0; // Вдигаме звука на макс за после
            }, 200);
            
        }).catch(e => {
            console.log(">>> iOS Audio Unlock Failed:", e);
        });
    }
}


// В script.js

// В script.js

function openMapForSelection() {
    // 1. Скриваме Creator екрана
    document.getElementById('screen-create-custom').classList.remove('active');
    document.getElementById('screen-create-custom').classList.add('hidden');

    // 2. Показваме Картата
    document.querySelector('[data-target="screen-map"]').click();
    
    // 3. Показваме панела за избор
    const panel = document.getElementById('map-selection-panel');
    panel.classList.remove('hidden');
    
    // 4. Скриваме стандартните бутони
    document.getElementById('btn-live-radar').classList.add('hidden');
    document.getElementById('btn-locate').classList.add('hidden');
    document.getElementById('map-search-container').classList.add('hidden');
    
    // 5. Вдигаме флага
    isCustomStopSelectionMode = true;
    
    // 6. Рендираме панела долу
    renderMapSelectionPanel();
    
    // --- ВАЖНО: Веднага слагаме тикчетата на вече добавените спирки ---
    setTimeout(() => {
        map.invalidateSize(); // Оправя размера на картата
        refreshMapSelectionVisuals(); // <--- ТОВА Е КЛЮЧЪТ
    }, 100);
}



// В script.js

function closeMapSelectionMode() {
    // 1. Сваляме флага (Вече не сме в режим избор)
    isCustomStopSelectionMode = false;
    
    // 2. ВЕДНАГА чистим всички тикчета от картата
    refreshMapSelectionVisuals(); 
    
    // 3. Скриваме панела
    document.getElementById('map-selection-panel').classList.add('hidden');
    
    // 4. Връщаме нормалните бутони на картата
    document.getElementById('btn-live-radar').classList.remove('hidden');
    document.getElementById('btn-locate').classList.remove('hidden');
    document.getElementById('map-search-container').classList.remove('hidden');
    
    // 5. Връщаме се в Creator екрана
    const creatorScreen = document.getElementById('screen-create-custom');
    creatorScreen.classList.remove('hidden');
    creatorScreen.classList.add('active');
    
    // 6. Обновяваме списъка в Creator екрана
    renderAddedStopsList(tempCustomStopsList);
}


// --- ФУНКЦИЯ 1: Отваря панела (за Нова спирка или за Редакция) ---
// В script.js

function openCustomStopCreator(editId = null, mode = 'GROUP') {
    editingCustomStopId = editId; 
    currentCreatorMode = mode; // Запазваме режима
    
    const screen = document.getElementById('screen-create-custom');
    const title = document.getElementById('custom-creator-title'); 
    const nameInputContainer = document.getElementById('custom-group-name').parentElement; // Родителят на инпута
    const saveBtn = document.getElementById('btn-save-custom-stop');
    
    // Чистим полетата
    document.getElementById('custom-group-name').value = '';
    document.getElementById('custom-stop-search').value = '';
    document.getElementById('custom-search-results').style.display = 'none';
    
    if (mode === 'SINGLE') {
        // --- РЕЖИМ ЕДИНИЧНИ СПИРКИ ---
        title.textContent = t('title_add_single'); // "Добави любими спирки"
        saveBtn.textContent = t('btn_add_favorites'); // "Добави в Любими"
        
        // СКРИВАМЕ ПОЛЕТО ЗА ИМЕ НА ГРУПА (не ни трябва)
        nameInputContainer.style.display = 'none';
        
        tempCustomStopsList = [];
    } else {
        // --- РЕЖИМ ГРУПА (Стандартен) ---
        nameInputContainer.style.display = 'block'; // Показваме полето
        
        if (editId) {
            // Редакция на съществуваща група
            const customObj = customStopsData.find(c => c.id === editId);
            if (!customObj) return; 
            title.textContent = t('custom_title_edit');
            saveBtn.textContent = t('btn_save_changes');
            document.getElementById('custom-group-name').value = customObj.name;
            
            tempCustomStopsList = customObj.subStops.map(subId => {
                return allStopsData.find(s => s.stop_id === subId) || { stop_id: subId, stop_name: t('txt_unknown'), stop_code: '?' };
            });
        } else {
            // Нова група
            title.textContent = t('custom_title_create');
            saveBtn.textContent = t('btn_create_stop');
            tempCustomStopsList = [];
        }
    }
    
    renderAddedStopsList(tempCustomStopsList);
    
    screen.classList.remove('hidden');
    screen.classList.add('active');
}



// --- ФУНКЦИЯ 2: Инициализация на бутоните (Сложи я в началото или при другите init функции) ---
// В script.js

function initCustomStopsUI() {
    console.log("Initializing Custom Stops UI..."); // За дебъгване

    // 1. Слушател за бутона "+" в Любими
    const btnAdd = document.getElementById('btn-add-custom-stop');
    
    if (btnAdd) {
        btnAdd.onclick = () => {
            const modal = document.getElementById('modal-add-choice');
            if (modal) {
                // Показваме модала за избор
                modal.classList.remove('hidden');
                // Малко закъснение за CSS анимацията (ако има такава)
                requestAnimationFrame(() => modal.classList.add('active'));
            } else {
                console.error("ГРЕШКА: HTML елементът 'modal-add-choice' липсва!");
                // Резервен вариант: Отваря старото меню директно
                openCustomStopCreator(null, 'GROUP');
            }
        };
    } else {
        console.error("ГРЕШКА: Бутонът 'btn-add-custom-stop' не е намерен!");
    }
    
    // 2. Слушател за затваряне на екрана за създаване
    const btnCloseCreator = document.getElementById('btn-close-custom-creator');
    if (btnCloseCreator) {
        btnCloseCreator.onclick = closeCreatorScreen;
    }
    
    // 3. Слушатели за бутоните в НОВИЯ МОДАЛ
    const btnSingle = document.getElementById('btn-choice-single');
    const btnGroup = document.getElementById('btn-choice-group');

    if (btnSingle) {
        btnSingle.onclick = () => {
            closeAddChoiceModal();
            openCustomStopCreator(null, 'SINGLE');
        };
    }

    if (btnGroup) {
        btnGroup.onclick = () => {
            closeAddChoiceModal();
            openCustomStopCreator(null, 'GROUP');
        };
    }

    // 4. Търсачка и други бутони (както преди)
    const searchInput = document.getElementById('custom-stop-search');
    const resultsDiv = document.getElementById('custom-search-results');
    
// В initCustomStopsUI() ...
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            if (val.length < 2) {
                resultsDiv.style.display = 'none';
                return;
            }

            // 1. Филтрираме по име или код
            const filtered = allStopsData.filter(s => 
                s.stop_name.toLowerCase().includes(val) || 
                (s.stop_code && s.stop_code.includes(val))
            );

            // 2. ПРЕМАХВАНЕ НА ДУБЛИКАТИ (Логиката от Search таба)
            const unique = []; 
            const seen = new Set(); 
            
            filtered.forEach(s => { 
                // Уникалност по КОД (ако има) или ID
                const key = s.stop_code ? s.stop_code : s.stop_id;
                
                if(!seen.has(key)) { 
                    seen.add(key); 
                    unique.push(s); 
                } 
            });

            // Взимаме само първите 10 резултата
            const displayList = unique.slice(0, 10);

            resultsDiv.innerHTML = '';
            if (displayList.length > 0) {
                resultsDiv.style.display = 'block';
                displayList.forEach(stop => {
                    const div = document.createElement('div');
                    div.className = 'custom-search-item';
                    div.innerHTML = `<div><div style="font-weight:bold; font-size:14px;">${stop.stop_name}</div><div style="font-size:12px; color:#888;">${stop.stop_code || ''}</div></div><button class="btn-add-mini">+</button>`;
                    div.onclick = () => addStopToCustomList(stop);
                    resultsDiv.appendChild(div);
                });
            } else { 
                resultsDiv.style.display = 'none'; 
            }
        });
    }
   
   // Бутон Карта
    const btnMap = document.getElementById('btn-open-map-selection');
    if (btnMap) btnMap.onclick = openMapForSelection;

    // Бутон Готово на картата
    const btnFinish = document.getElementById('btn-finish-selection');
    if (btnFinish) btnFinish.onclick = closeMapSelectionMode;

    // Бутон Запази
    const btnSave = document.getElementById('btn-save-custom-stop');
    if (btnSave) btnSave.onclick = saveCustomStop;
}

// Помощна функция за затваряне на модала
function closeAddChoiceModal() {
    const modal = document.getElementById('modal-add-choice');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}




// Временен списък докато създаваме
let tempCustomStopsList = [];

function addStopToCustomList(stop) {
    // Проверка за дублиране
    if (tempCustomStopsList.some(s => s.stop_id === stop.stop_id)) return;
    
    tempCustomStopsList.push(stop);
    renderAddedStopsList(tempCustomStopsList);
    
    // Чистим търсачката
    document.getElementById('custom-stop-search').value = '';
    document.getElementById('custom-search-results').style.display = 'none';
}

function removeStopFromCustomList(stopId) {
    tempCustomStopsList = tempCustomStopsList.filter(s => s.stop_id !== stopId);
    renderAddedStopsList(tempCustomStopsList);
}



// В script.js

function renderAddedStopsList(list) {
    tempCustomStopsList = list;
    const container = document.getElementById('custom-added-list');
    container.innerHTML = '';
    
    if (list.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: #999; font-size: 14px; padding: 10px;">${t('custom_no_added_stops')}</div>`;
        return;
    }

    list.forEach(stop => {
        const el = document.createElement('div');
        el.className = 'added-stop-item';
        el.setAttribute('data-temp-id', stop.stop_id);
        
        // --- ПРОМЯНАТА Е ТУК ---
        el.innerHTML = `
            <div class="sub-drag-handle"><span class="material-icons-round">swap_vert</span></div>
            <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center;">
                <div style="font-weight:600; font-size:15px; color:var(--on-surface);">${stop.stop_name}</div>
                <div style="font-size:12px; color:var(--on-surface-variant);">${stop.stop_code || ''}</div>
            </div>
            
            <!-- НОВ БУТОН: КАРТА -->
            <button class="icon-btn-small" style="color:var(--primary); padding:8px; margin-right:4px;" 
                onclick="locateAndSelectFromList('${stop.stop_id}')">
                <span class="material-icons-round">map</span>
            </button>

            <!-- БУТОН: ИЗТРИВАНЕ -->
            <button class="icon-btn-small" style="color:#d32f2f; padding:8px;" onclick="removeStopFromCustomList('${stop.stop_id}')">
                <span class="material-icons-round">delete</span>
            </button>
        `;
        // -----------------------
        
        const handle = el.querySelector('.sub-drag-handle');
        setupSubStopDrag(handle, el, container);
        container.appendChild(el);
    });
}




// В script.js

function saveCustomStop() {
    // 1. Взимаме списъка с избрани спирки (техните ID-та)
    const subIds = tempCustomStopsList.map(s => s.stop_id);
    
    // ПРОВЕРКА: Трябва да има поне 1 спирка
    if (subIds.length === 0) {
        alert(t('custom_no_added_stops')); // "Няма добавени спирки"
        return;
    }

    // ============================================================
    // ВАРИАНТ 1: РЕЖИМ "ЕДИНИЧНИ СПИРКИ" (SINGLE)
    // ============================================================
    if (currentCreatorMode === 'SINGLE') {
        let addedCount = 0;
        
        // Обикаляме всички избрани спирки
        subIds.forEach(id => {
            // Ако я няма в любими, я добавяме
            if (!favoriteStops.includes(id)) {
                favoriteStops.push(id);
                addedCount++;
            }
        });
        
        // Запазваме промените
        localStorage.setItem('favStops', JSON.stringify(favoriteStops));
        
        // Показваме съобщение
        if (addedCount > 0) {
            alert(currentLanguage === 'bg' ? `Добавени са ${addedCount} спирки!` : `${addedCount} stops added!`);
        } else {
            alert(currentLanguage === 'bg' ? "Всички избрани спирки вече са в любими." : "All selected stops are already in favorites.");
        }
        
        // Затваряме екрана
        closeCreatorScreen();
		
	

        // --- ВАЖНО: ПРЕХВЪРЛЯМЕ КЪМ ЛЮБИМИ ---
        const favTab = document.querySelector('[data-target="screen-favorites"]');
        if (favTab) {
            favTab.click();
        }
        return; // Край на функцията за този режим
    }

    // ============================================================
    // ВАРИАНТ 2: РЕЖИМ "КОМБИНИРАНА СПИРКА" (GROUP)
    // ============================================================

    // За група задължително трябва име
    const name = document.getElementById('custom-group-name').value.trim();
    if (!name) { 
        alert(t('alert_enter_name')); // "Моля, въведете име на групата."
        return; 
    }

    // --- СПЕЦИАЛЕН СЛУЧАЙ: Само 1 спирка в режим Група ---
    // Ако правиш група, но си сложил само 1 спирка, я записваме като нормална любима.
    if (subIds.length === 1) {
        const realStopId = subIds[0];

        if (editingCustomStopId) {
            // РЕДАКЦИЯ: Ако група е намалена до 1 спирка -> става нормална спирка
            // 1. Намираме къде е била групата и слагаме ID-то на спирката там
            const idx = favoriteStops.indexOf(editingCustomStopId);
            if (idx > -1) {
                favoriteStops[idx] = realStopId;
            } else {
                favoriteStops.push(realStopId);
            }
            
            // 2. Изтриваме старата дефиниция на групата (вече не ни трябва)
            customStopsData = customStopsData.filter(c => c.id !== editingCustomStopId);
        } else {
            // НОВО: Ако създаваш нова група с 1 спирка -> просто добавяме спирката
            if (!favoriteStops.includes(realStopId)) {
                favoriteStops.push(realStopId);
            } else {
                alert(currentLanguage === 'bg' ? "Тази спирка вече е в любими." : "Stop already in favorites.");
                return;
            }
        }
        
        // Запазваме всичко
        localStorage.setItem('customStopsData', JSON.stringify(customStopsData));
        localStorage.setItem('favStops', JSON.stringify(favoriteStops));
        alert(t('alert_saved'));
        
        closeCreatorScreen();
        return;
    } 
    
    // --- СТАНДАРТНО СЪЗДАВАНЕ/РЕДАКЦИЯ НА ГРУПА (2+ спирки) ---
    
    if (editingCustomStopId) {
        // --- РЕДАКЦИЯ НА СЪЩЕСТВУВАЩА ГРУПА ---
        const index = customStopsData.findIndex(c => c.id === editingCustomStopId);
        if (index > -1) {
            customStopsData[index].name = name;
            customStopsData[index].subStops = subIds;
            
            localStorage.setItem('customStopsData', JSON.stringify(customStopsData));
            alert(t('alert_saved'));
        }
    } else {
        // --- СЪЗДАВАНЕ НА НОВА ГРУПА ---
        const newId = `custom_${Date.now()}`;
        const newCustomStop = {
            id: newId,
            name: name,
            subStops: subIds
        };

        customStopsData.push(newCustomStop);
        localStorage.setItem('customStopsData', JSON.stringify(customStopsData));

        // Добавяме ID-то на групата в любими
        favoriteStops.push(newId);
        localStorage.setItem('favStops', JSON.stringify(favoriteStops));
        alert(t('alert_created'));
    }

    closeCreatorScreen();
	// --- НОВО: ВИНАГИ ОТИВАМЕ В ТАБ ЛЮБИМИ ---
    // Намираме бутона в навигацията и го натискаме програмно
    const favTab = document.querySelector('[data-target="screen-favorites"]');
    if (favTab) {
        favTab.click();
    }
}

// Помощна функция за затваряне и обновяване
function closeCreatorScreen() {
    document.getElementById('screen-create-custom').classList.remove('active');
    document.getElementById('screen-create-custom').classList.add('hidden');
    
    // Ако сме в екран Любими, презареждаме го веднага, за да видим новите спирки
    if (document.getElementById('screen-favorites').classList.contains('active')) {
        loadFavoritesScreen();
        // Извикваме и обновяване на живите данни за новите спирки
        refreshFavoritesLiveStatus();
    }
}



async function toggleExpandedCustomStop(customId, header, container) {
    let icon = header.querySelector('.list-expand-icon');
    const isExpanded = icon.classList.contains('expanded');
    
    if (isExpanded) {
        // Затваряне
        icon.classList.remove('expanded');
        container.classList.remove('visible');
        setTimeout(() => { container.innerHTML = ''; }, 300);
    } else {
        // Отваряне
        icon.classList.add('expanded');
        container.classList.add('visible');
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <span class="rotating material-icons-round" style="font-size: 32px; color: var(--primary); margin-bottom: 8px;">refresh</span>
                <span style="font-size: 13px; color: var(--on-surface-variant);">${t('loading_stops')}</span>
            </div>
        `;
        
        const customObj = customStopsData.find(c => c.id === customId);
        if (!customObj) return;
        await loadCombinedArrivals(customObj, container);
    }

    // --- НОВО: ПУСКАМЕ ТАЙМЕРА ЗА АВТОМАТИЧНО ОБНОВЯВАНЕ ---
    setTimeout(checkAndManageTimers, 100);
}





async function loadCombinedArrivals(customObj, targetContainer) {
    // 1. Взимаме всички ID-та на под-спирките
    const subIds = customObj.subStops;
    
    // 2. Паралелно теглене
    const promises = subIds.map(id => 
        fetch(`${API_BASE_URL}vehicles_for_stop/${id}`, { headers: { 'Accept-Language': currentLanguage } })
            .then(r => r.json())
            .then(data => ({ id: id, data: data }))
            .catch(() => ({ id: id, data: [] }))
    );
    
    try {
        const results = await Promise.all(promises);
        
        // --- ПРОМЯНАТА: Изграждаме HTML в буфер, вместо да трием веднага ---
        // (Така ако потребителят гледа в момента, няма да му изчезне списъка докато зарежда)
        
        const tempContainer = document.createElement('div');
        let hasAnyData = false;

        results.forEach(result => {
            const stopInfo = allStopsData.find(s => s.stop_id === result.id);
            const stopName = stopInfo ? stopInfo.stop_name : "Спирка";
            const stopCode = stopInfo ? stopInfo.stop_code : "";
            
            const headerHtml = `
                <div class="combined-stop-header">
                    <span>${stopName} <span style="font-weight:normal; opacity:0.7;">(${stopCode})</span></span>
                </div>
            `;
            
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = headerHtml;
            const listDiv = document.createElement('div');
            
            if (result.data.length > 0) {
                hasAnyData = true;
                renderArrivals(result.data, listDiv, result.id);
            } else {
                listDiv.innerHTML = '<div style="font-size:12px; color:#999; padding:4px 12px; font-style:italic;">Няма курсове скоро</div>';
            }
            
            sectionDiv.appendChild(listDiv);
            tempContainer.appendChild(sectionDiv);
        });
        
        if (!hasAnyData) {
            tempContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#888;">${t('txt_no_data_combined')}</div>`;
        }

        // --- ФИНАЛНО ЗАМЕСТВАНЕ ---
        targetContainer.innerHTML = '';
        // Прехвърляме децата от временния контейнер в реалния
        while (tempContainer.firstChild) {
            targetContainer.appendChild(tempContainer.firstChild);
        }

    } catch (e) {
        console.error(e);
        // Показваме грешка само ако контейнерът е празен (първоначално зареждане)
        // Ако е авто-рефреш, по-добре да оставим старите данни, отколкото "Грешка"
        if (!targetContainer.hasChildNodes() || targetContainer.querySelector('.rotating')) {
            targetContainer.innerHTML = '<div style="color:red; text-align:center; padding:10px;">Грешка при зареждане.</div>';
        }
    }
}




function setupSubStopDrag(handle, item, container) {
    let isDragging = false;
    let startY = 0;

    const getClientY = (e) => {
        return e.touches ? e.touches[0].clientY : e.clientY;
    };

    const onStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        e.preventDefault(); // Спира селектирането на текст
        // e.stopPropagation(); // (Опционално)

        isDragging = true;
        startY = getClientY(e);
        
        item.classList.add('dragging');
        
        if (e.type === 'touchstart') {
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        } else {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
        }
    };

    const onMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        const currentY = getClientY(e);
        const delta = currentY - startY;

        // 1. Визуално местене на елемента
        item.style.transform = `translateY(${delta}px)`;

        // 2. Проверка за размяна със съседните елементи
        const siblings = [...container.children].filter(c => c !== item);
        const sibling = siblings.find(s => {
            const box = s.getBoundingClientRect();
            // Проверяваме дали мишката/пръста е в средата на съседния елемент
            return currentY > box.top && currentY < box.bottom;
        });

        if (sibling) {
            const box = sibling.getBoundingClientRect();
            const mid = box.top + box.height / 2;
            
            // Разменяме в DOM-а (това е магията, която прави разместването живо)
            if (currentY < mid) {
                container.insertBefore(item, sibling);
            } else {
                container.insertBefore(item, sibling.nextSibling);
            }

            // Ресетваме координатите, за да няма визуален скок
            startY = currentY;
            item.style.transform = 'translateY(0px)';
        }
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        item.classList.remove('dragging');
        item.style.transform = '';

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // --- ТУК Е РАЗЛИКАТА С ГЛАВНАТА ФУНКЦИЯ ---
        // Обновяваме временния списък tempCustomStopsList според новата подредба в DOM-а
        
        const newOrderIds = Array.from(container.children).map(child => child.getAttribute('data-temp-id'));
        
        const reorderedList = [];
        newOrderIds.forEach(id => {
            const stop = tempCustomStopsList.find(s => s.stop_id === id);
            if (stop) reorderedList.push(stop);
        });
        
        // Запазваме новата подредба
        tempCustomStopsList = reorderedList;
    };

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
}




// --- ЛОГИКА ЗА FAV MENU (ЗВЕЗДАТА) ---

let targetStopForAction = null; // Спирката, върху която сме цъкнали звездата

// 1. Отваря менюто
window.openFavMenu = function(stopId) {
    // Намираме спирката
    const stop = allStopsData.find(s => s.stop_id === stopId);
    if (!stop) return;
    
    targetStopForAction = stop;
    
    const modal = document.getElementById('fav-menu-modal');
    const title = document.getElementById('fav-menu-title');
    const toggleText = document.getElementById('fav-toggle-text');
    const toggleIcon = document.getElementById('fav-toggle-icon');
    
    // Преводи
    title.textContent = t('fav_menu_title');
    
    // Проверяваме дали вече е в любими
    const isFav = favoriteStops.includes(stopId);
    if (isFav) {
        toggleText.textContent = t('btn_fav_remove');
        toggleIcon.textContent = 'star_border';
        toggleIcon.style.color = 'var(--on-surface-variant)';
    } else {
        toggleText.textContent = t('btn_fav_add');
        toggleIcon.textContent = 'star';
        toggleIcon.style.color = '#FFD700';
    }
    
    // Започваме от главната стъпка
    goToFavStep('main');
    
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
};

window.closeFavMenu = function() {
    const modal = document.getElementById('fav-menu-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
};

window.goToFavStep = function(step) {
    document.getElementById('fav-step-main').classList.add('hidden');
    document.getElementById('fav-step-merge-type').classList.add('hidden');
    document.getElementById('fav-step-list').classList.add('hidden');
    
    if (step === 'main') {
        document.getElementById('fav-step-main').classList.remove('hidden');
    } else if (step === 'merge-type') {
        document.getElementById('fav-step-merge-type').classList.remove('hidden');
    } else if (step === 'list') {
        document.getElementById('fav-step-list').classList.remove('hidden');
        renderMergeList();
    }
};

// --- ЕКШЪНИ В МЕНЮТО ---



// Рендира списъка с любими (за обединяване)
function renderMergeList() {
    const container = document.getElementById('merge-targets-list');
    container.innerHTML = '';
    
    // Филтрираме текущата спирка да не излиза в списъка
    const targets = favoriteStops.filter(id => id !== targetStopForAction.stop_id);
    
    if (targets.length === 0) {
        container.innerHTML = '<div style="padding:10px; text-align:center; color:#999;">Няма други любими спирки.</div>';
        return;
    }
    
    const aliases = JSON.parse(localStorage.getItem('favAliases') || '{}');

    targets.forEach(favId => {
        const isCustom = favId.startsWith('custom_');
        let name = "";
        let icon = "";
        
        if (isCustom) {
            const cObj = customStopsData.find(c => c.id === favId);
            if (!cObj) return;
            name = cObj.name;
            icon = 'merge_type';
        } else {
            const sObj = allStopsData.find(s => s.stop_id === favId);
            if (!sObj) return;
            name = aliases[favId] || sObj.stop_name;
            icon = 'place';
        }
        
        const item = document.createElement('div');
        item.className = 'custom-search-item';
        item.innerHTML = `
            <div style="display:flex; align-items:center;">
                <span class="material-icons-round" style="margin-right:8px; color:var(--primary); font-size:18px;">${icon}</span>
                <span style="font-weight:500;">${name}</span>
            </div>
            <span class="material-icons-round" style="color:#666;">add</span>
        `;
        
        // КЛИК ЗА ОБЕДИНЯВАНЕ
        item.onclick = () => performMerge(favId);
        container.appendChild(item);
    });
}

function performMerge(targetId) {
    const currentId = targetStopForAction.stop_id;
    
    if (targetId.startsWith('custom_')) {
        // --- ВАРИАНТ А: Обединяване към съществуваща група ---
        const groupIndex = customStopsData.findIndex(c => c.id === targetId);
        if (groupIndex > -1) {
            // Проверка за дубликат
            if (!customStopsData[groupIndex].subStops.includes(currentId)) {
                customStopsData[groupIndex].subStops.push(currentId);
                localStorage.setItem('customStopsData', JSON.stringify(customStopsData));
                alert(t('alert_merged'));
            } else {
                alert("Спирката вече е в тази група.");
            }
        }
    } else {
        // --- ВАРИАНТ Б: Обединяване на две единични спирки в НОВА група ---
        const name = prompt(t('prompt_new_group_name')); // "Име на новата обединена спирка:"
        if (!name) return;
        
        const newId = `custom_${Date.now()}`;
        const newGroup = {
            id: newId,
            name: name,
            subStops: [targetId, currentId] // Старата + Текущата
        };
        
        customStopsData.push(newGroup);
        localStorage.setItem('customStopsData', JSON.stringify(customStopsData));
        
        // Заменяме старата единична спирка (targetId) с новата група (newId) в любими
        const favIndex = favoriteStops.indexOf(targetId);
        if (favIndex > -1) {
            favoriteStops[favIndex] = newId;
        } else {
            favoriteStops.push(newId);
        }
        
        // Ако текущата (currentId) също е била отделно в любими, я махаме, за да не се дублира
        const currentFavIndex = favoriteStops.indexOf(currentId);
        if (currentFavIndex > -1) {
            favoriteStops.splice(currentFavIndex, 1);
        }
        
        localStorage.setItem('favStops', JSON.stringify(favoriteStops));
        alert(t('alert_merged'));
    }
    
    closeFavMenu();
    if (document.getElementById('screen-favorites').classList.contains('active')) loadFavoritesScreen();
}


// --- CHANGELOG LOGIC ---
function checkAndShowChangelog() {
    // --- НОВО: Ако е споделен линк, не показваме Changelog ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('track')) return; 

    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    if (lastSeenVersion !== APP_VERSION) {
        if (SHOW_CHANGELOG_POPUP === false) {
            localStorage.setItem('lastSeenVersion', APP_VERSION);
            return;
        }
        showChangelogModal();
    }
}

function showChangelogModal() {
    const modal = document.getElementById('modal-changelog');
    if (!modal) return;

    // --- ПРОМЯНА 1: Динамично заглавие според езика ---
    // Намираме H3 елемента в модала
    const titleEl = modal.querySelector('h3');
    if (titleEl) {
        // Задаваме текста + спана с версията
        titleEl.innerHTML = `${t('changelog_title')} <span id="changelog-version">${APP_VERSION}</span>`;
    }

    // Генерираме списъка (това си е същото)
    const listContainer = document.getElementById('changelog-list');
    const changes = CHANGELOG_DATA[currentLanguage] || CHANGELOG_DATA['bg'];
    
    if (listContainer) {
        listContainer.innerHTML = changes.map(item => `
            <div class="changelog-item">
                <span class="changelog-bullet">•</span>
                <span>${item}</span>
            </div>
        `).join('');
    }

    // --- ПРОМЯНА 2: Превод на бутона ---
    const btnClose = document.getElementById('btn-close-changelog');
    if (btnClose) {
        // Слагаме преведения текст (Разбрах! / Got it!)
        btnClose.textContent = t('changelog_btn');
        
        btnClose.onclick = () => {
            localStorage.setItem('lastSeenVersion', APP_VERSION);
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 200);
        };
    }

    // Показваме
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
}





// В script.js

function toggleStopInSelection(stop) {
    const exists = tempCustomStopsList.some(s => s.stop_id === stop.stop_id);
    
    if (exists) {
        // Махаме от списъка
        tempCustomStopsList = tempCustomStopsList.filter(s => s.stop_id !== stop.stop_id);
    } else {
        // Добавяме в списъка
        tempCustomStopsList.push(stop);
    }
    
    // 1. Обновяваме панела долу
    renderMapSelectionPanel();
    
    // 2. Обновяваме визуално иконите на картата (Тикчетата)
    refreshMapSelectionVisuals();
}

// НОВА ФУНКЦИЯ: Обикаля всички видими маркери и им слага/маха тикчетата
// В script.js

function refreshMapSelectionVisuals() {
    // 1. Взимаме ID-тата на избраните спирки
    const selectedIds = new Set(tempCustomStopsList.map(s => s.stop_id));

    // 2. Обикаляме ВСИЧКИ видими маркери на картата
    visibleMarkers.forEach((marker, stopId) => {
        const iconDiv = marker.getElement(); // Взимаме HTML елемента
        
        if (iconDiv) {
            const wrapper = iconDiv.querySelector('.map-marker-wrapper');
            if (wrapper) {
                // АКО сме в режим на избиране И спирката е в списъка -> Слагаме тикче
                if (isCustomStopSelectionMode && selectedIds.has(stopId)) {
                    wrapper.classList.add('selected-tick');
                } 
                // В противен случай (или ако сме излезли от режима) -> Махаме тикчето
                else {
                    wrapper.classList.remove('selected-tick');
                }
            }
        }
    });
}


function renderMapSelectionPanel() {
    const listContainer = document.getElementById('map-selection-list');
    const countSpan = document.getElementById('selection-count');
    
    listContainer.innerHTML = '';
    countSpan.textContent = tempCustomStopsList.length;
    
if (tempCustomStopsList.length === 0) {
        // ПРОМЯНАТА Е ТУК: Ползваме t('map_sel_hint')
        listContainer.innerHTML = `<div style="color:#888; font-size:14px; align-self:center; width:100%; text-align:center;">${t('map_sel_hint')}</div>`;
        return;
    }
    
    // Обръщаме списъка, за да се виждат последните добавени най-вляво (по избор)
    [...tempCustomStopsList].reverse().forEach(stop => {
        const chip = document.createElement('div');
        chip.className = 'selection-chip';
        
        chip.innerHTML = `
            <span class="material-icons-round" style="font-size:16px; color:var(--primary);">place</span>
            <span>${stop.stop_name}</span>
            <span class="material-icons-round remove-icon">close</span>
        `;
        
        // Махане при клик на хикса
        chip.querySelector('.remove-icon').onclick = (e) => {
            e.stopPropagation();
            toggleStopInSelection(stop);
        };
        
        listContainer.appendChild(chip);
    });
}


// В script.js

window.locateAndSelectFromList = function(stopId) {
    const stop = allStopsData.find(s => s.stop_id === stopId);
    if (!stop) return;

    // 1. Активираме режима за избор (това скрива менютата и показва картата)
    openMapForSelection();

    // 2. Изчакваме малко картата да се "събуди" и я местим
    setTimeout(() => {
        map.invalidateSize(); // Важно за правилно рендиране
        map.setView([stop.stop_lat, stop.stop_lon], 17, { animate: true });
        
        // 3. Форсираме обновяване на маркерите, за да се покажат тикчетата
        updateVisibleMarkers();
    }, 100);
};

// В script.js

function setupTrafficButton() {
    const btn = document.getElementById('btn-traffic');
    if (!btn) return;

    // Създаваме слоя (Google Traffic Tiles)
    // lyrs=m,traffic означава: m (стандартна карта) + traffic (трафик линии)
    trafficLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        zIndex: 50 // Слагаме го под маркерите, но над основната OSM карта
    });

    btn.onclick = () => {
        isTrafficActive = !isTrafficActive;
        
        if (isTrafficActive) {
            // ВКЛЮЧВАНЕ
            btn.classList.add('active'); // Прави бутона син
            trafficLayer.addTo(map); // Добавя слоя върху картата
            
            // Показваме хинт на потребителя
            const hint = document.getElementById('zoom-hint');
            if (hint) {
                hint.textContent = currentLanguage === 'bg' ? "Трафикът е включен" : "Traffic layer enabled";
                hint.classList.add('visible');
                setTimeout(() => hint.classList.remove('visible'), 2000);
            }
        } else {
            // ИЗКЛЮЧВАНЕ
            btn.classList.remove('active');
            if (map.hasLayer(trafficLayer)) {
                map.removeLayer(trafficLayer);
            }
        }
    };
}

// В script.js -> submitReport
async function submitReport(type) {
    if (!selectedLineForAction) return;

    const busLat = selectedLineForAction.lat;
    const busLng = selectedLineForAction.lng;

    // 1. ПОСЛЕДНА ПРОВЕРКА НА РАДИУСА ПРЕДИ SUBMIT
    const distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, busLat, busLng);
    if (distKm > 0.2) {
        alert("⛔ Грешка: Вече сте твърде далеч от превозното средство!");
        return;
    }

    // 2. ПРОВЕРКА ЗА ДУБЛИКАТ (Защита против спам на един и същ бутон)
    const isDuplicate = serverReportsList.some(r => 
        (String(r.tripId) === String(selectedLineForAction.trip_id)) && r.type === type
    );
    
    if (isDuplicate) {
        alert("ℹ️ Този сигнал вече е активен.");
        return;
    }

    // 3. ИЗПРАЩАНЕ
    const success = await processReportSubmission({
        type: type,
        tripId: selectedLineForAction.trip_id,
        vehicleId: selectedLineForAction.vehicle_id,
        routeName: selectedLineForAction.route_name,
        lat: busLat,
        lng: busLng,
        reporter: currentUserNick
    });

    if (success) {
        // Опресняваме модала веднага, за да изчезне бутона
        refreshVehicleLiveData(selectedLineForAction);
    }
}


// В script.js -> Намери и замени submitReportWithCoords
// В script.js -> Намери и замени submitReportWithCoords
function submitReportWithCoords(type, lat, lng) {
    // --- 1. ЗАПИСВАМЕ ТАЙМЕРА (КРИТИЧНО) ---
    localStorage.setItem(`last_report_${type}`, Date.now());

    const reportData = {
        type: type,
        tripId: selectedLineForAction.trip_id,
        vehicleId: selectedLineForAction.vehicle_id,
        routeName: selectedLineForAction.route_name,
        lat: lat,
        lng: lng,
        reporter: currentUserNick
    };

    // 2. Изпращане към сървъра
    submitSocialReportToServer(reportData);
    
    // 3. UI Оптимистичен ъпдейт
    const fakeReport = {
        ...reportData,
        id: "temp_" + Date.now(),
        timestamp: Date.now(),
        upvotes: 0, 
        downvotes: 0,
        usersVoted: [],
        userId: appUserId
    };
    
    serverReportsList.push(fakeReport);
    
    // 4. Сменяме UI-а веднага на "Гласуване"
    openLineModal(selectedLineForAction, null, isActionFromVehicle);
    
    // 5. Обновяваме картата
    if (activeRoutesList.length > 0) fetchAndDrawVehicles(); 
    else if (isRadarActive) fetchGlobalRadarVehicles();
}

function setupVoteButtons(report) {
    const btnUp = document.getElementById('modal-btn-vote-up');
    const btnDown = document.getElementById('modal-btn-vote-down');
    const myVote = report.usersVoted.find(u => u.nick === currentUserNick);
    const isMine = (String(report.userId) === String(appUserId));
    
    // Отново проверка за разстояние, за да активираме/деактивираме гласуването
    // Тук може да ползваме същата логика или да оставим гласуването по-свободно
    // Потребителят поиска 200м и за гласуване:
    
    let canVote = false;
    if (userLocation && report.lat) {
        const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, report.lat, report.lng);
        if (dist <= 0.2) canVote = true;
    }

    btnUp.className = 'vote-btn upvote';
    btnDown.className = 'vote-btn downvote';
    
    // Ако е далеч, гласувал е вече, или е негов доклад -> Disable
    if (!canVote && !isMine && !myVote) {
         // Показваме, че е заключено заради дистанция
         btnUp.disabled = true; btnDown.disabled = true;
         btnUp.style.opacity = '0.5'; btnDown.style.opacity = '0.5';
         document.getElementById('modal-dist-warning').textContent = "⚠️ Трябва да сте наблизо (200м), за да гласувате.";
         document.getElementById('modal-dist-warning').classList.remove('hidden');
    } 
    else if (myVote) {
        if (myVote.vote === 'up') btnUp.classList.add('active');
        else btnDown.classList.add('active');
        btnUp.disabled = true; btnDown.disabled = true;
    } else if (isMine) {
        btnUp.disabled = true; btnDown.disabled = true;
        btnUp.style.opacity = '0.5'; btnDown.style.opacity = '0.5';
    } else {
        // Активни бутони
        btnUp.disabled = false; btnDown.disabled = false;
        btnUp.style.opacity = '1'; btnDown.style.opacity = '1';
        btnUp.onclick = () => { voteReport(report.id, 'up'); closeModal(); };
        btnDown.onclick = () => { voteReport(report.id, 'down'); closeModal(); };
    }
}

// Помощна функция за самото изпращане
function submitReportWithCoords(type, lat, lng) {
    const reportData = {
        type: type,
        tripId: selectedLineForAction.trip_id,
        vehicleId: selectedLineForAction.vehicle_id, // Важно за движението
        routeName: selectedLineForAction.route_name,
        lat: lat,
        lng: lng,
        reporter: currentUserNick
    };

    submitSocialReportToServer(reportData);
    
    // Оптимистично UI обновяване
    const fakeReport = {
        ...reportData,
        id: "temp_" + Date.now(),
        timestamp: Date.now(),
        upvotes: 0, 
        downvotes: 0,
        usersVoted: []
    };
    serverReportsList.push(fakeReport);
    
    // Презареждаме модала в режим гласуване
    openLineModal(selectedLineForAction, null, isActionFromVehicle);
    
    // Обновяваме картата
    if (activeRoutesList.length > 0) fetchAndDrawVehicles(); 
    else if (isRadarActive) fetchGlobalRadarVehicles();
}




// --- FILTER UI FUNCTIONS ---

let currentFilterView = 'MAIN'; // 'MAIN', 'STOPS', 'VEHICLES'

function initFilterUI() {
    const btn = document.getElementById('btn-map-filter');
    if (btn) btn.onclick = openCenteredFilter;
    
    document.getElementById('btn-filter-back').onclick = () => renderFilterView('MAIN');
}

function openCenteredFilter() {
    const modal = document.getElementById('modal-centered-filter');
    modal.classList.remove('hidden');
    // Малко закъснение за анимацията
    requestAnimationFrame(() => modal.classList.add('active'));
    
    renderFilterView('MAIN');
}

function closeCenteredFilter() {
    const modal = document.getElementById('modal-centered-filter');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
}

// ГЛАВНА ФУНКЦИЯ ЗА РИСУВАНЕ НА МЕНЮТО
// --- ФУНКЦИЯ: Основното меню за филтри ---
// ГЛАВНА ФУНКЦИЯ ЗА РИСУВАНЕ НА МЕНЮТО
function renderFilterView(view) {
    currentFilterView = view;
    const container = document.getElementById('filter-content-body');
    const title = document.getElementById('filter-title');
    const backBtn = document.getElementById('btn-filter-back');
    
    container.innerHTML = '';

    if (view === 'MAIN') {
        title.textContent = t('filter_title');
        backBtn.classList.add('hidden');

        // 1. ТЪРСАЧКА ЗА ЛИНИИ
        const searchContainer = document.createElement('div');
        searchContainer.className = 'filter-search-container';
        searchContainer.style.display = 'flex';
        searchContainer.style.flexDirection = 'column';
        
searchContainer.innerHTML = `
            <div style="display:flex; align-items:center; margin-bottom: 8px; padding-left: 4px;">
                <span class="material-icons-round" style="color:var(--on-surface-variant); font-size:18px; margin-right:8px;">map</span>
                <span style="font-size:12px; font-weight:800; color:var(--on-surface-variant); text-transform:uppercase; letter-spacing:1px;">${t('filter_route_search_title')}</span>
            </div>
            <div class="filter-search-input-wrapper" style="height: 48px; border-radius: 12px; background: var(--surface); border: 1px solid var(--outline); display:flex; align-items:center; padding:0 12px;">
                <span class="material-icons-round" style="color:var(--on-surface-variant); font-size: 20px;">search</span>
                <input type="text" id="filter-line-input" class="filter-search-input" style="font-size: 14px; flex-grow:1; border:none; outline:none; background:transparent; margin-left:8px; color:var(--on-surface);" placeholder="${t('filter_search_placeholder')}">
                <span class="material-icons-round" id="filter-search-clear" style="color:var(--on-surface-variant); cursor:pointer; display:none; font-size: 20px;">close</span>
            </div>
            <div id="filter-search-dropdown" class="filter-search-dropdown"></div>
        `;
        container.appendChild(searchContainer);

        const input = searchContainer.querySelector('#filter-line-input');
        const clearBtn = searchContainer.querySelector('#filter-search-clear');
        const dropdown = searchContainer.querySelector('#filter-search-dropdown');

        input.oninput = (e) => {
            const val = e.target.value.trim().toUpperCase();
            clearBtn.style.display = val ? 'block' : 'none';
            if(val.length > 0) renderFilterSearchResults(val, dropdown, input);
            else dropdown.style.display = 'none';
        };
        clearBtn.onclick = () => { input.value = ''; clearBtn.style.display = 'none'; dropdown.style.display = 'none'; input.focus(); };

        // ЧИПОВЕ ЗА ИЗБРАНИ ЛИНИИ
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'selected-lines-container';
        chipsContainer.id = 'selected-lines-chips';
        chipsContainer.style.display = 'flex';
        chipsContainer.style.flexWrap = 'wrap';
        chipsContainer.style.gap = '8px';
        chipsContainer.style.alignItems = 'center';
        chipsContainer.style.justifyContent = 'flex-start';
        chipsContainer.style.marginBottom = '12px';
        chipsContainer.style.width = '100%';
        container.appendChild(chipsContainer);
        renderSelectedLineChips();

        // 2. ПАНЕЛ ЗА ПРЕВОЗНИ СРЕДСТВА
        const vehContainer = document.createElement('div');
        vehContainer.className = 'vehicle-filter-container';
        vehContainer.style.padding = '10px';
        vehContainer.style.borderRadius = '14px';
        
        const hasSpecific = mapFilters.specificLines && mapFilters.specificLines.length > 0;
        const opacityStyle = hasSpecific ? 'opacity: 0.5; pointer-events: none; filter: grayscale(1);' : '';
        const statusText = hasSpecific ? `(${t('filter_all')})` : '';

        vehContainer.innerHTML = `
            <div class="vehicle-filter-header" style="font-size: 11px; margin-bottom: 8px;">
                <span class="material-icons-round" style="font-size: 16px;">directions_bus</span> 
                ${t('filter_vehicles')} <span style="font-size:10px; margin-left:5px; font-weight:normal; opacity: 0.7;">${statusText}</span>
            </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'vehicle-grid';
        grid.style.cssText = `display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; ${opacityStyle}`;

        const types =[
            { key: 'BUS', label: t('bus'), color: '#BE1E2D', img: 'stop_icon_bus.png' },
            { key: 'TROLLEY', label: t('trolley'), color: '#27AAE1', img: 'stop_icon_trolley.png' },
            { key: 'TRAM', label: t('tram'), color: '#F7941D', img: 'stop_icon_tram.png' },
            { key: 'NIGHT', label: t('night'), color: '#2C2C2E', img: 'stop_icon_night.png' }
        ];

        types.forEach(type => {
            const btn = document.createElement('div');
            const isActive = mapFilters.vehicles.types[type.key];
            btn.className = `vehicle-toggle-btn ${isActive ? 'active' : ''}`;
            btn.style.height = '60px';
            btn.style.borderRadius = '12px';
            if(isActive) { btn.style.backgroundColor = type.color; btn.style.borderColor = type.color; }
            
            btn.innerHTML = `
                <div class="vehicle-btn-icon-wrapper" style="width: 28px; height: 28px; padding: 4px;"><img src="${type.img}" class="vehicle-filter-img"></div>
                <span class="vehicle-btn-label" style="font-size: 9px;">${type.label}</span>
            `;
            
            // --- ТУК Е ФИКСЪТ ---
            btn.onclick = () => {
                // Обръщаме стойността само на цъкнатия бутон
                mapFilters.vehicles.types[type.key] = !mapFilters.vehicles.types[type.key];
                
                // Запазваме в паметта
                saveFullFilters();
                
                // Извикваме умната функция за радара, която проверява дали е останало нещо включено
                if (typeof checkRadarStateAfterFilterChange === 'function') {
                    checkRadarStateAfterFilterChange();
                }
                
                // Прерисуваме менюто, за да обновим визуализацията
                renderFilterView('MAIN'); 
            };
            grid.appendChild(btn);
        });

        // БУТОН "ВСИЧКИ"
        const allBtn = document.createElement('button');
        allBtn.className = 'vehicle-all-btn';
        allBtn.style.height = '34px';
        allBtn.style.fontSize = '12px';
        allBtn.style.marginTop = '6px';
        
        const visibleKeys =['BUS', 'TROLLEY', 'TRAM', 'METRO', 'NIGHT'];
        const allOn = visibleKeys.every(k => mapFilters.vehicles.types[k]);
        
        allBtn.innerHTML = allOn 
            ? `<span class="material-icons-round" style="font-size:16px;">visibility_off</span> ${t('filter_deselect_all')}` 
            : `<span class="material-icons-round" style="font-size:16px;">done_all</span> ${t('filter_select_all')}`;

        allBtn.onclick = () => {
            const newState = !allOn;
            visibleKeys.forEach(k => mapFilters.vehicles.types[k] = newState);
            saveFullFilters();
            
            // Същата умна проверка
            if (typeof checkRadarStateAfterFilterChange === 'function') {
                checkRadarStateAfterFilterChange();
            }
            
            renderFilterView('MAIN');
        };

        grid.appendChild(allBtn);
        vehContainer.appendChild(grid);
        container.appendChild(vehContainer);

// --- НОВО: БУФЕРНИ ПАРКИНГИ (Switch с превод) ---
        const parkingRow = createMainRow(
            'local_parking', '#1C75BC', t('filter_buffer_parkings'), 
            mapFilters.showBufferParkings, 
            (isChecked) => {
                mapFilters.showBufferParkings = isChecked;
                saveFullFilters(); 
                
                if (isChecked) {
                    fetchBufferParkings(); 
                } else {
                    if (typeof parkingLayer !== 'undefined') {
                        parkingLayer.clearLayers(); 
                    }
                    document.getElementById('parking-selection-container').classList.add('hidden');
                    document.getElementById('btn-toggle-parking').classList.remove('active');
                }
            }
        );
        parkingRow.style.marginBottom = '8px';
        container.appendChild(parkingRow);

        // 3. ПОКАЖИ СПИРКИ (Switch)
        const stopsRow = createMainRow(
            'place', '#d32f2f', t('filter_stops'), 
            mapFilters.stops.enabled, 
            (isChecked) => {
                mapFilters.stops.enabled = isChecked;
                saveFullFilters();
                updateVisibleMarkers(); 
            }
        );
        stopsRow.style.marginTop = '4px';
        container.appendChild(stopsRow);

        // 4. ИЗБОР НА СТИЛ ЗА СПИРКИ
        const styleRow = document.createElement('div');
        styleRow.className = 'style-selector-row';
        const currentStyle = mapFilters.appearance.style || 'DYNAMIC';
        const isIcons = currentStyle === 'DYNAMIC';
        
        styleRow.innerHTML = `
            <div class="style-option ${isIcons ? 'active' : ''}" id="opt-dynamic">
                <span class="material-icons-round">directions_bus</span> 
                <span>${t('filter_icons')}</span>
            </div>
            <div class="style-option ${!isIcons ? 'active' : ''}" id="opt-simple">
                <span class="material-icons-round">radio_button_checked</span> 
                <span>${t('filter_dots')}</span>
            </div>
        `;
        container.appendChild(styleRow);
        
        styleRow.querySelector('#opt-dynamic').onclick = () => {
            mapFilters.appearance.style = 'DYNAMIC';
            saveFullFilters();
            setStopStyle('DYNAMIC');
            renderFilterView('MAIN');
        };
        styleRow.querySelector('#opt-simple').onclick = () => {
            mapFilters.appearance.style = 'SIMPLE';
            saveFullFilters();
            setStopStyle('SIMPLE');
            renderFilterView('MAIN');
        };

        // 5. СЛАЙДЕРИ
        const slidersGroup = document.createElement('div');
        slidersGroup.style.display = 'flex';
        slidersGroup.style.flexDirection = 'column';
        slidersGroup.style.gap = '4px';

        slidersGroup.appendChild(createSlider(t('filter_zoom_stops'), 13, 17, mapFilters.appearance.minZoomStops, (val) => {
            mapFilters.appearance.minZoomStops = val;
            saveFullFilters();
            updateVisibleMarkers();
        }, 1, 'minZoomStops'));

        slidersGroup.appendChild(createSlider(t('filter_size_stops'), 0.5, 1.5, mapFilters.appearance.stopSizeMultiplier, (val) => {
            mapFilters.appearance.stopSizeMultiplier = val;
            saveFullFilters();
            if (typeof iconCache !== 'undefined') iconCache.clear();
            stopMarkersLayer.clearLayers(); visibleMarkers.clear(); updateVisibleMarkers();
        }, 0.1, 'stopSizeMultiplier'));

        slidersGroup.appendChild(createSlider(t('filter_size_vehicles'), 0.5, 1.5, mapFilters.appearance.vehicleSizeMultiplier, (val) => {
            mapFilters.appearance.vehicleSizeMultiplier = val;
            saveFullFilters();
            fetchGlobalRadarVehicles(); 
        }, 0.1, 'vehicleSizeMultiplier'));

        container.appendChild(slidersGroup);
    }
}




function checkRadarStateAfterFilterChange() {
    const hasSpecificLines = mapFilters.specificLines && mapFilters.specificLines.length > 0;
    
    // ВАЖНО: Проверяваме само 4-те бутона, които реално съществуват в менюто!
    const uiKeys = ['BUS', 'TROLLEY', 'TRAM', 'NIGHT'];
    const anyCategoryOn = uiKeys.some(k => mapFilters.vehicles.types[k]);

    // Ако потребителят е изключил и 4-те бутона ръчно, изключваме и скритото METRO
    if (!anyCategoryOn) {
        mapFilters.vehicles.types['METRO'] = false;
    }

    // Радарът трябва да е пуснат ако има поне 1 категория ИЛИ има филтрирана линия
    const shouldRadarBeActive = hasSpecificLines || anyCategoryOn;

    isRadarActive = shouldRadarBeActive;
    mapFilters.vehicles.enabled = shouldRadarBeActive;

    // Запазваме промените (включително изгасеното метро и статуса на радара)
    localStorage.setItem('isRadarActive', isRadarActive);
    localStorage.setItem('mapFilters_Full', JSON.stringify(mapFilters));

    const radarBtn = document.getElementById('btn-live-radar');
    if (radarBtn) {
        if (shouldRadarBeActive) {
            radarBtn.classList.add('active');
            fetchGlobalRadarVehicles();
            if (!radarTimer) radarTimer = setInterval(fetchGlobalRadarVehicles, 3000);
        } else {
            radarBtn.classList.remove('active');
            stopRadar(); // Спираме радара напълно!
        }
    }
}


function createSlider(label, min, max, value, onChange, step = 1, configKey) {
    const wrap = document.createElement('div');
    wrap.className = 'zoom-slider-container';
    
    // Генерираме уникален клас базиран на ключа (напр. slider-stopSizeMultiplier)
    const uniqueClass = `slider-${configKey}`;
    
    const formatDisplay = (v) => (step < 1) ? Math.round(v * 100) + '%' : v;

    wrap.innerHTML = `
        <div class="slider-header-row">
            <span class="slider-label">${label}</span>
            <span class="slider-val" style="font-weight:bold; color:var(--primary);">${formatDisplay(value)}</span>
        </div>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" class="custom-range ${uniqueClass}" style="width:100%; margin: 8px 0;">
        <div class="zoom-slider-labels" style="display:flex; justify-content:space-between; font-size:10px; opacity:0.6;">
            <span>${formatDisplay(min)}</span>
            <span>${formatDisplay(max)}</span>
        </div>
    `;
    
    const input = wrap.querySelector('input');
    const valDisplay = wrap.querySelector('.slider-val');
    
    input.oninput = (e) => { 
        const v = parseFloat(e.target.value);
        valDisplay.textContent = formatDisplay(v);
        
        // 1. СИНХРОНИЗАЦИЯ: Намираме всички слайдери със същия ключ и ги местим
        document.querySelectorAll(`.${uniqueClass}`).forEach(otherInput => {
            if (otherInput !== input) {
                otherInput.value = v;
                // Обновяваме и текста на съседа му (slider-val)
                const otherValDisplay = otherInput.parentElement.querySelector('.slider-val');
                if (otherValDisplay) otherValDisplay.textContent = formatDisplay(v);
            }
        });

        // 2. Изпълняваме логиката за промяна
        onChange(v); 
    };
    return wrap;
}


// --- ПОМОЩНА: Търсене в линиите ---
function renderFilterSearchResults(query, dropdown, input) {
    dropdown.innerHTML = '';
    
    const matched = allLinesData.filter(l => 
        l.line_name.toUpperCase().includes(query)
    );

    matched.sort((a, b) => {
        const nA = parseInt(a.line_name.replace(/\D/g, '')) || 999;
        const nB = parseInt(b.line_name.replace(/\D/g, '')) || 999;
        return nA - nB;
    });

    if (matched.length === 0) {
        const noResultsText = currentLanguage === 'bg' ? "Няма намерени линии." : "No lines found.";
        dropdown.innerHTML = `<div style="padding:12px; color:#888; text-align:center;">${noResultsText}</div>`;
        dropdown.style.display = 'block';
        return;
    }

    matched.slice(0, 10).forEach(line => {
        const typeKey = line.transport_type;
        const uniqueId = `${typeKey}_${line.line_name}`;
        if (mapFilters.specificLines.includes(uniqueId)) return;

        const typeInfo = TRANSPORT_TYPES_CONFIG[typeKey] || TRANSPORT_TYPES_CONFIG.BUS;
        
        let labelKey = typeKey.toLowerCase();
        if (labelKey === 'trolley') labelKey = 'trolley'; 
        const translatedLabel = t(labelKey); 
        
        // --- ФИКС: ИЗПОЛЗВАМЕ MATERIAL ИКОНИ, А НЕ СНИМКИ С БЯЛ ФОН ---
        let iconName = 'directions_bus';
        if (typeKey === 'TRAM') iconName = 'tram';
        if (typeKey === 'METRO') iconName = 'subway';
        if (typeKey === 'NIGHT') iconName = 'nights_stay';

        const div = document.createElement('div');
        // Намален външен падинг
        div.style.cssText = "padding: 4px 12px; width: 100%; display: flex; box-sizing: border-box; cursor: pointer;";
        
        // --- СУПЕР КОМПАКТЕН ДИЗАЙН ---
        div.innerHTML = `
            <div style="background-color: ${typeInfo.color}; color: white; width: 100%; border-radius: 18px; padding: 0 12px; height: 36px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.1s; box-sizing: border-box;">
                
                <!-- Лява част: Икона + Автобус + 12 -->
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="material-icons-round" style="font-size:18px;">${iconName}</span>
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: 0.9;">${translatedLabel}</span>
                    <span style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px;">${line.line_name}</span>
                </div>
                
                <!-- Дясна част: Тъмно кръгче с ПЛЮС -->
                <div style="background: rgba(0,0,0,0.2); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-icons-round" style="font-size: 16px; color: white;">add</span>
                </div>
                
            </div>
        `;

        div.onmousedown = () => div.firstElementChild.style.transform = 'scale(0.97)';
        div.onmouseup = () => div.firstElementChild.style.transform = 'scale(1)';
        div.ontouchstart = () => div.firstElementChild.style.transform = 'scale(0.97)';
        div.ontouchend = () => div.firstElementChild.style.transform = 'scale(1)';

        div.onclick = (e) => {
            e.stopPropagation();
            addSpecificLine(line);
            input.value = '';
            dropdown.style.display = 'none';
        };

        dropdown.appendChild(div);
    });

    dropdown.style.display = (dropdown.children.length > 0) ? 'block' : 'none';
}



// --- ПОМОЩНА: Добавяне на линия ---
function addSpecificLine(line) {
    const uniqueId = `${line.transport_type}_${line.line_name}`;
    if (!mapFilters.specificLines.includes(uniqueId)) {
        mapFilters.specificLines.push(uniqueId);
        
        // Активираме радара автоматично
        mapFilters.vehicles.enabled = true;
        isRadarActive = true;
        
        const radarBtn = document.getElementById('btn-live-radar');
        if (radarBtn) radarBtn.classList.add('active');
        
        // ВАЖНО: ТОВА ЛИПСВАШЕ! То извиква syncSpecificLinesToRoutes и чертае хапчето + шейпа
        saveFullFilters(); 
        
        // Рестартираме радара
        fetchGlobalRadarVehicles();
        if (radarTimer) clearInterval(radarTimer);
        radarTimer = setInterval(fetchGlobalRadarVehicles, 2000);

        // Прерисуваме екрана (за да се покаже чипа в менюто)
        renderFilterView('MAIN');
    }
}



// --- ПОМОЩНА: Рендиране на чиповете ---
function renderSelectedLineChips() {
    const container = document.getElementById('selected-lines-chips');
    if (!container) return;
    container.innerHTML = '';
    
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '8px';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'flex-start';

    mapFilters.specificLines.forEach(id => {
        const parts = id.split('_');
        const typeKey = parts[0];
        const lineNum = parts[1];
        const typeInfo = TRANSPORT_TYPES_CONFIG[typeKey] || TRANSPORT_TYPES_CONFIG.BUS;

        let iconName = 'directions_bus';
        if (typeKey === 'TRAM') iconName = 'tram';
        if (typeKey === 'METRO') iconName = 'subway';
        if (typeKey === 'NIGHT') iconName = 'nights_stay';

        const chip = document.createElement('div');
        
        chip.style.cssText = `
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: max-content !important;
            flex: 0 0 auto !important;
            height: 32px !important;
            padding: 0 12px !important;
            border-radius: 16px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            color: white !important;
            cursor: pointer !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
            background-color: ${typeInfo.color} !important;
            margin: 0 !important;
        `;
        
        chip.innerHTML = `
            <span class="material-icons-round" style="font-size:16px; margin-right:6px;">${iconName}</span>
            ${lineNum}
            <span class="material-icons-round remove-icon" style="font-size:14px; margin-left:6px; background:rgba(0,0,0,0.2); border-radius:50%; padding:2px;">close</span>
        `;

        chip.onclick = () => {
            mapFilters.specificLines = mapFilters.specificLines.filter(x => x !== id);
            saveFullFilters(); 
            checkRadarStateAfterFilterChange(); // <--- УМНОТО ИЗКЛЮЧВАНЕ
            renderFilterView('MAIN');
        };

        container.appendChild(chip);
    });

    if (mapFilters.specificLines.length > 0) {
        const clearBtn = document.createElement('div');
        
        clearBtn.style.cssText = `
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: max-content !important;
            flex: 0 0 auto !important;
            height: 32px !important;
            padding: 0 12px !important;
            border-radius: 16px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            color: white !important;
            cursor: pointer !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
            background-color: #4CAF50 !important;
            margin: 0 !important;
        `;
        
        clearBtn.innerHTML = `
            <span class="material-icons-round" style="font-size:16px; margin-right:4px;">delete_sweep</span>
            ${t('filter_clear_lines') || 'Изчисти'}
        `;

        clearBtn.onclick = () => {
            mapFilters.specificLines =[];
            saveFullFilters();
            checkRadarStateAfterFilterChange(); // <--- УМНОТО ИЗКЛЮЧВАНЕ
            renderFilterView('MAIN');
        };

        container.appendChild(clearBtn);
    }
}


// --- ФУНКЦИЯ 2: Създаване на ред (Разделен клик) ---
function createSubRow(text, isChecked, color, icon, onToggle, onLabelClick = null) {
    const div = document.createElement('div');
    div.className = 'filter-menu-item';
    
    const activeClass = isChecked ? 'active' : '';
    const arrowHtml = onLabelClick ? `<span class="material-icons-round chevron-right" style="font-size:18px; color:#aaa; margin-right:8px;">chevron_right</span>` : '';

    // Лява зона (Текст + Икона)
    const leftDiv = document.createElement('div');
    leftDiv.className = 'filter-left';
    leftDiv.style.flexGrow = '1';
    leftDiv.style.cursor = 'pointer';
    leftDiv.innerHTML = `
        <div class="filter-icon-circle" style="background: ${color}; width:32px; height:32px; font-size:18px;">
            <span class="material-icons-round">${icon}</span>
        </div>
        <span class="filter-label-text" style="font-size:15px;">${text}</span>
    `;

    // Дясна зона (Суич + Стрелка)
    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';
    rightDiv.innerHTML = `
        ${arrowHtml}
        <div class="filter-switch ${activeClass}">
            <div class="filter-switch-knob"></div>
        </div>
    `;

    // Клик ЛЯВО (Отваря меню)
    leftDiv.onclick = (e) => {
        e.stopPropagation();
        if (onLabelClick) onLabelClick();
        else toggleSwitch();
    };

    // Клик ДЯСНО (Само суич)
    rightDiv.onclick = (e) => {
        e.stopPropagation();
        toggleSwitch();
    };

    function toggleSwitch() {
        const switchEl = rightDiv.querySelector('.filter-switch');
        const newState = !switchEl.classList.contains('active');
        if (newState) switchEl.classList.add('active');
        else switchEl.classList.remove('active');
        onToggle(newState);
    }

    div.appendChild(leftDiv);
    div.appendChild(rightDiv);

    return div;
}

// --- ФУНКЦИЯ 3: Избор на конкретни линии (Квадратчетата) ---
function renderLineSelectionView(typeObj) {
    const container = document.getElementById('filter-content-body');
    const title = document.getElementById('filter-title');
    const backBtn = document.getElementById('btn-filter-back');
    
    title.textContent = `${typeObj.label}`;
    backBtn.onclick = () => renderFilterView('VEHICLES');

    container.innerHTML = '';
    
    // Проверка за данни
    if (!allLinesData || allLinesData.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Зареждане на линии...</div>';
        return;
    }

    // Филтриране
    const lines = allLinesData.filter(l => l.transport_type === typeObj.key);
    
    // Сортиране
    lines.sort((a, b) => {
        const nA = parseInt(a.line_name.replace(/\D/g, '')) || 999;
        const nB = parseInt(b.line_name.replace(/\D/g, '')) || 999;
        return nA - nB;
    });

    if (lines.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Няма налични линии.</div>';
        return;
    }

    // Бутон "Избери/Скрий всички"
    const headerDiv = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.justifyContent = 'flex-end';
    headerDiv.style.padding = '0 10px 10px 10px';
    
    const areAllActive = lines.every(l => {
        const key = `${typeObj.key}_${l.line_name}`;
        return mapFilters.lines[key] !== false;
    });

    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'btn-text-only';
    toggleAllBtn.style.color = 'var(--primary)';
    toggleAllBtn.style.fontWeight = 'bold';
    toggleAllBtn.textContent = areAllActive ? t('filter_deselect_all') : t('filter_select_all');
    
    toggleAllBtn.onclick = () => {
        const newState = !areAllActive;
        lines.forEach(l => {
            const key = `${typeObj.key}_${l.line_name}`;
            mapFilters.lines[key] = newState;
        });
        if (isRadarActive) fetchGlobalRadarVehicles();
        renderLineSelectionView(typeObj);
    };

    headerDiv.appendChild(toggleAllBtn);
    container.appendChild(headerDiv);

    // Решетка с бутони
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(60px, 1fr))';
    grid.style.gap = '10px';
    grid.style.padding = '0 10px 20px 10px';

    lines.forEach(line => {
        const key = `${typeObj.key}_${line.line_name}`;
        const isActive = mapFilters.lines[key] !== false; 

        const btn = document.createElement('div');
        btn.style.height = '40px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.transition = 'all 0.2s';
        
        if (isActive) {
            btn.style.backgroundColor = typeObj.color;
            btn.style.color = '#fff';
            btn.style.border = `2px solid ${typeObj.color}`;
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        } else {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--on-surface)';
            btn.style.border = '2px solid var(--outline)';
            btn.style.opacity = '0.6';
        }

        btn.textContent = line.line_name;

        btn.onclick = () => {
            mapFilters.lines[key] = !isActive;
            if (isRadarActive) fetchGlobalRadarVehicles();
            renderLineSelectionView(typeObj);
        };

        grid.appendChild(btn);
    });

    container.appendChild(grid);
}


function setStopStyle(style) {
    mapFilters.appearance.style = style;
    saveMapConfig();
    
    // Обновяваме класовете в UI-а на филтъра веднага
    const optDyn = document.getElementById('opt-dynamic');
    const optSim = document.getElementById('opt-simple');
    if (optDyn && optSim) {
        if (style === 'DYNAMIC') {
            optDyn.classList.add('active');
            optSim.classList.remove('active');
        } else {
            optDyn.classList.remove('active');
            optSim.classList.add('active');
        }
    }
    
    // Презареждаме маркерите на картата
    // Трябва да изчистим текущите, за да се генерират наново с новия HTML
    stopMarkersLayer.clearLayers();
    visibleMarkers.clear();
    updateVisibleMarkers();
}


// Помощна функция за прилагане на промените
function applyFilterChanges(isStops) {
    if (isStops) {
        updateVisibleMarkers();
    } else {
        // За колите: Ако радарът работи, го рефрешваме
        if (isRadarActive) fetchGlobalRadarVehicles();
        // Ако има активен маршрут, може и него да рефрешнем (по желание)
        if (activeRoutesList.length > 0) fetchAndDrawVehicles();
    }
}

// HTML ГЕНЕРАТОР: ГЛАВЕН РЕД (Спирки / Коли)
// --- ФУНКЦИЯ: Създаване на главен ред (Умна) ---
function createMainRow(icon, color, text, isChecked, onToggle, onOpen = null) {
    const div = document.createElement('div');
    div.className = 'filter-menu-item';
    
    // Ако няма функция за отваряне (onOpen), няма стрелка
    const arrowHtml = onOpen 
        ? `<span class="material-icons-round chevron-right">chevron_right</span>` 
        : ''; 

    const activeClass = isChecked ? 'active' : '';

    div.innerHTML = `
        <div class="filter-left">
            <div class="filter-icon-circle" style="background: ${color};">
                <span class="material-icons-round">${icon}</span>
            </div>
            <span class="filter-label-text">${text}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
            <div class="filter-switch ${activeClass}">
                <div class="filter-switch-knob"></div>
            </div>
            ${arrowHtml}
        </div>
    `;

    // Логика на клика
    div.onclick = (e) => {
        // Ако сме цъкнали точно върху суича
        if (e.target.closest('.filter-switch')) {
            toggleTheSwitch();
            return;
        }

        // Ако сме цъкнали върху реда:
        if (onOpen) {
            // Ако има меню -> отваряме го
            onOpen();
        } else {
            // Ако НЯМА меню -> действа като суич (това искаш ти)
            toggleTheSwitch();
        }
    };

    function toggleTheSwitch() {
        const switchEl = div.querySelector('.filter-switch');
        const newState = !switchEl.classList.contains('active');
        
        if (newState) switchEl.classList.add('active');
        else switchEl.classList.remove('active');
        
        onToggle(newState);
    }

    return div;
}



// HTML ГЕНЕРАТОР: ПОД-РЕД (Автобус, Трамвай...)
function createSubRow(text, isChecked, color, icon, onToggle, onLabelClick = null) {
    const div = document.createElement('div');
    div.className = 'filter-menu-item';
    
    const activeClass = isChecked ? 'active' : '';

    // Стрелка, ако има подменю
    const arrowHtml = onLabelClick ? `<span class="material-icons-round chevron-right" style="font-size:18px; color:#aaa; margin-right:8px;">chevron_right</span>` : '';

    // ВАЖНО: Разделяме HTML-а на две ясно разграничени зони с отделни onclick събития
    
    // 1. Лява зона (Икона + Текст)
    const leftDiv = document.createElement('div');
    leftDiv.className = 'filter-left';
    leftDiv.style.flexGrow = '1'; // Заема цялото място
    leftDiv.style.cursor = 'pointer';
    leftDiv.innerHTML = `
        <div class="filter-icon-circle" style="background: ${color}; width:32px; height:32px; font-size:18px;">
            <span class="material-icons-round">${icon}</span>
        </div>
        <span class="filter-label-text" style="font-size:15px;">${text}</span>
    `;

    // 2. Дясна зона (Стрелка + Суич)
    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';
    rightDiv.innerHTML = `
        ${arrowHtml}
        <div class="filter-switch ${activeClass}">
            <div class="filter-switch-knob"></div>
        </div>
    `;

    // --- ЛОГИКА НА КЛИКОВЕТЕ ---

    // Клик върху ЛЯВОТО (Текста):
    leftDiv.onclick = (e) => {
        e.stopPropagation();
        if (onLabelClick) {
            // Ако има подменю -> отваряме го
            onLabelClick();
        } else {
            // Ако няма подменю (напр. бутона "Всички") -> работи като суич
            toggleSwitch();
        }
    };

    // Клик върху ДЯСНОТО (Суича):
    rightDiv.onclick = (e) => {
        e.stopPropagation();
        toggleSwitch();
    };

    // Функция за превключване на суича
    function toggleSwitch() {
        const switchEl = rightDiv.querySelector('.filter-switch');
        const newState = !switchEl.classList.contains('active');
        
        if (newState) switchEl.classList.add('active');
        else switchEl.classList.remove('active');
        
        onToggle(newState);
    }

    div.appendChild(leftDiv);
    div.appendChild(rightDiv);

    return div;
}

function renderLineSelectionView(typeObj) {
    const container = document.getElementById('filter-content-body');
    const title = document.getElementById('filter-title');
    const backBtn = document.getElementById('btn-filter-back');
    
    // Заглавие: напр. "Автобус - Линии"
    title.textContent = `${typeObj.label}`;
    
    // Бутон Назад: Връща ни в менюто "Превозни средства"
    backBtn.onclick = () => renderFilterView('VEHICLES');

    container.innerHTML = '';
    
    // 1. Филтрираме линиите от allLinesData (трябва да са заредени)
    if (!allLinesData || allLinesData.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Зареждане на линии...</div>';
        return;
    }

    const lines = allLinesData.filter(l => l.transport_type === typeObj.key);
    
    // Сортиране по номер
    lines.sort((a, b) => {
        const nA = parseInt(a.line_name.replace(/\D/g, '')) || 999;
        const nB = parseInt(b.line_name.replace(/\D/g, '')) || 999;
        return nA - nB;
    });

    if (lines.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center;">Няма налични линии.</div>';
        return;
    }

    // 2. Хедър с бутон "Избери всички / Скрий всички"
    const headerDiv = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.justifyContent = 'flex-end';
    headerDiv.style.padding = '0 10px 10px 10px';
    
    // Проверяваме дали всички са включени (по подразбиране са включени, ако ги няма в списъка)
    // В `mapFilters.lines` true = включено, undefined = включено (default), false = изключено.
    const areAllActive = lines.every(l => {
        const key = `${typeObj.key}_${l.line_name}`;
        return mapFilters.lines[key] !== false;
    });

    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'btn-text-only'; // Може да ползваш някой съществуващ клас
    toggleAllBtn.style.color = 'var(--primary)';
    toggleAllBtn.style.fontWeight = 'bold';
    toggleAllBtn.textContent = areAllActive ? t('filter_deselect_all') : t('filter_select_all');
    
    toggleAllBtn.onclick = () => {
        const newState = !areAllActive;
        lines.forEach(l => {
            const key = `${typeObj.key}_${l.line_name}`;
            mapFilters.lines[key] = newState;
        });
        // Рефрешваме радара
        if (isRadarActive) fetchGlobalRadarVehicles();
        // Рефрешваме екрана
        renderLineSelectionView(typeObj);
    };

    headerDiv.appendChild(toggleAllBtn);
    container.appendChild(headerDiv);

    // 3. Решетка с бутони (Grid)
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(60px, 1fr))';
    grid.style.gap = '10px';
    grid.style.padding = '0 10px 20px 10px';

    lines.forEach(line => {
        const key = `${typeObj.key}_${line.line_name}`;
        const isActive = mapFilters.lines[key] !== false; // Default true

        const btn = document.createElement('div');
        // Стилове за квадратчето
        btn.style.height = '40px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.transition = 'all 0.2s';
        
        // Цветове
        if (isActive) {
            btn.style.backgroundColor = typeObj.color;
            btn.style.color = '#fff';
            btn.style.border = `2px solid ${typeObj.color}`;
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        } else {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--on-surface)'; // Тъмен текст на светло, светъл на тъмно
            btn.style.border = '2px solid var(--outline)'; // Сив бордър
            btn.style.opacity = '0.6';
        }

        btn.textContent = line.line_name;

        btn.onclick = () => {
            // Тогълваме състоянието
            mapFilters.lines[key] = !isActive;
            
            // Запазваме (по желание, тук не го запазваме в localStorage още, но е добра идея)
            // Рефрешваме радара веднага
            if (isRadarActive) fetchGlobalRadarVehicles();
            
            // Прерисуваме само този бутон или целия екран
            renderLineSelectionView(typeObj);
        };

        grid.appendChild(btn);
    });

    container.appendChild(grid);
}


function setupFavoritesSearch() {
    const input = document.getElementById('fav-search-input');
    const clearBtn = document.getElementById('btn-fav-search-clear');
    const favList = document.getElementById('favorites-list');
    const resultsList = document.getElementById('fav-search-results');

    if (!input) return;

    input.addEventListener('input', (e) => {
        const val = e.target.value.trim();

        if (val.length > 0) {
            // Режим на търсене
            clearBtn.classList.remove('hidden');
            favList.classList.add('hidden');      // Скрий любимите
            resultsList.classList.remove('hidden'); // Покажи резултатите
            
            // Използваме универсалната функция, но сочим към контейнера в Favorites
            renderSearchList(val, 'fav-search-results');
        } else {
            // Режим на списък с любими
            clearBtn.classList.add('hidden');
            favList.classList.remove('hidden');   // Покажи любимите
            resultsList.classList.add('hidden');  // Скрий резултатите
            resultsList.innerHTML = '';
        }
    });

    // Бутон за изчистване
    clearBtn.onclick = () => {
        input.value = '';
        clearBtn.classList.add('hidden');
        favList.classList.remove('hidden');
        resultsList.classList.add('hidden');
        resultsList.innerHTML = '';
    };
}

// Слушател за промяна на размера (завъртане на екрана)
window.addEventListener('resize', () => {
    // Изчакваме малко, за да приключи анимацията на завъртане
    setTimeout(() => {
        if (map) {
            map.invalidateSize(); // Това пренарежда плочките на картата
        }
    }, 300);
});




// ==========================================
// SOCIAL / COMMUNITY MODULE
// ==========================================
// ==========================================
// SOCIAL / COMMUNITY MODULE (SERVER INTEGRATED)
// ==========================================

// Глобален списък с доклади, изтеглени от сървъра
let serverReportsList = []; 

// Помощни константи (Остават същите)
// В началото на script.js
const REPORT_TYPES = {
    ACCIDENT: { label: 'rep_crash', icon: 'car_crash', color: '#d32f2f', isLocation: true, isImage: false },
    POLICE:   { label: 'rep_police', icon: 'local_police', color: '#1976d2', isLocation: true, isImage: false },
    CONTROL:  { label: 'rep_control', icon: 'confirmation_number', color: '#333', isLocation: true, isImage: false },
    HOT:      { label: 'rep_hot', icon: 'hot.png', color: '#f57c00', isLocation: false, isImage: true },
    COLD:     { label: 'rep_cold', icon: 'cold.png', color: '#0288d1', isLocation: false, isImage: true },
    DIRTY:    { label: 'rep_dirty', icon: 'stain.png', color: '#5d4037', isLocation: false, isImage: true },
    // Нов тип:
    CROWDED:  { label: 'rep_crowded', icon: 'crowded.png', color: '#7B1FA2', isLocation: false, isImage: true }
};



// --- STATE ---
let socialLivePositions = new Map(); 
let socialVehiclesById = new Map();  
let socialRefreshTimer = null;       
let currentSocialFilter = 'RECENT'; 

let currentUserNick = localStorage.getItem('userNickname');
let userLocation = null;
let pickerMap = null;    
let pickerCenter = null; 
let currentReportType = null; 

// --- 1. INITIALIZATION ---

function initSocialTab() {
    // 1. Проверка за режим на ремонт (съществуващ код)
    const maintenanceMode = localStorage.getItem('SOCIAL_MAINTENANCE_MODE') === 'TRUE';
    const maintenanceView = document.getElementById('social-maintenance-view');
    const nicknameView = document.getElementById('nickname-setup-container'); // Това вече почти няма да се вижда
    const mainContentView = document.getElementById('social-main-content');
    const headerActions = document.getElementById('social-header-actions');

    if (maintenanceMode) {
        maintenanceView.classList.remove('hidden');
        nicknameView.classList.add('hidden');
        mainContentView.classList.add('hidden');
        if(headerActions) headerActions.style.display = 'none';
        return;
    } else {
        maintenanceView.classList.add('hidden');
        if(headerActions) headerActions.style.display = 'flex';
    }

    // 2. Взимаме името (вече трябва да е генерирано от ensureAutoNickname)
    currentUserNick = localStorage.getItem('userNickname');
    
    // Дори да е станала грешка, генерираме го пак за всеки случай
    if (!currentUserNick) {
        ensureAutoNickname();
        currentUserNick = localStorage.getItem('userNickname');
    }

    // ВИНАГИ показваме главното съдържание
    nicknameView.classList.add('hidden');
    mainContentView.classList.remove('hidden');
    
    // Обновяваме хедъра
    updateHeaderNickname();
    
    // Зареждаме докладите
    if (serverReportsList && serverReportsList.length > 0) {
        renderReportsFeed();
    } else {
        document.getElementById('social-feed-list').innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Зареждане...</div>';
        fetchReportsFromServer();
    }
}
// --- API FUNCTIONS (НОВИТЕ ФУНКЦИИ) ---

// 1. ИЗТЕГЛЯНЕ НА ДОКЛАДИ
// В script.js -> замени fetchReportsFromServer с това:
// В script.js -> Замени цялата функция fetchReportsFromServer



async function fetchReportsFromServer() {
    try {
        // --- ПАРАЛЕЛНО ИЗПЪЛНЕНИЕ (ЗА ПО-БЪРЗО ЗАРЕЖДАНЕ) ---
        // Пускаме заявките едновременно, вместо да чакаме едната, после другата
        const [livePosResult, reportsResult] = await Promise.allSettled([
            fetchSocialLivePositions(), // Автобуси
            fetch(`${API_BASE_URL}social/reports?t=${Date.now()}&r=${Math.random()}`, { // Доклади
                headers: { 'Accept-Language': currentLanguage },
                cache: 'no-store'
            })
        ]);

        // Обработка на докладите (ако заявката е успешна)
        if (reportsResult.status === 'fulfilled' && reportsResult.value.ok) {
            serverReportsList = await reportsResult.value.json();
            
            // Проверка и рисуване
            const socialScreen = document.getElementById('screen-social');
            const isActive = socialScreen && socialScreen.classList.contains('active');

            if (isActive) {
                const list = document.getElementById('social-feed-list');
                if (list) {
                    const scroll = list.scrollTop;
                    renderReportsFeed(); 
                    list.scrollTop = scroll;
                }
            }
            
            // Проверки за близост и карта
            if (userLocation) checkForProximityAlerts();

			
            if (typeof addSocialMarkersToMap === 'function') addSocialMarkersToMap();
        } 
        
    } catch (e) {
        console.error("Heartbeat Fetch Error:", e);
    }
}
// --- WAZE-STYLE PROXIMITY ALERTS ---



function checkForProximityAlerts() {
    // 1. Проверка на настройката
    if (!areProximityAlertsEnabled) {
        // console.log("Proximity: Спряно от настройките");
        return; 
    }

    if (!userLocation) return;
    const modal = document.getElementById('modal-proximity-alert');
    if (modal && modal.classList.contains('active')) return;

    for (const report of serverReportsList) {
        // ПРОВЕРКА 1: ВЕЧЕ ВИДЯН ЛИ Е?
        if (shownProximityAlerts.has(report.id)) {
            // console.log(`Proximity: Репорт ${report.id} е игнориран (вече видян/затворен).`);
            continue;
        }

        // ПРОВЕРКА 2: МОЙ ЛИ Е?
         // --- ВРЕМЕННО ИЗКЛЮЧЕНО ЗА ТЕСТ: ПРОВЕРКА ЗА МОЙ ДОКЛАД ---
         if (String(report.userId) === String(appUserId)) {
            console.log(`LOG: Репорт ${report.id} е мой, пропускам.`);
            continue;
         }
        // ----------------------------------------------------------

        // ПРОВЕРКА 3: ГЛАСУВАЛ ЛИ СЪМ?
        const hasVoted = report.usersVoted.some(u => u.nick === currentUserNick);
        if (hasVoted) continue;

        let targetLat = report.lat;
        let targetLng = report.lng;
        
        if (report.tripId && typeof socialLivePositions !== 'undefined' && socialLivePositions.has(String(report.tripId))) {
            const live = socialLivePositions.get(String(report.tripId));
            targetLat = live.lat;
            targetLng = live.lng;
        }

        const distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, targetLat, targetLng);
        const triggerRadius = report.tripId ? 0.15 : 0.3; 

        // console.log(`Proximity Check: Dist=${distKm.toFixed(3)}km, Radius=${triggerRadius}km`);

        if (distKm <= triggerRadius) {
            console.log(">>> ПОКАЗВАНЕ НА ПОП-ЪП!");
            triggerProximityModal(report, targetLat, targetLng);
            
            // Маркираме го като видян ВЕДНАГА
            markReportAsSeen(report.id); 
            break; 
        }
    }
}




function triggerProximityModal(report, rLat, rLng) {
    const modal = document.getElementById('modal-proximity-alert');
    if (!modal) return;

    const titleEl = document.getElementById('prox-alert-title');
    const descEl = document.getElementById('prox-alert-desc');
    const btnYes = document.getElementById('btn-prox-yes');
    const btnNo = document.getElementById('btn-prox-no');

    const config = REPORT_TYPES[report.type] || REPORT_TYPES['ACCIDENT'];
    const label = t(config.label);

    // --- ДОБАВЯНЕ НА БУТОН "ЗАТВОРИ" (X) ---
    let closeX = document.getElementById('btn-prox-close-x');
    if (!closeX) {
        closeX = document.createElement('div');
        closeX.id = 'btn-prox-close-x';
        closeX.innerHTML = '<span class="material-icons-round">close</span>';
        
        closeX.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            color: #666;
            cursor: pointer;
            padding: 5px;
            z-index: 10;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.position = 'relative';
            modalContent.appendChild(closeX);
        }
        
        closeX.onclick = () => {
            // Просто затваряме. Тъй като ID-то е добавено в shownProximityAlerts 
            // още при отварянето, то няма да се покаже пак в тази сесия.
             markReportAsSeen(report.id);
			closeProximityModal();
        };
    }
    // -------------------------------------

    if (report.tripId) {
        titleEl.textContent = "В този автобус ли сте?";
        const line = report.currentRouteLabel || report.routeName || "?";
        descEl.innerHTML = `Докладвано за <b>Линия ${line}</b>:<br><b style="color:${config.color}">${label}</b>. Вярно ли е?`;
    } else {
        titleEl.textContent = "Виждате ли това?";
        descEl.innerHTML = `Наблизо е докладвано:<br><b style="color:${config.color}">${label}</b>. Още ли е там?`;
    }

    setTimeout(() => {
        if (!proxMap) {
            proxMap = L.map('prox-alert-map', { 
                zoomControl: false, 
                attributionControl: false,
                dragging: false, 
                scrollWheelZoom: false
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(proxMap);
        }
        
        proxMap.invalidateSize();
        
        proxMap.eachLayer(layer => {
            if (layer instanceof L.Marker) proxMap.removeLayer(layer);
        });

        const userIcon = L.divIcon({
            className: 'user-location-icon',
            html: `<div class="user-loc-dot" style="width:12px;height:12px;background:#2196F3;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16]
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(proxMap);

        let reportIconHtml = '';
        if (config.isImage) {
            reportIconHtml = `<img src="${config.icon}" style="width:24px;height:24px; object-fit:contain;">`;
        } else {
            reportIconHtml = `<span class="material-icons-round" style="color:white;font-size:20px;">${config.icon}</span>`;
        }
        
        const reportIcon = L.divIcon({
            className: '',
            html: `<div style="background:${config.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);">${reportIconHtml}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        L.marker([rLat, rLng], { icon: reportIcon }).addTo(proxMap);

        const bounds = L.latLngBounds([
            [userLocation.lat, userLocation.lng],
            [rLat, rLng]
        ]);
        proxMap.fitBounds(bounds, { padding: [30, 30] });

    }, 200);

    btnYes.onclick = () => {
        voteReport(report.id, 'up');
        closeProximityModal();
    };
    
    btnNo.onclick = () => {
        voteReport(report.id, 'down');
        closeProximityModal();
    };

    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}


window.closeProximityModal = function() {
    const modal = document.getElementById('modal-proximity-alert');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
};



// 2. ИЗПРАЩАНЕ НА ДОКЛАД
async function submitSocialReportToServer(reportData) {
    // Добавяме ID-то автоматично
    reportData.userId = appUserId; 
    
    try {
        const response = await fetch(`${API_BASE_URL}social/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': currentLanguage
            },
            body: JSON.stringify(reportData)
        });

        // Проверка за БАН
        if (response.status === 403) {
            alert("Вие сте БАННАТ от системата и не можете да докладвате.");
            return;
        }

        if (response.ok) {
            alert("Докладът е изпратен успешно!");
            localStorage.setItem(`last_report_${reportData.type}`, Date.now());
            fetchReportsFromServer();
        } else {
            alert("Грешка при изпращане. Опитайте отново.");
        }
    } catch (e) {
        console.error("Submit error:", e);
        alert("Няма връзка със сървъра.");
    }
}



// 3. ГЛАСУВАНЕ
window.voteReport = async function(reportId, type) {
    // 1. Проверка за локация
    if (!userLocation) {
        alert(currentLanguage === 'bg' ? "Не можем да определим вашето местоположение. Моля, включете GPS-а." : "Cannot determine location. Please enable GPS.");
        // Опитваме да обновим локацията за следващия път
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(
                (pos) => { userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }; },
                () => {}, { enableHighAccuracy: true }
            );
        }
        return;
    }

    // 2. Търсим в списъка от сървъра
    const report = serverReportsList.find(r => r.id === reportId);
    if (!report) return;

    // 3. Проверка за разстояние
    let targetLat = report.lat;
    let targetLng = report.lng;
    
    // Ако има живи данни за автобуса, ползваме тях
    if (report.tripId && typeof socialLivePositions !== 'undefined' && socialLivePositions.has(String(report.tripId))) {
        const live = socialLivePositions.get(String(report.tripId));
        targetLat = live.lat; targetLng = live.lng;
    }

    const distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, targetLat, targetLng);
    
    // --- ПРОМЯНАТА Е ТУК ---
    // Настройваме радиуса според типа на доклада
    let maxRadius = 0.5; // По подразбиране 500 метра (за Полиция, Катастрофа)
    
    // Ако е доклад за състояние на автобус (има tripId), искаме да си по-близо (200м)
    if (report.tripId) {
        maxRadius = 0.2; 
    }

    if (distKm > maxRadius) {
        const distMeters = (distKm * 1000).toFixed(0);
        const limitMeters = maxRadius * 1000;
        
        const msg = currentLanguage === 'bg' 
            ? `Твърде далеч сте (${distMeters}м)! Можете да гласувате само в радиус от ${limitMeters}м.` 
            : `Too far (${distMeters}m)! Voting allowed within ${limitMeters}m radius.`;
            
        alert(msg);
        return;
    }
    // -----------------------

    // 4. Проверка дали вече е гласувал
    const existingVote = report.usersVoted.find(u => u.nick === currentUserNick);
    if (existingVote) {
        alert(currentLanguage === 'bg' ? "Вече сте гласували за този доклад." : "You have already voted.");
        return;
    }

    // 5. Изпращане на вота към сървъра
    try {
        const response = await fetch(`${API_BASE_URL}social/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reportId: reportId,
                voteType: type,
                userNick: currentUserNick,
                userId: appUserId 
            })
        });

        if (response.status === 403) {
            alert("Не можете да гласувате за собствения си доклад!");
            return;
        }

        if (response.ok) {
            // Успех - обновяваме веднага
            fetchReportsFromServer();
        } else {
            console.error("Vote failed");
        }
    } catch (e) {
        console.error("Vote error:", e);
    }
};

// --- СЪЩЕСТВУВАЩА ЛОГИКА (АДАПТИРАНА) ---

window.setSocialFilter = function(filterType) {
    currentSocialFilter = filterType;
    
    const btnNearby = document.getElementById('btn-filter-nearby');
    const btnRecent = document.getElementById('btn-filter-recent');
    
    if (filterType === 'NEARBY') {
        btnNearby.classList.add('active');
        btnRecent.classList.remove('active');
    } else {
        btnNearby.classList.remove('active');
        btnRecent.classList.add('active');
    }
    
    renderReportsFeed();
};

async function fetchSocialLivePositions() {
    // Взимаме маршрутите от активните доклади
    const activeRouteNames = serverReportsList
        .filter(r => r.tripId)
        .map(r => r.routeName)
        .filter((v, i, a) => a.indexOf(v) === i);

    if (activeRouteNames.length === 0) return;

    try {
        const routeNamesStr = activeRouteNames.join(',');
        const response = await fetch(`${API_BASE_URL}vehicles_for_routes/${routeNamesStr}`, {
            headers: { 'Accept-Language': currentLanguage }
        });
        const vehicles = await response.json();

        socialLivePositions.clear();
        socialVehiclesById.clear();

        vehicles.forEach(v => {
            // --- ТУК Е ПРОМЯНАТА ---
            // Запазваме И vehicle_id, не само координатите!
            socialLivePositions.set(String(v.trip_id), { 
                lat: v.latitude, 
                lng: v.longitude,
                vehicleId: v.vehicle_id // <--- ВАЖНО!
            });
            
            if (v.vehicle_id) {
                socialVehiclesById.set(String(v.vehicle_id), {
                    lat: v.latitude,
                    lng: v.longitude,
                    tripId: v.trip_id,
                    routeName: v.route_name,
                    vehicleId: v.vehicle_id
                });
            }
        });
    } catch (e) {
        console.error("Error fetching live pos:", e);
    }
}
// --- REPORTING FLOW (UI HANDLERS) ---
// В script.js -> Намери и замени initiateReport
window.initiateReport = async function(typeKey) {
    currentReportType = typeKey;
    const typeConfig = REPORT_TYPES[typeKey];
    
    // --- ПРОВЕРКА 1 ---
    const lastTime = getLastUserReportTime(typeKey);
    const now = Date.now();
    const cooldown = 30 * 60 * 1000; 

    // Взимаме флага
    const isAdmin = localStorage.getItem('IS_ADMIN_USER') === 'true';

    // Ако НЕ си админ И имаш скорошен доклад -> Блок
    if (!isAdmin && lastTime > 0 && (now - lastTime < cooldown)) {
        const minLeft = Math.ceil((cooldown - (now - lastTime)) / 60000);
        alert(`⏳ Вече имате активен доклад за "${t(typeConfig.label)}".\nОстават ${minLeft} минути.`);
        return; 
    }
    // ------------------

    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.style.display = 'flex';
        const txt = loader.querySelector('p');
        if(txt) txt.textContent = "Намиране на GPS...";
    }

    try {
        await updateUserLocation();
    } catch (e) {
        if (loader) loader.style.display = 'none';
        return; 
    }

    if (loader) loader.style.display = 'none';

    if (!userLocation) return;

    if (typeConfig.isLocation) {
        openLocationPicker();
    } else {
        openVehicleSelector();
    }
};


// Submitting Vehicle Report (Променен да ползва API)
// В script.js -> Намери и замени submitVehicleReport
function submitVehicleReport(vehicle) {
    const typeKey = currentReportType; 

    // --- ПРОВЕРКА ЗА ВРЕМЕ ---
    const lastTime = getLastUserReportTime(typeKey);
    const now = Date.now();
    const cooldown = 30 * 60 * 1000;
    
    // Взимаме флага
    const isAdmin = localStorage.getItem('IS_ADMIN_USER') === 'true';

    // Блокираме само ако НЕ си админ
    if (!isAdmin && lastTime > 0 && (now - lastTime < cooldown)) {
        const minLeft = Math.ceil((cooldown - (now - lastTime)) / 60000);
        alert(`⏳ Трябва да изчакате още ${minLeft} мин.`);
        closeSelectVehicleModal();
        return;
    }
    // -------------------------

    // ... останалият код надолу си е същият ...
    
    const targetVehId = String(vehicle.vehicle_id || "");
    const targetTripId = String(vehicle.trip_id);

    const alreadyReported = serverReportsList.find(r => {
        const isMe = (String(r.userId) === String(appUserId) || r.reporter === currentUserNick);
        if (!isMe) return false;
        if (r.type !== typeKey) return false;

        if (targetVehId && r.vehicleId && String(r.vehicleId) === targetVehId) return true;
        if (!targetVehId && String(r.tripId) === targetTripId) return true;
        return false;
    });

    // Админът може да докладва един и същ автобус много пъти
    if (alreadyReported && !isAdmin) {
        alert("Вече сте докладвали този проблем за този автобус!");
        closeSelectVehicleModal();
        return;
    }

    localStorage.setItem(`last_report_${typeKey}`, Date.now());

    const reportData = {
        type: typeKey,
        tripId: vehicle.trip_id,
        vehicleId: vehicle.vehicle_id,
        routeName: vehicle.route_name,
        lat: vehicle.latitude, 
        lng: vehicle.longitude,
        reporter: currentUserNick
    };

    submitSocialReportToServer(reportData);
    
    serverReportsList.push({
        ...reportData,
        id: "temp_" + Date.now(),
        timestamp: Date.now(),
        userId: appUserId,
        usersVoted: [],
        upvotes: 0, downvotes: 0
    });

    closeSelectVehicleModal();
}


// Submitting Location Report (Променен да ползва API)
function submitLocationReport() {
    const center = pickerMap.getCenter();
    const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, center.lat, center.lng);
    
    if (dist > 0.5) {
        alert(t('alert_too_far')); 
        pickerMap.panTo([userLocation.lat, userLocation.lng]);
        return;
    }

    const success = processReportSubmission({
        type: currentReportType,
        lat: center.lat,
        lng: center.lng,
        reporter: currentUserNick,
        tripId: null,
        vehicleId: null,
        routeName: null
    });

    if (success) {
        closeLocationPicker();
    }
}

// --- RENDERING FEED ---
// В script.js -> замени renderReportsFeed с това:

// В script.js -> замени renderReportsFeed с това:
function renderReportsFeed() {
    const list = document.getElementById('social-feed-list');
    if (!list) return;
    
    // Запазваме скрола
    const currentScroll = list.scrollTop;
    
    list.innerHTML = '';

    const now = Date.now();
    let displayData = [];

    // Определяне на локацията
    let myLat, myLng;
    if (userLocation) {
        myLat = userLocation.lat;
        myLng = userLocation.lng;
    } else if (map) {
        const center = map.getCenter();
        myLat = center.lat;
        myLng = center.lng;
    } else {
        myLat = 42.6977; myLng = 23.3219;
    }

    serverReportsList.forEach(r => {
        if (now - r.timestamp > 30 * 60 * 1000) return;
        if (r.downvotes >= 2 && r.downvotes > r.upvotes) return;

        let targetLat = r.lat;
        let targetLng = r.lng;
        let statusLabel = "";
        let isLivePos = false;

        if (r.tripId) {
            let liveData = null;
            if (r.vehicleId && socialVehiclesById.has(String(r.vehicleId))) {
                liveData = socialVehiclesById.get(String(r.vehicleId));
            } else if (socialLivePositions.has(String(r.tripId))) {
                liveData = socialLivePositions.get(String(r.tripId));
            }

            if (liveData) {
                targetLat = liveData.lat;
                targetLng = liveData.lng;
                statusLabel = t('feed_live');
                isLivePos = true;
            } else {
                statusLabel = t('feed_last_pos');
            }
        }

        let distKm = getDistanceFromLatLonInKm(myLat, myLng, targetLat, targetLng);
        let maxRadius = currentSocialFilter === 'NEARBY' ? 5 : 30;
        if (!userLocation) maxRadius = 10; 

        if (distKm > maxRadius) return;

        const displayRouteName = r.currentRouteLabel || r.routeName;

        displayData.push({
            report: r,
            distKm: distKm,
            isLivePos: isLivePos,
            statusLabel: statusLabel,
            displayRouteName: displayRouteName,
            finalLat: targetLat,
            finalLng: targetLng,
            timeAgo: Math.floor((now - r.timestamp) / 60000)
        });
    });

    if (currentSocialFilter === 'NEARBY') {
        displayData.sort((a, b) => a.distKm - b.distKm);
    } else {
        displayData.sort((a, b) => b.report.timestamp - a.report.timestamp);
    }

    if (displayData.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#888;">${t('feed_no_reports')}</div>`;
        return;
    }

    displayData.forEach(item => {
        const r = item.report;
        const config = REPORT_TYPES[r.type] || REPORT_TYPES['ACCIDENT'];
        
        // --- ТУК Е ПРОМЯНАТА ---
        // Проверяваме дали сме затворили поп-ъпа за този репорт
        const isDismissed = shownProximityAlerts.has(r.id);

        // Настройваме радиуса за гласуване (0.5 км за инциденти, 0.2 км за автобуси)
        let voteRadius = r.tripId ? 0.2 : 0.5;

        // Условие за активни бутони:
        // 1. Имаш GPS и си близо
        // 2. НЕ е твой доклад
        // 3. НЕ си го затворил през поп-ъпа (!isDismissed)
        const canVote = (userLocation && item.distKm <= voteRadius) && 
                        (String(r.userId) !== String(appUserId)) &&
                        !isDismissed;
        // -----------------------
        
        const userVoted = r.usersVoted.find(u => u.nick === currentUserNick);
        
        let titleText = t(config.label);
        let distLabel = userLocation ? t('feed_dist') : "~";
        let locationText = `${distLabel} ${(item.distKm*1000).toFixed(0)}m`;
        
        if (r.tripId) {
            const displayRoute = r.currentRouteLabel || r.routeName || '?';
            titleText += ` (${t('feed_line')} ${displayRoute})`;
            if (item.isLivePos) locationText += ` <span style='color:#2e7d32; font-weight:bold; font-size:10px;'>${item.statusLabel}</span>`;
            else if (item.statusLabel) locationText += ` <span style='color:#666; font-size:10px;'>${item.statusLabel}</span>`;
        }

        const isMine = (String(r.userId) === String(appUserId));
        const deleteBtnHtml = isMine ? `
            <button onclick="deleteOwnReport('${r.id}')" style="background:#ffebee; border:1px solid #ffcdd2; color:#d32f2f; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; margin-left:8px; flex-shrink:0;">
                <span class="material-icons-round" style="font-size:16px;">delete</span>
            </button>
        ` : '';

        const mapBtnHtml = `
            <div class="report-feed-actions">
                <button class="btn-locate-report" onclick="goToReportLocation('${r.id}', ${item.finalLat}, ${item.finalLng})">
                    <span class="material-icons-round">map</span>
                </button>
            </div>
        `;

        let iconHtml = '';
        let iconStyle = '';
        if (config.isImage) {
            iconHtml = `<img src="${config.icon}" style="width:24px; height:24px; object-fit:contain; display:block;">`;
            iconStyle = `background: transparent; box-shadow: none;`; 
        } else {
            iconHtml = `<span class="material-icons-round" style="font-size:20px;">${config.icon}</span>`;
            iconStyle = `background: ${config.color}; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);`;
        }

        const expiresAt = r.expiresAt || (r.timestamp + 30 * 60 * 1000);
        const timeLeftMs = expiresAt - Date.now();
        let timeLeftMin = Math.floor(timeLeftMs / 60000);
        if (timeLeftMin < 0) timeLeftMin = 0;
        const timerColor = timeLeftMin < 5 ? '#d32f2f' : '#888';

        const btnOpacity = canVote ? '1' : '0.5';
        const btnCursor = canVote ? 'pointer' : 'not-allowed';
        const btnAttr = canVote ? '' : 'disabled';

        const div = document.createElement('div');
        div.className = 'report-feed-item';
        
        const metaText = `${t('feed_by')} ${r.reporter} • ${t('feed_ago')} ${item.timeAgo} ${t('time_min')} • ${locationText}`;

        div.innerHTML = `
            <div class="report-feed-icon" style="${iconStyle} display:flex; align-items:center; justify-content:center;">
                ${iconHtml}
            </div>
            <div class="report-feed-content">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div class="report-feed-title" style="flex-grow:1;">${titleText}</div>
                    ${deleteBtnHtml}
                </div>
                
                <div class="report-feed-meta">${metaText}</div>
                
                <div class="vote-controls" style="display: flex; align-items: center; width: 100%;">
                    <button class="vote-btn upvote ${userVoted?.vote === 'up' ? 'active' : ''}" 
                        onclick="voteReport('${r.id}', 'up')" 
                        style="opacity:${btnOpacity}; cursor:${btnCursor};" ${btnAttr}>
                        <span class="material-icons-round" style="font-size:16px;">thumb_up</span> ${r.upvotes || 0}
                    </button>
                    
                    <button class="vote-btn downvote ${userVoted?.vote === 'down' ? 'active' : ''}" 
                        onclick="voteReport('${r.id}', 'down')" 
                        style="opacity:${btnOpacity}; cursor:${btnCursor};" ${btnAttr}>
                        <span class="material-icons-round" style="font-size:16px;">thumb_down</span> ${r.downvotes || 0}
                    </button>
                    
                    <span style="font-size: 11px; font-weight: bold; color: ${timerColor}; margin-left: auto;">
                        ⏳ ${timeLeftMin} мин
                    </span>
                </div>
            </div>
            ${mapBtnHtml}
        `;
        list.appendChild(div);
    });
    
    if (list.scrollTop !== currentScroll) {
        list.scrollTop = currentScroll;
    }
}



window.deleteOwnReport = async function(reportId) {
    if (!confirm("Искате ли да изтриете този сигнал?")) return;
    
    try {
        await fetch(`${API_BASE_URL}social/delete_own_report`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ reportId: reportId, userId: appUserId })
        });
        fetchReportsFromServer(); // Веднага обновяваме
    } catch (e) { alert("Error"); }
};

// Функция за триене на Roadmap item
window.adminDeleteRoadmapItem = async function(id) {
    if(!confirm("Изтриване от Roadmap?")) return;
    try {
        await fetch(`${API_BASE_URL}admin/delete_roadmap_item`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ itemId: id })
        });
        openAdminSuggestions(); 
    } catch(e) { alert("Error"); }
};


function goToReportLocation(reportId, lat, lng) {
    document.querySelector('[data-target="screen-map"]').click();
    
    // Взимаме доклада за детайли
    const report = serverReportsList.find(r => r.id === reportId);
    
    setTimeout(() => {
        map.invalidateSize();
        map.setView([lat, lng], 17, { animate: true });
        
        // Показваме балонче
        if (report) {
            const config = REPORT_TYPES[report.type];
            let content = `<div style="text-align:center;"><b>${config.label}</b><br>от ${report.reporter}</div>`;
            L.popup({ closeButton: false, offset: [0, -10], className: 'custom-popup' })
             .setLatLng([lat, lng])
             .setContent(content)
             .openOn(map);
        }
    }, 300);
}

// --- MAP OVERLAY (MARKERS) ---
let socialMarkersLayer = L.featureGroup();

function initSocialMapLayer() {
    socialMarkersLayer.addTo(map);
    map.on('moveend', addSocialMarkersToMap);
}


// В script.js

function addSocialMarkersToMap() {
    socialMarkersLayer.clearLayers();
    
    const now = Date.now();

    serverReportsList.forEach(r => {
        if (now - r.timestamp > 30 * 60 * 1000) return;
        if (r.downvotes >= 2 && r.downvotes > r.upvotes) return;

        if (REPORT_TYPES[r.type].isLocation) {
            const config = REPORT_TYPES[r.type];
            
            const htmlIcon = `
                <div class="map-incident-marker" style="background:${config.color}">
                    <span class="material-icons-round" style="color:white; font-size:20px;">${config.icon}</span>
                </div>`;
            
            const icon = L.divIcon({ className: '', html: htmlIcon, iconSize: [36, 36], iconAnchor: [18, 18] });

            let distKm = 9999;
            if (userLocation) {
                distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, r.lat, r.lng);
            }
            
            const canVote = distKm <= 0.5;
            const userVoted = r.usersVoted.find(u => u.nick === currentUserNick);
            
            const btnStyle = `border: 1px solid #ccc; background: white; border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;`;
            const upStyle = (userVoted?.vote === 'up') ? 'background:#e8f5e9; border-color:#2e7d32; color:#2e7d32;' : '';
            const downStyle = (userVoted?.vote === 'down') ? 'background:#ffebee; border-color:#c62828; color:#c62828;' : '';
            const disabledAttr = (!canVote) ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : '';

            const timeAgo = Math.floor((now - r.timestamp) / 60000);
            
            // --- ТУК СА ПРЕВОДИТЕ ---
            let popupContent = `
                <div style="text-align:center; min-width: 180px;">
                    <div style="font-weight:bold; color:${config.color}; margin-bottom:6px; font-size: 14px;">
                        <span class="material-icons-round" style="vertical-align:bottom; font-size:20px; margin-right:4px;">${config.icon}</span> 
                        ${t(config.label)} 
                    </div>
                    <div style="font-size:12px; color:#333; margin-bottom: 8px;">
                        ${t('feed_by')} <b>${r.reporter}</b> • ${t('feed_ago')} ${timeAgo} ${t('time_min')}
                    </div>
                    
                    <div style="display:flex; justify-content:center; gap:8px; margin-top:8px;">
                        <button onclick="window.voteReport('${r.id}', 'up')" style="${btnStyle} ${upStyle}" ${disabledAttr}>
                            <span class="material-icons-round" style="font-size:14px;">thumb_up</span> ${r.upvotes}
                        </button>
                        <button onclick="window.voteReport('${r.id}', 'down')" style="${btnStyle} ${downStyle}" ${disabledAttr}>
                            <span class="material-icons-round" style="font-size:14px;">thumb_down</span> ${r.downvotes}
                        </button>
                    </div>
            `;
            
            if (!canVote && userLocation) {
                // Добави превод за "Твърде далеч" ако искаш, или го скрий
                // popupContent += `<div style="font-size:10px; color:#999; margin-top:4px;">(Too far)</div>`;
            }

            popupContent += `</div>`;

            L.marker([r.lat, r.lng], { icon: icon, zIndexOffset: 2000 })
             .bindPopup(popupContent, { className: 'custom-popup', offset: [0, -10] })
             .addTo(socialMarkersLayer);
        }
    });
}


// Обновява значките върху автобусите (Hot/Cold/Dirty)
// В script.js -> замени generateReportBadges с това:
function generateReportBadges(tripId, isSmallRadar = false, hasDeviation = false) {
    if ((!serverReportsList || serverReportsList.length === 0) && !hasDeviation) return '';
    let stats = { HOT: 0, COLD: 0, DIRTY: 0, CROWDED: 0 };
    const reportsForTrip = serverReportsList.filter(r => String(r.tripId) === String(tripId));
    reportsForTrip.forEach(r => { if (stats.hasOwnProperty(r.type)) stats[r.type]++; });

    if (Object.values(stats).every(v => v < 1) && !hasDeviation) return '';

    let html = '';
    const size = isSmallRadar ? 12 : 16; 

    // 1. ОТКЛОНЕНИЕ: ДОЛУ ВЛЯВО
    if (hasDeviation) {
        html += `<div class="badge-deviation" style="width:${size+2}px; height:${size+2}px;">
             <span class="material-icons-round" style="font-size:${size}px;">warning</span>
        </div>`;
    }

    // 2. ЖЕГА / СТУД
    if (stats.HOT >= 1 || stats.COLD >= 1) {
        let img = stats.HOT >= stats.COLD ? 'hot.png' : 'cold.png';
        html += `<div class="vehicle-condition-badge" style="top:-8px; left:-8px; width:${size}px; height:${size}px;"><img src="${img}" class="badge-icon-img"></div>`;
    }
    // 3. МРЪСНО
    if (stats.DIRTY >= 1) {
        html += `<div class="vehicle-condition-badge" style="top:-8px; right:-8px; width:${size}px; height:${size}px;"><img src="stain.png" class="badge-icon-img"></div>`;
    }
    // 4. ПРЕТЪПКАН (Ако има deviation, местим вдясно)
    let crowdedStyle = "bottom:-8px; left:50%; transform:translateX(-50%);";
    if (hasDeviation) crowdedStyle = "bottom:-8px; right:-6px;";
    
    if (stats.CROWDED >= 1) {
        html += `<div class="vehicle-condition-badge" style="${crowdedStyle} width:${size}px; height:${size}px;"><img src="crowded.png" class="badge-icon-img"></div>`;
    }

    return html;
}




// --- НОВА ФУНКЦИЯ ЗА СЛУШАТЕЛИТЕ НА МЕНЮТО ---
function setupFavMenuListeners() {
    console.log("Setting up Fav Menu Listeners...");

    // Инициализация на UI за къстъм спирки (ако не е извикано другаде)
    if (typeof initCustomStopsUI === 'function') initCustomStopsUI();

    // 1. Бутон "Добави/Махни от Любими"
    const btnToggle = document.getElementById('action-fav-toggle');
    if (btnToggle) {
        btnToggle.onclick = () => {
            if (!targetStopForAction) return;
            const stopId = targetStopForAction.stop_id;
            
            const idx = favoriteStops.indexOf(stopId);
            if (idx > -1) {
                favoriteStops.splice(idx, 1); // Махаме
            } else {
                favoriteStops.push(stopId);   // Добавяме
            }
            
            localStorage.setItem('favStops', JSON.stringify(favoriteStops));
            
            // Рефрешваме екраните
            if (document.getElementById('screen-favorites').classList.contains('active')) loadFavoritesScreen();
            updateFavIconState(stopId);
            
            // Рефреш на иконата в търсенето
            const searchIcon = document.querySelector(`#search-actions-${stopId} .material-icons-round`);
            if (searchIcon) {
                 searchIcon.textContent = (idx > -1) ? 'star_border' : 'star';
                 searchIcon.parentElement.style.color = (idx > -1) ? '' : '#FFD700';
            }

            closeFavMenu();
        };
    }

    // 2. Бутон "Обедини спирка"
    const btnMerge = document.getElementById('action-fav-merge');
    if (btnMerge) {
        btnMerge.onclick = () => {
            goToFavStep('merge-type');
        };
    }

    // 3. Бутон "Създай нова"
    const btnCreateNew = document.getElementById('action-create-new');
    if (btnCreateNew) {
        btnCreateNew.onclick = () => {
            closeFavMenu();
            openCustomStopCreator(null);
            addStopToCustomList(targetStopForAction);
        };
    }

    // 4. Бутон "Обедини със съществуваща"
    const btnMergeExisting = document.getElementById('action-merge-existing');
    if (btnMergeExisting) {
        btnMergeExisting.onclick = () => {
            goToFavStep('list');
        };
    }
}




async function saveNickname() {
    const val = document.getElementById('input-nickname').value.trim();
    
    // 1. Проверка за дължина
    if (val.length < 3) {
        alert("Никнеймът трябва да е поне 3 символа.");
        return;
    }

    // 2. Проверка за специални символи (опционално, за по-чисти имена)
    if (/[^a-zA-Z0-9а-яА-Я _-]/.test(val)) {
        alert("Моля, използвайте само букви, цифри, тире и долна черта.");
        return;
    }

    const btn = document.getElementById('btn-save-nickname');
    const originalText = btn.textContent;
    btn.textContent = "Проверка...";
    btn.disabled = true;

    try {
        // 3. ПИТАМЕ СЪРВЪРА ДАЛИ Е ЗАЕТО
        // Използваме sync_user endpoint-а. Сървърът трябва да върне грешка 409 (Conflict), ако името е заето.
        const response = await fetch(`${API_BASE_URL}social/sync_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: appUserId,
                newNick: val
            })
        });

        if (response.status === 409) {
            // ГРЕШКА: Името е заето
            alert("Този никнейм вече е зает! Моля, изберете друг.");
            btn.textContent = originalText;
            btn.disabled = false;
            return;
        }

        if (!response.ok) {
            throw new Error("Server error");
        }

        // 4. Ако всичко е наред -> Запазваме локално и влизаме
        localStorage.setItem('userNickname', val);
        currentUserNick = val;
        updateHeaderNickname();
        
        // Влизане
        initSocialTab();

    } catch (e) {
        console.error(e);
        alert("Грешка при връзката със сървъра. Опитайте пак.");
        btn.textContent = originalText;
        btn.disabled = false;
    }
}




function updateUserLocation() {
    return new Promise((resolve, reject) => {
		// --- ЖЕЛЯЗНА ЗАБРАНА ЗА ГОСТИ ---
        if (isGuestMode) {
            console.log("Location denied: Guest Mode");
            reject("Guest mode");
            return;
        }
        if (!navigator.geolocation) {
            alert("Нужна е локация за тази функция.");
            reject(); return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                resolve(userLocation);
            },
            (err) => {
                console.error(err);
                alert("Моля, включете GPS-а.");
                reject();
            },
            { enableHighAccuracy: true }
        );
    });
}

// --- 2. REPORTING FLOW ---


// --- A. VEHICLE SELECTION ---
async function openVehicleSelector() {
    const modal = document.getElementById('modal-select-vehicle');
    const list = document.getElementById('vehicle-select-list');
    
    // ПРЕВОД на "Търсене..."
    list.innerHTML = `<div style="text-align:center; padding:20px;">${t('modal_veh_search')}</div>`;
    
    modal.classList.remove('hidden');
    modal.classList.add('active');

    try {
        let vehicles = [];
        
        const allRouteNames = [...new Set(allLinesData.map(l => l.line_name))].join(',');
        if (allRouteNames) {
            const response = await fetch(`${API_BASE_URL}vehicles_for_routes/${allRouteNames}`, {
                headers: { 'Accept-Language': currentLanguage }
            });
            vehicles = await response.json();
        }

        const nearbyVehicles = vehicles.filter(v => {
            if (!v.latitude || !v.longitude) return false;
            const dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, v.latitude, v.longitude);
            return dist <= 0.2;
        });

        list.innerHTML = '';
        if (nearbyVehicles.length === 0) {
            // ПРЕВОД на "Няма..."
            list.innerHTML = `<div style="text-align:center; padding:20px;">${t('modal_veh_none')}</div>`;
            return;
        }

        nearbyVehicles.sort((a,b) => {
            const distA = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
            const distB = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
            return distA - distB;
        });

        nearbyVehicles.forEach(v => {
            // ВАЖНО: Превеждаме типа!
            const typeName = getTransportTypeName(v.route_type);
            // ПРЕВОД на "към"
            const toText = t('to_label'); 

            const div = document.createElement('div');
            div.className = 'vehicle-select-item';
            div.innerHTML = `
                <div>
                    <span style="font-weight:bold; font-size:16px;">${typeName} ${v.route_name}</span>
                    <div style="font-size:12px; color:#666;">${toText} ${v.destination}</div>
                </div>
                <span class="material-icons-round" style="color:var(--primary);">chevron_right</span>
            `;
            div.onclick = () => submitVehicleReport(v);
            list.appendChild(div);
        });

    } catch (e) {
        list.innerHTML = `<div style="color:red; text-align:center; padding:20px;">${t('alert_no_connection')}</div>`;
    }
}



function closeSelectVehicleModal() {
    const modal = document.getElementById('modal-select-vehicle');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
}



// --- B. LOCATION SELECTION ---
function openLocationPicker() {
    const modal = document.getElementById('modal-location-picker');
    modal.classList.remove('hidden');
    modal.classList.add('active');

    // Инициализация на Leaflet mini-map
    if (!pickerMap) {
        pickerMap = L.map('location-picker-map', { zoomControl: false }).setView([userLocation.lat, userLocation.lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(pickerMap);
        
        // Кръг 500м
        L.circle([userLocation.lat, userLocation.lng], {
            color: 'gray', fillColor: '#ccc', fillOpacity: 0.1, radius: 500
        }).addTo(pickerMap);
    } else {
        pickerMap.setView([userLocation.lat, userLocation.lng], 16);
    }
    
    // При местене на картата проверяваме дали сме в радиуса
    pickerCenter = userLocation;
    
    document.getElementById('btn-submit-location-report').onclick = submitLocationReport;
}

function closeLocationPicker() {
    const modal = document.getElementById('modal-location-picker');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
}


// --- 3. SAVING & DISPLAYING ---

function saveReportToDB(report) {
    mockReportsDB.push(report);
    saveMockDB();
    
    // Rate Limit
    localStorage.setItem(`last_report_${report.type}`, Date.now());
    
    alert("Докладът е изпратен успешно!");
    loadReportsFeed();
    
    // Обновяваме и главната карта ако е нужно
    if (REPORT_TYPES[report.type].isLocation) {
        addSocialMarkersToMap();
    }
}

function markReportAsSeen(reportId) {
    shownProximityAlerts.add(reportId);
    // Записваме новия списък в паметта на телефона
    localStorage.setItem('hidden_popups', JSON.stringify([...shownProximityAlerts]));
}


function loadReportsFeed() {
    const list = document.getElementById('social-feed-list');
    list.innerHTML = '';

    const now = Date.now();
    let displayData = [];

    mockReportsDB.forEach(r => {
        if (now - r.timestamp > 30 * 60 * 1000) return;
        if (r.downvotes >= 2 && r.downvotes > r.upvotes) return;

        // --- ЛОГИКА ЗА ЛОКАЦИЯ (PRIORITY) ---
        
        // 1. Start with Original
        let targetLat = r.lat;
        let targetLng = r.lng;
        let statusLabel = ""; // Текст за статус (напр. "на живо", "последна поз.")
        let isLivePos = false; // За цвета на текста

        // 2. Check Last Known (от базата)
        if (r.lastKnownLat && r.lastKnownLng) {
            targetLat = r.lastKnownLat;
            targetLng = r.lastKnownLng;
            statusLabel = "(последна поз.)";
        }

        // 3. Check Live Data (от API-то в момента)
        if (r.tripId) {
            let liveData = null;

            // Опит по Vehicle ID
            if (r.vehicleId && socialVehiclesById.has(String(r.vehicleId))) {
                liveData = socialVehiclesById.get(String(r.vehicleId));
            } 
            // Опит по Trip ID
            else if (socialLivePositions.has(String(r.tripId))) {
                liveData = socialLivePositions.get(String(r.tripId));
            }

            // Ако имаме живи данни, те презаписват всичко
            if (liveData) {
                targetLat = liveData.lat;
                targetLng = liveData.lng;
                statusLabel = "(НА ЖИВО)";
                isLivePos = true;
            }
        }

        // Изчисляване на разстоянието
        let distKm = 9999;
        if (userLocation) {
            distKm = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, targetLat, targetLng);
        }

        let maxRadius = currentSocialFilter === 'NEARBY' ? 5 : 30;
        if (distKm > maxRadius) return;

        // Използваме currentRouteLabel, ако е налично (заради смяна на линия), иначе оригиналното
        const displayRouteName = r.currentRouteLabel || r.routeName;

        displayData.push({
            report: r,
            distKm: distKm,
            isLivePos: isLivePos,
            statusLabel: statusLabel,
            displayRouteName: displayRouteName,
            // Важно: подаваме изчислените координати за бутона "Карта"
            finalLat: targetLat,
            finalLng: targetLng,
            timeAgo: Math.floor((now - r.timestamp) / 60000)
        });
    });

    if (currentSocialFilter === 'NEARBY') {
        displayData.sort((a, b) => a.distKm - b.distKm);
    } else {
        displayData.sort((a, b) => b.report.timestamp - a.report.timestamp);
    }

    if (displayData.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:#888;">Няма доклади.</div>`;
        return;
    }

// ... (началото на renderReportsFeed е същото) ...

// ... (началото на функцията си остава) ...
    displayData.forEach(item => {
        const r = item.report;
        const config = REPORT_TYPES[r.type] || REPORT_TYPES['ACCIDENT'];
        
        const canVote = item.distKm <= 0.5;
        const userVoted = r.usersVoted.find(u => u.nick === currentUserNick);
        
        let titleText = config.label;
        let locationText = `на ${(item.distKm*1000).toFixed(0)}м`;
        
        if (r.tripId) {
            const displayRoute = r.currentRouteLabel || r.routeName || '?';
            titleText += ` (Линия ${displayRoute})`;
            if (item.isLivePos) locationText += ` <span style='color:#2e7d32; font-weight:bold; font-size:10px;'>${item.statusLabel}</span>`;
            else if (item.statusLabel) locationText += ` <span style='color:#666; font-size:10px;'>${item.statusLabel}</span>`;
        }

        // HTML ЗА ИКОНАТА
        let iconHtml = '';
        if (config.isImage) {
            // PNG БЕЗ ТОЧКА
            iconHtml = `<img src="${config.icon}" style="width:24px; height:24px; object-fit:contain; display:block;">`;
        } else {
            iconHtml = `<span class="material-icons-round" style="color:white; font-size:20px;">${config.icon}</span>`;
        }

        // БУТОН КАРТА
        const mapBtnHtml = `
            <div class="report-feed-actions">
                <button class="btn-locate-report" onclick="goToReportLocation('${r.id}', ${item.finalLat}, ${item.finalLng})">
                    <span class="material-icons-round">map</span>
                </button>
            </div>
        `;

        const div = document.createElement('div');
        div.className = 'report-feed-item';
        
        div.innerHTML = `
            <div class="report-feed-icon" style="background:${config.color}; display:flex; align-items:center; justify-content:center;">
                ${iconHtml}
            </div>
            <div class="report-feed-content">
                <div class="report-feed-title" style="flex-grow:1;">${titleText}</div>
                <div class="report-feed-meta">от ${r.reporter} • преди ${item.timeAgo} мин. • ${locationText}</div>
                
                <div class="vote-controls">
                    <button class="vote-btn upvote ${userVoted?.vote === 'up' ? 'active' : ''}" 
                        onclick="voteReport('${r.id}', 'up')" ${!canVote ? 'disabled style="opacity:0.5;"' : ''}>
                        <span class="material-icons-round" style="font-size:16px;">thumb_up</span> ${r.upvotes || 0}
                    </button>
                    <button class="vote-btn downvote ${userVoted?.vote === 'down' ? 'active' : ''}" 
                        onclick="voteReport('${r.id}', 'down')" ${!canVote ? 'disabled style="opacity:0.5;"' : ''}>
                        <span class="material-icons-round" style="font-size:16px;">thumb_down</span> ${r.downvotes || 0}
                    </button>
                </div>
            </div>
            ${mapBtnHtml}
        `;
        list.appendChild(div);
    });



}






// --- 4. MAP INTEGRATION ---


// Извикай това в initMap()

// Помощна функция за разстояние (Haversine)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// --- 5. INTEGRATION WITH VEHICLES (BADGES) ---
// Трябва да модифицираме generateReportBadges функцията, за да чете и от нашата mock база

// Намери старата функция `generateReportBadges` и я замени с тази ОБНОВЕНА версия:



// В script.js -> замени цялата функция window.goToReportLocation

// В script.js -> замени старата функция с тази:

// В script.js -> замени goToReportLocation с това:

window.goToReportLocation = function(reportId, initialLat, initialLng) {
    const report = serverReportsList.find(r => r.id === reportId);
    
    // 1. По подразбиране взимаме координатите от доклада
    let targetLat = report ? (report.lastKnownLat || report.lat) : initialLat;
    let targetLng = report ? (report.lastKnownLng || report.lng) : initialLng;

    // 2. ВАЖНО: Проверяваме дали имаме ЖИВИ данни за този автобус СЕГА
    // Това оправя проблема "праща ме на моята локация"
    if (report && (report.tripId || report.vehicleId)) {
        let liveData = null;
        
        // Търсим по Vehicle ID (най-сигурно)
        if (report.vehicleId && typeof socialVehiclesById !== 'undefined' && socialVehiclesById.has(String(report.vehicleId))) {
            liveData = socialVehiclesById.get(String(report.vehicleId));
        } 
        // Търсим по Trip ID
        else if (report.tripId && typeof socialLivePositions !== 'undefined' && socialLivePositions.has(String(report.tripId))) {
            liveData = socialLivePositions.get(String(report.tripId));
        }

        // Ако намерим автобуса на живо, отиваме при него!
        if (liveData) {
            console.log("Redirecting map to LIVE bus location instead of report location.");
            targetLat = liveData.lat;
            targetLng = liveData.lng;
        }
    }

    // 3. Отваряме картата
    document.querySelector('[data-target="screen-map"]').click();

    setTimeout(() => {
        map.invalidateSize();
        // Местим картата към актуалната позиция
        map.setView([targetLat, targetLng], 17, { animate: true });

        if (report) {
            const config = REPORT_TYPES[report.type];
            const timeAgo = Math.floor((Date.now() - report.timestamp) / 60000);
            
            let iconHtml = '';
            if (config.isImage) {
                iconHtml = `<img src="${config.icon}" style="width:20px; height:20px; vertical-align:bottom; margin-right:4px; object-fit:contain;">`;
            } else {
                iconHtml = `<span class="material-icons-round" style="vertical-align:bottom; font-size:20px; margin-right:4px;">${config.icon}</span>`;
            }
            
            let content = `
                <div style="text-align:center; min-width: 160px;">
                    <div style="font-weight:bold; color:${config.color}; margin-bottom:6px; font-size: 14px;">
                        ${iconHtml} 
                        ${t(config.label)} 
                    </div>
                    <div style="font-size:13px; color:#333; margin-bottom: 4px;">
                        ${t('feed_by')}: <b>${report.reporter}</b>
                    </div>
                    <div style="font-size:11px; color:#666;">
                        ${t('feed_ago')} ${timeAgo} ${t('time_min')}
                    </div>
            `;
            
            if (report.tripId || report.vehicleId) {
                content += `<div style="background:#f5f5f5; padding:6px; border-radius:6px; margin-top:6px; display:flex; flex-direction:column; gap:2px;">`;
                
                if (report.routeName) {
                    const displayRoute = report.currentRouteLabel || report.routeName;
                    content += `<div style="font-size:12px; color:#333;">${t('feed_line')}: <b>${displayRoute}</b></div>`;
                }
                
                if (report.vehicleId) {
                    content += `<div style="font-size:11px; color:#555;">№ <b>${report.vehicleId}</b></div>`;
                }
                
                content += `</div>`;
            }
            
            content += `</div>`;

            L.popup({
                closeButton: true, offset: [0, -10], className: 'custom-popup', autoPan: false
            })
            .setLatLng([targetLat, targetLng])
            .setContent(content)
            .openOn(map);
        }
    }, 300);
};



function updateMapButtons(height) {
    const btnGroup = document.getElementById('map-buttons-container');
    if (!btnGroup) return;
    
    // Ако height е 0 (няма меню), връщаме бутоните в начална позиция
    if (height <= 0) {
        btnGroup.style.transition = 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        btnGroup.style.bottom = 'calc(80px + var(--safe-bottom))';
    } else {
        btnGroup.style.transition = 'none'; // Махаме анимацията при влачене за бързина
        btnGroup.style.bottom = (height + 10) + "px";
    }
}



// --- LIVE WIDGET LOGIC ---

window.minimizeRideAlong = function() {
    const sheet = document.getElementById('screen-ride-along');
    sheet.classList.add('hidden');
    
    // Връщаме бутоните долу, тъй като менюто вече е минимизирано
    const btnGroup = document.getElementById('map-buttons-container');
    if (btnGroup) btnGroup.style.bottom = 'calc(80px + var(--safe-bottom))';

    const widget = document.getElementById('minimized-live-widget');
    widget.classList.remove('hidden');
    updateLiveWidgetData();
};

window.maximizeRideAlong = function() {
    const widget = document.getElementById('minimized-live-widget');
    widget.classList.add('hidden');

    const sheet = document.getElementById('screen-ride-along');
    sheet.classList.remove('hidden');
    sheet.classList.add('active');
    
    // Местим бутоните обратно над менюто (което се връща на последната си височина, обикновено 50vh)
    const btnGroup = document.getElementById('map-buttons-container');
    if (btnGroup) {
        const h = sheet.getBoundingClientRect().height;
        btnGroup.style.bottom = `${h + 10}px`;
    }
};


function updateLiveWidgetData() {
    // Тази функция се вика при всяко обновяване на данните
    if (!rideAlongState.active || !rideAlongState.routeDetails) return;

    const widget = document.getElementById('minimized-live-widget');
    // Ако не е видим, няма нужда да го обновяваме визуално
    if (widget.classList.contains('hidden')) return;

    const color = rideAlongState.routeDetails.color || '#333';
    const lineName = rideAlongState.routeDetails.routeName;
    
    // 1. Цветове
    document.getElementById('min-widget-line').style.color = color;
    document.getElementById('min-widget-live').style.color = color;
    widget.style.borderColor = color; // Рамката също става цветна

    // 2. Име на линията
    document.getElementById('min-widget-line').textContent = lineName;

    // 3. Време (Взимаме го от кешираните данни)
    // Търсим времето до: Пинната спирка ИЛИ Крайната спирка
    let targetStopId = rideAlongState.pinnedStopId 
        ? rideAlongState.pinnedStopId 
        : rideAlongState.stops[rideAlongState.stops.length - 1].stop_id;

    let timeText = "...";
    if (rideAlongState.cachedRealTimes && rideAlongState.cachedRealTimes.has(targetStopId)) {
        const eta = rideAlongState.cachedRealTimes.get(targetStopId);
        const suffix = currentLanguage === 'en' ? 'min' : 'мин';
        timeText = (eta === 0) ? (currentLanguage === 'en' ? "Now" : "Сега") : `${eta} ${suffix}`;
    }
    
    // Ако имаме пинната спирка, добавяме иконка или текст, за да се знае
    if (rideAlongState.pinnedStopId) {
        // timeText += " (слизам)"; // Може да се добави по желание
    }

    document.getElementById('min-widget-eta').textContent = timeText;
}



// --- SUGGESTIONS LOGIC ---

function openSuggestionModal() {
    const modal = document.getElementById('modal-suggestion');
    document.getElementById('suggestion-text').value = ''; // Чистим
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
}


async function submitSuggestionToServer() {
    const text = document.getElementById('suggestion-text').value.trim();
    if (text.length < 5) {
        alert("Моля, напишете поне 5 символа.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}social/suggestion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                author: currentUserNick || 'Anonymous',
                userId: appUserId // <--- НОВО
            })
        });

        if (response.status === 403) {
            alert("Вие сте БАННАТ и не можете да пращате предложения.");
            return;
        }

        if (response.ok) {
            alert("Благодарим за предложението!");
            document.getElementById('modal-suggestion').classList.remove('active');
            setTimeout(()=>document.getElementById('modal-suggestion').classList.add('hidden'), 200);
        } else {
            alert("Грешка при изпращане.");
        }
    } catch (e) {
        console.error(e);
        alert("Няма връзка със сървъра.");
    }
}

function openNicknameEditor() {
    document.getElementById('edit-nickname-input').value = currentUserNick || '';
    const modal = document.getElementById('modal-edit-nickname');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
}

// В script.js

async function confirmNicknameChange() {
    const newNick = document.getElementById('edit-nickname-input').value.trim();
    
    if (newNick.length < 3) { 
        alert("Името е твърде късо."); 
        return; 
    }

    if (newNick === currentUserNick) {
        closeModal(); // Няма промяна
        return;
    }

    // Бутонът за запазване (намираме го през DOM, за да покажем лоудинг)
    const saveBtn = document.querySelector('#modal-edit-nickname .route-action-btn');
    if(saveBtn) {
        saveBtn.textContent = "...";
        saveBtn.disabled = true;
    }

    try {
        // 1. ПИТАМЕ СЪРВЪРА
        const response = await fetch(`${API_BASE_URL}social/sync_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: appUserId,
                newNick: newNick
            })
        });
        
        // 2. ПРОВЕРКА ЗА ЗАЕТО ИМЕ
        if (response.status === 409) {
            alert("Това име вече е заето от друг потребител.");
            if(saveBtn) {
                saveBtn.textContent = "Запази";
                saveBtn.disabled = false;
            }
            return;
        }

        if (!response.ok) throw new Error("Failed");

        // 3. УСПЕХ -> Запазваме локално
        localStorage.setItem('userNickname', newNick);
        currentUserNick = newNick;
        updateHeaderNickname();
        
        // Затваряме модала
        const modal = document.getElementById('modal-edit-nickname');
        modal.classList.remove('active');
        setTimeout(() => modal.classList.add('hidden'), 200);
        
        alert("Името е сменено успешно!");

    } catch (e) {
        console.error("Sync failed", e);
        alert("Възникна грешка при проверката на името.");
    } finally {
        if(saveBtn) {
            saveBtn.textContent = "Запази";
            saveBtn.disabled = false;
        }
    }
}

// В script.js -> Най-долу
async function openAdminSuggestions() {
    const modal = document.getElementById('modal-admin-suggestions');
    const listSugg = document.getElementById('admin-suggestions-list');
    const listReports = document.getElementById('admin-reports-list');
    const listBanned = document.getElementById('admin-banned-users-list');
    
    // Подготовка за Roadmap секцията (създава се динамично, ако липсва)
    let listRoadmap = document.getElementById('admin-roadmap-list');
    const container = document.querySelector('#modal-admin-suggestions .modal-content > div:last-child');
    
    if (!listRoadmap) {
        const hr = document.createElement('hr'); 
        hr.style.cssText = "border:0; border-top:2px solid #ddd; margin:20px 0;";
        const h4 = document.createElement('h4');
        h4.textContent = "🚀 Публикуван Roadmap";
        h4.style.cssText = "margin-top:0; color:#6200ea;";
        listRoadmap = document.createElement('div');
        listRoadmap.id = 'admin-roadmap-list';
        listRoadmap.style.paddingBottom = '20px';
        container.appendChild(hr);
        container.appendChild(h4);
        container.appendChild(listRoadmap);
    }

    // --- КОНТРОЛЕН ПАНЕЛ (За режим "В Ремонт") ---
    let controlPanel = document.getElementById('admin-control-panel');
    if (!controlPanel) {
        controlPanel = document.createElement('div');
        controlPanel.id = 'admin-control-panel';
        controlPanel.style.cssText = "background:#fff3e0; padding:12px; margin-bottom:16px; border-radius:8px; border:1px solid #ffe0b2;";
        // Вмъкваме го най-отпред
        container.insertBefore(controlPanel, container.firstChild);
    }

    // Взимаме текущия статус от LocalStorage
    const isMaintenanceOn = localStorage.getItem('SOCIAL_MAINTENANCE_MODE') === 'TRUE';
    
    const statusText = isMaintenanceOn ? "АКТИВЕН (Спряно за хора)" : "НЕАКТИВЕН (Работи)";
    const statusColor = isMaintenanceOn ? "#f57c00" : "green"; 
    const btnText = isMaintenanceOn ? "ИЗКЛЮЧИ РЕМОНТА" : "ВКЛЮЧИ РЕМОНТА";
    const btnBg = isMaintenanceOn ? "#2e7d32" : "#f57c00"; 

    controlPanel.innerHTML = `
        <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#e65100;">🛠️ Режим "В Ремонт"</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:12px;">Статус: <b style="color:${statusColor}">${statusText}</b></div>
            <button id="btn-toggle-maintenance" style="background:${btnBg}; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:10px;">
                ${btnText}
            </button>
        </div>
    `;

    // --- ЛОГИКА НА БУТОНА ЗА ВКЛЮЧВАНЕ/ИЗКЛЮЧВАНЕ ---
    document.getElementById('btn-toggle-maintenance').onclick = async () => {
        const newStatus = !isMaintenanceOn;
        const msg = newStatus 
            ? "Включвате режим РЕМОНТ. Потребителите ще виждат 'Under Construction'." 
            : "Изключвате режим РЕМОНТ. Общността ще бъде достъпна.";
            
        if (confirm(msg)) {
            try {
                // Изпращаме към сървъра
                const response = await fetch(`${API_BASE_URL}admin/config`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ maintenance_mode: newStatus })
                });

                if (response.ok) {
                    // Запазваме локално за бързодействие
                    localStorage.setItem('SOCIAL_MAINTENANCE_MODE', newStatus ? 'TRUE' : 'FALSE');
                    alert("Успешно! Рестартирайте приложението, за да видите ефекта.");
                    location.reload();
                } else {
                    alert("Грешка при запис на сървъра.");
                }
            } catch (e) {
                console.error(e);
                alert("Няма връзка със сървъра.");
            }
        }
    };
    // ---------------------------------------------

    modal.classList.remove('hidden');
    modal.classList.add('active');
    
    // Показваме лоудъри докато зареждаме данните
    listSugg.innerHTML = '<div style="text-align:center;">Зареждане...</div>';
    listReports.innerHTML = '<div style="text-align:center;">Зареждане...</div>';
    listBanned.innerHTML = '<div style="text-align:center;">Зареждане...</div>';
    listRoadmap.innerHTML = '<div style="text-align:center;">Зареждане...</div>';
    
    try {
        // Теглим всички данни паралелно
        const [suggRes, banRes, repRes, roadRes] = await Promise.all([
            fetch(`${API_BASE_URL}social/suggestions`),
            fetch(`${API_BASE_URL}admin/banned_list`),
            fetch(`${API_BASE_URL}social/reports`),
            fetch(`${API_BASE_URL}roadmap/list`)
        ]);
        
        const suggestions = await suggRes.json();
        const bannedList = await banRes.json();
        const reports = await repRes.json();
        const roadmap = await roadRes.json();
        
        // --- 1. ПРЕДЛОЖЕНИЯ (Suggestions) ---
        listSugg.innerHTML = '';
        if (suggestions.length === 0) listSugg.innerHTML = '<div style="color:#999; font-style:italic;">Няма нови.</div>';
        else {
            suggestions.forEach(item => {
                const isBanned = bannedList.includes(item.userId);
                const banColor = isBanned ? 'green' : 'orange';
                const banText = isBanned ? 'UNBAN' : 'BAN';
                const banAction = isBanned ? 'UNBAN' : 'BAN';
                
                const div = document.createElement('div');
                div.style.cssText = 'background:white; padding:12px; margin-bottom:10px; border-radius:8px; border:1px solid #eee;';
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <div style="font-weight:bold; color:#333;">${item.author}</div>
                        <div style="display:flex; gap:6px;">
                            <button onclick="adminPublishSuggestion('${item.id}')" style="color:white; background:#2E7D32; border:none; border-radius:4px; font-size:10px; padding:3px 6px; cursor:pointer; font-weight:bold;">PUB</button>
                            <button onclick="adminBanUser('${item.userId}', '${banAction}')" style="color:${banColor}; border:1px solid ${banColor}; background:white; border-radius:4px; font-size:10px; padding:2px 6px; cursor:pointer;">${banText}</button>
                            <button onclick="adminDeleteSuggestion('${item.id}')" style="color:red; border:1px solid red; background:white; border-radius:4px; font-size:10px; padding:2px 6px; cursor:pointer;">X</button>
                        </div>
                    </div>
                    <div style="font-size:14px; white-space: pre-wrap;">
                         <span style="background:#eee; padding:1px 4px; border-radius:3px; font-size:9px; font-weight:bold; margin-right:4px;">${item.type || 'FEATURE'}</span>
                         ${item.text}
                    </div>
                    <div style="font-size:10px; color:#888; text-align:right; margin-top:6px;">${item.date_str}</div>
                `;
                listSugg.appendChild(div);
            });
        }
        
        // --- 2. АКТИВНИ РЕПОРТИ (Reports) ---
        listReports.innerHTML = '';
        if (reports.length === 0) listReports.innerHTML = '<div style="color:#999; font-style:italic;">Няма активни.</div>';
        else {
            reports.sort((a,b) => b.timestamp - a.timestamp);
            reports.forEach(r => {
                const isBanned = bannedList.includes(r.userId);
                const banColor = isBanned ? 'green' : 'orange';
                const banText = isBanned ? 'UNBAN' : 'BAN';
                const banAction = isBanned ? 'UNBAN' : 'BAN';
                
                const title = (REPORT_TYPES[r.type]?.label || r.type) + (r.tripId ? ` (${r.routeName || '?'})` : '');
                const timeAgo = Math.floor((Date.now() - r.timestamp) / 60000);

                const div = document.createElement('div');
                div.style.cssText = 'background:white; padding:12px; margin-bottom:10px; border-radius:8px; box-shadow:0 1px 2px rgba(0,0,0,0.1); border-left:4px solid ' + (REPORT_TYPES[r.type]?.color || '#999');
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:bold; font-size:13px;">${title}</span>
                        <span style="font-size:11px; color:#666;">${timeAgo}m ago</span>
                    </div>
                    <div style="font-size:12px; margin: 4px 0;"><b>${r.reporter}</b> (V: ${r.upvotes}/${r.downvotes})</div>
                    <div style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;">
                         <button onclick="goToReportLocation('${r.id}', ${r.lat}, ${r.lng}); closeAdminSuggestions();" style="color:#1976D2; border:1px solid #1976D2; background:white; border-radius:4px; font-size:10px; padding:2px 6px; cursor:pointer;">GO</button>
                         <button onclick="adminBanUser('${r.userId}', '${banAction}')" style="color:${banColor}; border:1px solid ${banColor}; background:white; border-radius:4px; font-size:10px; padding:2px 6px; cursor:pointer;">${banText}</button>
                         <button onclick="adminDeleteReport('${r.id}')" style="color:white; background:#d32f2f; border:none; border-radius:4px; font-size:10px; padding:2px 6px; cursor:pointer; font-weight:bold;">DEL</button>
                    </div>
                `;
                listReports.appendChild(div);
            });
        }
        
        // --- 3. БАННАТИ (Banned Users) ---
        listBanned.innerHTML = '';
        if (bannedList.length === 0) listBanned.innerHTML = '<div style="color:#999; font-style:italic;">Чисто.</div>';
        else {
            bannedList.forEach(userId => {
                let knownName = "Unknown";
                const foundSugg = suggestions.find(s => s.userId === userId);
                const foundRep = reports.find(r => r.userId === userId);
                if (foundSugg) knownName = foundSugg.author;
                else if (foundRep) knownName = foundRep.reporter;

                const div = document.createElement('div');
                div.style.cssText = 'background:#ffebee; padding:8px; margin-bottom:6px; border-radius:6px; border:1px solid #ffcdd2; display:flex; justify-content:space-between; align-items:center;';
                div.innerHTML = `
                    <div><b style="color:#d32f2f;">${knownName}</b> <span style="font-size:9px; color:#888;">${userId.substring(0,8)}...</span></div>
                    <button onclick="adminBanUser('${userId}', 'UNBAN')" style="background:#4CAF50; color:white; border:none; border-radius:4px; padding:4px 8px; font-weight:bold; cursor:pointer; font-size:10px;">UNBAN</button>
                `;
                listBanned.appendChild(div);
            });
        }

        // --- 4. ROADMAP (Published) ---
        listRoadmap.innerHTML = '';
        if (roadmap.length === 0) listRoadmap.innerHTML = '<div style="color:#999; font-style:italic;">Няма публични.</div>';
        else {
            roadmap.forEach(item => {
                const div = document.createElement('div');
                div.style.cssText = 'background:white; padding:10px; margin-bottom:8px; border-radius:8px; border-left:4px solid #6200ea; box-shadow:0 1px 2px rgba(0,0,0,0.1);';
                div.innerHTML = `
                    <div style="font-size:13px; font-weight:bold; margin-bottom:4px;">${item.text}</div>
                    <div style="font-size:11px; color:#666; display:flex; justify-content:space-between;">
                        <span>Votes: <b>${item.votes || 0}</b></span>
                        <button onclick="adminDeleteRoadmapItem('${item.id}')" style="color:red; background:none; border:none; font-weight:bold; cursor:pointer; font-size:10px;">DELETE</button>
                    </div>
                `;
                listRoadmap.appendChild(div);
            });
        }

    } catch (e) {
        console.error(e);
        listSugg.innerHTML = '<div style="color:red;">Грешка при връзката.</div>';
    }
}

async function checkGlobalConfig() {
    try {
        // Извикваме конфигурацията с уникален клейм, за да заобиколим кеша на браузъра
        const response = await fetch(`${API_BASE_URL}config?t=${Date.now()}`);
        if (!response.ok) return;
        const config = await response.json();

        // --- ФИКС: ЛОГИКА ЗА ВЕРСИЯТА (Handling NaN/Null) ---
        const serverVersion = parseInt(config.data_version) || 0;
        // Ако local_data_version липсва, Number() връща 0, което активира чистенето при първия старт на новия код
        const localVersion = Number(localStorage.getItem('local_data_version')) || 0;

        console.log(`Checking versions: Server(${serverVersion}) vs Local(${localVersion})`);

        if (serverVersion > localVersion) {
            console.log("Remote update detected! Forcing cache reset...");

            // Изтриваме всички кеширани спирки за всички езици
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('cached_all_stops_v2')) {
                    localStorage.removeItem(key);
                }
            });

            // Запазваме новата версия веднага
            localStorage.setItem('local_data_version', serverVersion);

            // ФОРСИРАНО ПРЕЗАРЕЖДАНЕ: Презареждаме сайта на чисто
            window.location.reload(true);
            return true; // Сигнал, че е стартирано презареждане
        }

        // --- ЛОГИКА ЗА MAINTENANCE И SOCIAL BUTTON ---
        const serverMaintenance = config.maintenance_mode ? 'TRUE' : 'FALSE';
        const localMaintenance = localStorage.getItem('SOCIAL_MAINTENANCE_MODE');
        if (serverMaintenance !== localMaintenance) {
            localStorage.setItem('SOCIAL_MAINTENANCE_MODE', serverMaintenance);
            const socialScreen = document.getElementById('screen-social');
            if (socialScreen && socialScreen.classList.contains('active')) {
                initSocialTab();
            }
        }

        const serverEnabled = config.social_enabled;
        if (typeof IS_SOCIAL_ENABLED !== 'undefined' && IS_SOCIAL_ENABLED !== serverEnabled) {
            IS_SOCIAL_ENABLED = serverEnabled;
            const btn = document.querySelector('.nav-item[data-target="screen-social"]');
            if (btn) btn.style.display = serverEnabled ? 'flex' : 'none';
        }

        return false;
    } catch (e) {
        console.warn("Global config check failed:", e);
        return false;
    }
}



window.adminPublishSuggestion = async function(id) {
    // Можеш да редактираш текста преди публикуване
    const text = prompt("Редактирай текста за публичния списък (или остави същия):");
    if (text === null) return;

    try {
        await fetch(`${API_BASE_URL}admin/publish_suggestion`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ suggestionId: id, text: text })
        });
        openAdminSuggestions(); // Рефреш
        alert("Публикувано!");
    } catch(e) { alert("Error"); }
};




window.adminDeleteSuggestion = async function(id) {
    if(!confirm("Изтриване на това предложение?")) return;
    try {
        await fetch(`${API_BASE_URL}admin/delete_suggestion`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ suggestionId: id })
        });
        openAdminSuggestions(); // Рефреш
    } catch(e) { alert("Error"); }
};

window.adminDeleteReport = async function(id) {
    if(!confirm("Изтриване на този сигнал? Той ще изчезне от картата на всички.")) return;
    try {
        await fetch(`${API_BASE_URL}admin/delete_report`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ reportId: id })
        });
        openAdminSuggestions(); // Рефреш на админ панела
        fetchReportsFromServer(); // Рефреш и на картата отзад
    } catch(e) { alert("Error"); }
};




// H. Функция за изпълнение на БАН
window.adminBanUser = async function(userId, action) {
    if (!userId || userId === 'undefined') {
        alert("Грешка: Няма User ID за този запис (може би е стар).");
        return;
    }
    
    if (!confirm(`Сигурни ли сте, че искате да ${action} този потребител?`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}admin/ban_action`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ targetUserId: userId, action: action })
        });
        
        if (response.ok) {
            openAdminSuggestions(); // Рефреш на списъка
        } else {
            alert("Грешка при операцията.");
        }
    } catch(e) { alert("Error connecting to server"); }
};


// H. Функция за изпълнение на БАН
window.adminBanUser = async function(userId, action) {
    if (!userId || userId === 'undefined') {
        alert("Грешка: Няма User ID за този запис (може би е стар).");
        return;
    }
    
    if (!confirm(`Сигурни ли сте, че искате да ${action} този потребител?`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}admin/ban_action`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ targetUserId: userId, action: action })
        });
        
        if (response.ok) {
            openAdminSuggestions(); // Рефреш на списъка
        } else {
            alert("Грешка при операцията.");
        }
    } catch(e) { alert("Error connecting to server"); }
};






window.closeAdminSuggestions = function() {
    const modal = document.getElementById('modal-admin-suggestions');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
};



function closeAdminSuggestions() {
    document.getElementById('modal-admin-suggestions').classList.add('hidden');
}


// --- ROADMAP & FEEDBACK LOGIC ---

let currentFeedbackType = 'FEATURE';

function openRoadmapModal() {
    const modal = document.getElementById('modal-roadmap');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
    
    // Зареждаме по подразбиране таб "Гласувай"
    switchRoadmapTab('vote');
}

function closeRoadmapModal() {
    const modal = document.getElementById('modal-roadmap');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
}

function switchRoadmapTab(tab) {
    // UI Update
    document.querySelectorAll('.roadmap-tab').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-roadmap-${tab}`).classList.add('active');
    
    document.querySelectorAll('.roadmap-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(`view-roadmap-${tab}`).classList.remove('hidden');

    if (tab === 'vote') {
        fetchRoadmapData();
    } else if (tab === 'sent') {
        fetchMySubmissions();
        
        // НОВО: Ако имаме непрочетени, маркираме ги като прочетени веднага
        if (unreadAdminCount > 0) {
            markAllAsRead();
        }
    }
}


// --- LOGIC FOR UNREAD MESSAGES & BADGES ---

async function checkUnreadMessages() {
    if (!appUserId) return;

    try {
        // Използваме съществуващия endpoint, за да вземем нашите съобщения
        const response = await fetch(`${API_BASE_URL}social/my_submissions/${appUserId}`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        let count = 0;
        
        // Броим: Колко replies имат (isAdmin == true) И (isRead == false или липсва)
        data.forEach(item => {
            if (item.replies) {
                item.replies.forEach(reply => {
                    // Ако е от Админ и не е прочетено -> +1
                    if (reply.isAdmin === true && reply.isRead === false) {
                        count++;
                    }
                });
            }
        });

        unreadAdminCount = count;
        updateBadgesUI();

    } catch (e) {
        console.error("Unread check failed", e);
    }
}

function updateBadgesUI() {
    // Взимаме елементите от HTML-а
    const badgeNav = document.getElementById('badge-nav-social');
    const badgeBtn = document.getElementById('badge-btn-roadmap');
    const badgeTab = document.getElementById('badge-tab-sent');

    const text = unreadAdminCount > 9 ? '9+' : unreadAdminCount.toString();
    // Ако е 0, крием баджа (слагаме клас hidden)
    const shouldHide = unreadAdminCount === 0;

    // 1. Обновяваме Навигацията (долу)
    if (badgeNav) {
        badgeNav.textContent = text;
        if (shouldHide) badgeNav.classList.add('hidden');
        else badgeNav.classList.remove('hidden');
    }

    // 2. Обновяваме Големия Бутон (в екрана)
    if (badgeBtn) {
        badgeBtn.textContent = text;
        if (shouldHide) badgeBtn.classList.add('hidden');
        else badgeBtn.classList.remove('hidden');
    }

    // 3. Обновяваме Таба (в модала)
    if (badgeTab) {
        badgeTab.textContent = text;
        if (shouldHide) badgeTab.classList.add('hidden');
        else badgeTab.classList.remove('hidden');
    }
}

async function markAllAsRead() {
    // Нулираме локално веднага, за да изчезнат кръгчетата мигновено
    unreadAdminCount = 0;
    updateBadgesUI();

    try {
        // Казваме на сървъра
        await fetch(`${API_BASE_URL}social/mark_read`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: appUserId })
        });
    } catch (e) {
        console.error("Mark read failed", e);
    }
}


function setFeedbackType(type) {
    currentFeedbackType = type;
    document.querySelectorAll('.feedback-type-opt').forEach(el => el.classList.remove('active'));
    if(type === 'FEATURE') document.getElementById('opt-feature').classList.add('active');
    else document.getElementById('opt-bug').classList.add('active');
}


let currentRoadmapSort = 'VOTES'; // 'VOTES' or 'DATE'

function setRoadmapSort(type) {
    currentRoadmapSort = type;
    document.getElementById('sort-votes').classList.toggle('active', type === 'VOTES');
    document.getElementById('sort-date').classList.toggle('active', type === 'DATE');
    fetchRoadmapData(); // Презареждаме с новия сорт
}

// В script.js -> замени fetchRoadmapData с това:

async function fetchRoadmapData() {
    const list = document.getElementById('roadmap-list-container');
    list.innerHTML = `<div style="text-align:center; padding:20px;">${t('feed_loading')}</div>`;
    
    try {
        const response = await fetch(`${API_BASE_URL}roadmap/list`);
        const data = await response.json();
        
        list.innerHTML = '';
        if (data.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:30px; color:#888;">No data.</div>';
            return;
        }

        if (currentRoadmapSort === 'VOTES') {
            data.sort((a,b) => (b.votes || 0) - (a.votes || 0));
        } else {
            data.sort((a,b) => b.timestamp - a.timestamp);
        }

        data.forEach(item => {
            const hasVoted = item.voters && item.voters.includes(appUserId);
            const dateOnly = item.date_str ? item.date_str.substring(0, 10) : "N/A";

            // ПРЕВОД НА СТАТУСА
            const statusBadge = item.status === 'DONE' 
                ? `<span style="background:#E8F5E9; color:#2E7D32; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:bold;">${t('status_done')}</span>` 
                : '';

            const div = document.createElement('div');
            div.className = 'roadmap-item';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
                    <div style="font-weight:bold; font-size:15px; color:var(--on-surface); line-height:1.3;">${item.text}</div>
                    ${statusBadge}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    
                    <!-- ПРЕВОД НА 'ДАТА' -->
                    <div style="font-size:11px; color:#888;">${t('txt_date')}: <b>${dateOnly}</b></div>
                    
                    <button class="roadmap-vote-btn ${hasVoted ? 'voted' : ''}" onclick="voteForRoadmapItem('${item.id}', this)">
                        <span class="material-icons-round" style="font-size:16px;">arrow_upward</span>
                        <span class="vote-count">${item.votes || 0}</span>
                    </button>
                </div>
            `;
            list.appendChild(div);
        });

    } catch (e) { console.error(e); }
}


async function voteForRoadmapItem(itemId, btn) {
    if (btn.classList.contains('voted')) return; // Вече гласувал
    
    // UI Optimistic update
    btn.classList.add('voted');
    const countSpan = btn.querySelector('.vote-count');
    countSpan.textContent = parseInt(countSpan.textContent) + 1;

    try {
        await fetch(`${API_BASE_URL}roadmap/vote`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ itemId: itemId, userId: appUserId })
        });
    } catch (e) { console.error(e); }
}

async function submitFeedbackForm() {
    const text = document.getElementById('feedback-input').value.trim();
    if (text.length < 5) {
        alert(t('alert_short_text'));
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}feedback/submit`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                text: text,
                type: currentFeedbackType, // 'FEATURE' or 'BUG'
                author: currentUserNick || 'Anonymous',
                userId: appUserId
            })
        });

        // Тук response вече съществува
        if (response.status === 403) {
            alert(t('alert_banned'));
            return;
        }

        if (response.ok) {
            alert(t('alert_feedback_success'));
            document.getElementById('feedback-input').value = '';
            closeRoadmapModal();
        } else {
            alert(t('alert_feedback_fail'));
        }
    } catch (e) {
        console.error(e);
        alert(t('alert_no_connection'));
    }
}

// ... (Целият ти останал код е тук) ...


// --- ГЛОБАЛЕН ПУЛС (HEARTBEAT) ---
let globalTicker = 0;

// --- ГЛОБАЛЕН ПУЛС (HEARTBEAT) ---
// 2. ЗАБРАНА В ГЛОБАЛНИЯ ПУЛС (startGlobalHeartbeat)
function startGlobalHeartbeat() {
    if (window.appHeartbeatInterval) return;

    fetchReportsFromServer();
    checkUnreadMessages();

    window.appHeartbeatInterval = setInterval(() => {
        if (localStorage.getItem('SOCIAL_MAINTENANCE_MODE') === 'TRUE') return;

        fetchReportsFromServer();
        checkUnreadMessages();
        
        // --- ПРОМЯНАТА Е ТУК ---
        // Викаме локация само ако НЕ сме гост (няма track в URL)
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('track') && !isSharedTrackingActive && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }; },
                (err) => {}, { maximumAge: 10000, timeout: 2000 }
            );
        }
    }, 5000);
}

// ==========================================
// INIT APP (СЛОЖИ ТОВА НАЙ-ДОЛУ)
// ==========================================

// --- ФИНАЛЕН БЛОК ЗА СТАРТИРАНЕ ---
let isAppInitialized = false; // Глобален флаг



async function initApp() {
    // 1. ПЪРВО ПРОВЕРЯВАМЕ КОНФИГУРАЦИЯТА ЗА ДИСТАНЦИОННО ЧИСТЕНЕ НА КЕША
    // Използваме await, за да спрем изпълнението, докато не разберем дали версията е актуална
    const isReloading = await checkGlobalConfig();
    if (isReloading) return; // Ако страницата се презарежда, спираме изпълнението на стария код

    // 2. ПРОВЕРКА ЗА ДУБЛИРАНО ИНИЦИАЛИЗИРАНЕ
    if (isAppInitialized) return;
    isAppInitialized = true;

    const urlParams = new URLSearchParams(window.location.search);
    const isSharedLink = urlParams.has('track');

    // 3. ИНИЦИАЛИЗАЦИЯ НА КАРТАТА И СИСТЕМИТЕ
    if (!map) initMap(); 
    initParkingSystem();

    // --- ЛОГИКА ЗА ИЗТРИВАНЕ НА АЛАРМИ САМО ПРИ "КИЛВАНЕ" ---
    if (!sessionStorage.getItem('is_session_alive')) {
        console.log(">>> Fresh start detected (App was killed). Clearing alarms.");
        localStorage.removeItem('active_alarms_web');
        activeAlarms = [];
        sessionStorage.setItem('is_session_alive', 'true');
    } else {
        console.log(">>> Session resumed. Alarms kept.");
    }

    if (activeAlarms.length > 0) {
        activateWakeLock();
    }

    // 4. ВЪЗСТАНОВЯВАНЕ НА СЛОЕВЕТЕ (Трафик и Радар)
    if (isTrafficActive && typeof trafficLayer !== 'undefined') {
        trafficLayer.addTo(map);
        const tBtn = document.getElementById('btn-traffic');
        if(tBtn) tBtn.classList.add('active');
    }

    if (isRadarActive) {
        const rBtn = document.getElementById('btn-live-radar');
        if(rBtn) rBtn.classList.add('active');
        fetchGlobalRadarVehicles();
        if (radarTimer) clearInterval(radarTimer);
        radarTimer = setInterval(fetchGlobalRadarVehicles, 2000);
    }

    // 5. ВИЗУАЛНА ПОДГОТОВКА (Махане на лоудъра)
    const loader = document.getElementById('app-loader');
    if (loader) loader.style.display = 'none';

    // 6. ОСНОВНИ НАСТРОЙКИ И СЛУШАТЕЛИ
    try {
        verifyUserStatus();   
        ensureAutoNickname(); 
        applyTheme(currentTheme);
        applyLanguage();
        setupSettings();
        
        if (typeof initFavoritePlaces === 'function') initFavoritePlaces();
        setupNavigation();
        
        if (typeof setupSearchUI === 'function') setupSearchUI();
        if (typeof initPhotonSearch === 'function') initPhotonSearch();
        if (typeof setupFavoritesSearch === 'function') setupFavoritesSearch();
        if (typeof setupActionListeners === 'function') setupActionListeners();
        if (typeof setupSwipeGestures === 'function') setupSwipeGestures();
        if (typeof setupLineModalDrag === 'function') setupLineModalDrag();
        
        setupFavMenuListeners(); 
        updateTimeIconState();
        startGlobalHeartbeat(); 

        if (typeof setupRadarButton === 'function') setupRadarButton();
        if (typeof setupTrafficButton === 'function') setupTrafficButton();
        if (typeof initLinesTab === 'function') initLinesTab();
        if (typeof initFilterUI === 'function') initFilterUI(); 
        if (typeof initTimetable === 'function') initTimetable();
        if (typeof initRoutesSheet === 'function') initRoutesSheet(); 
        if (typeof initCustomStopsUI === 'function') initCustomStopsUI();

        document.querySelectorAll('#app-version-display').forEach(el => el.textContent = APP_VERSION);

        // 7. ЛОГИКА ПРИ ЗАРЕЖДАНЕ НА ДАННИТЕ (СЛЕД ВЕРСИЯТА)
        fetchAllStops().then(async () => {
            console.log("Stops loaded successfully.");

            // А. Споделен линк
            await handleSharedTrackingLink(); 

            // Б. Възстановяване на филтрираните линии
            if (mapFilters.specificLines && mapFilters.specificLines.length > 0) {
                setTimeout(() => {
                    syncSpecificLinesToRoutes();
                }, 1000); 
            }

            // В. Новина/Промяна
            if (typeof checkUrlForNews === 'function') checkUrlForNews();

            // Г. Changelog и Auto-Locate
            const isNewsLink = urlParams.has('news_url');
            if (!isSharedLink && !isNewsLink) {
                if (typeof checkAndShowChangelog === 'function') checkAndShowChangelog();
                if (isAutoLocateEnabled) setTimeout(triggerAutoLocation, 1000);
            }

            // Д. Навигация към началния екран
            if (!isSharedLink && !isNewsLink) {
                const targetBtn = document.querySelector(`.nav-item[data-target="${startScreen}"]`);
                if (targetBtn) {
                    targetBtn.click();
                } else {
                    const mapBtn = document.querySelector('[data-target="screen-map"]');
                    if (mapBtn) mapBtn.click();
                }
            } else if (isSharedLink) {
                const mapBtn = document.querySelector('[data-target="screen-map"]');
                if (mapBtn) mapBtn.click();
            } else if (isNewsLink) {
                const socialBtn = document.querySelector('[data-target="screen-social"]');
                if (socialBtn) socialBtn.click();
            }
        });

    } catch (criticalError) {
        console.error("CRITICAL INIT ERROR:", criticalError);
    }

    // 8. РЕСТАРТИРАНЕ НА АКТИВНИ ПРОЦЕСИ
    if (activeAlarms.length > 0) {
        console.log(">>> Restoring active alarms...");
        startBackgroundMode(); 
        checkActiveAlarmsLoop();
    }
}

// Стартиране
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}



// --- ЛОГИКА ЗА ТАБ "ИЗПРАТЕНИ" (Chat) ---

async function fetchMySubmissions() {
    const container = document.getElementById('roadmap-sent-container');
    container.innerHTML = `<div style="text-align:center; padding:20px;">${t('loading')}</div>`;
    
    try {
        // Използваме appUserId (генерираното ID на браузъра)
        const response = await fetch(`${API_BASE_URL}social/my_submissions/${appUserId}`);
        const data = await response.json();
        
        container.innerHTML = '';
        if (!data || data.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:#888;">${t('no_favorites')}</div>`; // Ползваме generic "Nqma"
            return;
        }
        
        data.forEach(item => {
            renderSentItem(item, container);
        });
        
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="color:red; text-align:center;">Грешка при зареждане.</div>';
    }
}

function renderSentItem(item, container) {
    const card = document.createElement('div');
    card.className = 'sent-item-card';
    
    const typeColor = (item.type === 'BUG') ? '#D32F2F' : '#1976D2';
    const typeLabel = item.type || 'FEEDBACK';
    
    // 1. HEADER
    let html = `
        <div class="sent-card-header">
            <span style="background:${typeColor}22; color:${typeColor}; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px;">${typeLabel}</span>
            <span style="font-size:10px; color:#888;">${item.date_str || ''}</span>
        </div>
        <div style="font-weight:500; font-size:14px; margin-bottom:12px; color:var(--on-surface);">
            ${item.text}
        </div>
    `;
    
    // 2. CHAT HISTORY (Replies)
    if (item.replies && item.replies.length > 0) {
        html += `<div class="chat-container">`;
        // Сортираме по време
        item.replies.sort((a,b) => a.timestamp - b.timestamp);
        
        item.replies.forEach(reply => {
            const isAdmin = reply.isAdmin;
            const alignClass = isAdmin ? 'chat-left' : 'chat-right';
            const bubbleClass = isAdmin ? 'bubble-admin' : 'bubble-user';
            const label = isAdmin ? t('roadmap_admin_label') : t('roadmap_you_label');
            
            html += `
                <div class="chat-row ${alignClass}">
                    <div class="chat-bubble ${bubbleClass}">
                        <div class="chat-label">${label}</div>
                        <div class="chat-text">${reply.text}</div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    
    // 3. REPLY INPUT
    html += `
        <div class="reply-input-row">
            <input type="text" class="reply-input" placeholder="${t('roadmap_reply_hint')}" id="reply-input-${item.id}">
            <button class="reply-send-btn" onclick="sendUserReply('${item.id}')">
                <span class="material-icons-round">send</span>
            </button>
        </div>
    `;
    
    card.innerHTML = html;
    container.appendChild(card);
}

async function sendUserReply(suggestionId) {
    const input = document.getElementById(`reply-input-${suggestionId}`);
    const text = input.value.trim();
    if (!text) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}feedback/reply`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                suggestionId: suggestionId,
                text: text,
                author: currentUserNick || 'WebUser',
                userId: appUserId,
                isAdmin: false // Потребителски отговор
            })
        });
        
        if (response.ok) {
            input.value = '';
            fetchMySubmissions(); // Рефреш за да се види новото съобщение
        } else {
            alert("Error sending reply");
        }
    } catch (e) {
        console.error(e);
    }
}


function openSheet(id) {
    const sheet = document.getElementById(id);
    if(sheet) {
        sheet.classList.remove('hidden');
        requestAnimationFrame(() => sheet.style.transform = 'translateY(0)');
        
        // Ако е About sheet-а, обновяваме версията вътре
        if(id === 'sheet-about') {
            document.getElementById('about-version-display').textContent = APP_VERSION;
        }
    }
}

function closeSheet(id) {
    const sheet = document.getElementById(id);
    if(sheet) {
        sheet.style.transform = '';
        setTimeout(() => sheet.classList.add('hidden'), 300);
    }
}



window.shareLiveRide = async function() {
    if (!rideAlongState.active || !rideAlongState.tripId) return;

    // 1. Подготовка на линка
    const baseUrl = window.location.origin + window.location.pathname;
    let shareUrl = `${baseUrl}?track=${rideAlongState.tripId}`;
    
    // 2. Взимаме основни данни за линията
    const lineName = rideAlongState.routeDetails ? rideAlongState.routeDetails.routeName : "";
    const typeName = getTransportTypeName(rideAlongState.routeDetails.type);
    
    // 3. Логика за пинната спирка (крайна цел)
    let message = "";
    const pinnedId = rideAlongState.pinnedStopId;
    
    if (pinnedId) {
        // Добавяме спирката в линка
        shareUrl += `&stop=${pinnedId}`;
        
        // Взимаме името на спирката и ETA (времето)
        const stopObj = rideAlongState.stops.find(s => s.stop_id == pinnedId);
        const stopName = stopObj ? stopObj.stop_name : "...";
        const eta = rideAlongState.cachedRealTimes.get(pinnedId) || 0;

        // Сглобяваме пълното съобщение
        message = t('share_ride_msg_full')
            .replace("%1$s", typeName)
            .replace("%2$s", lineName)
            .replace("%3$s", stopName)
            .replace("%4$d", eta)
            .replace("%5$s", shareUrl);
    } else {
        // Сглобяваме простото съобщение (без спирка)
        message = t('share_ride_msg_simple')
            .replace("%1$s", typeName)
            .replace("%2$s", lineName)
            .replace("%3$s", shareUrl);
    }

    // 4. Споделяне
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Sofia Yrd Maps Live',
                text: message
                // При Web Share API текстът и URL често се сливат, 
                // но тук го пращаме като единен текст за по-добра съвместимост
            });
        } catch (err) {
            console.log('Share failed:', err);
        }
    } else {
        // Fallback: Копиране в клипборда
        try {
            await navigator.clipboard.writeText(message);
            alert(t('link_copied'));
        } catch (err) {
            prompt("Copy link:", message);
        }
    }
};


// --- GENERIC MODAL LOGIC (За Помощ и Инфо) ---

function openGenericModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => modal.classList.add('active'));
        
        // --- ПРОМЯНАТА: Слушаме за новото ID "modal-about" ---
        if(id === 'modal-about') {
            const verEl = document.getElementById('about-version-display');
            if (verEl) verEl.textContent = APP_VERSION;
        }
    }
}


function closeGenericModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}




// ==========================================
// 1:1 ANDROID PORT: ARRIVAL ALARM SYSTEM
// ==========================================


// --- 1. НАЧАЛО (ОТВАРЯНЕ НА ДИАЛОГА) ---
// --- 1. ОТВАРЯНЕ НА WIZARD (С опция за прескачане на стъпка 1) ---
function openAlarmWizard(stopId, preSelectedArrival = null) {
    const stop = allStopsData.find(s => s.stop_id === stopId);
    if (!stop) return;

    const listContainer = document.getElementById('alarm-wizard-content');
    listContainer.innerHTML = '<div style="text-align:center; padding:20px;">Зареждане на линии...</div>';
    
    document.getElementById('modal-alarm-wizard').classList.remove('hidden');
    document.getElementById('modal-alarm-wizard').classList.add('active');
    
    document.getElementById('btn-alarm-cancel').onclick = closeAlarmWizard;

    // Винаги теглим данните, защото ни трябват за изчисленията в Стъпка 4
    fetch(`${API_BASE_URL}vehicles_for_stop/${stopId}`, { headers: { 'Accept-Language': currentLanguage } })
        .then(r => r.json())
        .then(data => {
            const uniqueRoutes = [];
            const seen = new Set();
            
            // Ако сме подали предварително избрана линия, я добавяме ръчно в сет-а,
            // за да сме сигурни, че я има, дори API-то да не я върне веднага (ако е по разписание)
            if (preSelectedArrival) {
                // Уверяваме се, че обектът има нужните полета
                if (!data.find(d => d.route_name === preSelectedArrival.route_name)) {
                     // Ако я няма в live данните, я добавяме фиктивно, за да работи UI-а
                     data.push(preSelectedArrival); 
                }
            }

            data.forEach(arr => {
                if (!seen.has(arr.route_name)) {
                    seen.add(arr.route_name);
                    uniqueRoutes.push(arr);
                }
            });
            
            uniqueRoutes.sort((a,b) => {
                const nA = parseInt(a.route_name.replace(/\D/g, '')) || 999;
                const nB = parseInt(b.route_name.replace(/\D/g, '')) || 999;
                return nA - nB;
            });

            // --- ТУК Е МАГИЯТА ЗА ПРЕСКАЧАНЕ ---
            let initialStep = 1;
            let routeObj = null;

            if (preSelectedArrival) {
                // Намираме обекта от списъка (или ползваме подадения)
                routeObj = uniqueRoutes.find(r => r.route_name === preSelectedArrival.route_name) || preSelectedArrival;
                initialStep = 2; // Директно на стъпка 2
            }

            alarmWizardState = {
                step: initialStep, 
                stop: stop,
                arrivals: data, 
                selectedRoute: routeObj, // Вече е избрано
                bufferMinutes: 10,
                mode: 'NEXT_COURSE',
                editingAlarm: null
            };
            
            renderAlarmWizard(uniqueRoutes);
        })
        .catch(e => {
            console.error(e);
            listContainer.innerHTML = '<div style="color:red; text-align:center;">Грешка при зареждане.</div>';
        });
}




function closeAlarmWizard() {
    document.getElementById('modal-alarm-wizard').classList.remove('active');
    setTimeout(() => document.getElementById('modal-alarm-wizard').classList.add('hidden'), 200);
}

// --- 2. RENDER WIZARD STEPS ---
// --- 2. RENDER WIZARD STEPS (UPDATED WITH SCHEDULE FALLBACK) ---
function renderAlarmWizard(uniqueRoutesForStep1 = []) {
    const content = document.getElementById('alarm-wizard-content');
    const title = document.getElementById('alarm-wizard-title');
    const subtitle = document.getElementById('alarm-wizard-subtitle');
    const footer = document.querySelector('#modal-alarm-wizard .btn-close-modal').parentElement;
    
    // Чистене на стари бутони
    const oldBtns = footer.querySelectorAll('.wizard-nav-btn');
    oldBtns.forEach(btn => btn.remove());

    const defaultCancel = document.getElementById('btn-alarm-cancel');
    if(defaultCancel) {
        defaultCancel.style.display = (alarmWizardState.step === 1) ? 'block' : 'none';
        defaultCancel.innerText = t('cancel'); 
    }

    content.innerHTML = '';

    // ============================================================
    // СТЪПКА 1 (Списък линии + АКТИВНИ АЛАРМИ)
    // ============================================================
    if (alarmWizardState.step === 1) {
        title.textContent = alarmWizardState.stop.stop_name;
        subtitle.textContent = t('wizard_select_line'); 

        const stopAlarms = activeAlarms.filter(a => a.stopId === alarmWizardState.stop.stop_id);
        
        if (stopAlarms.length > 0) {
            content.innerHTML += `<div style="font-size:12px; font-weight:bold; color:gray; margin-bottom:8px;">${t('wizard_active_label')}</div>`;
            
            stopAlarms.forEach(alarm => {
                const div = document.createElement('div');
                div.className = 'active-alarm-badge'; 
                div.style.flexDirection = 'column';
                div.style.alignItems = 'stretch';
                div.style.gap = '6px';
                
                const now = new Date();
                let arrivalTimeStr = "--:--";
                let triggerTimeStr = "--:--";
                let extraInfo = ""; 
                let isSchedule = false; 
                let isLive = false;     

                // Взимаме данните за тази линия от заредените в Wizard-а
                const routeArrivals = alarmWizardState.arrivals.filter(v => v.route_name === alarm.routeName);
                let targetVehicle = null;

                // --- ТУК Е ПОПРАВКАТА: УМНАТА ЛОГИКА ---
                if (alarm.mode === 'NEXT_COURSE') {
                    // 1. Махаме игнорирания
                    let candidates = routeArrivals.filter(v => v.trip_id !== alarm.initialTripIdToIgnore);
                    // 2. Сортираме по време
                    candidates.sort((a, b) => a.eta_minutes - b.eta_minutes);
                    // 3. Търсим GPS приоритет
                    targetVehicle = candidates.find(v => v.prediction_source === 'official') || candidates[0];
                } else {
                    // SPECIFIC_TIME: Търсим най-близкия по час
                    const candidates = routeArrivals.map(v => {
                        const busTime = new Date(now.getTime() + v.eta_minutes * 60000);
                        const [targetH, targetM] = alarm.plannedArrivalTime.split(':').map(Number);
                        const targetDate = new Date(now);
                        targetDate.setHours(targetH, targetM, 0, 0);
                        
                        if (targetDate < new Date(now.getTime() - 12 * 60 * 60 * 1000)) {
                            targetDate.setDate(targetDate.getDate() + 1);
                        }
                        
                        const diff = Math.abs((busTime - targetDate) / 60000);
                        return { v, diff };
                    });

                    candidates.sort((a, b) => a.diff - b.diff);

                    if (candidates.length > 0 && candidates[0].diff <= 20) {
                        targetVehicle = candidates[0].v;
                    }
                }
                // ----------------------------------------

                if (targetVehicle) {
                    // ИМАМЕ ЖИВ АВТОБУС (ЗЕЛЕНО)
                    isLive = true;
                    // Ако е official -> GPS (зелено), иначе е schedule (сиво с надпис разп.)
                    const isOfficial = targetVehicle.prediction_source === 'official';
                    isSchedule = !isOfficial; 
                    
                    const etaMin = targetVehicle.eta_minutes;
                    const arrDate = new Date(now.getTime() + etaMin * 60000);
                    arrivalTimeStr = formatHHMM(arrDate);
                    
                    const trigDate = new Date(arrDate.getTime() - alarm.bufferMinutes * 60000);
                    triggerTimeStr = formatHHMM(trigDate);
                    
                    extraInfo = `(${etaMin} ${t('time_min')})`;
                } 
                else {
                    // НЯМА ЖИВ АВТОБУС -> ПОЛЗВАМЕ ЗАПИСАНОТО РАЗПИСАНИЕ (СИВО)
                    if (alarm.plannedArrivalTime && alarm.plannedArrivalTime !== "??:??") {
                        isLive = false;
                        isSchedule = true; 
                        
                        arrivalTimeStr = alarm.plannedArrivalTime;
                        
                        const [h, m] = arrivalTimeStr.split(':').map(Number);
                        const arrDate = new Date(); arrDate.setHours(h, m, 0, 0);
                        
                        if (arrDate < new Date(now.getTime() - 2*60*60*1000)) arrDate.setDate(arrDate.getDate() + 1);

                        const trigDate = new Date(arrDate.getTime() - alarm.bufferMinutes * 60000);
                        triggerTimeStr = formatHHMM(trigDate);
                    } else {
                        arrivalTimeStr = "...";
                        triggerTimeStr = "...";
                    }
                }

                // Цветове и текстове
                // Ако е Live и е Official -> Зелено (#2e7d32)
                // Ако е Live но е Schedule -> Сиво (gray)
                // Ако е Static Schedule -> Сиво (gray) или Черно (black)
                const arrColor = (isLive && !isSchedule) ? '#2e7d32' : 'gray';
                const schedHint = isSchedule ? t('alarm_scheduled_hint') : "";

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:4px; margin-bottom:2px;">
                        <div style="font-weight:bold; font-size:15px; color:#1C75BC;">${alarm.routeName}</div>
                        
                        <div style="display:flex; gap:8px;">
                            <button class="icon-btn-small" onclick="openEditAlarmBuffer('${alarm.stopId}', '${alarm.routeName}', ${alarm.bufferMinutes})">
                                <span class="material-icons-round" style="font-size:18px;">edit</span>
                            </button>
                            <button class="icon-btn-small" style="color:red;" onclick="deleteAlarm('${alarm.stopId}', '${alarm.routeName}')">
                                <span class="material-icons-round" style="font-size:18px;">delete</span>
                            </button>
                        </div>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="material-icons-round" style="font-size:14px; color:var(--primary);">directions_bus</span>
                            <span style="color:gray;">${t('alarm_arrival_label')}</span>
                            <span style="font-weight:bold; color:${arrColor}; font-size:13px;">
                                ${arrivalTimeStr} <span style="font-size:11px; font-weight:normal; color:#555;">${extraInfo} ${schedHint}</span>
                            </span>
                        </div>
                        
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="material-icons-round" style="font-size:14px; color:#e65100;">notifications_active</span>
                            <span style="color:gray;">${t('alarm_trigger_label')}</span>
                            <span style="font-weight:bold; font-size:13px;">${triggerTimeStr}</span>
                            <span style="color:#888; font-size:11px;">(${alarm.bufferMinutes} ${t('time_min')})</span>
                        </div>
                    </div>
                `;
                content.appendChild(div);
            });
            content.appendChild(document.createElement('hr'));
        }

        if (uniqueRoutesForStep1.length === 0) {
            content.innerHTML += `<div style="text-align:center; padding:20px; color:gray;">${t('wizard_no_lines')}</div>`;
            return;
        }

        uniqueRoutesForStep1.forEach(line => {
            if (stopAlarms.some(a => a.routeName === line.route_name)) return; 

            const div = document.createElement('div');
            div.className = 'alarm-line-card';
            const color = getTransportColor(line.route_type, line.route_name);
            
            div.innerHTML = `
                <span class="material-icons-round" style="color:${color}; margin-right:12px;">directions_bus</span>
                <div>
                    <div style="font-weight:bold; font-size:16px;">${line.route_name}</div>
                    <div style="font-size:12px; color:gray;">${t('to_label')} ${line.destination}</div>
                </div>
                <span class="material-icons-round" style="margin-left:auto; color:gray;">chevron_right</span>
            `;
            div.onclick = () => {
                alarmWizardState.selectedRoute = line;
                alarmWizardState.step = 2;
                renderAlarmWizard();
            };
            content.appendChild(div);
        });
    }

    // --- СТЪПКА 2 (БУФЕР) ---
    else if (alarmWizardState.step === 2) {
        const lineLabel = t('line_label');
        title.textContent = `${lineLabel} ${alarmWizardState.selectedRoute.route_name}`;
        subtitle.textContent = t('wizard_time_to_stop');
        content.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; margin-bottom:10px; margin-top:20px;">
                <input type="number" id="alarm-buffer-input" class="alarm-input" value="${alarmWizardState.bufferMinutes}" inputmode="numeric" pattern="[0-9]*" style="text-align:center; font-size:24px; width:80px; margin:0;">
                <span style="font-size:18px; margin-left:8px;">${t('time_min')}</span>
            </div>
            <div style="font-size:12px; color:gray; text-align:center; padding:0 20px;">${t('wizard_buffer_expl')}</div>`;
        addNavBtn(t('btn_back'), () => { alarmWizardState.step = 1; openAlarmWizard(alarmWizardState.stop.stop_id); }, false);
        addNavBtn(t('btn_continue'), () => {
            const val = document.getElementById('alarm-buffer-input').value;
            if (val && !isNaN(val) && val > 0) { alarmWizardState.bufferMinutes = parseInt(val); alarmWizardState.step = 3; renderAlarmWizard(); } 
            else { alert(t('error_valid_number')); }
        }, true);
    }
    // --- СТЪПКА 3 (РЕЖИМ) ---
    else if (alarmWizardState.step === 3) {
        title.textContent = t('wizard_choose_mode');
        subtitle.textContent = t('wizard_mode_subtitle').replace('%d', alarmWizardState.bufferMinutes);
        content.innerHTML = `
            <div class="alarm-option-btn" onclick="goToStep4('NEXT_FEW')"><span class="material-icons-round" style="color:var(--primary);">format_list_numbered</span><div><div style="font-weight:bold;">${t('mode_recent_title')}</div><div style="font-size:11px; color:gray;">${t('mode_recent_desc')}</div></div><span class="material-icons-round" style="margin-left:auto; color:gray;">chevron_right</span></div>
            <div style="text-align:center; margin:8px; color:gray; font-size:12px;">${t('txt_or')}</div>
            <div class="alarm-option-btn" onclick="goToStep4('ALL_DAY')"><span class="material-icons-round" style="color:var(--primary);">schedule</span><div><div style="font-weight:bold;">${t('mode_all_title')}</div><div style="font-size:11px; color:gray;">${t('mode_all_desc')}</div></div><span class="material-icons-round" style="margin-left:auto; color:gray;">chevron_right</span></div>`;
        window.goToStep4 = (viewMode) => { alarmWizardState.viewMode = viewMode; alarmWizardState.step = 4; renderAlarmWizard(); };
        addNavBtn(t('btn_back'), () => { alarmWizardState.step = 2; renderAlarmWizard(); }, false);
    }
    // --- СТЪПКА 4 (СПИСЪК ЧАСОВЕ) ---
    else if (alarmWizardState.step === 4) {
        if (alarmWizardState.viewMode === 'NEXT_FEW') { title.textContent = t('wizard_screen_recent'); subtitle.textContent = t('wizard_sub_recent'); } 
        else { title.textContent = t('wizard_screen_all'); subtitle.textContent = t('wizard_sub_all'); }
        content.innerHTML = `<div style="text-align:center; padding:20px;">${t('searching_courses')}</div>`;
        fetchCoursesAroundTime().then(courses => {
            content.innerHTML = '';
            if (courses.length === 0) { content.innerHTML = `<div style="padding:20px; text-align:center; color:red;">${t('no_suitable_courses')}</div>`; } 
            else {
                const listDiv = document.createElement('div'); listDiv.className = 'time-grid-container';
                let displayCourses = (alarmWizardState.viewMode === 'NEXT_FEW') ? courses.slice(0, 3) : courses;
                displayCourses.forEach(timeStr => {
                    const isGps = timeStr.includes("(GPS)"); const cleanTime = timeStr.replace("(GPS)", "").trim();
                    const btn = document.createElement('div'); btn.className = `time-choice-btn ${isGps ? 'gps' : ''}`;
                    btn.innerHTML = `<span style="font-size:16px; font-weight:bold;">${cleanTime}</span>${isGps ? '<span class="material-icons-round" style="font-size:16px;">rss_feed</span>' : ''}`;
                    btn.onclick = () => saveAlarmSetup('SPECIFIC_TIME', cleanTime);
                    listDiv.appendChild(btn);
                });
                content.appendChild(listDiv);
            }
        });
        addNavBtn(t('btn_back'), () => { alarmWizardState.step = 3; renderAlarmWizard(); }, false);
    }

    function addNavBtn(text, onClick, isPrimary) {
        const btn = document.createElement('button'); btn.innerText = text; btn.onclick = onClick;
        btn.className = isPrimary ? 'route-action-btn go wizard-nav-btn' : 'wizard-nav-btn';
        if (!isPrimary) {
            btn.style.backgroundColor = 'transparent'; btn.style.color = 'var(--on-surface-variant)';
            btn.style.border = '1px solid var(--outline)'; btn.style.padding = '10px 20px';
            btn.style.borderRadius = '20px'; btn.style.marginRight = 'auto'; btn.style.cursor = 'pointer';
        }
        footer.appendChild(btn);
    }
}
// --- LOGIC: FETCH COURSES (COPY FROM KOTLIN) ---
// Замени fetchCoursesAroundTime с тази версия:

async function fetchCoursesAroundTime() {
    const stopCode = alarmWizardState.stop.stop_code;
    const routeName = alarmWizardState.selectedRoute.route_name;
    const buffer = alarmWizardState.bufferMinutes;
    
    const now = new Date();
    
    // ВАЖНО: Прагът е "Сега + Буфер". 
    // Ако буферът е 10 мин, търсим часове, които са поне след 11 минути.
    // Така не можеш да избереш автобус, за който вече е късно (според буфера).
    const minSafeTime = new Date(now.getTime() + (buffer + 1) * 60000);
    const minSafeStr = formatHHMM(minSafeTime); // Превръщаме в "HH:MM"
    
    let combinedList = [];
    let lastLiveTimeStr = "00:00";

    // 1. LIVE ARRIVALS (GPS)
    try {
        const liveData = await fetch(`${API_BASE_URL}vehicles_for_stop/${alarmWizardState.stop.stop_id}`, 
            { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
        
        const ourLive = liveData.filter(v => v.route_name === routeName);
        
        ourLive.forEach(arrival => {
            // Изчисляваме кога реално ще дойде този автобус
            const arrTime = new Date(now.getTime() + arrival.eta_minutes * 60000);
            const h = arrTime.getHours().toString().padStart(2,'0');
            const m = arrTime.getMinutes().toString().padStart(2,'0');
            const timeStr = `${h}:${m}`;
            
            // ФИЛТЪР: Показваме го само ако ETA е по-голяма от буфера
            if (arrival.eta_minutes > buffer) {
                const label = arrival.prediction_source === 'official' ? `${timeStr} (GPS)` : timeStr;
                combinedList.push(label);
                if (timeStr > lastLiveTimeStr) lastLiveTimeStr = timeStr;
            }
        });
    } catch(e) { console.error("GPS Fetch error", e); }

    // 2. SCHEDULE (РАЗПИСАНИЕ)
    if (stopCode) {
        try {
            const schedData = await fetch(`${API_BASE_URL}schedule_for_stop/${stopCode}`, 
                { headers: { 'Accept-Language': currentLanguage } }).then(r => r.json());
            
            const day = now.getDay();
            const isWeekend = (day === 0 || day === 6); 
            const todaySched = isWeekend ? schedData.holiday : schedData.weekday;
            const targetDigits = routeName.replace(/\D/g, '');
            
            for (const [key, destMap] of Object.entries(todaySched)) {
                if (key.replace(/\D/g, '') === targetDigits) {
                    for (const [dest, info] of Object.entries(destMap)) {
                        info.times.forEach(tStr => {
                            const cleanTime = tStr.substring(0, 5); // "HH:mm"
                            
                            // ФИЛТЪР: 
                            // 1. Часът трябва да е "безопасен" (по-късно от буфера)
                            // 2. Да не се дублира с GPS данните
                            if (cleanTime >= minSafeStr && cleanTime > lastLiveTimeStr) {
                                combinedList.push(cleanTime);
                            }
                        });
                    }
                }
            }
        } catch(e) { console.error("Schedule Fetch error", e); }
    }

    // Сортиране и уникалност
    const unique = [...new Set(combinedList)].sort((a, b) => {
        const timeA = a.replace(" (GPS)", "");
        const timeB = b.replace(" (GPS)", "");
        return timeA.localeCompare(timeB);
    });
    
    return unique;
}



function formatHHMM(date) {
    const h = date.getHours().toString().padStart(2,'0');
    const m = date.getMinutes().toString().padStart(2,'0');
    return `${h}:${m}`;
}

// --- 3. SAVE ALARM (WITH ANDROID LOGIC) ---
// ЧАСТ 1: Проверка
function saveAlarmSetup(mode, timeStr) {
    finalizeAlarmSave(mode, timeStr);
}

// ЧАСТ 2: Същинското запазване (Кодът от преди)
function finalizeAlarmSave(mode, timeStr) {
     // 1. ВЕДНАГА ОТКЛЮЧВАМЕ ЗВУКА ЗА IOS (Критично!)
    unlockiOSAudio();
    
    // Пускаме и стандартния background mode (за плеъра)
    startBackgroundMode();

    const routeName = alarmWizardState.selectedRoute.route_name;
    const buffer = alarmWizardState.bufferMinutes;
    
    let initialTripIdToIgnore = null;
    let finalPlannedTime = timeStr; 

    if (mode === 'NEXT_COURSE') {
        const now = new Date();
        const candidates = alarmWizardState.arrivals
            .filter(v => v.route_name === routeName)
            .sort((a,b) => a.eta_minutes - b.eta_minutes);

        const tooSoonBus = candidates.find(v => v.eta_minutes < buffer);
        let targetBus = null;
        
        if (tooSoonBus) {
            initialTripIdToIgnore = tooSoonBus.trip_id;
            targetBus = candidates.find(v => v.eta_minutes >= buffer);
        } else {
            targetBus = candidates[0];
        }

        if (targetBus) {
            const etaTime = new Date(now.getTime() + targetBus.eta_minutes * 60000);
            finalPlannedTime = formatHHMM(etaTime);
        } else {
            finalPlannedTime = "??:??";
        }
    }

    const newAlarm = {
        stopId: alarmWizardState.stop.stop_id,
        stopName: alarmWizardState.stop.stop_name,
        routeName: alarmWizardState.selectedRoute.route_name,
        routeType: alarmWizardState.selectedRoute.route_type,
        mode: mode,
        bufferMinutes: alarmWizardState.bufferMinutes,
        plannedArrivalTime: finalPlannedTime,
        initialTripIdToIgnore: initialTripIdToIgnore,
        lastTriggered: 0
    };

    activeAlarms = activeAlarms.filter(a => !(a.stopId === newAlarm.stopId && a.routeName === newAlarm.routeName));
    activeAlarms.push(newAlarm);
    
    localStorage.setItem('active_alarms_web', JSON.stringify(activeAlarms));
    
    // Нотификация
    updateAlarmNotification(newAlarm, false); 

    alert(t('alarm_set_success'));

    closeAlarmWizard();
    updateAlarmButtonState(newAlarm.stopId);
    
    if(document.getElementById('screen-active-alarms').classList.contains('active')) {
        openActiveAlarmsScreen();
    }
    
    setTimeout(() => {
        checkActiveAlarmsLoop();
    }, 1000);
}






// --- 4. SETTINGS SCREEN "MY ALARMS" ---
// --- 4. SETTINGS SCREEN "MY ALARMS" (FIXED TRANSLATION) ---
function openActiveAlarmsScreen() {
    document.getElementById('screen-settings').classList.remove('active');
    document.getElementById('screen-settings').classList.add('hidden');
    
    const screen = document.getElementById('screen-active-alarms');
    screen.classList.remove('hidden');
    screen.classList.add('active');
    
    let headerTitle = screen.querySelector('h2');
    if (!headerTitle) headerTitle = screen.querySelector('.screen-title');
    if (headerTitle) headerTitle.textContent = t('my_alarms_title'); 
    
    const list = document.getElementById('active-alarms-list');
    list.innerHTML = '';
    
    if (activeAlarms.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px; color:gray;">${t('no_active_alarms')}</div>`;
        return;
    }
    
    activeAlarms.forEach(alarm => {
        const div = document.createElement('div');
        div.className = 'active-alarm-card';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '8px';
        
        const color = getTransportColor(alarm.routeType, alarm.routeName);
        const typeName = getTransportTypeName(alarm.routeType);
        
        // Уникални ID-та за обновяване от Loop-а
        const arrivalId = `alarm-arrival-${alarm.stopId}-${alarm.routeName}`;
        const triggerId = `alarm-trigger-${alarm.stopId}-${alarm.routeName}`;
        
        const initialArrival = alarm.mode === 'SPECIFIC_TIME' ? alarm.plannedArrivalTime : "--:--";
        const bufferText = `(${alarm.bufferMinutes} ${t('time_min')})`; // Ползваме t('time_min')

        div.innerHTML = `
            <!-- ГОРЕН РЕД -->
            <div style="display:flex; justify-content:space-between; align-items:start; border-bottom:1px solid #eee; padding-bottom:8px; margin-bottom:4px;">
                <div>
                    <div style="font-weight:bold; font-size:18px; color:${color}; display:flex; align-items:center; gap:6px;">
                        ${typeName} ${alarm.routeName}
                    </div>
                    <div style="font-size:13px; color:#555; line-height:1.2;">
                        ${alarm.stopName}
                    </div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="icon-btn-small" onclick="openEditAlarmBuffer('${alarm.stopId}', '${alarm.routeName}', ${alarm.bufferMinutes})">
                        <span class="material-icons-round">edit</span>
                    </button>
                    <button class="icon-btn-small" style="color:red;" onclick="deleteAlarm('${alarm.stopId}', '${alarm.routeName}', true)">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            </div>

            <!-- ДОЛЕН РЕД (Времена) -->
            <div style="display:flex; flex-direction:column; gap:6px; font-size:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-icons-round" style="color:var(--primary); font-size:18px;">directions_bus</span>
                    <span style="color:gray;">${t('alarm_arrival_label')}</span>
                    <span id="${arrivalId}" style="font-weight:bold; font-size:15px;">${initialArrival}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="material-icons-round" style="color:#e65100; font-size:18px;">notifications_active</span>
                    <span style="color:gray;">${t('alarm_trigger_label')}</span>
                    <span id="${triggerId}" style="font-weight:bold; font-size:15px;">--:--</span>
                    <span style="font-size:12px; color:#888;">${bufferText}</span>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
    
    setTimeout(checkActiveAlarmsLoop, 50);
}


// Редакция на буфера
let editingAlarmKey = null;
function openEditAlarmBuffer(stopId, routeName, currentBuffer) {
    editingAlarmKey = { stopId, routeName };
    document.getElementById('edit-alarm-buffer').value = currentBuffer;
    document.getElementById('modal-edit-alarm').classList.remove('hidden');
    document.getElementById('modal-edit-alarm').classList.add('active');
}

// --- РЕДАКТИРАНА ФУНКЦИЯ ЗА ЗАПАЗВАНЕ НА АЛАРМА ---
function saveEditedAlarm() {
    const val = parseInt(document.getElementById('edit-alarm-buffer').value);
    
    if (val > 0 && editingAlarmKey) {
        const idx = activeAlarms.findIndex(a => a.stopId === editingAlarmKey.stopId && a.routeName === editingAlarmKey.routeName);
        
        if (idx !== -1) {
            // 1. Обновяваме данните
            activeAlarms[idx].bufferMinutes = val;
            // Нулираме игнорирането, за да хване новия буфер веднага
            activeAlarms[idx].initialTripIdToIgnore = null; 
            
            localStorage.setItem('active_alarms_web', JSON.stringify(activeAlarms));
            
            // 2. ПРОВЕРКА: Кой екран е отворен в момента?
            
            // А) Ако е отворен екранът "Моите аларми" (Settings -> Active Alarms)
            const activeAlarmsScreen = document.getElementById('screen-active-alarms');
            if (activeAlarmsScreen && activeAlarmsScreen.classList.contains('active')) {
                openActiveAlarmsScreen(); // Рефрешваме списъка
            }

            // Б) Ако е отворен Wizard-а (Списъкът в спирката)
            const wizardModal = document.getElementById('modal-alarm-wizard');
            if (wizardModal && wizardModal.classList.contains('active')) {
                renderAlarmWizard(); // Рефрешваме Wizard-а, за да се види новата цифра веднага
            }
        }
    }
    
    // 3. Затваряме само малкия модал за редакция
    document.getElementById('modal-edit-alarm').classList.remove('active');
    setTimeout(() => document.getElementById('modal-edit-alarm').classList.add('hidden'), 200);
}




function deleteAlarm(stopId, routeName, refreshScreen = false) {
    let current = JSON.parse(localStorage.getItem('active_alarms_web') || '[]');
    const newAlarms = current.filter(a => !(a.stopId === stopId && a.routeName === routeName));
    
    activeAlarms = newAlarms;
    localStorage.setItem('active_alarms_web', JSON.stringify(newAlarms));
    
    if (activeAlarms.length === 0) {
        // 1. Казваме на диспечера да изчисти алармата от екрана
        updateGlobalLockScreen('CLEAR_ALARM');
        
        // 2. Спираме аудиото САМО АКО няма активно проследяване
        if (!rideAlongState.active) {
            stopBackgroundMode();     
        }
        
        clearAlarmNotification();
    } else {
        // Ако има други аларми, обновяваме нотификацията с първата налична
        // (Това ще мине през updateGlobalLockScreen вътре в loop-а)
        checkActiveAlarmsLoop(); 
    }
    
    if(refreshScreen) {
        openActiveAlarmsScreen();
    } else {
        const wizard = document.getElementById('modal-alarm-wizard');
        if (wizard && wizard.classList.contains('active')) {
             renderAlarmWizard(); 
        }
    }
    
    updateAlarmButtonState(stopId);
}
// --- 5. SERVICE LOGIC (BACKGROUND LOOP) ---
// 1:1 Порт на Android ArrivalTrackingService.kt
// Вика се от глобалния heartbeat или собствен интервал
// --- 5. SERVICE LOGIC (BACKGROUND LOOP) ---
// --- 5. SMART SERVICE LOGIC (BACKGROUND LOOP) ---


// --- 5. SMART SERVICE LOGIC (DEBUG VERSION) ---

// --- 5. SMART SERVICE LOGIC (UPDATED WITH TIMES) ---
// --- 5. SMART SERVICE LOGIC (FIXED SCHEDULE FALLBACK) ---
function checkActiveAlarmsLoop() {
    if (alarmLoopTimeout) clearTimeout(alarmLoopTimeout);

    let currentAlarms = JSON.parse(localStorage.getItem('active_alarms_web') || '[]');
    
    if (currentAlarms.length === 0) {
        activeAlarms = [];
        if (!rideAlongState.active) stopBackgroundMode();
        else updateGlobalLockScreen('CLEAR_ALARM');
        return; 
    }
    activeAlarms = currentAlarms;

    const uniqueStops = [...new Set(activeAlarms.map(a => a.stopId))];
    if (typeof allStopsData === 'undefined' || allStopsData.length === 0) {
        alarmLoopTimeout = setTimeout(checkActiveAlarmsLoop, 2000);
        return;
    }
    const stopCodes = uniqueStops.map(id => allStopsData.find(s => s.stop_id === id)?.stop_code).filter(c => c);

    const now = new Date();
    
    fetch(`${API_BASE_URL}bulk_detailed_arrivals`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLanguage }, 
        body: JSON.stringify({ stop_codes: stopCodes }) 
    })
    .then(r => r.json())
    .then(data => {
        let alarmsToRemove = [];

        activeAlarms.forEach(alarm => {
            const stop = allStopsData.find(s => s.stop_id === alarm.stopId);
            if (!stop || !stop.stop_code) return;
            
            const arrivals = data[stop.stop_code] || [];
            // Взимаме само колите за тази линия
            const routeArrivals = arrivals.filter(v => v.route_name === alarm.routeName);
            
            let targetVehicle = null;

            if (alarm.mode === 'NEXT_COURSE') {
                // --- НОВА ЛОГИКА: ПРИОРИТЕТ НА GPS ---
                
                // 1. Махаме този, който сме казали да се игнорира (ако има такъв)
                let candidates = routeArrivals.filter(v => v.trip_id !== alarm.initialTripIdToIgnore);
                
                // 2. Сортираме ги по време (най-скорошните първи)
                candidates.sort((a, b) => a.eta_minutes - b.eta_minutes);

                // 3. Търсим дали има кандидат с GPS (official)
                const gpsCandidate = candidates.find(v => v.prediction_source === 'official');

                if (gpsCandidate) {
                    // Ако имаме GPS данни, ВИНАГИ избираме тях! 
                    // (Така игнорираме изостаналите разписания)
                    targetVehicle = gpsCandidate;
                } else {
                    // Ако няма нито един с GPS, взимаме първия по разписание
                    targetVehicle = candidates[0];
                }

            } else {
                // ... (Логиката за SPECIFIC_TIME си остава същата, тя работи добре) ...
                const candidates = routeArrivals.map(v => {
                    const busTime = new Date(now.getTime() + v.eta_minutes * 60000);
                    const [targetH, targetM] = alarm.plannedArrivalTime.split(':').map(Number);
                    const targetDate = new Date(now);
                    targetDate.setHours(targetH, targetM, 0, 0);
                    
                    if (targetDate < new Date(now.getTime() - 12 * 60 * 60 * 1000)) {
                        targetDate.setDate(targetDate.getDate() + 1);
                    }
                    
                    const diff = Math.abs((busTime - targetDate) / 60000);
                    return { v, diff };
                });

                candidates.sort((a, b) => a.diff - b.diff);

                if (candidates.length > 0 && candidates[0].diff <= 20) {
                    targetVehicle = candidates[0].v;
                }
            }

            // --- ВИЗУАЛИЗАЦИЯ И ЛОГИКА ЗА ЗВЪНЕНЕ (Същата като преди) ---
            let arrivalTimeStr = "--:--";
            let triggerTimeStr = "--:--";
            let currentEta = 999;
            let statusPrefix = ""; 
            let isLive = false; 

            if (targetVehicle) {
                isLive = true;
                currentEta = targetVehicle.eta_minutes;
                // Ако API-то каже, че е schedule, слагаме (разп.), иначе е чисто
                statusPrefix = targetVehicle.prediction_source === 'official' ? "" : t('alarm_scheduled_hint') + " ";
                
                const arrDate = new Date(now.getTime() + currentEta * 60000);
                arrivalTimeStr = formatHHMM(arrDate);

                const trigDate = new Date(arrDate.getTime() - alarm.bufferMinutes * 60000);
                triggerTimeStr = formatHHMM(trigDate);

                if (currentEta <= alarm.bufferMinutes) {
                    const lastTrig = alarm.lastTriggered || 0;
                    if (now - lastTrig > 300000) { 
                        let typeName = getTransportTypeName(targetVehicle.route_type);
                        const msg = t('alarm_alert_body')
                            .replace('%s', `${typeName} ${alarm.routeName}`)
                            .replace('%d', currentEta);
                        
                        triggerAlarmSound(msg, alarm);
                        alarmsToRemove.push(alarm);
                    }
                }
            } else {
                if (alarm.plannedArrivalTime && alarm.plannedArrivalTime !== "??:??") {
                    isLive = false;
                    arrivalTimeStr = alarm.plannedArrivalTime;
                    statusPrefix = t('alarm_scheduled_hint') + " ";

                    const [h, m] = arrivalTimeStr.split(':').map(Number);
                    const arrDate = new Date(); arrDate.setHours(h, m, 0, 0);
                    
                    if (arrDate < new Date(now.getTime() - 2*60*60*1000)) arrDate.setDate(arrDate.getDate() + 1);

                    const trigDate = new Date(arrDate.getTime() - alarm.bufferMinutes * 60000);
                    triggerTimeStr = formatHHMM(trigDate);
                } else {
                    arrivalTimeStr = "...";
                    triggerTimeStr = "...";
                }
            }

            // UI Updates
            const arrivalEl = document.getElementById(`alarm-arrival-${alarm.stopId}-${alarm.routeName}`);
            const triggerEl = document.getElementById(`alarm-trigger-${alarm.stopId}-${alarm.routeName}`);
            
            if (arrivalEl) {
                if (isLive) {
                    // Ако е GPS (official), става зелено
                    // Ако е намерен автобус, но е по разписание -> става сиво с текст (разп.)
                    const color = targetVehicle && targetVehicle.prediction_source === 'official' ? '#2e7d32' : 'gray';
                    arrivalEl.textContent = `${arrivalTimeStr} (${statusPrefix}${currentEta} ${t('time_min')})`;
                    arrivalEl.style.color = color; 
                } else if (arrivalTimeStr !== "..." && arrivalTimeStr !== "--:--") {
                    arrivalEl.textContent = `${arrivalTimeStr} ${statusPrefix}`;
                    arrivalEl.style.color = 'gray';
                } else {
                    arrivalEl.textContent = arrivalTimeStr;
                }
            }
            if (triggerEl) triggerEl.textContent = triggerTimeStr;

            let aTypeName = getTransportTypeName(alarm.routeType);
            let alarmTitle = `${t('alarm_title_prefix')} ${aTypeName} ${alarm.routeName}`;
            if (alarm.stopName) alarmTitle += ` (${alarm.stopName})`;

            let notificationSubtitle = "";
            if (arrivalTimeStr !== "..." && arrivalTimeStr !== "--:--") {
                let etaPart = isLive ? `(${currentEta}m)` : "";
                notificationSubtitle = `🚌 ${arrivalTimeStr} ${etaPart} | 🔔 ${triggerTimeStr}`;
            } else {
                notificationSubtitle = t('alarm_wait_course'); 
            }
            updateGlobalLockScreen('ALARM', alarmTitle, notificationSubtitle);
        });

        if (alarmsToRemove.length > 0) {
            activeAlarms = activeAlarms.filter(a => !alarmsToRemove.includes(a));
            localStorage.setItem('active_alarms_web', JSON.stringify(activeAlarms));
            alarmsToRemove.forEach(rem => updateAlarmButtonState(rem.stopId));
            
            if (activeAlarms.length === 0) {
                updateGlobalLockScreen('CLEAR_ALARM');
                if (!rideAlongState.active) stopBackgroundMode();
            }
            if(document.getElementById('screen-active-alarms').classList.contains('active')) {
                openActiveAlarmsScreen();
            }
        }
    })
    .catch(e => { console.log("Loop error: " + e); })
    .finally(() => {
        alarmLoopTimeout = setTimeout(checkActiveAlarmsLoop, 5000);
    });
}




function triggerAlarmSound(msg, alarm) {
    const audio = document.getElementById('alarm-sound');
    
    if (audio) {
        audio.volume = 1.0;
        audio.currentTime = 0;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (typeof stopBackgroundMode === 'function') stopBackgroundMode();
            })
            .catch(error => {
                alert("🔔 " + msg);
            });
        }
    } else {
        if (typeof stopBackgroundMode === 'function') stopBackgroundMode();
        alert("🔔 " + msg);
    }
    
    if (navigator.vibrate) navigator.vibrate([1000, 500, 1000, 500, 1000]);

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
            reg.getNotifications({ tag: 'active-alarm-tag' }).then(n => n.forEach(x => x.close()));
            
            // Заглавието от превода: "ВРЕМЕ Е ЗА ТРЪГВАНЕ!"
            const title = t('alarm_alert_title');
            
            reg.showNotification(title, {
                body: msg,
                icon: 'sofia_traffic_icon2.png',
                vibrate: [200, 100, 200, 100, 200],
                tag: 'alarm-fired-' + Date.now(),
                requireInteraction: true,
                data: { url: window.location.href }
            });
        });
    }
}

// --- ФУНКЦИЯ ЗА ОБНОВЯВАНЕ НА БУТОНА (КАМБАНКА) ---
function updateAlarmButtonState(stopId) {
    const btn = document.getElementById('btn-alarm-stop');
    if (!btn) return;
    
    // Проверяваме дали в списъка с активни аларми има такава за текущата спирка
    const hasAlarm = activeAlarms.some(a => a.stopId === stopId);
    
    if (hasAlarm) {
        btn.style.color = '#4CAF50'; // Зелен цвят (активна)
        btn.classList.add('active');
    } else {
        btn.style.color = ''; // Връщаме стандартния цвят (сиво/черно)
        btn.classList.remove('active');
    }
}


// --- BACKGROUND MODE (MUSIC PLAYER HACK) ---
function startBackgroundMode() {
    const audio = document.getElementById('background-audio');
    if (!audio) return;

    if (!audio.src || audio.src === "" || audio.src.endsWith("index.html")) {
        audio.src = "silence.mp3"; 
    }

    // --- IOS FIX: EVENT LISTENER ---
    // Ако някой (вкл. iOS Control Center) натисне пауза, ние веднага пускаме Play пак.
    // Това прави бутона за пауза на iPhone безполезен (както искаш).
    audio.onpause = function() {
        // Проверяваме дали алармите са активни. Ако са, не даваме да спре.
        if (activeAlarms.length > 0 && !audio.ended) {
            console.log(">>> iOS tried to pause. Resuming force...");
            audio.play().catch(e => console.log("Resume failed", e));
        }
    };

    audio.volume = 0.05;
    audio.play()
    .then(() => {
        console.log(">>> Audio engine started.");
        updateMediaSessionInfo("...", "Активиране на аларма...", null);
    })
    .catch(error => {
        console.error("Audio Auto-Play blocked:", error);
    });
}


// --- СПИРАНЕ НА ФОНОВИЯ РЕЖИМ (FIX ЗА IOS) ---
function stopBackgroundMode() {
    const audio = document.getElementById('background-audio');
    
    // 1. Спираме аудиото и махаме защитите
    if (audio) {
        // ВАЖНО: Първо махаме onpause слушателя!
        // Иначе той ще се опита да пусне аудиото отново веднага щом дадем pause().
        audio.onpause = null; 
        
        audio.pause();
        audio.currentTime = 0;
        
        // ВАЖНО ЗА IOS: Махаме източника напълно
        // Това казва на Safari "няма вече медия за възпроизвеждане"
        audio.removeAttribute('src'); 
        audio.load(); 
    }
    
    // 2. ИЗЧИСТВАНЕ НА ЕКРАНА (Media Session)
    if ('mediaSession' in navigator) {
        // Казваме на телефона, че нищо не свири
        navigator.mediaSession.playbackState = 'none';
        
        // Изчистваме текстовете
        navigator.mediaSession.metadata = null;
        
        // Махаме бутоните и хендлърите
        try {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('stop', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('seekbackward', null);
            navigator.mediaSession.setActionHandler('seekforward', null);
        } catch(e) { }
    }
    
    // 3. НУЛИРАМЕ ГЛОБАЛНИЯ ДИСПЕЧЕР
    lockScreenState = { ride: null, alarm: null };
    
    console.log(">>> Background Audio Stopped & Player Cleared (iOS Force Kill)");
}




// Тази функция показва контролите на заключения екран (като Spotify)
function updateMediaSession(title, status) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: status,
            album: 'Sofia Yrd Maps',
            artwork: [
                { src: 'sofia_traffic_icon2.png', sizes: '96x96', type: 'image/png' },
                { src: 'sofia_traffic_icon2.png', sizes: '128x128', type: 'image/png' },
            ]
        });

        // Добавяме dummy handlers, за да се покажат бутоните на екрана
        navigator.mediaSession.setActionHandler('play', function() {});
        navigator.mediaSession.setActionHandler('pause', function() {});
        navigator.mediaSession.setActionHandler('stop', function() {});
    }
}




// --- ALARM NOTIFICATION (System Style) ---



function clearAlarmNotification() {
    if (!("Notification" in window)) return;
    navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
            notifications.forEach(notification => {
                if (notification.tag === 'active-alarm-tag') {
                    notification.close();
                }
            });
        });
    });
}

// Слушател за съобщения от Service Worker (за бутона "Отказ")
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CANCEL_ALARM') {
            console.log(">>> Alarm cancelled via notification");
            // Трием всички аларми (или може да направим логика за конкретна, но тук трием всички за по-лесно)
            activeAlarms = [];
            localStorage.setItem('active_alarms_web', JSON.stringify([]));
            stopBackgroundMode(); // Спираме "музиката"
            
            // Рефреш на UI ако е отворен
            const btn = document.getElementById('btn-alarm-stop');
            if(btn) btn.classList.remove('active');
            
            if(document.getElementById('screen-active-alarms').classList.contains('active')) {
                openActiveAlarmsScreen();
            }
        }
    });
}



function closeBatteryWarning() {
    // Записваме, че потребителят е видял съобщението
    localStorage.setItem('has_seen_battery_warning', 'true');
    
    document.getElementById('modal-battery-warning').classList.remove('active');
    setTimeout(() => document.getElementById('modal-battery-warning').classList.add('hidden'), 200);
    
    // Продължаваме със записа на алармата, която беше на изчакване
    if (window.pendingAlarmData) {
        finalizeAlarmSave(window.pendingAlarmData.mode, window.pendingAlarmData.timeStr);
        window.pendingAlarmData = null;
    }
}




// --- DEBUG HELPER (SCROLLABLE) ---
// --- DEBUG HELPER (SCROLLABLE) ---
function log(msg) {
    // ПРОМЯНА: Търсим правилното ID 'debug-console'
    const contentDiv = document.getElementById('debug-console');
    
    if (contentDiv) {
        const time = new Date().toLocaleTimeString();
        // Добавяме най-отгоре
        contentDiv.innerHTML = `<div style="border-bottom:1px solid #333;">[${time}] ${msg}</div>` + contentDiv.innerHTML;
        
        // Ограничаваме до последните 100 реда, за да не забие телефона
        if (contentDiv.children.length > 100) {
            contentDiv.lastElementChild.remove();
        }
    }
    console.log(msg);
}



// Замени съществуващата функция updateMediaSessionInfo с тази:

// Замени цялата функция updateMediaSessionInfo с тази версия:

// Замени функцията updateMediaSessionInfo с тази версия:
function updateMediaSessionInfo(routeName, statusText, routeTypeCode, stopName = "", isTrackingMode = false) {
    if ('mediaSession' in navigator) {
        
        let typeName = getTransportTypeName(routeTypeCode); // Използваме helper-а, той е преведен
        
        // Ако helper-ът не върне нищо (защото code е null), правим fallback
        if (!typeName) {
             const isEn = (currentLanguage === 'en');
             typeName = isEn ? "Line" : "Линия";
        }

        let prefix = "";
        if (isTrackingMode) {
            prefix = t('tracking_title_prefix') + " ";
        } else {
            prefix = t('alarm_title_prefix') + " ";
        }

        let titleText = `${prefix}${typeName} ${routeName}`;
        if (stopName) titleText += ` (${stopName})`;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: titleText,
            artist: statusText, 
            album: 'Sofia Yrd Maps', 
            artwork: [
                { src: 'sofia_traffic_icon2.png', sizes: '96x96', type: 'image/png' },
                { src: 'sofia_traffic_icon2.png', sizes: '128x128', type: 'image/png' },
            ]
        });
        
        const keepAlive = () => {
            const audio = document.getElementById('background-audio');
            if(audio && audio.paused) audio.play().catch(()=>{});
        };

        try {
            navigator.mediaSession.setActionHandler('play', keepAlive);
            navigator.mediaSession.setActionHandler('pause', keepAlive);
            navigator.mediaSession.setActionHandler('stop', keepAlive);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('seekbackward', null);
            navigator.mediaSession.setActionHandler('seekforward', null);
        } catch(e) {}
    }
}



// --- FIX ЗА ГРЕШКАТА ---
// Тази функция е нужна, защото се вика при запазване на аларма.
// Сега тя просто обновява музикалния плеър, вместо да пуска системна нотификация.

// --- FIX ЗА ПРЕВОДА НА НОТИФИКАЦИЯТА ---
function updateAlarmNotification(alarm, silent) {
    if (!alarm) return;

    let statusMsg = "";
    
    // Използваме t() за превод
    if (alarm.mode === 'SPECIFIC_TIME') {
        // "Target: 14:00"
        statusMsg = `${t('alarm_target')} ${alarm.plannedArrivalTime}`;
    } else {
        // "Next trip (Buffer: 10 min)"
        const bufferStr = t('alarm_buffer_info').replace('%d', alarm.bufferMinutes);
        statusMsg = `${t('alarm_next_course')} (${bufferStr})`;
    }

    // Обновяваме плеъра с преведения текст
    updateMediaSessionInfo(alarm.routeName, statusMsg, alarm.routeType, alarm.stopName);
}



// Тази функция също трябва да съществува, за да не гърми кодът при изтриване
function clearAlarmNotification() {
    // Не правим нищо тук, защото stopBackgroundMode() вече чисти плеъра
}
// Добави проверката в главния цикъл
// Намери функцията performAutoRefresh() и добави реда:
// checkActiveAlarms();

// --- BACKUP & RESTORE LOGIC ---
// ==========================================
// BACKUP & RESTORE MODULE (ФИНАЛЕН ФИКС)
// ==========================================

// 1. Функция за отваряне на модала (вика се от Settings реда)
window.openBackupModal = function() {
    const modal = document.getElementById('modal-backup');
    if (modal) {
        modal.classList.remove('hidden');
        // Малко закъснение за CSS анимацията
        setTimeout(() => modal.classList.add('active'), 10);
    }
};

// 2. Инициализация на слушателите (закачаме функциите към бутоните)
document.addEventListener('DOMContentLoaded', () => {
    // Бутон "Създай копие"
    const btnExport = document.getElementById('btn-trigger-export');
    if (btnExport) {
        btnExport.onclick = (e) => {
            e.preventDefault();
            exportUserData();
        };
    }

    // Бутон "Възстанови"
    const btnImport = document.getElementById('btn-trigger-import');
    const fileInput = document.getElementById('import-file-input');
    
    if (btnImport && fileInput) {
        btnImport.onclick = (e) => {
            e.preventDefault();
            fileInput.click(); // Отваря диалога за избор на файл
        };

        fileInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                importUserData(e.target.files[0]);
            }
        };
    }
});


async function exportUserData() {
    const backupData = {
        version: APP_VERSION,
        timestamp: Date.now(),
        data: {
            favStops: localStorage.getItem('favStops'),
            favLines: localStorage.getItem('favLines'),
            customStopsData: localStorage.getItem('customStopsData'),
            favAliases: localStorage.getItem('favAliases'),
            active_alarms_web: localStorage.getItem('active_alarms_web'),
            appLanguage: localStorage.getItem('appLanguage'),
            appTheme: localStorage.getItem('appTheme'),
            startScreen: localStorage.getItem('startScreen'),
            sortingPreference: localStorage.getItem('sortingPreference'),
            mapFiltersConfig: localStorage.getItem('mapFiltersConfig'), 
            favoritePlaces: localStorage.getItem('favoritePlaces'),
            settings_proximity_alerts: localStorage.getItem('settings_proximity_alerts'), 
            settings_auto_locate: localStorage.getItem('settings_auto_locate'),
            mapFilters_Full: localStorage.getItem('mapFilters_Full')
        }
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const date = new Date().toISOString().split('T')[0];
    const filename = `Sofia Yrd Maps_${date}.json`;

    if ('showSaveFilePicker' in window) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }],
            });
            const writable = await handle.createWritable();
            await writable.write(dataStr);
            await writable.close();
            alert(t('alert_backup_saved') || "Резервното копие е запазено!");
            return;
        } catch (err) { if (err.name === 'AbortError') return; }
    }

    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert((t('alert_file_saved_auto') || "Файлът е запазен: %s").replace('%s', filename));
}




function importUserData(file) {
    if (!file) return;
    if (!confirm(t('confirm_restore') || "Това ще презапише текущите настройки. Продължи?")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const backup = JSON.parse(e.target.result);
            if (!backup || !backup.data) throw new Error("Invalid format");
            const d = backup.data;
            Object.keys(d).forEach(key => {
                if (d[key] !== null && d[key] !== undefined) {
                    localStorage.setItem(key, String(d[key]));
                }
            });
            alert(t('alert_restore_success') || "Успешно възстановяване! Рестартиране...");
            window.location.reload();
        } catch (err) { 
            alert(t('alert_restore_error') || "Грешка при четене на файла."); 
        }
    };
    reader.readAsText(file);
}
// Сложи това най-долу в script.js
document.getElementById('btn-routes-back').onclick = function(e) {
    e.stopPropagation();
    document.getElementById('routes-list-content').classList.remove('hidden');
    document.getElementById('routes-details-content').classList.add('hidden');
    document.getElementById('btn-routes-back').classList.add('hidden');
    document.getElementById('routes-sheet-title').innerText = "Маршрути";
};

// Обнови и бутона за затваряне (X), за да ресетва състоянието
const originalCloseRoutes = document.getElementById('btn-close-routes').onclick;
document.getElementById('btn-close-routes').onclick = function(e) {
    document.getElementById('btn-routes-back').click(); // Ресетва изгледа към списък
    if(originalCloseRoutes) originalCloseRoutes(e);
};

window.closeRoutesSheet = function() {
    const sheet = document.getElementById('routes-sheet');
    sheet.classList.add('hidden');
    
    // Ресет на съдържанието
    document.getElementById('routes-list-content').classList.remove('hidden');
    document.getElementById('routes-details-content').classList.add('hidden');
    document.getElementById('btn-routes-back').classList.add('hidden');
    document.getElementById('routes-sheet-title').innerText = "Маршрути";

    // Чистене на картата
    isGoogleRouteActive = false;
    googleRouteStopIds.clear();
    routeLayer.clearLayers();
    vehicleLayer.clearLayers();
    
    updateVisibleMarkers(); // Връщаме нормалните икони
    updateMapButtons(0);    // Сваляме бутоните на картата долу
};











// --- ФУНКЦИИ ЗА ЛЮБИМИ МЕСТА (ХАПЧЕТА) ---

function initFavoritePlaces() {
    renderFavoritePlacesBar();
}

function renderFavoritePlacesBar() {
    const bar = document.getElementById('favorite-places-bar');
    if (!bar) return;
    bar.innerHTML = '';

    // Взимаме списъка от паметта
    let favoritePlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');

    // БУТОН ЗА ДОБАВЯНЕ (Винаги първи)
    const addBtn = document.createElement('div');
    addBtn.className = 'place-chip';
    addBtn.innerHTML = `<span class="material-icons-round">add</span><span>${t('add_btn')}</span>`;
    addBtn.onclick = () => {
        if (!currentSearchedLocation) {
            // Ако няма пинче на картата
            alert(currentLanguage === 'bg' ? "Първо задръжте върху картата!" : "Long press on map first!");
            return;
        }
        openAddPlaceModal();
    };
    bar.appendChild(addBtn);

    // РИСУВАНЕ НА ЗАПАЗЕНИТЕ МЕСТА
// РИСУВАНЕ НА ЗАПАЗЕНИТЕ МЕСТА
    favoritePlaces.forEach(place => {
        const chip = document.createElement('div');
        chip.className = 'place-chip';
        const iconName = place.iconName === 'home' ? 'home' : (place.iconName === 'work' ? 'business_center' : 'place');
        
        chip.innerHTML = `<span class="material-icons-round">${iconName}</span><span>${place.label}</span>`;
        
        let longPressTimer;
        let isLongPress = false;

        // --- ЛОГИКА ЗА МОБИЛНИ (iPhone) ---
        chip.addEventListener('touchstart', (e) => {
            isLongPress = false;
            // Ако задържим за 600 милисекунди, активираме изтриването
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                handleDeletePlace(place);
            }, 600);
        }, { passive: true });

        chip.addEventListener('touchend', (e) => {
            clearTimeout(longPressTimer); // Спираме таймера, ако пуснем по-рано
        });

        chip.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer); // Спираме таймера, ако си мръднем пръста (скролване)
        });

        // Клик: Отиване (само ако НЕ е било дълго задържане)
        chip.onclick = () => {
            if (isLongPress) return; // Ако е било дълго натискане, не местим картата
            
            if (typeof map !== 'undefined') {
                map.setView([place.latitude, place.longitude], 17);
                if (typeof handleMapLongPress === 'function') {
                    handleMapLongPress(place.latitude, place.longitude);
                }
            }
        };

        // Подсигуряване за компютри (десен бутон)
        chip.oncontextmenu = (e) => {
            e.preventDefault();
            handleDeletePlace(place);
        };

        bar.appendChild(chip);
    });

// Нова помощна функция за самото изтриване
function handleDeletePlace(place) {
    // Взимаме превода за потвърждение
    const msg = t('msg_confirm_delete_place') ? t('msg_confirm_delete_place').replace('%s', place.label) : `Изтриване на "${place.label}"?`;
    
    if (confirm(msg)) {
        let places = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
        places = places.filter(p => p.id !== place.id);
        localStorage.setItem('favoritePlaces', JSON.stringify(places));
        renderFavoritePlacesBar();
        
        // Вибрация за обратна връзка (ако устройството поддържа)
        if (navigator.vibrate) navigator.vibrate(50);
    }
}
}

// --- МОДАЛНИ ФУНКЦИИ ЗА МЕСТАТА ---

window.openAddPlaceModal = function() {
    const modal = document.getElementById('modal-add-place');
    document.getElementById('input-place-label').value = '';
    setPlaceIcon('place');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => modal.classList.add('active'));
};

window.closeAddPlaceModal = function() {
    const modal = document.getElementById('modal-add-place');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
};

window.setPlaceIcon = function(icon) {
    currentPlaceIcon = icon;
    document.querySelectorAll('#modal-add-place .icon-btn-square').forEach(btn => {
        btn.style.background = 'var(--surface)';
        btn.style.border = '1px solid var(--outline)';
    });
    const selected = document.getElementById(`icon-opt-${icon}`);
    if(selected) {
        selected.style.border = '2px solid var(--primary)';
        selected.style.background = 'rgba(28, 117, 188, 0.1)';
    }
};

window.confirmSavePlace = function() {
    const label = document.getElementById('input-place-label').value.trim();
    if (!label) {
        alert("Въведете име!");
        return;
    }
    if (!currentSearchedLocation) return;

    let favoritePlaces = JSON.parse(localStorage.getItem('favoritePlaces') || '[]');
    
    const newPlace = {
        id: "place_" + Date.now(),
        label: label,
        latitude: currentSearchedLocation.lat,
        longitude: currentSearchedLocation.lng,
        iconName: currentPlaceIcon || 'place',
        address: document.getElementById('map-search-input').value
    };

    favoritePlaces.push(newPlace);
    localStorage.setItem('favoritePlaces', JSON.stringify(favoritePlaces));
    
    closeAddPlaceModal();
    renderFavoritePlacesBar();
};


// --- ЛОГИКА ЗА МАРШРУТНИ ПРОМЕНИ ---

// 1. Извикване на списъка (Summary)
async function loadRouteChanges() {
    const container = document.getElementById('route-changes-list');
    container.innerHTML = '<div style="text-align:center; padding:40px;"><span class="rotating material-icons-round">refresh</span></div>';
    
	
	 if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
    // Показваме екрана
    document.getElementById('screen-social').classList.add('hidden');
    document.getElementById('screen-route-changes').classList.remove('hidden');
    document.getElementById('screen-route-changes').classList.add('active');

    try {
        const response = await fetch(`https://46.224.75.86.nip.io/news/active_changes.json?t=${Date.now()}`);
        const list = await response.json();
        
        const today = new Date().toISOString().split('T')[0];
        const activeItems = list.filter(item => item.date_to >= today);

        if (activeItems.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:40px; color:gray;">Няма активни промени в момента.</div>';
            return;
        }

        let html = '';
        activeItems.forEach(item => {
            const dateFrom = item.date_from.split('-').reverse().join('.');
            const dateTo = item.date_to.split('-').reverse().join('.');
            
            let badgesHtml = '';
            item.lines.forEach(group => {
                const badgeClass = group.type === "1" ? "badge-bus" : (group.type === "2" ? "badge-tram" : (group.type === "4" ? "badge-trolley" : "badge-other"));
                group.nums.forEach(num => {
                    badgesHtml += `<span class="line-square-badge ${badgeClass}">${num}</span>`;
                });
            });

            html += `
                <div class="change-card" onclick="loadNewsDetails('${item.id}')">
                    <div style="width: 90px; flex-shrink:0;">
                        <div style="font-size:10px; color:gray; font-weight:bold;">${t('label_valid_from')}</div>
                        <div style="font-size:12px; font-weight:bold;">${dateFrom}</div>
                        <div style="font-size:10px; color:#BE1E2D; font-weight:bold; margin-top:4px;">${t('label_valid_to')}</div>
                        <div style="font-size:12px; font-weight:bold; color:#BE1E2D;">${dateTo}</div>
                    </div>
                    <div style="flex-grow:1; display:flex; flex-wrap:wrap; justify-content:center; padding:0 8px;">
                        ${badgesHtml}
                    </div>
                    <span class="material-icons-round" style="color:#ccc;">chevron_right</span>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:red;">Грешка при връзката със сървъра.</div>';
    }
}

// 2. Извикване на детайли (Full Content)
// 2. Извикване на детайли (Full Content)
async function loadNewsDetails(newsId) {
    const url = `https://46.224.75.86.nip.io/news/news_${newsId}.json`;
    
    // Loader
    const modal = document.getElementById('modal-news');
    modal.classList.remove('hidden');
    document.getElementById('news-title').textContent = t('loading');
    document.getElementById('news-text').textContent = "";
    document.getElementById('news-image-container').style.display = 'none';

    try {
        const res = await fetch(url);
        const data = await res.json();

        document.getElementById('news-title').textContent = data.title;
        document.getElementById('news-text').textContent = data.text;
        
        // --- ФИКС ЗА ЛИНКА КЪМ ИЗТОЧНИКА ---
        const sourceLink = document.getElementById('news-source-link');
        if (sourceLink) {
            // Ако API-то връща конкретен линк (data.url), ползваме него.
            // Ако не, слагаме главната страница на ЦГМ.
            const targetUrl = data.url || "https://www.sofiatraffic.bg";
            sourceLink.href = targetUrl;
        }
        // -----------------------------------
        
        if (data.image && data.image !== "null") {
            const img = document.getElementById('news-img');
            img.src = data.image;
            document.getElementById('news-image-container').style.display = 'block';
            document.getElementById('news-header-no-img').style.display = 'none';
            
            if (typeof enableImageZoom === 'function') {
                enableImageZoom(img); 
            }
        } else {
            document.getElementById('news-image-container').style.display = 'none';
            document.getElementById('news-header-no-img').style.display = 'flex';
        }

        requestAnimationFrame(() => modal.classList.add('active'));
    } catch (e) {
        alert("Грешка при зареждане на детайлите.");
        closeNewsModal();
    }
}



window.closeNewsModal = function() {
    const modal = document.getElementById('modal-news');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 200);
};

// 3. Обработка на URL параметър (за отваряне от нотификация)
function checkUrlForNews() {
    const params = new URLSearchParams(window.location.search);
    const newsUrl = params.get('news_url');
    if (newsUrl) {
        // Очакваме формат news_123.json, вадим само ID-то
        const match = newsUrl.match(/news_(\d+)\.json/);
        if (match && match[1]) {
            loadNewsDetails(match[1]);
            // Почистваме URL без презареждане
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// Добавете checkUrlForNews() в initApp() след fetchAllStops()
// --- ЛОГИКА ЗА ЗУУМ НА СНИМКИ (PINCH-TO-ZOOM & PAN) ---
// --- ЛОГИКА ЗА ЗУУМ И МЕСТЕНЕ НА СНИМКАТА (FIXED) ---
let zoomState = {
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    startX: 0,
    startY: 0,
    startDist: 0
};

function enableImageZoom(imgElement) {
    // Ресет на състоянието при отваряне
    zoomState = { scale: 1, panning: false, pointX: 0, pointY: 0, startX: 0, startY: 0, startDist: 0 };
    imgElement.style.transform = `translate(0px, 0px) scale(1)`;

    imgElement.onmousedown = startPan;

    imgElement.ontouchstart = (e) => {
        if (e.touches.length === 2) {
            if (e.cancelable) e.preventDefault(); // Спираме зуума на браузъра
            zoomState.startDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        } else {
            startPan(e.touches[0]);
        }
    };

    // --- MOUSE MOVE (DESKTOP) ---
    imgElement.onmousemove = (e) => {
        if (zoomState.panning) {
            e.preventDefault(); // Спираме селектирането на текст
            movePan(e);
        }
    };

    // --- TOUCH MOVE (MOBILE) ---
    imgElement.ontouchmove = (e) => {
        // ВАЖНО: Спираме скролването на страницата, ако сме зуумнали
        if (zoomState.scale > 1 || e.touches.length === 2) {
            if (e.cancelable) e.preventDefault();
        }

        if (e.touches.length === 2) {
            // Логика за Pinch-to-Zoom
            const dist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            // Изчисляване на новия мащаб
            let newScale = zoomState.scale * (dist / zoomState.startDist);
            newScale = Math.max(1, Math.min(newScale, 5)); // Ограничение между 1x и 5x

            zoomState.scale = newScale;
            zoomState.startDist = dist;
            
            // Ако върнем на 1, центрираме снимката
            if (newScale === 1) {
                zoomState.pointX = 0;
                zoomState.pointY = 0;
            }
            updateTransform(imgElement);
        } else {
            // Логика за Pan (Местене)
            // Подаваме само координатите от първия пръст
            movePan(e.touches[0]);
        }
    };

    imgElement.onmouseup = () => { zoomState.panning = false; };
    imgElement.onmouseleave = () => { zoomState.panning = false; };
    imgElement.ontouchend = () => { zoomState.panning = false; };

    function startPan(event) {
        if (zoomState.scale > 1) { // Местим само ако е зуумнато
            zoomState.panning = true;
            zoomState.startX = event.clientX - zoomState.pointX;
            zoomState.startY = event.clientY - zoomState.pointY;
        }
    }

    function movePan(point) {
        if (!zoomState.panning) return;
        
        // ТУК БЕШЕ ГРЕШКАТА: Махнахме event.preventDefault() от тук,
        // защото 'point' може да е Touch обект, който няма тази функция.
        // preventDefault() вече се вика горе в ontouchmove/onmousemove.

        zoomState.pointX = point.clientX - zoomState.startX;
        zoomState.pointY = point.clientY - zoomState.startY;
        updateTransform(imgElement);
    }

    function updateTransform(el) {
        el.style.transform = `translate(${zoomState.pointX}px, ${zoomState.pointY}px) scale(${zoomState.scale})`;
    }
}


// --- ПОМОЩНА ФУНКЦИЯ ЗА НАВИГАЦИЯ (ИЗПОЛЗВА СЕ ОТ БУТОНИТЕ "НАЗАД") ---
window.showScreen = function(screenId) {
    // Най-лесният начин е да симулираме клик върху съответния бутон в долното меню.
    // Така се активира и цялата инициализация на таба (напр. зареждане на новини или карта).
    const navBtn = document.querySelector(`.nav-item[data-target="${screenId}"]`);
    
    if (navBtn) {
        navBtn.click();
    } else {
        // Резервен вариант (ако екранът няма бутон в менюто)
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
    }
};

// --- ФОНОВА ПРОВЕРКА ЗА НОВИНИ (POLLING) ---

function initNewsNotifications() {
    // 1. Искаме разрешение за нотификации, ако нямаме
    if ("Notification" in window && Notification.permission !== "granted") {
        // Браузърите изискват потребителско действие, затова това може да се извика и от бутон
        Notification.requestPermission();
    }

    // 2. Пускаме проверка веднага и после на интервал
    checkForNewRouteChanges();
    // Проверка на всеки 15 минути (900000 мс)
    setInterval(checkForNewRouteChanges, 900000); 
}

async function checkForNewRouteChanges() {
    try {
        // Теглим списъка с активни промени
        const response = await fetch(`https://46.224.75.86.nip.io/news/active_changes.json?t=${Date.now()}`);
        if (!response.ok) return;

        const list = await response.json();
        if (list.length === 0) return;

        // Взимаме най-новата новина (първата в списъка или тази с най-голямо ID)
        // Предполагаме, че ID-то расте (news_132, news_133...)
        const latestNews = list.reduce((prev, current) => (parseInt(prev.id) > parseInt(current.id)) ? prev : current);

        // Взимаме последното видяно ID от паметта
        const lastSeenId = localStorage.getItem('last_seen_news_id') || '0';

        // АКО има по-нова новина
        if (parseInt(latestNews.id) > parseInt(lastSeenId)) {
            console.log("New route change detected:", latestNews.id);
            
            // Показваме нотификация
            showSystemNewsNotification(latestNews);
            
            // Запазваме новото ID, за да не пищим пак за същата новина
            localStorage.setItem('last_seen_news_id', latestNews.id);
        }

    } catch (e) {
        console.error("News check failed", e);
    }
}

function showSystemNewsNotification(newsItem) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        // Подготвяме заглавие и тяло
        // newsItem в active_changes.json има структура: {id, date_from, date_to, lines: [...]}
        // За да вземем заглавието, може да се наложи да дръпнем детайлите или да генерираме общо заглавие
        
        const title = TRANSLATIONS[currentLanguage].route_changes_title_main; // "Маршрутни промени"
        const affectedLines = newsItem.lines.map(l => l.nums.join(", ")).join(", ");
        const body = `${t('label_affected_lines')}: ${affectedLines}\n${t('label_valid_from')} ${newsItem.date_from}`;

        // Опитваме през Service Worker (за да работи на Android/Background)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: 'sofia_traffic_icon2.png',
                    vibrate: [200, 100, 200],
                    tag: 'news-update-' + newsItem.id,
                    data: {
                        // Този URL ще бъде прихванат от Service Worker-а и ще отвори приложението
                        newsUrl: `https://46.224.75.86.nip.io/news/news_${newsItem.id}.json`
                    }
                });
            });
        } else {
            // Fallback за десктоп без SW
            const n = new Notification(title, {
                body: body,
                icon: 'sofia_traffic_icon2.png'
            });
            n.onclick = () => {
                loadNewsDetails(newsItem.id);
                window.focus();
            };
        }
    }
}
// --- ОБНОВЯВАНЕ НА BACKUP / RESTORE ---
// Вмъкни тези редове в съществуващите функции exportUserData и importUserData

// В exportUserData (в обекта data):
// favoritePlaces: localStorage.getItem('favoritePlaces'),

// В importUserData (в списъка с restoreItem):
// restoreItem('favoritePlaces');

// ==========================================
// ФИНАЛНИ ПОМОЩНИ ФУНКЦИИ (ЗА СПОДЕЛЯНЕ И МОДАЛИ)
// ==========================================



// 2. Основна функция за споделяне (вика се от Android/Web бутоните)
async function performShare(shareUrl, titleText) {
    const shareData = {
        title: titleText,
        text: t('share_msg_text') || "Виж градския транспорт в реално време:",
        url: shareUrl
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log('Успешно споделяне');
        } catch (err) {
            console.log('Споделянето е отказано или затворено');
        }
    } else {
        // Fallback ако браузърът не поддържа native share (напр. по-стари компютри)
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert(t('link_copied') || "Връзката е копирана!");
        } catch (err) {
            prompt("Копирайте връзката от тук:", shareUrl);
        }
    }
}

// 3. Затваряне на менюто за споделяне
window.closeShareModal = function() {
    const modal = document.getElementById('modal-share-options');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
};



















const VoiceUtils = {
    // Речник с пътищата към файловете
    getAudioPath: (name) => `./audio/${name}.wav`,

    getNumberFiles: function(number, isFeminine = false) {
        const list = [];
        if (number < 0) return list;

        if (number < 20) {
            if (number === 1 && isFeminine) list.push("num_1_fem");
            else list.push(`num_${number}`);
        } else if (number < 100) {
            const tens = Math.floor(number / 10) * 10;
            const units = number % 10;
            list.push(`num_${tens}`);
            if (units > 0) {
                list.push("conj_and");
                if (units === 1 && isFeminine) list.push("num_1_fem");
                else list.push(`num_${units}`);
            }
        } else if (number < 1000) {
            const hundreds = Math.floor(number / 100) * 100;
            const remainder = number % 100;
            list.push(`num_${hundreds}`);
            if (remainder > 0) {
                if (remainder < 20 || remainder % 10 === 0) list.push("conj_and");
                list.push(...this.getNumberFiles(remainder, isFeminine));
            }
        }
        return list;
    }
};


class VoicePlayer {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.cache = new Map();
    }

    async playSequence(fileNames) {
        try {
            const buffers = await Promise.all(fileNames.map(name => this.loadBuffer(name)));
            let startTime = this.audioCtx.currentTime + 0.1;

            buffers.forEach(buffer => {
                if (!buffer) return;
                const source = this.audioCtx.createBufferSource();
                source.buffer = buffer;
                
                // Настройка на скоростта (SPEECH_SPEED = 1.08)
                source.playbackRate.value = 1.08;
                
                // Усилване (VOLUME_BOOST)
                const gainNode = this.audioCtx.createGain();
                gainNode.gain.value = 1.6;

                source.connect(gainNode);
                gainNode.connect(this.audioCtx.destination);

                source.start(startTime);
                startTime += buffer.duration / source.playbackRate.value;
            });
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }

    async loadBuffer(name) {
        if (this.cache.has(name)) return this.cache.get(name);
        const response = await fetch(VoiceUtils.getAudioPath(name));
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this.cache.set(name, audioBuffer);
        return audioBuffer;
    }
}


// --- ГЛАСОВО СЛЕДЕНЕ (1:1 С АНДРОИД) ---
const VoiceTracker = {
    activeTripId: null,
    trackedStopId: null,
    trackedStopName: null,
    trackedRouteName: null,
    trackedRouteType: null,
    trackedDestination: null,
    lastSpokenEta: -100,
    interval: null,
    
    audioCtx: null,
    gainNode: null,
    cache: new Map(),

    initAudio: function() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.value = 1.8;
            this.gainNode.connect(this.audioCtx.destination);
        }
    },

    ensureBackgroundAudio: function() {
        const bgAudio = document.getElementById('background-audio');
        if (!bgAudio) return;

        if (!bgAudio.src || bgAudio.src === "" || bgAudio.src.endsWith("index.html")) {
            bgAudio.src = "silence.mp3"; 
        }
        bgAudio.loop = true;
        bgAudio.volume = 0.05;

        bgAudio.onpause = function() {
            if (VoiceTracker.activeTripId) { 
                console.log(">>> System tried to kill player. Reviving...");
                bgAudio.play().catch(e => console.error("Revive failed", e));
            }
        };

        bgAudio.play().then(() => {
            console.log(">>> Background Audio: Locked & Loaded");
        }).catch(e => {
            console.error(">>> Background Audio: Start failed", e);
        });
    },

    loadBuffer: async function(name) {
        if (this.cache.has(name)) return this.cache.get(name);
        try {
            const response = await fetch(`./audio/${name}.wav`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
            this.cache.set(name, audioBuffer);
            return audioBuffer;
        } catch (e) { return null; }
    },

    playSequence: async function(names) {
        this.initAudio();
        if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();
        
        const buffers = await Promise.all(names.map(n => this.loadBuffer(n)));
        let startTime = this.audioCtx.currentTime + 0.05;
        
        buffers.forEach(buffer => {
            if (!buffer) return;
            const source = this.audioCtx.createBufferSource();
            source.buffer = buffer;
            source.playbackRate.value = 1.08;
            source.connect(this.gainNode);
            source.start(startTime);
            startTime += (buffer.duration / 1.08);
        });
    },

    start: async function(tripId, stopId, routeName, routeType, destination, stopName = "") {
        if (this.activeTripId === tripId) {
            this.stop();
            return;
        }
        this.stop(); 
        
        this.activeTripId = tripId;
        this.trackedStopId = stopId;
        this.trackedRouteName = routeName;
        this.trackedRouteType = routeType;
        this.trackedDestination = destination || "";
        this.lastSpokenEta = -100;

        // Опит да намерим името на спирката
        if (!stopName && typeof allStopsData !== 'undefined') {
            const s = allStopsData.find(x => x.stop_id == stopId);
            if (s) stopName = s.stop_name;
            else stopName = "Спирка";
        }
        this.trackedStopName = stopName;

        if (typeof unlockiOSAudio === 'function') unlockiOSAudio();

        // 1. Показваме плеъра веднага в нотификациите
        this.updatePlayer("...");

        // 2. Заключваме аудио сесията с тихия шум
        this.ensureBackgroundAudio();

        // 3. Директно викаме poll(), което ще изтегли времето и ще го изговори веднага
        // Махнахме "phrase_started" тук
        this.poll(); 

        // 4. Пускаме интервала за обновяване
        this.interval = setInterval(() => this.poll(), 15000);
        
        if (currentOpenStopId) loadArrivals(currentOpenStopId, document.getElementById('sheet-arrivals-list'), true);
    },

    poll: async function() {
        if (!this.activeTripId) return;
        
        const bgAudio = document.getElementById('background-audio');
        if (bgAudio && bgAudio.paused) {
            bgAudio.play().catch(()=>{});
        }

        try {
            const response = await fetch(`${API_BASE_URL}vehicles_for_stop/${this.trackedStopId}`);
            const arrivals = await response.json();
            const target = arrivals.find(a => a.trip_id === this.activeTripId);

            if (target) {
                const currentEta = target.eta_minutes;
                
                let timeText;
                if (currentEta < 1) {
                    timeText = "сега";
                } else {
                    timeText = `${currentEta} мин.`;
                }
                
                this.updatePlayer(timeText);

                // Тъй като lastSpokenEta е -100 при старт, това условие е винаги вярно първия път
                // и ще изговори "Автобус Х пристига след У" веднага щом дойдат данните.
                if (currentEta !== this.lastSpokenEta) {
                    this.speakArrival(target.route_type, target.route_name, currentEta);
                    this.lastSpokenEta = currentEta;
                }
                
                if (currentEta <= 0) {
                    setTimeout(() => this.stop(), 10000);
                }
            }
        } catch (e) { console.error(e); }
    },

    updatePlayer: function(statusText) {
        const typeName = getTransportTypeName(this.trackedRouteType);
        const title = `Следене: ${typeName} ${this.trackedRouteName}`;
        
        let subtitle = `${this.trackedStopName}: ${statusText}`;
        
        if (typeof updateGlobalLockScreen === 'function') {
            updateGlobalLockScreen('RIDE', title, subtitle);
        }
        
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('stop', () => {
                this.stop();
            });
        }
    },

    speakArrival: function(type, name, eta) {
        const playlist = [];
        const typeRes = { "0": "type_tram", "11": "type_trolley", "3": "type_bus", "1": "type_metro" }[type] || "phrase_line";
        playlist.push(typeRes, "phrase_number");
        this.addRouteToPlaylist(playlist, name);
        if (eta <= 0) { playlist.push("phrase_now"); } 
        else {
            playlist.push("phrase_arrives");
            playlist.push(...VoiceUtils.getNumberFiles(eta, true));
            playlist.push(eta === 1 ? "phrase_minute" : "phrase_minutes");
        }
        this.playSequence(playlist);
    },

    addRouteToPlaylist: function(playlist, name) {
        const num = parseInt(name.replace(/\D/g, ''));
        if (name.toUpperCase().startsWith("M")) playlist.push("em");
        else if (name.toUpperCase().startsWith("N")) playlist.push("en");
        if (!isNaN(num)) playlist.push(...VoiceUtils.getNumberFiles(num));
    },

    stop: function() {
        if (this.interval) clearInterval(this.interval);
        this.activeTripId = null;
        this.lastSpokenEta = -100;
        this.interval = null;

        if (typeof updateGlobalLockScreen === 'function') {
            updateGlobalLockScreen('CLEAR_RIDE');
        }

        const bgAudio = document.getElementById('background-audio');
        if (bgAudio) {
            bgAudio.onpause = null; 
        }

        const hasAlarms = (typeof activeAlarms !== 'undefined' && activeAlarms.length > 0);
        const hasLockScreenAlarm = (typeof lockScreenState !== 'undefined' && lockScreenState.alarm);

        if (!hasAlarms && !hasLockScreenAlarm) {
             if (bgAudio) {
                 bgAudio.pause();
                 bgAudio.currentTime = 0;
             }
             if (typeof stopBackgroundMode === 'function') stopBackgroundMode();
        }
        
        if (currentOpenStopId) loadArrivals(currentOpenStopId, document.getElementById('sheet-arrivals-list'), true);
    }
};



// Хендлър за "Клик върху плеъра" -> Отваряне на спирката
window.addEventListener('focus', () => {
    if (VoiceTracker.activeTripId && VoiceTracker.trackedStopId) {
        const stop = allStopsData.find(s => s.stop_id === VoiceTracker.trackedStopId);
        if (stop) {
            // Ако приложението е отворено на картата, показваме спирката
            openStopSheet(stop);
        }
    }
});




// --- LINE MODAL DRAG (Менюто за автобуса) ---
function setupLineModalDrag() {
    const modal = document.getElementById('line-modal');
    const content = modal.querySelector('.modal-content');
    // Ще добавим зона за влачене динамично или ще ползваме хедъра
    // Тук ще ползваме целия content, но ще проверяваме дали началната точка е горе
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTime = 0;

    const getClientY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

    const onStart = (e) => {
        // Позволяваме влачене само ако хванем горната част на модала (хедъра)
        // или ако съдържанието е скролнато догоре (за да не пречим на вътрешния скрол)
        const target = e.target;
        const scrollableContent = document.getElementById('modal-report-section')?.parentElement; 
        
        // Ако сме в бутон, игнорираме
        if (target.closest('button') || target.closest('.vote-btn')) return;

        // Ако има скрол и не сме най-горе, не влачим модала, а скролваме съдържанието
        if (scrollableContent && scrollableContent.scrollTop > 0) return;

        isDragging = true;
        startY = getClientY(e);
        startTime = Date.now();
        
        modal.classList.add('dragging');
    };

    const onMove = (e) => {
        if (!isDragging) return;
        
        currentY = getClientY(e);
        const delta = currentY - startY;

        // Влачим само надолу (затваряне) или леко нагоре (еластичност)
        if (delta > 0) {
            content.style.transform = `translateY(${delta}px)`;
        } else {
            // Съпротивление при дърпане нагоре
            content.style.transform = `translateY(${delta / 4}px)`;
        }
        
        if(e.cancelable && e.type === 'touchmove') e.preventDefault();
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        modal.classList.remove('dragging');
        
        const delta = currentY - startY;
        const timeElapsed = Date.now() - startTime;
        const isFlick = timeElapsed < 250 && delta > 50;

        // Ако е дръпнато достатъчно надолу -> Затваряме
        if (delta > 120 || isFlick) {
            closeModal(); // Извикваме съществуващата функция за затваряне
            // Ресетваме стила след малко, за да е готов за следващото отваряне
            setTimeout(() => { content.style.transform = ''; }, 300);
        } else {
            // Връщаме го горе
            content.style.transform = '';
        }
        
        startY = 0;
        currentY = 0;
    };

    // Закачаме за зоната на хедъра, която ще добавим в HTML
    const dragHandle = document.getElementById('line-modal-drag-handle');
    if (dragHandle) {
        dragHandle.addEventListener('touchstart', onStart, { passive: false });
        dragHandle.addEventListener('mousedown', onStart);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchend', onEnd);
        document.addEventListener('mouseup', onEnd);
    }
}






// 1. Помощна функция за центриране (слага автобуса в горната част)
function panMapWithOffset(lat, lng) {
    if (!map) return;
    
    const currentZoom = map.getZoom();
    const mapSize = map.getSize();
    
    // Превръщаме координатите в пиксели
    const targetPoint = map.project([lat, lng], currentZoom);
    
    // Изместваме центъра надолу с 20% от височината, 
    // така автобусът визуално отива нагоре
    const offsetY = mapSize.y * 0.20; 
    
    const newCenterPoint = targetPoint.add([0, offsetY]);
    const newCenterLatLng = map.unproject(newCenterPoint, currentZoom);
    
    // Плавно движение
    map.panTo(newCenterLatLng, { 
        animate: true, 
        duration: 1.0, 
        easeLinearity: 0.1
    });
}

// 2. ГЛАВНАТА ФУНКЦИЯ ЗА ОБНОВЯВАНЕ (ТАЗИ ТИ ЛИПСВАШЕ)
async function updateRideAlongData() {
    // Ако режимът не е активен или няма детайли, спираме
    if (!rideAlongState.active) return;
    if (!rideAlongState.routeDetails || !rideAlongState.routeDetails.routeName) return;
    
    try {
        // Теглим колите за линията
        const vehiclesResponse = await fetch(`${API_BASE_URL}vehicles_for_routes/${rideAlongState.routeDetails.routeName}`, {
            headers: { 'Accept-Language': currentLanguage }
        });
        const vehicles = await vehiclesResponse.json();

        // Намираме нашия автобус
        let vehicle = vehicles.find(v => String(v.trip_id) === String(rideAlongState.tripId));
        
        // Fallback ако tripId се е сменило (за всеки случай)
        if (!vehicle && rideAlongState.fixedVehicleId) {
             vehicle = vehicles.find(v => String(v.trip_id) === String(rideAlongState.fixedVehicleId));
        }
        
        if (!vehicle) return; // Автобусът го няма в мрежата

        // --- АВТОМАТИЧНО СЛЕДЕНЕ ---
        if (typeof isAutoFollowEnabled !== 'undefined' && isAutoFollowEnabled) {
            if (vehicle.latitude && vehicle.longitude) {
                panMapWithOffset(vehicle.latitude, vehicle.longitude);
            }
        }

        // Изчисляване на прогреса
        const result = calculateVehicleProgressJS(vehicle, rideAlongState.stops, rideAlongState.shape, {}, rideAlongState.tripId);
        rideAlongState.realBusIndex = result.nextStopIndex;

        // Определяне на целта (пинната спирка или крайната)
        let targetStopId = rideAlongState.pinnedStopId 
            ? rideAlongState.pinnedStopId 
            : rideAlongState.stops[rideAlongState.stops.length - 1].stop_id;
            
        let targetName = "";
        const targetStopObj = rideAlongState.stops.find(s => s.stop_id == targetStopId);
        if (targetStopObj) targetName = targetStopObj.stop_name;

        // Изтегляне на времената (ETA)
        const stopCodes = rideAlongState.stops.map(s => s.stop_code).filter(c => c);
        const bulkResponse = await fetch(`${API_BASE_URL}bulk_detailed_arrivals`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLanguage }, 
            body: JSON.stringify({ stop_codes: stopCodes }) 
        });
        const bulkData = await bulkResponse.json();
        
        if (!rideAlongState.cachedRealTimes) rideAlongState.cachedRealTimes = new Map();

        // Обновяване на кеша с времената
        for (const [sCode, arrivals] of Object.entries(bulkData)) {
            const myArrival = arrivals.find(a => String(a.trip_id) === String(rideAlongState.tripId));
            const stopObj = rideAlongState.stops.find(s => s.stop_code == sCode);
            if (stopObj) {
                if (myArrival) rideAlongState.cachedRealTimes.set(stopObj.stop_id, myArrival.eta_minutes);
                else rideAlongState.cachedRealTimes.delete(stopObj.stop_id);
            }
        }

        // Текст за времето до целта
        let etaText = "...";
        const eta = rideAlongState.cachedRealTimes.get(targetStopId);
        if (eta !== undefined) etaText = (eta === 0) ? "Сега" : `${eta} мин`;

        // Обновяване на Lock Screen / Нотификация
        const isEn = (currentLanguage === 'en');
        let typeName = getTransportTypeName(rideAlongState.routeDetails.type);
        let prefix = isEn ? "Tracking: " : "Проследяване: ";
        let rideTitle = `${prefix}${typeName} ${rideAlongState.routeDetails.routeName}`;
        let rideSubtitle = `${targetName}: ${etaText}`;

        updateGlobalLockScreen('RIDE', rideTitle, rideSubtitle);

        // Проверка за пристигане
        const targetIndex = rideAlongState.stops.findIndex(s => s.stop_id == targetStopId);
        const isAtStop = (result.nextStopIndex === targetIndex && eta <= 0);
        const hasPassedStop = (result.nextStopIndex > targetIndex);

        if ((isAtStop || hasPassedStop) && !rideAlongState.notifiedArrival) {
            const doneBody = isEn ? `Arrived at ${targetName}` : `Пристигнахте на ${targetName}`;
            sendTransportNotification(rideTitle, doneBody);
            updateGlobalLockScreen('CLEAR_RIDE');
            rideAlongState.notifiedArrival = true;
        }

        if (hasPassedStop) {
            setTimeout(() => { if (rideAlongState.active) closeRideAlong(); }, 3000);
            return; 
        }

        // Обновяване на UI (списъка с точките)
        const minSuffix = isEn ? "min" : "мин";
        rideAlongState.stops.forEach((stop, index) => {
            const el = document.getElementById(`ra-eta-${index}`);
            if (!el) return;
            
            if (index < result.nextStopIndex) { 
                el.textContent = ""; 
                return; 
            }
            
            if (rideAlongState.cachedRealTimes.has(stop.stop_id)) {
                let realEta = rideAlongState.cachedRealTimes.get(stop.stop_id);
                el.textContent = (realEta === 0) ? (isEn ? "Now" : "Сега") : `${realEta} ${minSuffix}`;
            } else { 
                el.textContent = ""; 
            }
        });

        // Зеленото балонче върху графиката
        let greenLabel = rideAlongState.pinnedStopId ? (isEn ? "get off" : "слизам") : (isEn ? "final" : "крайна");
        let greenBubbleHtml = `<div style="line-height:1.1">${etaText}<br><span style="font-size:10px; opacity:0.9">${greenLabel}</span></div>`;
        
        // Рисуване на графиката и маркера
        updateTimelineUI(result.progress, result.nextStopIndex, greenBubbleHtml);
        
        // Обновяване на минимизирания уиджет
        updateLiveWidgetData();

    } catch (e) { 
        console.error("RideAlong Update Error:", e); 
    }
}




// --- GLOBAL SOCIAL UPDATER ---
// В script.js

// В script.js -> Замени цялата функция startSocialBackgroundUpdates
// Глобална променлива (увери се, че е дефинирана най-горе в файла, ако не е - сложи я)
// let socialRefreshTimer = null; 




// ==========================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================
// ==========================================
// PWA SERVICE WORKER REGISTRATION
// ==========================================

const ENABLE_PWA = true; 

// Проверка: Регистрираме САМО ако сме на http/https
if (ENABLE_PWA && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) { 
    window.addEventListener('load', () => { 
        navigator.serviceWorker.register('./service-worker.js')
            .then((r) => console.log('SW registered', r.scope))
            .catch((e) => console.log('SW failed', e)); 
    }); 
} else {
    console.log("PWA/Service Worker disabled (Local mode or not supported).");

}