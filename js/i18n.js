/**
 * Panshaker Services - Internationalization (i18n) Module
 * ========================================================
 * Supports: zh-CN (简体中文), en (English), zh-TW (繁體中文), ko (한국어), ja (日本語)
 *
 * Usage:
 *   1. Add data-i18n="key" to HTML elements
 *   2. Add data-i18n-placeholder="key" for input placeholders
 *   3. Add data-i18n-title="key" for title attributes
 *   4. Call PanI18n.switchLang('en') to switch language
 *
 * Browser language auto-detection and cookie persistence are built-in.
 */

(function (global) {
    'use strict';

    var COOKIE_NAME = 'ps_lang';
    var COOKIE_DAYS = 365;
    var DEFAULT_LANG = 'zh-CN';
    var SUPPORTED_LANGS = ['zh-CN', 'en', 'zh-TW', 'ko', 'ja'];

    var LANG_LABELS = {
        'zh-CN': '简体中文',
        'en': 'English',
        'zh-TW': '繁體中文',
        'ko': '한국어',
        'ja': '日本語'
    };

    // Language pack storage (loaded lazily)
    var langPacks = {};
    var currentLang = DEFAULT_LANG;
    var isInitialized = false;

    /* ============================
     * Cookie Utilities
     * ============================ */

    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    }

    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }
        return null;
    }

    /* ============================
     * Browser Language Detection
     * ============================ */

    function detectBrowserLang() {
        var nav = navigator;
        var browserLangs = nav.languages ? nav.languages : [nav.language || nav.userLanguage || ''];

        for (var i = 0; i < browserLangs.length; i++) {
            var lang = browserLangs[i];
            // Exact match
            if (SUPPORTED_LANGS.indexOf(lang) !== -1) {
                return lang;
            }
            // Partial match (e.g., 'zh' → 'zh-CN', 'ko-KR' → 'ko')
            var prefix = lang.split('-')[0];
            for (var j = 0; j < SUPPORTED_LANGS.length; j++) {
                if (SUPPORTED_LANGS[j].split('-')[0] === prefix) {
                    return SUPPORTED_LANGS[j];
                }
            }
        }
        return DEFAULT_LANG;
    }

    /* ============================
     * Determine Initial Language
     * Priority: Cookie > Browser Detection > Default
     * ============================ */

    function resolveInitialLang() {
        var cookieLang = getCookie(COOKIE_NAME);
        if (cookieLang && SUPPORTED_LANGS.indexOf(cookieLang) !== -1) {
            return cookieLang;
        }
        return detectBrowserLang();
    }

    /* ============================
     * Language Pack Loading
     * ============================ */

    function getBasePath() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src || '';
            if (src.indexOf('i18n.js') !== -1) {
                return src.replace(/js\/i18n\.js.*$/, '');
            }
        }
        return '';
    }

    function loadLangPack(lang, callback) {
        if (langPacks[lang]) {
            callback(langPacks[lang]);
            return;
        }

        var basePath = getBasePath();
        var url = basePath + 'js/lang/' + lang + '.json';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        langPacks[lang] = JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.warn('[i18n] Failed to parse language pack: ' + lang, e);
                        langPacks[lang] = {};
                    }
                } else {
                    console.warn('[i18n] Language pack not found: ' + lang + ' (HTTP ' + xhr.status + ')');
                    langPacks[lang] = {};
                }
                callback(langPacks[lang]);
            }
        };
        xhr.send();
    }

    /* ============================
     * DOM Translation
     * ============================ */

    function translatePage(pack) {
        if (!pack || Object.keys(pack).length === 0) return;

        // Translate text content
        var els = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < els.length; i++) {
            var key = els[i].getAttribute('data-i18n');
            if (pack[key] !== undefined) {
                els[i].textContent = pack[key];
            }
        }

        // Translate placeholders
        var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        for (var j = 0; j < placeholders.length; j++) {
            var pKey = placeholders[j].getAttribute('data-i18n-placeholder');
            if (pack[pKey] !== undefined) {
                placeholders[j].setAttribute('placeholder', pack[pKey]);
            }
        }

        // Translate title attributes
        var titles = document.querySelectorAll('[data-i18n-title]');
        for (var k = 0; k < titles.length; k++) {
            var tKey = titles[k].getAttribute('data-i18n-title');
            if (pack[tKey] !== undefined) {
                titles[k].setAttribute('title', pack[tKey]);
            }
        }

        // Translate HTML content (for elements with rich formatting)
        var htmlEls = document.querySelectorAll('[data-i18n-html]');
        for (var l = 0; l < htmlEls.length; l++) {
            var hKey = htmlEls[l].getAttribute('data-i18n-html');
            if (pack[hKey] !== undefined) {
                htmlEls[l].innerHTML = pack[hKey];
            }
        }

        // Update html lang attribute
        document.documentElement.setAttribute('lang', currentLang);
    }

    /* ============================
     * Language Switcher UI
     * ============================ */

    // Short labels for the header button (compact display)
    var LANG_SHORT = {
        'zh-CN': '中文',
        'en': 'EN',
        'zh-TW': '繁體',
        'ko': '한국',
        'ja': '日本'
    };

    function createSwitcherUI() {
        // Check if already exists
        if (document.getElementById('ps-lang-switcher')) return;

        // Find the header nav area to insert into
        var navInner = document.querySelector('.nav-inner');
        if (!navInner) return; // fallback: no header found

        var container = document.createElement('div');
        container.id = 'ps-lang-switcher';
        container.style.cssText = 'position:relative;margin-left:32px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

        // Toggle button — shows current language as text
        var btn = document.createElement('button');
        btn.id = 'ps-lang-btn';
        btn.style.cssText = 'background:none;border:1px solid #e0e0e0;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:6px;padding:6px 14px;font-size:13px;color:#666;font-weight:500;transition:all 0.3s;white-space:nowrap;';
        btn.innerHTML = '<span id="ps-lang-label">' + (LANG_SHORT[currentLang] || currentLang) + '</span>'
            + '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 3 3-3"/></svg>';
        btn.setAttribute('aria-label', 'Switch Language');
        btn.addEventListener('mouseenter', function () { btn.style.borderColor = '#62BA46'; btn.style.color = '#62BA46'; });
        btn.addEventListener('mouseleave', function () {
            var dd = document.getElementById('ps-lang-dropdown');
            if (dd && dd.style.display === 'block') return;
            btn.style.borderColor = '#e0e0e0'; btn.style.color = '#666';
        });

        // Dropdown — opens downward from header
        var dropdown = document.createElement('div');
        dropdown.id = 'ps-lang-dropdown';
        dropdown.style.cssText = 'position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e0e0e0;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.1);overflow:hidden;display:none;min-width:150px;z-index:9999;';

        for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
            var lang = SUPPORTED_LANGS[i];
            var item = document.createElement('a');
            item.href = '#';
            item.setAttribute('data-lang', lang);
            item.style.cssText = 'display:block;padding:10px 18px;font-size:13px;color:#333;text-decoration:none;transition:background 0.2s;border-bottom:1px solid #f5f5f5;';
            item.textContent = LANG_LABELS[lang];
            if (lang === currentLang) {
                item.style.color = '#62BA46';
                item.style.fontWeight = '600';
            }
            (function (l) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    PanI18n.switchLang(l);
                    dropdown.style.display = 'none';
                    btn.style.borderColor = '#e0e0e0'; btn.style.color = '#666';
                });
            })(lang);
            item.addEventListener('mouseenter', function () { this.style.background = '#fafafa'; });
            item.addEventListener('mouseleave', function () { this.style.background = '#fff'; });
            dropdown.appendChild(item);
        }

        // Remove last border
        if (dropdown.lastChild) {
            dropdown.lastChild.style.borderBottom = 'none';
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            if (isOpen) { btn.style.borderColor = '#e0e0e0'; btn.style.color = '#666'; }
            else { btn.style.borderColor = '#62BA46'; btn.style.color = '#62BA46'; }
        });

        document.addEventListener('click', function () {
            dropdown.style.display = 'none';
            btn.style.borderColor = '#e0e0e0'; btn.style.color = '#666';
        });

        container.appendChild(btn);
        container.appendChild(dropdown);
        navInner.appendChild(container);
    }

    function updateSwitcherUI() {
        // Update button label
        var label = document.getElementById('ps-lang-label');
        if (label) {
            label.textContent = LANG_SHORT[currentLang] || currentLang;
        }
        // Update dropdown highlights
        var dropdown = document.getElementById('ps-lang-dropdown');
        if (!dropdown) return;
        var items = dropdown.querySelectorAll('a[data-lang]');
        for (var i = 0; i < items.length; i++) {
            var lang = items[i].getAttribute('data-lang');
            if (lang === currentLang) {
                items[i].style.color = '#62BA46';
                items[i].style.fontWeight = '600';
            } else {
                items[i].style.color = '#333';
                items[i].style.fontWeight = '400';
            }
        }
    }

    /* ============================
     * Public API
     * ============================ */

    var PanI18n = {
        /** Current language code */
        get currentLang() { return currentLang; },

        /** All supported languages */
        supportedLangs: SUPPORTED_LANGS,

        /** Language labels map */
        langLabels: LANG_LABELS,

        /**
         * Initialize the i18n module.
         * Auto-detects language, loads pack, and translates page.
         */
        init: function () {
            if (isInitialized) return;
            isInitialized = true;

            currentLang = resolveInitialLang();
            setCookie(COOKIE_NAME, currentLang, COOKIE_DAYS);

            loadLangPack(currentLang, function (pack) {
                translatePage(pack);
                createSwitcherUI();
            });
        },

        /**
         * Switch to a different language.
         * @param {string} lang - Language code (e.g., 'en', 'zh-TW')
         */
        switchLang: function (lang) {
            if (SUPPORTED_LANGS.indexOf(lang) === -1) {
                console.warn('[i18n] Unsupported language: ' + lang);
                return;
            }

            currentLang = lang;
            setCookie(COOKIE_NAME, lang, COOKIE_DAYS);

            loadLangPack(lang, function (pack) {
                translatePage(pack);
                updateSwitcherUI();

                // Dispatch custom event for other modules to react
                var event;
                try {
                    event = new CustomEvent('langchange', { detail: { lang: lang } });
                } catch (e) {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('langchange', true, true, { lang: lang });
                }
                document.dispatchEvent(event);
            });
        },

        /**
         * Get a translated string by key.
         * @param {string} key
         * @param {string} [fallback] - Fallback text if key not found
         * @returns {string}
         */
        t: function (key, fallback) {
            var pack = langPacks[currentLang];
            if (pack && pack[key] !== undefined) return pack[key];
            return fallback || key;
        }
    };

    // Export
    global.PanI18n = PanI18n;

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { PanI18n.init(); });
    } else {
        PanI18n.init();
    }

})(window);
