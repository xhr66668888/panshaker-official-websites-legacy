/**
 * Panshaker Services - Device Detection Module
 * ==============================================
 * Detects user device type (PC, Mobile, Tablet) and applies
 * appropriate body classes and exposes a global API.
 *
 * Body classes applied:
 *   .device-pc       - Desktop/Laptop
 *   .device-mobile   - Smartphone
 *   .device-tablet   - Tablet (iPad, Android Tablet)
 *   .device-ios      - iOS device
 *   .device-android  - Android device
 *   .device-wechat   - WeChat in-app browser
 *   .device-portrait  - Portrait orientation
 *   .device-landscape - Landscape orientation
 *
 * Usage:
 *   if (PanDevice.isMobile) { ... }
 *   if (PanDevice.isWeChat) { ... }
 */

(function (global) {
    'use strict';

    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';

    /* ============================
     * Detection Logic
     * ============================ */

    // WeChat detection (must be before general mobile check)
    var isWeChat = /MicroMessenger/i.test(ua);

    // iOS detection
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Android detection
    var isAndroid = /Android/i.test(ua);

    // Tablet detection
    // iPads with iPadOS 13+ report as 'MacIntel' with touch support
    var isTablet = (function () {
        if (/iPad/i.test(ua)) return true;
        if (platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
        if (isAndroid && !/Mobile/i.test(ua)) return true;
        // Windows tablets
        if (/Windows.*Touch/i.test(ua) && !/Phone/i.test(ua)) return true;
        return false;
    })();

    // Mobile detection (phones only, excludes tablets)
    var isMobile = (function () {
        if (isTablet) return false;
        if (/iPhone|iPod/i.test(ua)) return true;
        if (isAndroid && /Mobile/i.test(ua)) return true;
        if (/Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(ua)) return true;
        // Fallback: check screen width
        if (window.innerWidth <= 768 && 'ontouchstart' in window) return true;
        return false;
    })();

    // PC detection (everything that's not mobile or tablet)
    var isPC = !isMobile && !isTablet;

    // Orientation
    var isPortrait = window.innerHeight > window.innerWidth;
    var isLandscape = !isPortrait;

    /* ============================
     * Apply Body Classes
     * ============================ */

    function applyClasses() {
        var body = document.body;
        if (!body) return;

        // Device type
        toggleClass(body, 'device-pc', isPC);
        toggleClass(body, 'device-mobile', isMobile);
        toggleClass(body, 'device-tablet', isTablet);

        // OS
        toggleClass(body, 'device-ios', isIOS);
        toggleClass(body, 'device-android', isAndroid);

        // Browser
        toggleClass(body, 'device-wechat', isWeChat);

        // Orientation
        updateOrientation();
    }

    function updateOrientation() {
        var body = document.body;
        if (!body) return;
        var portrait = window.innerHeight > window.innerWidth;
        toggleClass(body, 'device-portrait', portrait);
        toggleClass(body, 'device-landscape', !portrait);
    }

    function toggleClass(el, cls, condition) {
        if (condition) {
            el.classList.add(cls);
        } else {
            el.classList.remove(cls);
        }
    }

    /* ============================
     * Orientation Change Listener
     * ============================ */

    function onOrientationChange() {
        updateOrientation();
        // Update orientation flags
        isPortrait = window.innerHeight > window.innerWidth;
        isLandscape = !isPortrait;

        // Dispatch custom event
        var event;
        try {
            event = new CustomEvent('deviceorientationchange', {
                detail: { portrait: isPortrait, landscape: isLandscape }
            });
        } catch (e) {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('deviceorientationchange', true, true, {
                portrait: isPortrait, landscape: isLandscape
            });
        }
        document.dispatchEvent(event);
    }

    // Listen for orientation/resize changes
    window.addEventListener('resize', debounce(onOrientationChange, 150));
    if ('onorientationchange' in window) {
        window.addEventListener('orientationchange', onOrientationChange);
    }

    function debounce(fn, delay) {
        var timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    /* ============================
     * Public API
     * ============================ */

    var PanDevice = {
        /** True if desktop/laptop */
        get isPC() { return isPC; },
        /** True if smartphone (not tablet) */
        get isMobile() { return isMobile; },
        /** True if tablet */
        get isTablet() { return isTablet; },
        /** True if iOS */
        get isIOS() { return isIOS; },
        /** True if Android */
        get isAndroid() { return isAndroid; },
        /** True if WeChat in-app browser */
        get isWeChat() { return isWeChat; },
        /** True if portrait orientation */
        get isPortrait() { return isPortrait; },
        /** True if landscape orientation */
        get isLandscape() { return isLandscape; },

        /**
         * Returns a descriptive device string.
         * @returns {string} e.g., "mobile-ios-wechat-portrait"
         */
        getDeviceString: function () {
            var parts = [];
            if (isPC) parts.push('pc');
            if (isMobile) parts.push('mobile');
            if (isTablet) parts.push('tablet');
            if (isIOS) parts.push('ios');
            if (isAndroid) parts.push('android');
            if (isWeChat) parts.push('wechat');
            parts.push(isPortrait ? 'portrait' : 'landscape');
            return parts.join('-');
        },

        /**
         * Returns a summary object of the device info.
         * @returns {object}
         */
        getInfo: function () {
            return {
                type: isPC ? 'pc' : (isMobile ? 'mobile' : 'tablet'),
                os: isIOS ? 'ios' : (isAndroid ? 'android' : 'other'),
                isWeChat: isWeChat,
                orientation: isPortrait ? 'portrait' : 'landscape',
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                pixelRatio: window.devicePixelRatio || 1,
                userAgent: ua
            };
        }
    };

    // Export
    global.PanDevice = PanDevice;

    /* ============================
     * Mobile Navigation (Hamburger)
     * Injects toggle button & manages open/close state
     * ============================ */

    /**
     * Set --nav-vh CSS custom property to the real visual viewport height.
     * This is the ultimate fallback for browsers where 100vh / 100dvh
     * includes browser chrome (WeChat Android, older WebViews, etc.).
     */
    function setNavVH() {
        var vh = window.innerHeight;
        document.documentElement.style.setProperty('--nav-vh', vh + 'px');
    }

    // Touch-move blocker for scroll-lock (reusable reference so we can remove it)
    var touchMoveBlocker = function (e) {
        // Allow scrolling inside .nav-links itself
        var navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.contains(e.target)) return;
        e.preventDefault();
    };

    function initMobileNav() {
        if (window.innerWidth > 768) return;

        var header = document.querySelector('header');
        var navInner = document.querySelector('.nav-inner');
        if (!header || !navInner) return;
        if (navInner.querySelector('.nav-toggle')) return; // already injected

        // Set initial --nav-vh
        setNavVH();

        // Create hamburger button
        var btn = document.createElement('button');
        btn.className = 'nav-toggle';
        btn.setAttribute('aria-label', 'Menu');
        btn.innerHTML = '<span></span>';
        navInner.appendChild(btn);

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = header.classList.contains('nav-open');
            if (!isOpen) {
                // Recalculate real viewport height right before opening
                setNavVH();
                // Opening: save scroll position, then lock body
                var scrollPos = window.scrollY || window.pageYOffset || 0;
                header.classList.add('nav-open');
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.top = '-' + scrollPos + 'px';
                // WeChat & Android: also block touchmove on body to fully prevent scroll-through
                document.addEventListener('touchmove', touchMoveBlocker, { passive: false });
            } else {
                // Closing: restore scroll position
                closeNav();
            }
        });

        function closeNav() {
            var scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
            header.classList.remove('nav-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
            document.removeEventListener('touchmove', touchMoveBlocker);
        }

        // Close menu when a nav link is clicked
        var links = navInner.querySelectorAll('.nav-links a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                closeNav();
            });
        }

        // Close menu on backdrop click
        document.addEventListener('click', function (e) {
            if (header.classList.contains('nav-open') && !navInner.contains(e.target)) {
                closeNav();
            }
        });
    }

    // Handle resize — show/hide hamburger dynamically
    function handleNavResize() {
        var header = document.querySelector('header');
        if (!header) return;

        // Always update --nav-vh on resize / orientation change
        setNavVH();

        if (window.innerWidth > 768) {
            var scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
            header.classList.remove('nav-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            if (scrollY) window.scrollTo(0, scrollY);
            document.removeEventListener('touchmove', touchMoveBlocker);
            var toggle = header.querySelector('.nav-toggle');
            if (toggle) toggle.style.display = 'none';
        } else {
            var toggle2 = header.querySelector('.nav-toggle');
            if (toggle2) {
                toggle2.style.display = '';
            } else {
                initMobileNav();
            }
        }
    }

    // Apply classes on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyClasses();
            setNavVH();
            initMobileNav();
            window.addEventListener('resize', handleNavResize);
        });
    } else {
        applyClasses();
        setNavVH();
        initMobileNav();
        window.addEventListener('resize', handleNavResize);
    }

})(window);
