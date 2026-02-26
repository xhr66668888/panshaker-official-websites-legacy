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
            'synapse.stories.desc': '看看餐饮企业如何通过PanOS提升效率和收益',
            'synapse.features.title': '适配您业务的智能硬件',
            'synapse.features.desc': '从POS系统到Panshaker机器人，全方位智能化解决方案',
            'synapse.screens.title': '体验 PanOS 的强大功能',
            'synapse.screens.desc': '全方位的餐饮智能管理，从订单到出餐，一切尽在掌控',
            'synapse.screens.item1.title': 'AI 神经中枢',
            'synapse.screens.item1.desc': '自然语言点单，秒懂复杂需求。AI 助手自动解析订单、识别桌号，并实时下发给后厨机器人。让服务员从繁琐的订单输入中解放，专注于提升顾客体验。',
            'synapse.screens.item2.title': '实时仪表盘',
            'synapse.screens.item2.desc': '一屏掌握全局运营数据。今日订单数、营业额、客单价、完成率，关键指标实时刷新。智能化数据洞察，助力精准决策。',
            'synapse.screens.item3.title': 'Panshaker 智能炒锅',
            'synapse.screens.item3.desc': '机器人实时状态监控，油温精准控制到 0.1°C。系统直接下发 G-Code 指令，确保每一道菜品的标准化出品。物理级库存扣减，防止超卖。',
            'synapse.screens.item4.title': '外卖聚合平台',
            'synapse.screens.item4.desc': '一个界面统管所有外卖订单。无缝对接 Uber Eats、DoorDash、饿了么等主流平台，告别多平板混乱。自动接单、智能调度，让外卖运营更高效。',
            'synapse.screens.item5.title': '口味数字孪生',
            'synapse.screens.item5.desc': '每位顾客都有专属口味档案。系统记录咸淡、辣度、油量等偏好，实现真正的 C2M 个性化定制。VIP 会员体系，让每次消费都是定制化体验。',
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
            'synapse.video.title': '看看 PanOS 的实际运作',
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
            'synapse.footer.col3.title': '关于PanOS',
            'synapse.footer.col3.item1': '关于我们',
            'synapse.footer.col3.item2': '了解Panshaker',
            'synapse.footer.col3.item3': '预约演示',
            'synapse.footer.col4.title': '资源',
            'synapse.footer.col4.item1': '博客',
            'synapse.footer.col4.item2': '隐私政策',
            'synapse.footer.col4.item3': '服务条款',
            'synapse.footer.copyright': '2026 PanOS. All rights reserved.',
            'synapse.footer.designed': 'Designed for',
            'synapse.footer.brand': 'Panshaker Services'
        },
        'en': {
            'synapse.nav.products': 'Products',
            'synapse.nav.features': 'Features',
            'synapse.nav.stories': 'Customer Stories',
            'synapse.nav.learn': 'About Panshaker',
            'synapse.nav.about': 'About',
            'synapse.nav.demo': 'Get a Demo',
            'synapse.hero.title': 'Built for Smarter Restaurants',
            'synapse.hero.for': 'Built for',
            'synapse.hero.build': 'restaurants',
            'synapse.hero.subtitle': 'The AI nerve center connecting your front-of-house and kitchen.<br>From omnichannel ordering to robotic wok output — streamline everything, unlock growth.',
            'synapse.hero.cta_demo': 'Get a Demo',
            'synapse.hero.cta_learn': 'About Panshaker',
            'synapse.ai.badge': 'AI-Powered Assistant',
            'synapse.ai.subtitle': 'Hands-Free Restaurant Ops',
            'synapse.ai.desc1': 'Built on shared core tech<br>Integrated with <strong>GLM-4</strong>, <strong>Doubao</strong>, <strong>Qwen</strong> and other leading LLMs',
            'synapse.ai.desc2': 'Multi-agent orchestration with voice understanding, task decomposition, decision-making, and flavor digital twins — your AI restaurant manager.',
            'synapse.ai.more': 'Learn More →',
            'synapse.ai.chat.title': 'autoGLM Assistant',
            'synapse.ai.chat.online': 'Online',
            'synapse.ai.chat.user': 'Help me plan tomorrow\'s shifts',
            'synapse.ai.chat.ai_title': 'Tomorrow\'s traffic forecast — done',
            'synapse.ai.chat.ai_hint': 'Recommended staffing:',
            'synapse.ai.chat.ai_list': '• Front-of-house: 3 (+2 at lunch rush)<br>• Kitchen: 4<br>• Estimated labor savings: 18%',
            'synapse.value.title': 'Smarter Ops. Lower Costs. Bigger Returns.',
            'synapse.value.desc': 'Powerful tools for the modern restaurant — cut costs without cutting corners.',
            'synapse.value.cta': 'Get a Demo →',
            'synapse.products.title': 'Smart Tech for Every Kitchen',
            'synapse.products.item1.title': 'Quick Service',
            'synapse.products.item1.desc': 'Self-order kiosks + KDS',
            'synapse.products.item2.title': 'Full Service Dining',
            'synapse.products.item2.desc': 'Full POS + table management',
            'synapse.products.item3.title': 'Tea & Dessert Shops',
            'synapse.products.item3.desc': 'Fast ordering + pickup screens',
            'synapse.products.item4.title': 'Robotic Wok Restaurants',
            'synapse.products.item4.desc': 'Precision control by Panshaker robots',
            'synapse.products.item5.title': 'Hotpot & Buffet',
            'synapse.products.item5.desc': 'Tablet ordering + smart billing',
            'synapse.products.item6.title': 'Multi-Location Chains',
            'synapse.products.item6.desc': 'Multi-store management + data rollup',
            'synapse.common.more': 'Learn More →',
            'synapse.common.more_plain': 'Learn More',
            'synapse.tiers.title': 'Pick the Plan That Fits',
            'synapse.tier.gold.desc': 'The ultimate C2M engine with flavor digital twins',
            'synapse.tier.standard.desc': 'The go-to stack for automated restaurants — direct G-Code robot control included.',
            'synapse.tier.lite.desc': 'Visual inventory monitoring + smart circuit breaker',
            'synapse.tier.lite.cta': 'Try Free',
            'synapse.tier.care.desc': 'Silent interaction system for the hearing-impaired',
            'synapse.stories.title': 'Real Stories. Real Results.',
            'synapse.stories.desc': 'See how restaurants are boosting efficiency and profitability with PanOS.',
            'synapse.features.title': 'The Hardware That Runs It All',
            'synapse.features.desc': 'From POS systems to Panshaker robots — the full intelligent stack.',
            'synapse.screens.title': 'See What PanOS Can Do',
            'synapse.screens.desc': 'End-to-end intelligent management — from order to table.',
            'synapse.screens.item1.title': 'AI Nerve Center',
            'synapse.screens.item1.desc': 'Natural language ordering that handles complex requests on the fly. The AI parses orders, identifies tables, and dispatches to kitchen robots in real time.',
            'synapse.screens.item2.title': 'Real-Time Dashboard',
            'synapse.screens.item2.desc': 'One screen, full picture: orders, revenue, average check, completion rate — all refreshing live for smarter decisions.',
            'synapse.screens.item3.title': 'Panshaker Smart Wok',
            'synapse.screens.item3.desc': 'Monitor robot status live. Oil temp precision down to 0.1°C. Direct G-Code dispatch ensures every dish comes out exactly right.',
            'synapse.screens.item4.title': 'Delivery Hub',
            'synapse.screens.item4.desc': 'All your delivery orders in one place. Seamless integration with major platforms — auto-accept, smart dispatch, done.',
            'synapse.screens.item5.title': 'Flavor Digital Twin',
            'synapse.screens.item5.desc': 'Build a personalized flavor profile for every customer — spice, salt, oil preferences — for true made-to-order customization.',
            'synapse.compare.title': 'Which PanOS Is Right for You?',
            'synapse.compare.feature': 'Feature',
            'synapse.compare.row1.k': 'Core Hardware',
            'synapse.compare.row1.lite': 'Camera + Box',
            'synapse.compare.row1.std': 'Camera + Robot',
            'synapse.compare.row1.gold': 'Camera + Robot',
            'synapse.compare.row1.care': 'Works with all versions',
            'synapse.compare.row2.k': 'Visual Inventory Monitoring',
            'synapse.compare.row3.k': 'Delivery Auto Circuit Breaker',
            'synapse.compare.row4.k': 'Automated Robot Cooking',
            'synapse.compare.row4.std': '(Standard SOP)',
            'synapse.compare.row4.gold': '(Dynamic Adjustment)',
            'synapse.compare.row4.care': 'Compatible',
            'synapse.compare.row5.k': 'Flavor Personalization (C2M)',
            'synapse.compare.row6.k': 'Accessible Vibration Interaction',
            'synapse.video.title': 'See PanOS in Action',
            'synapse.video.desc': 'The full journey — from order to plate.',
            'synapse.video.fallback': 'Your browser doesn\'t support HTML5 video. Please upgrade.',
            'synapse.cta.title': 'Smart Systems for Ambitious<br>Restaurant Businesses',
            'synapse.cta.desc': 'Book a quick demo — we\'ll tailor the solution to your business.',
            'synapse.cta.button': 'Get in Touch',
            'synapse.cta.tip': 'Heads up: We currently serve restaurant businesses in North America.',
            'synapse.partners.title': 'Trusted by Leading Restaurants Worldwide',
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
            'synapse.footer.col3.title': 'About PanOS',
            'synapse.footer.col3.item1': 'About Us',
            'synapse.footer.col3.item2': 'About Panshaker',
            'synapse.footer.col3.item3': 'Get a Demo',
            'synapse.footer.col4.title': 'Resources',
            'synapse.footer.col4.item1': 'Blog',
            'synapse.footer.col4.item2': 'Privacy Policy',
            'synapse.footer.col4.item3': 'Terms of Service',
            'synapse.footer.copyright': '2026 PanOS. All rights reserved.',
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
            'synapse.screens.title': '體驗 PanOS 的強大功能',
            'synapse.screens.item1.title': 'AI 神經中樞',
            'synapse.screens.item1.desc': '自然語言點單，快速理解複雜需求。AI 助手自動解析訂單、識別桌號，並即時下發給後廚機器人。',
            'synapse.screens.item2.title': '即時儀表板',
            'synapse.screens.item2.desc': '一屏掌握全局營運數據。訂單、營收、客單價與完成率即時刷新，助力精準決策。',
            'synapse.screens.item3.title': 'Panshaker 智慧炒鍋',
            'synapse.screens.item3.desc': '機器人狀態即時監控，油溫精準控制到 0.1°C。系統直接下發 G-Code 指令，確保出品標準化。',
            'synapse.screens.item4.title': '外送聚合平台',
            'synapse.screens.item4.desc': '單一介面管理所有外送訂單。無縫對接主流平台，自動接單、智慧調度，提升外送效率。',
            'synapse.screens.item5.title': '口味數位分身',
            'synapse.screens.item5.desc': '為每位顧客建立專屬口味檔案，記錄鹹淡、辣度、油量偏好，實現真正 C2M 個性化。',
            'synapse.compare.title': '哪個版本最適合您？',
            'synapse.compare.feature': '功能',
            'synapse.video.title': '看看 PanOS 的實際運作',
            'synapse.video.desc': '完整演示從點單到出餐的全流程',
            'synapse.cta.button': '聯繫我們',
            'synapse.partners.title': '助力全球頂尖餐飲企業',
            'synapse.partners.link': '了解我們的夥伴 →',
            'synapse.footer.col1.title': '產品',
            'synapse.footer.col2.title': '餐飲類型',
            'synapse.footer.col3.title': '關於PanOS',
            'synapse.footer.col4.title': '資源',
            'synapse.footer.copyright': '2026 PanOS. All rights reserved.',
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
            'synapse.hero.for': '오직',
            'synapse.hero.build': '를 위해',
            'synapse.hero.subtitle': '프런트와 키친을 연결하는 AI 신경 허브.<br>옴니채널 주문부터 로봇 조리까지, 운영을 단순화하고 서비스 속도를 높입니다.',
            'synapse.hero.cta_demo': '데모 예약',
            'synapse.hero.cta_learn': 'Panshaker 소개',
            'synapse.ai.badge': 'AI 기반 스마트 어시스턴트',
            'synapse.ai.subtitle': '손대지 않는 레스토랑 운영',
            'synapse.ai.desc1': '동일한 핵심 기술 기반<br><strong>GLM-4</strong>, <strong>Doubao</strong>, <strong>Qwen</strong> 등 주요 LLM 연동',
            'synapse.ai.desc2': '멀티 에이전트 협업 구조로 음성 이해, 작업 분해, 의사결정 추천, 맛 디지털 트윈까지 구현해 AI가 매장 운영을 도와줍니다.',
            'synapse.ai.more': '자세히 보기 →',
            'synapse.ai.chat.title': 'autoGLM 어시스턴트',
            'synapse.ai.chat.online': '온라인',
            'synapse.ai.chat.user': '내일 근무표를 짜줘',
            'synapse.ai.chat.ai_title': '내일 예상 고객 흐름을 분석했습니다',
            'synapse.ai.chat.ai_hint': '권장 배치:',
            'synapse.ai.chat.ai_list': '• 프런트 3명(점심 피크 +2)<br>• 주방 4명<br>• 예상 인건비 절감 18%',
            'synapse.value.title': '더 스마트한 운영. 더 낮은 비용. 더 높은 수익.',
            'synapse.value.desc': '품질을 유지하면서 비용을 절감할 수 있는 현대 레스토랑용 도구를 확인해보세요.',
            'synapse.value.cta': '데모 예약 →',
            'synapse.products.title': '비즈니스에 맞는 지능형 기술',
            'synapse.products.item1.title': '퀵 서비스',
            'synapse.products.item1.desc': '셀프 주문 키오스크 + KDS',
            'synapse.products.item2.title': '풀 서비스 다이닝',
            'synapse.products.item2.desc': '통합 POS + 테이블 관리',
            'synapse.products.item3.title': '티·디저트 매장',
            'synapse.products.item3.desc': '빠른 주문 + 픽업 화면',
            'synapse.products.item4.title': '스마트 웍 레스토랑',
            'synapse.products.item4.desc': 'Panshaker 로봇 정밀 제어',
            'synapse.products.item5.title': '핫팟 뷔페',
            'synapse.products.item5.desc': '태블릿 주문 + 스마트 정산',
            'synapse.products.item6.title': '체인 레스토랑',
            'synapse.products.item6.desc': '멀티매장 관리 + 데이터 통합',
            'synapse.common.more': '자세히 보기 →',
            'synapse.common.more_plain': '자세히 보기',
            'synapse.tiers.title': '적합한 버전을 선택하세요',
            'synapse.tier.gold.desc': '최고 수준의 C2M 엔진 - 맛 디지털 트윈 시스템',
            'synapse.tier.standard.desc': '자동화 레스토랑의 표준 구성. 로봇 제어센터가 G-Code를 직접 내려 정밀 조리합니다.',
            'synapse.tier.lite.desc': '비전 재고 모니터링 + 스마트 차단 시스템',
            'synapse.tier.lite.cta': '무료 체험',
            'synapse.tier.care.desc': '청각장애인을 위한 사일런트 상호작용 시스템',
            'synapse.stories.title': '실제 사례. 실제 성과.',
            'synapse.stories.desc': '레스토랑이 PanOS로 어떻게 효율과 수익을 높였는지 확인하세요.',
            'synapse.features.title': '운영에 맞는 스마트 하드웨어',
            'synapse.features.desc': 'POS부터 Panshaker 로봇까지, 전방위 지능형 솔루션을 제공합니다.',
            'synapse.screens.title': 'PanOS 기능 체험',
            'synapse.screens.desc': '주문부터 서빙까지 전 과정을 아우르는 지능형 운영 관리.',
            'synapse.screens.item1.title': 'AI 신경 허브',
            'synapse.screens.item1.desc': '자연어 주문으로 복잡한 요구를 즉시 이해합니다. AI가 주문을 해석하고 테이블을 인식해 주방 로봇에 실시간 전달합니다.',
            'synapse.screens.item2.title': '실시간 대시보드',
            'synapse.screens.item2.desc': '주문 수, 매출, 객단가, 완료율 등 핵심 지표를 한 화면에서 실시간으로 파악해 정확한 의사결정을 지원합니다.',
            'synapse.screens.item3.title': 'Panshaker 스마트 웍',
            'synapse.screens.item3.desc': '로봇 상태를 실시간 모니터링하고 유온을 0.1°C 단위로 정밀 제어합니다. G-Code 직접 제어로 표준화된 맛을 제공합니다.',
            'synapse.screens.item4.title': '배달 통합 플랫폼',
            'synapse.screens.item4.desc': '모든 배달 주문을 하나의 화면에서 관리합니다. 주요 플랫폼 연동으로 자동 접수와 스마트 배차가 가능합니다.',
            'synapse.screens.item5.title': '맛 디지털 트윈',
            'synapse.screens.item5.desc': '고객별 짠맛·매운맛·기름량 선호를 기록해 진정한 C2M 개인화 경험을 제공합니다.',
            'synapse.compare.title': '어떤 OS가 맞을까요?',
            'synapse.compare.feature': '기능',
            'synapse.compare.row1.k': '핵심 하드웨어',
            'synapse.compare.row1.lite': '카메라 + 박스',
            'synapse.compare.row1.std': '카메라 + 로봇',
            'synapse.compare.row1.gold': '카메라 + 로봇',
            'synapse.compare.row1.care': '모든 버전에 적용',
            'synapse.compare.row2.k': '비전 재고 모니터링',
            'synapse.compare.row3.k': '배달 자동 차단',
            'synapse.compare.row4.k': '로봇 자동 조리',
            'synapse.compare.row4.std': '(표준 SOP)',
            'synapse.compare.row4.gold': '(동적 조정)',
            'synapse.compare.row4.care': '적용',
            'synapse.compare.row5.k': '맛 개인화 (C2M)',
            'synapse.compare.row6.k': '접근성 진동 상호작용',
            'synapse.video.title': 'PanOS 실제 동작 보기',
            'synapse.video.desc': '주문부터 서빙까지 전 과정을 데모로 확인하세요.',
            'synapse.video.fallback': '브라우저가 HTML5 비디오를 지원하지 않습니다. 최신 버전으로 업데이트해 주세요.',
            'synapse.cta.title': '성장 지향 레스토랑을 위한<br>스마트 시스템',
            'synapse.cta.desc': '빠른 데모를 통해 귀사 비즈니스에 맞춘 도입 방안을 안내드립니다.',
            'synapse.cta.button': '문의하기',
            'synapse.cta.tip': '안내: 현재 북미 지역 레스토랑 기업에 집중해 서비스하고 있습니다.',
            'synapse.partners.title': '글로벌 선도 외식 기업 지원',
            'synapse.partners.link': '파트너 보기 →',
            'synapse.footer.col1.title': '제품',
            'synapse.footer.col1.item1': 'POS 시스템',
            'synapse.footer.col1.item2': '셀프 주문 키오스크',
            'synapse.footer.col1.item3': '온라인 주문',
            'synapse.footer.col1.item4': 'Panshaker 로봇',
            'synapse.footer.col1.item5': '멤버십 로열티',
            'synapse.footer.col2.title': '레스토랑 유형',
            'synapse.footer.col2.item1': '풀 서비스',
            'synapse.footer.col2.item2': '퀵 서비스',
            'synapse.footer.col2.item3': '티·디저트',
            'synapse.footer.col2.item4': '로봇 레스토랑',
            'synapse.footer.col3.title': 'PanOS 소개',
            'synapse.footer.col3.item1': '회사 소개',
            'synapse.footer.col3.item2': 'Panshaker 소개',
            'synapse.footer.col3.item3': '데모 예약',
            'synapse.footer.col4.title': '리소스',
            'synapse.footer.col4.item1': '블로그',
            'synapse.footer.col4.item2': '개인정보 처리방침',
            'synapse.footer.col4.item3': '서비스 약관',
            'synapse.footer.copyright': '2026 PanOS. All rights reserved.',
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
            'synapse.hero.build': 'を実現',
            'synapse.hero.subtitle': 'フロントとキッチンをつなぐAI中枢。<br>全チャネル注文からロボット調理まで、運営を効率化し成長を加速します。',
            'synapse.hero.cta_demo': 'デモ予約',
            'synapse.hero.cta_learn': 'Panshakerを知る',
            'synapse.ai.badge': 'AI搭載スマートアシスタント',
            'synapse.ai.subtitle': 'ハンズフリー店舗運営',
            'synapse.ai.desc1': '共通コア技術を基盤に<br><strong>GLM-4</strong>、<strong>Doubao</strong>、<strong>Qwen</strong> など主要LLMと連携',
            'synapse.ai.desc2': 'マルチエージェント協調により、音声理解、タスク分解、意思決定提案、味のデジタルツインを実現します。',
            'synapse.ai.more': '詳しく見る →',
            'synapse.ai.chat.title': 'autoGLM アシスタント',
            'synapse.ai.chat.online': 'オンライン',
            'synapse.ai.chat.user': '明日のシフトを組んで',
            'synapse.ai.chat.ai_title': '明日の来客予測を分析しました',
            'synapse.ai.chat.ai_hint': '推奨配置：',
            'synapse.ai.chat.ai_list': '• フロア 3名（昼ピーク時 +2）<br>• キッチン 4名<br>• 人件費を18%削減見込み',
            'synapse.value.title': 'より賢く。より低コスト。より高収益。',
            'synapse.value.desc': '品質を損なわずにコスト削減を実現する、現代飲食向けツール。',
            'synapse.value.cta': 'デモ予約 →',
            'synapse.products.title': '業態に合わせたスマート技術',
            'synapse.products.item1.title': 'クイックサービス',
            'synapse.products.item1.desc': 'セルフ注文キオスク + KDS',
            'synapse.products.item2.title': 'フルサービス',
            'synapse.products.item2.desc': '統合POS + テーブル管理',
            'synapse.products.item3.title': 'ティー・デザート店',
            'synapse.products.item3.desc': '高速注文 + 受け取り表示',
            'synapse.products.item4.title': 'スマート中華レストラン',
            'synapse.products.item4.desc': 'Panshakerロボットによる精密制御',
            'synapse.products.item5.title': '火鍋ビュッフェ',
            'synapse.products.item5.desc': 'タブレット注文 + スマート会計',
            'synapse.products.item6.title': 'チェーン店運営',
            'synapse.products.item6.desc': '多店舗管理 + データ統合',
            'synapse.common.more': '詳しく見る →',
            'synapse.common.more_plain': '詳しく見る',
            'synapse.tiers.title': '最適なプランを選択',
            'synapse.tier.gold.desc': '究極のC2Mエンジン - 味のデジタルツイン',
            'synapse.tier.standard.desc': '自動化レストランの標準構成。ロボット中枢がG-Codeを直接配信し精密制御します。',
            'synapse.tier.lite.desc': '視覚在庫モニタリングとスマート遮断システム',
            'synapse.tier.lite.cta': '無料トライアル',
            'synapse.tier.care.desc': '聴覚障害者を支援するサイレント対話システム',
            'synapse.stories.title': '実例と成果',
            'synapse.stories.desc': 'PanOSで効率と収益を高めた実際の事例をご覧ください。',
            'synapse.features.title': '業務に最適なスマートハードウェア',
            'synapse.features.desc': 'POSからPanshakerロボットまで、包括的なインテリジェントソリューション。',
            'synapse.screens.title': 'PanOS の機能を体験',
            'synapse.screens.desc': '注文から提供までを一元管理する、次世代レストランオペレーション。',
            'synapse.screens.item1.title': 'AI神経ハブ',
            'synapse.screens.item1.desc': '自然言語で複雑な要望を即座に理解。AIが注文を解析し、卓番を認識してキッチンロボットへリアルタイム配信します。',
            'synapse.screens.item2.title': 'リアルタイムダッシュボード',
            'synapse.screens.item2.desc': '注文件数、売上、客単価、完了率など主要指標を一画面で可視化。データ駆動の意思決定を支援します。',
            'synapse.screens.item3.title': 'Panshakerスマート中華鍋',
            'synapse.screens.item3.desc': 'ロボット状態をリアルタイム監視し、油温を0.1°C単位で精密制御。G-Code直接配信で標準化された提供品質を実現。',
            'synapse.screens.item4.title': 'デリバリー統合プラットフォーム',
            'synapse.screens.item4.desc': '複数の配達注文を一つの画面で管理。主要プラットフォーム連携で自動受付・スマート配車が可能です。',
            'synapse.screens.item5.title': '味のデジタルツイン',
            'synapse.screens.item5.desc': '塩味・辛さ・油量などの嗜好を顧客ごとに記録し、真のC2Mパーソナライズを実現します。',
            'synapse.compare.title': 'どのOSが最適ですか？',
            'synapse.compare.feature': '機能',
            'synapse.compare.row1.k': '中核ハードウェア',
            'synapse.compare.row1.lite': 'カメラ + ボックス',
            'synapse.compare.row1.std': 'カメラ + ロボット',
            'synapse.compare.row1.gold': 'カメラ + ロボット',
            'synapse.compare.row1.care': '全バージョン対応',
            'synapse.compare.row2.k': '視覚在庫モニタリング',
            'synapse.compare.row3.k': 'デリバリー自動遮断',
            'synapse.compare.row4.k': 'ロボット自動調理',
            'synapse.compare.row4.std': '(標準 SOP)',
            'synapse.compare.row4.gold': '(動的調整)',
            'synapse.compare.row4.care': '適用',
            'synapse.compare.row5.k': '味の個別最適化 (C2M)',
            'synapse.compare.row6.k': 'アクセシビリティ振動インタラクション',
            'synapse.video.title': 'PanOS の実動作を見る',
            'synapse.video.desc': '注文から提供までのフローを完全デモ',
            'synapse.video.fallback': 'お使いのブラウザはHTML5動画に対応していません。ブラウザを更新してください。',
            'synapse.cta.title': '成長志向の飲食企業へ<br>スマートシステムを',
            'synapse.cta.desc': 'クイックデモで、御社に最適な導入プランをご提案します。',
            'synapse.cta.button': 'お問い合わせ',
            'synapse.cta.tip': '注記：現在は北米の飲食企業への提供に注力しています。',
            'synapse.partners.title': '世界の有力飲食企業を支援',
            'synapse.partners.link': 'パートナーを見る →',
            'synapse.footer.col1.title': '製品',
            'synapse.footer.col1.item1': 'POSシステム',
            'synapse.footer.col1.item2': 'セルフ注文キオスク',
            'synapse.footer.col1.item3': 'オンライン注文',
            'synapse.footer.col1.item4': 'Panshakerロボット',
            'synapse.footer.col1.item5': '会員ロイヤルティ',
            'synapse.footer.col2.title': '業態',
            'synapse.footer.col2.item1': 'フルサービス',
            'synapse.footer.col2.item2': 'クイックサービス',
            'synapse.footer.col2.item3': 'ティー・デザート',
            'synapse.footer.col2.item4': 'ロボットレストラン',
            'synapse.footer.col3.title': 'PanOSについて',
            'synapse.footer.col3.item1': '会社概要',
            'synapse.footer.col3.item2': 'Panshakerを知る',
            'synapse.footer.col3.item3': 'デモ予約',
            'synapse.footer.col4.title': 'リソース',
            'synapse.footer.col4.item1': 'ブログ',
            'synapse.footer.col4.item2': 'プライバシーポリシー',
            'synapse.footer.col4.item3': '利用規約',
            'synapse.footer.copyright': '2026 PanOS. All rights reserved.',
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
