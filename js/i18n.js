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

    var SYNAPSE_INLINE_PACKS = {
        'zh-CN': {
            'synapse.nav.products': '产品',
            'synapse.nav.features': '功能特性',
            'synapse.nav.stories': '客户案例',
            'synapse.nav.learn': '了解Panshaker',
            'synapse.nav.about': '关于我们',
            'synapse.nav.demo': '预约演示',
            'synapse.hero.title': '为智能餐饮而生',
            'synapse.hero.for': '专为',
            'synapse.hero.build': '打造',
            'synapse.hero.subtitle': '连接前台与后厨的AI神经中枢。从全渠道点单到智能炒菜机器人出餐，<br>简化运营、加速服务、释放潜力。',
            'synapse.hero.cta_demo': '预约演示',
            'synapse.hero.cta_learn': '了解Panshaker',
            'synapse.ai.badge': 'AI驱动的智能助手',
            'synapse.ai.subtitle': '餐厅运营 无需动手',
            'synapse.ai.desc1': '同根同源技术<br>接入<strong>智谱GLM-4</strong>、<strong>豆包</strong>、<strong>阿里通义千问</strong>等主流大模型',
            'synapse.ai.desc2': '多Agent协作架构，语音识别秒懂需求，自动分解任务、智能推荐决策、口味数字孪生，让AI成为你的超级餐厅管家',
            'synapse.ai.more': '了解更多 →',
            'synapse.ai.chat.title': 'autoGLM 助手',
            'synapse.ai.chat.online': '在线',
            'synapse.ai.chat.user': '帮我安排明天的排班',
            'synapse.ai.chat.ai_title': '已为您分析明天客流预测',
            'synapse.ai.chat.ai_hint': '建议配置：',
            'synapse.ai.chat.ai_list': '• 前台 3人（午高峰+2）<br>• 后厨 4人<br>• 预计节省人力成本 18%',
            'synapse.value.title': '更智能的运营。更少的成本。更多的收益。',
            'synapse.value.desc': '探索为现代餐饮企业打造的强大工具，在不牺牲质量的前提下降低成本',
            'synapse.value.cta': '预约演示 →',
            'synapse.products.title': '匹配您业务的智能技术',
            'synapse.products.item1.title': '快餐服务',
            'synapse.products.item1.desc': '自助点餐机 + KDS厨显系统',
            'synapse.products.item2.title': '正餐服务',
            'synapse.products.item2.desc': '完整POS系统 + 桌台管理',
            'synapse.products.item3.title': '茶饮甜品店',
            'synapse.products.item3.desc': '快速点单 + 取餐屏幕',
            'synapse.products.item4.title': '智能炒菜餐厅',
            'synapse.products.item4.desc': 'Panshaker机器人精准控制',
            'synapse.products.item5.title': '火锅自助餐',
            'synapse.products.item5.desc': '平板点餐 + 智能计费',
            'synapse.products.item6.title': '连锁餐饮',
            'synapse.products.item6.desc': '多店管理 + 数据汇总',
            'synapse.common.more': '了解更多 →',
            'synapse.common.more_plain': '了解更多',
            'synapse.tiers.title': '选择适合您的版本',
            'synapse.tier.gold.desc': '极致个性化的 C2M 引擎 - 口味数字孪生系统',
            'synapse.tier.standard.desc': '自动化餐厅的标准配置。机器人中控直接下发 G-Code 指令，精准控制油温与翻炒。',
            'synapse.tier.lite.desc': '视觉库存监控与智能熔断系统',
            'synapse.tier.lite.cta': '免费试用',
            'synapse.tier.care.desc': '赋能听障群体的无声交互系统',
            'synapse.stories.title': '真实案例。真实成果。',
            'synapse.stories.desc': '看看餐饮企业如何通过Synapse OS提升效率和收益',
            'synapse.features.title': '适配您业务的智能硬件',
            'synapse.features.desc': '从POS系统到Panshaker机器人，全方位智能化解决方案',
            'synapse.screens.title': '体验 Synapse OS 的强大功能',
            'synapse.screens.desc': '全方位的餐饮智能管理，从订单到出餐，一切尽在掌控',
            'synapse.compare.title': '哪个版本更适合您？',
            'synapse.compare.feature': '功能',
            'synapse.compare.row1.k': '核心硬件',
            'synapse.compare.row1.lite': '摄像头 + 盒子',
            'synapse.compare.row1.std': '摄像头 + 机器人',
            'synapse.compare.row1.gold': '摄像头 + 机器人',
            'synapse.compare.row1.care': '适配任意版本',
            'synapse.compare.row2.k': '视觉库存监控',
            'synapse.compare.row3.k': '外卖自动熔断',
            'synapse.compare.row4.k': '机器人自动烹饪',
            'synapse.compare.row4.std': '(标准 SOP)',
            'synapse.compare.row4.gold': '(动态调整)',
            'synapse.compare.row4.care': '适配',
            'synapse.compare.row5.k': '口味个性化 (C2M)',
            'synapse.compare.row6.k': '无障碍震动交互',
            'synapse.video.title': '看看 Synapse OS 的实际运作',
            'synapse.video.desc': '完整演示从点单到出餐的全流程',
            'synapse.video.fallback': '您的浏览器不支持 HTML5 视频播放。请升级您的浏览器。',
            'synapse.cta.title': '为雄心勃勃的餐饮企业<br>打造智能系统',
            'synapse.cta.desc': '快速演示 — 我们将为您详细介绍如何为您的业务量身定制',
            'synapse.cta.button': '联系我们',
            'synapse.cta.tip': '温馨提示：我们只专注服务北美地区的餐饮企业',
            'synapse.partners.title': '助力全球顶尖餐饮企业',
            'synapse.partners.link': '了解我们的伙伴 →',
            'synapse.footer.col1.title': '产品',
            'synapse.footer.col1.item1': 'POS系统',
            'synapse.footer.col1.item2': '自助点餐机',
            'synapse.footer.col1.item3': '在线订餐',
            'synapse.footer.col1.item4': 'Panshaker机器人',
            'synapse.footer.col1.item5': '会员忠诚度',
            'synapse.footer.col2.title': '餐饮类型',
            'synapse.footer.col2.item1': '正餐服务',
            'synapse.footer.col2.item2': '快餐服务',
            'synapse.footer.col2.item3': '茶饮甜品',
            'synapse.footer.col2.item4': '智能机器人餐厅',
            'synapse.footer.col3.title': '关于Synapse OS',
            'synapse.footer.col3.item1': '关于我们',
            'synapse.footer.col3.item2': '了解Panshaker',
            'synapse.footer.col3.item3': '预约演示',
            'synapse.footer.col4.title': '资源',
            'synapse.footer.col4.item1': '博客',
            'synapse.footer.col4.item2': '隐私政策',
            'synapse.footer.col4.item3': '服务条款',
            'synapse.footer.copyright': '2026 Synapse OS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        },
        'en': {
            'synapse.nav.products': 'Products',
            'synapse.nav.features': 'Features',
            'synapse.nav.stories': 'Customer Stories',
            'synapse.nav.learn': 'About Panshaker',
            'synapse.nav.about': 'About Us',
            'synapse.nav.demo': 'Book a Demo',
            'synapse.hero.title': 'Built for Intelligent Restaurants',
            'synapse.hero.for': 'Built for',
            'synapse.hero.build': 'restaurants',
            'synapse.hero.subtitle': 'An AI nerve center connecting front-of-house and kitchen.<br>From omnichannel ordering to robotic wok output, streamline operations and unlock growth.',
            'synapse.hero.cta_demo': 'Book a Demo',
            'synapse.hero.cta_learn': 'About Panshaker',
            'synapse.ai.badge': 'AI-Powered Assistant',
            'synapse.ai.subtitle': 'Hands-Free Restaurant Operations',
            'synapse.ai.desc1': 'Built on shared core technology<br>Integrated with <strong>GLM-4</strong>, <strong>Doubao</strong>, <strong>Qwen</strong> and other mainstream LLMs',
            'synapse.ai.desc2': 'Multi-agent orchestration with voice understanding, task decomposition, decision recommendations and flavor digital twins—an AI manager for your restaurant.',
            'synapse.ai.more': 'Learn More →',
            'synapse.ai.chat.title': 'autoGLM Assistant',
            'synapse.ai.chat.online': 'Online',
            'synapse.ai.chat.user': 'Help me schedule tomorrow shifts',
            'synapse.ai.chat.ai_title': 'Tomorrow traffic forecast analyzed',
            'synapse.ai.chat.ai_hint': 'Recommended staffing:',
            'synapse.ai.chat.ai_list': '• Front desk 3 (+2 at lunch peak)<br>• Kitchen 4<br>• Estimated labor savings: 18%',
            'synapse.value.title': 'Smarter Operations. Lower Costs. Higher Returns.',
            'synapse.value.desc': 'Explore powerful tools for modern restaurants that reduce costs without sacrificing quality.',
            'synapse.value.cta': 'Book a Demo →',
            'synapse.products.title': 'Intelligent Technology for Your Business',
            'synapse.products.item1.title': 'Quick Service',
            'synapse.products.item1.desc': 'Self-order kiosks + KDS',
            'synapse.products.item2.title': 'Full Service Dining',
            'synapse.products.item2.desc': 'Complete POS + table management',
            'synapse.products.item3.title': 'Tea & Dessert Shops',
            'synapse.products.item3.desc': 'Fast ordering + pickup screens',
            'synapse.products.item4.title': 'Robotic Wok Restaurants',
            'synapse.products.item4.desc': 'Precision control by Panshaker robots',
            'synapse.products.item5.title': 'Hotpot Buffet',
            'synapse.products.item5.desc': 'Tablet ordering + smart billing',
            'synapse.products.item6.title': 'Restaurant Chains',
            'synapse.products.item6.desc': 'Multi-store management + data aggregation',
            'synapse.common.more': 'Learn More →',
            'synapse.common.more_plain': 'Learn More',
            'synapse.tiers.title': 'Choose the Right Version for You',
            'synapse.tier.gold.desc': 'Ultimate C2M engine with flavor digital twins',
            'synapse.tier.standard.desc': 'Standard stack for automated restaurants with direct G-Code robot control.',
            'synapse.tier.lite.desc': 'Visual inventory monitoring and smart circuit breaker',
            'synapse.tier.lite.cta': 'Free Trial',
            'synapse.tier.care.desc': 'Silent interaction system for the hearing-impaired',
            'synapse.stories.title': 'Real Stories. Real Results.',
            'synapse.stories.desc': 'See how restaurants improve efficiency and profitability with Synapse OS.',
            'synapse.features.title': 'Smart Hardware for Your Operations',
            'synapse.features.desc': 'From POS systems to Panshaker robots, a complete intelligent solution.',
            'synapse.screens.title': 'Experience the Power of Synapse OS',
            'synapse.screens.desc': 'End-to-end intelligent management from order to serving.',
            'synapse.compare.title': 'Which OS is right for you?',
            'synapse.compare.feature': 'Feature',
            'synapse.compare.row1.k': 'Core Hardware',
            'synapse.compare.row1.lite': 'Camera + Box',
            'synapse.compare.row1.std': 'Camera + Robot',
            'synapse.compare.row1.gold': 'Camera + Robot',
            'synapse.compare.row1.care': 'Compatible with all versions',
            'synapse.compare.row2.k': 'Visual Inventory Monitoring',
            'synapse.compare.row3.k': 'Delivery Auto Circuit Breaker',
            'synapse.compare.row4.k': 'Automated Robot Cooking',
            'synapse.compare.row4.std': '(Standard SOP)',
            'synapse.compare.row4.gold': '(Dynamic Adjustment)',
            'synapse.compare.row4.care': 'Compatible',
            'synapse.compare.row5.k': 'Flavor Personalization (C2M)',
            'synapse.compare.row6.k': 'Accessible Vibration Interaction',
            'synapse.video.title': 'See Synapse OS in Action',
            'synapse.video.desc': 'A complete walkthrough from order intake to dish delivery.',
            'synapse.video.fallback': 'Your browser does not support HTML5 video. Please upgrade your browser.',
            'synapse.cta.title': 'Smart Systems for Ambitious<br>Restaurant Businesses',
            'synapse.cta.desc': 'Book a quick demo — we will tailor the solution to your business.',
            'synapse.cta.button': 'Contact Us',
            'synapse.cta.tip': 'Note: We currently focus on restaurant businesses in North America.',
            'synapse.partners.title': 'Powering Leading Restaurants Worldwide',
            'synapse.partners.link': 'Meet Our Partners →',
            'synapse.footer.col1.title': 'Products',
            'synapse.footer.col1.item1': 'POS System',
            'synapse.footer.col1.item2': 'Self-Order Kiosk',
            'synapse.footer.col1.item3': 'Online Ordering',
            'synapse.footer.col1.item4': 'Panshaker Robot',
            'synapse.footer.col1.item5': 'Loyalty Program',
            'synapse.footer.col2.title': 'Restaurant Types',
            'synapse.footer.col2.item1': 'Full Service',
            'synapse.footer.col2.item2': 'Quick Service',
            'synapse.footer.col2.item3': 'Tea & Dessert',
            'synapse.footer.col2.item4': 'Robotic Restaurants',
            'synapse.footer.col3.title': 'About Synapse OS',
            'synapse.footer.col3.item1': 'About Us',
            'synapse.footer.col3.item2': 'About Panshaker',
            'synapse.footer.col3.item3': 'Book a Demo',
            'synapse.footer.col4.title': 'Resources',
            'synapse.footer.col4.item1': 'Blog',
            'synapse.footer.col4.item2': 'Privacy Policy',
            'synapse.footer.col4.item3': 'Terms of Service',
            'synapse.footer.copyright': '2026 Synapse OS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        },
        'zh-TW': {
            'synapse.nav.products': '產品',
            'synapse.nav.features': '功能特性',
            'synapse.nav.stories': '客戶案例',
            'synapse.nav.learn': '了解Panshaker',
            'synapse.nav.about': '關於我們',
            'synapse.nav.demo': '預約演示',
            'synapse.hero.title': '為智慧餐飲而生',
            'synapse.hero.for': '專為',
            'synapse.hero.build': '打造',
            'synapse.hero.subtitle': '連接前台與後廚的AI神經中樞。從全通路點單到智慧炒菜機器人出餐，<br>簡化營運、加速服務、釋放潛力。',
            'synapse.hero.cta_demo': '預約演示',
            'synapse.hero.cta_learn': '了解Panshaker',
            'synapse.ai.badge': 'AI驅動的智慧助手',
            'synapse.ai.subtitle': '餐廳營運 無需動手',
            'synapse.ai.more': '了解更多 →',
            'synapse.value.title': '更智慧的營運。更少的成本。更多的收益。',
            'synapse.value.desc': '探索為現代餐飲企業打造的強大工具，在不犧牲品質下有效降本。',
            'synapse.value.cta': '預約演示 →',
            'synapse.products.title': '匹配您業務的智慧技術',
            'synapse.common.more': '了解更多 →',
            'synapse.common.more_plain': '了解更多',
            'synapse.tiers.title': '選擇適合您的版本',
            'synapse.stories.title': '真實案例。真實成果。',
            'synapse.features.title': '適配您業務的智慧硬體',
            'synapse.screens.title': '體驗 Synapse OS 的強大功能',
            'synapse.compare.title': '哪個版本最適合您？',
            'synapse.compare.feature': '功能',
            'synapse.video.title': '看看 Synapse OS 的實際運作',
            'synapse.video.desc': '完整演示從點單到出餐的全流程',
            'synapse.cta.button': '聯繫我們',
            'synapse.partners.title': '助力全球頂尖餐飲企業',
            'synapse.partners.link': '了解我們的夥伴 →',
            'synapse.footer.col1.title': '產品',
            'synapse.footer.col2.title': '餐飲類型',
            'synapse.footer.col3.title': '關於Synapse OS',
            'synapse.footer.col4.title': '資源',
            'synapse.footer.copyright': '2026 Synapse OS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        },
        'ko': {
            'synapse.nav.products': '제품',
            'synapse.nav.features': '기능',
            'synapse.nav.stories': '고객 사례',
            'synapse.nav.learn': 'Panshaker 소개',
            'synapse.nav.about': '회사 소개',
            'synapse.nav.demo': '데모 예약',
            'synapse.hero.title': '지능형 레스토랑을 위해 설계',
            'synapse.hero.for': '전용',
            'synapse.hero.build': '구축',
            'synapse.hero.subtitle': '프런트와 키친을 연결하는 AI 신경 허브.<br>옴니채널 주문부터 로봇 조리까지 운영을 단순화합니다.',
            'synapse.hero.cta_demo': '데모 예약',
            'synapse.hero.cta_learn': 'Panshaker 소개',
            'synapse.ai.badge': 'AI 기반 어시스턴트',
            'synapse.ai.subtitle': '손대지 않는 레스토랑 운영',
            'synapse.ai.more': '자세히 보기 →',
            'synapse.value.title': '더 스마트한 운영. 더 낮은 비용. 더 높은 수익.',
            'synapse.value.desc': '품질을 유지하며 비용을 절감하는 현대 레스토랑용 도구를 만나보세요.',
            'synapse.value.cta': '데모 예약 →',
            'synapse.products.title': '비즈니스에 맞는 지능형 기술',
            'synapse.common.more': '자세히 보기 →',
            'synapse.common.more_plain': '자세히 보기',
            'synapse.tiers.title': '적합한 버전을 선택하세요',
            'synapse.stories.title': '실제 사례. 실제 성과.',
            'synapse.features.title': '운영에 맞는 스마트 하드웨어',
            'synapse.screens.title': 'Synapse OS 기능 체험',
            'synapse.compare.title': '어떤 OS가 맞을까요?',
            'synapse.compare.feature': '기능',
            'synapse.video.title': 'Synapse OS 실제 동작 보기',
            'synapse.video.desc': '주문부터 서빙까지 전체 흐름 데모',
            'synapse.cta.button': '문의하기',
            'synapse.partners.title': '글로벌 선도 외식 기업 지원',
            'synapse.partners.link': '파트너 보기 →',
            'synapse.footer.col1.title': '제품',
            'synapse.footer.col2.title': '레스토랑 유형',
            'synapse.footer.col3.title': 'Synapse OS 소개',
            'synapse.footer.col4.title': '리소스',
            'synapse.footer.copyright': '2026 Synapse OS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        },
        'ja': {
            'synapse.nav.products': '製品',
            'synapse.nav.features': '機能',
            'synapse.nav.stories': '導入事例',
            'synapse.nav.learn': 'Panshakerを知る',
            'synapse.nav.about': '会社概要',
            'synapse.nav.demo': 'デモ予約',
            'synapse.hero.title': 'スマートレストランのために',
            'synapse.hero.for': '専用',
            'synapse.hero.build': '構築',
            'synapse.hero.subtitle': 'フロントとキッチンをつなぐAI中枢。<br>全チャネル注文からロボット調理まで、運営を効率化します。',
            'synapse.hero.cta_demo': 'デモ予約',
            'synapse.hero.cta_learn': 'Panshakerを知る',
            'synapse.ai.badge': 'AI搭載アシスタント',
            'synapse.ai.subtitle': 'ハンズフリー店舗運営',
            'synapse.ai.more': '詳しく見る →',
            'synapse.value.title': 'より賢く。より低コスト。より高収益。',
            'synapse.value.desc': '品質を落とさずコスト削減を実現する、現代飲食向けツール。',
            'synapse.value.cta': 'デモ予約 →',
            'synapse.products.title': '業態に合わせたスマート技術',
            'synapse.common.more': '詳しく見る →',
            'synapse.common.more_plain': '詳しく見る',
            'synapse.tiers.title': '最適なプランを選択',
            'synapse.stories.title': '実例と成果',
            'synapse.features.title': '業務に最適なスマートハードウェア',
            'synapse.screens.title': 'Synapse OS の機能を体験',
            'synapse.compare.title': 'どのOSが最適ですか？',
            'synapse.compare.feature': '機能',
            'synapse.video.title': 'Synapse OS の実動作を見る',
            'synapse.video.desc': '注文から提供までのフローを完全デモ',
            'synapse.cta.button': 'お問い合わせ',
            'synapse.partners.title': '世界の有力飲食企業を支援',
            'synapse.partners.link': 'パートナーを見る →',
            'synapse.footer.col1.title': '製品',
            'synapse.footer.col2.title': '業態',
            'synapse.footer.col3.title': 'Synapse OSについて',
            'synapse.footer.col4.title': 'リソース',
            'synapse.footer.copyright': '2026 Synapse OS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        }
    };

    function mergeSynapseInlinePack(pack) {
        var path = (window.location && window.location.pathname) || '';
        if (path.indexOf('synapse_os.html') === -1) return pack;

        var baseLang = (currentLang === 'zh-TW') ? 'zh-CN' : 'en';
        var baseExtras = SYNAPSE_INLINE_PACKS[baseLang] || {};
        var extras = SYNAPSE_INLINE_PACKS[currentLang] || {};

        for (var baseKey in baseExtras) {
            if (Object.prototype.hasOwnProperty.call(baseExtras, baseKey)) {
                pack[baseKey] = baseExtras[baseKey];
            }
        }

        for (var key in extras) {
            if (Object.prototype.hasOwnProperty.call(extras, key)) {
                pack[key] = extras[key];
            }
        }
        return pack;
    }

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

        // Inject into .nav-links so the header stays a clean 2-child flex layout
        var navLinks = document.querySelector('.nav-links');
        if (!navLinks) return; // fallback: no header found

        var container = document.createElement('div');
        container.id = 'ps-lang-switcher';
        container.style.cssText = 'position:relative;margin-left:16px;display:inline-flex;align-items:center;font-family:"Smartisan Compact",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

        // Toggle button — shows current language as text
        var btn = document.createElement('button');
        btn.id = 'ps-lang-btn';
        btn.style.cssText = 'background:none;border:1px solid #e0e0e0;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;padding:6px 10px;font-size:13px;color:#666;font-weight:500;transition:all 0.3s;white-space:nowrap;line-height:1;';
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
            item.style.cssText = 'display:block;width:100%;box-sizing:border-box;padding:10px 14px;margin:0;font-size:13px;line-height:1.4;text-align:left;color:#333;text-decoration:none;transition:background 0.2s;border-bottom:1px solid #f5f5f5;';
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
        navLinks.appendChild(container);
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
                translatePage(mergeSynapseInlinePack(pack));
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
                translatePage(mergeSynapseInlinePack(pack));
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
