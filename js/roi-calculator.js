// Panshaker ROI Calculator Logic

const ROI_STATE = {
  currentView: 'roi-hero-view', // roi-hero-view, roi-step-view, roi-result-view, roi-soft-landing
  currentStep: 1, // 1 to 4
  input: {
    zipCode: '90012',
    revenueRangeMid: 45000,
    tier: 2,
    chefCount: 2,
    currentPainPoints: []
  }
};

const REVENUE_RANGES = [
  { label: "$15,000 - $30,000", mid: 22500 },
  { label: "$30,000 - $60,000", mid: 45000 },
  { label: "$60,000 - $100,000", mid: 80000 },
  { label: "$100,000 - $200,000", mid: 150000 },
  { label: "$200,000+", mid: 250000 }
];

const PAIN_POINTS = [
  { id: "p1", label: "厨师难招", text: "您提到厨师难招 — 您不是一个人。2025 年加州中餐馆厨师空缺率高达 38%。Panshaker 永不会“不来上班”。" },
  { id: "p2", label: "厨师工资年年涨", text: "您提到厨师工资年年涨 — 通胀和最低工资法案让餐饮利润越来越薄。Panshaker 一次投入，锁定未来成本。" },
  { id: "p3", label: "中午忙不过来，口味不稳定", text: "您提到中午忙不过来，口味不稳定 — 峰值效率是利润杠杆。Panshaker 机器不知疲倦，每一盘都是一样的大厨水准。" },
  { id: "p4", label: "厨师签证 / 身份问题", text: "您提到厨师身份问题 — 这是整个美国中餐业的结构性挑战。Panshaker 帮您从根源上减少对专职炒锅师傅的依赖。" },
  { id: "p5", label: "厨师跳槽带走客源", text: "您提到厨师跳槽带走客源 — 让机器复刻您的招牌菜，把核心配方和客源牢牢掌握在自己手里。" },
  { id: "p6", label: "家族成员在厨房，想解放", text: "您提到想解放厨房里的家族成员 — 餐饮是生意，不该变成套住全家的牢笼。把炒锅交给机器，您和家人去做好管理。" }
];

function initROICalculator() {
  const container = document.getElementById('roi-calculator-section');
  if (!container) return;

  container.innerHTML = `
    <!-- 跑马灯 -->
    <div class="roi-marquee">
        <p>恭喜发财 · 生意兴隆 · 财源广进 · 日进斗金 · 一本万利 · 猪笼入水 · 风生水起 · 掂过碌蔗 · 盘满钵满 · 货如轮转 · 趁大钱 · 好运连连 · 蒸蒸日上 · 客似云来 · 财运亨通 · 和气生财 · 大吉大利 · 金玉满堂 · 步步高升 · 财神报到 · 越开越旺</p>
    </div>

    <!-- 容器 -->
    <div class="roi-container" id="roi-main-container">
        
        <!-- Hero View -->
        <div id="roi-hero-view" class="roi-step-view active">
            <div class="roi-hero">
                <h2>算一算，Panshaker能帮您多赚多少钱</h2>
                
                <div style="margin-bottom: 40px;">
                     <button class="roi-btn" onclick="ROIGoToStep('roi-questions-view', 1)">开始计算</button>
                </div>
                <div class="roi-hero-badges">
                    <span class="roi-badge">中国市场满意率100%（截止2026/4/15)</span>
                    <span class="roi-badge">由华盛顿大学团队硬核打造</span>
                    <span class="roi-badge">加州/纽约/内华达州免费上门</span>
                </div>
            </div>
        </div>

        <!-- Questions View -->
        <div id="roi-questions-view" class="roi-step-view">
            <!-- Step 1: ZIP -->
            <div id="roi-step-1" class="roi-form-group">
                <h3>1. 您的店在哪里？</h3>
                
                <input type="text" id="roi-input-zip" class="roi-input" placeholder="输入 5 位美国邮编 (如 90012)" value="90012" maxlength="5">
                <div style="margin-top: 30px;">
                    <button class="roi-btn" onclick="ROIProceedStep(2)">下一步</button>
                </div>
            </div>

            <!-- Step 2: Revenue -->
            <div id="roi-step-2" class="roi-form-group" style="display:none;">
                <h3>2. 您的餐厅大概月营业额</h3>
                <p class="roi-form-hint">选择最符合您情况的区间</p>
                <div class="roi-card-grid" id="roi-grid-revenue">
                    ${REVENUE_RANGES.map((r, i) => `
                        <div class="roi-card" onclick="ROISelectRevenue(${i})" id="roi-rev-${i}">
                            <div class="roi-card-title">${r.label}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(1)">返回</button>
                </div>
            </div>

            <!-- Step 3: Tier -->
            <div id="roi-step-3" class="roi-form-group" style="display:none;">
                <h3>3. 您的餐厅主要做什么菜系</h3>
                <p class="roi-form-hint">这将决定机器人能帮您替代多少炒锅工作量</p>
                <div class="roi-card-grid" id="roi-grid-tier">
                    ${Object.keys(TIER_CONFIG).map(tierId => `
                        <div class="roi-card" onclick="ROISelectTier(${tierId})" id="roi-tier-${tierId}">
                            <div class="roi-card-title">${TIER_CONFIG[tierId].name}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(2)">返回</button>
                </div>
            </div>

            <!-- Step 4: Chef Count -->
            <div id="roi-step-4" class="roi-form-group" style="display:none;">
                <h3>4. 您现在雇了几位炒锅师傅？</h3>
                
                <div class="roi-card-grid" id="roi-grid-chef">
                    <div class="roi-card" onclick="ROISelectChef(1)">1 位</div>
                    <div class="roi-card selected" onclick="ROISelectChef(2)" id="roi-chef-2">2 位</div>
                    <div class="roi-card" onclick="ROISelectChef(3)">3 位</div>
                    <div class="roi-card" onclick="ROISelectChef(4)">4 位</div>
                    <div class="roi-card" onclick="ROISelectChef(5)">5+ 位</div>
                </div>
                <br>
                <!-- Optional Pain points -->
                <div style="margin-top: 20px;">
                    <p class="roi-form-hint">（可选）您目前最头疼的是什么？</p>
                    <div class="roi-tag-grid" id="roi-grid-pain">
                        ${PAIN_POINTS.map(p => `
                            <div class="roi-tag" onclick="ROITogglePain('${p.id}')" id="roi-pain-${p.id}">${p.label}</div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(3)">返回</button>
                    <button class="roi-btn" onclick="ROICalculateAndShow()">&nbsp;&nbsp;生成报告&nbsp;&nbsp;</button>
                </div>
            </div>

        </div>

        <!-- Result View -->
        <div id="roi-result-view" class="roi-step-view">
            <div class="roi-result-header">
                <p id="roi-result-subtitle" style="color: #666; font-size: 24px; font-weight: 500;">您在XX的餐厅<br>3年可以多赚</p>
                <div class="roi-hero-number-wrap" style="margin-top: 40px;">
                    <span style="font-size: 40px; font-weight: bold; color: #0E427E;">$</span>
                    <span class="roi-hero-number" id="roi-number-hero">0</span>
                </div>
                <p style="font-size: 12px; color: #999;">数据来源：BLS 2025 劳工统计 · ZipRecruiter 行业工资 · Panshaker 客户实测</p>
            </div>

            <div class="roi-stats-grid">
                <div class="roi-stat-card">
                    <div class="roi-stat-title">人工成本直降</div>
                    <div class="roi-stat-value" id="roi-val-reduction">0%</div>
                    <div class="roi-stat-sub" id="roi-val-reduction-sub">每月立省 $0</div>
                </div>
                <div class="roi-stat-card">
                    <div class="roi-stat-title">投资回本仅需</div>
                    <div class="roi-stat-value" id="roi-val-payback">0 个月</div>
                    <div class="roi-stat-sub">之后全是净赚</div>
                </div>
                <div class="roi-stat-card">
                    <div class="roi-stat-title">5 年累计收益</div>
                    <div class="roi-stat-value" id="roi-val-5year">$0</div>
                    <div class="roi-stat-sub">相当于再开一家店</div>
                </div>
            </div>

            <!-- Breakdown -->
            <div class="roi-breakdown-section">
                <h3 style="font-size: 22px; color: #333; margin-bottom: 20px;">您可能低估了现在的真实成本</h3>
                <p style="color: #666;">大多数餐厅老板只看到厨师月薪，忽略了其他 60% 的隐性成本。<br>当前每月总人力相关成本：<strong style="color: #d32f2f; font-size: 20px;" id="roi-val-current-cost">$0</strong></p>
                
                <div class="roi-bar-container" id="roi-bar-container">
                    <div class="roi-bar-segment" id="roi-bar-1"></div>
                    <div class="roi-bar-segment" id="roi-bar-2"></div>
                    <div class="roi-bar-segment" id="roi-bar-3"></div>
                    <div class="roi-bar-segment" id="roi-bar-4"></div>
                    <div class="roi-bar-segment" id="roi-bar-5"></div>
                    <div class="roi-bar-segment" id="roi-bar-6"></div>
                </div>

                <div class="roi-legend">
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#0E427E"></div>炒锅师傅全包成本 <span id="roi-leg-1" style="margin-left:auto; font-weight:500;">$0</span></div>
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#2c5ba3"></div>厨师流失摊销 <span id="roi-leg-2" style="margin-left:auto; font-weight:500;">$0</span></div>
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#4a74c8"></div>旺季高峰加班费 <span id="roi-leg-3" style="margin-left:auto; font-weight:500;">$0</span></div>
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#688dee"></div>食材浪费与客诉退单 <span id="roi-leg-4" style="margin-left:auto; font-weight:500;">$0</span></div>
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#85a6ff"></div>病假与事假替班 <span id="roi-leg-5" style="margin-left:auto; font-weight:500;">$0</span></div>
                    <div class="roi-legend-item"><div class="roi-legend-color" style="background:#a3bfff"></div>SaaS与支付手续费溢价 <span id="roi-leg-6" style="margin-left:auto; font-weight:500;">$0</span></div>
                </div>
            </div>

            <!-- Savings Checklist -->
            <div>
                <h3 style="font-size: 22px; color: #333; margin-bottom: 20px;">使用 Panshaker 后帮您省下的成本</h3>
                <ul class="roi-checklist">
                    <li>炒锅人工大幅减少，彻底告别依赖</li>
                    <li>机器永不跳槽、不生病，流失焦虑减少</li>
                    <li>旺季高峰火力全开，没有加班费</li>
                    <li>精准烹饪，口味稳定，极度降低退餐率</li>
                    <li><strong>免费赠送我们自研的商用餐厅管理系统 + 扫码点餐 + 会员系统（完全替代市面上的昂贵高额月费方案）</strong></li>
                    <li><strong>内建 0 手续费支付通道网关（仅收基础通道费和信用卡费，我们绝无分毫加点抽成溢价）</strong></li>
                </ul>
            </div>
            
            <!-- Painpoints dynamic section -->
            <div id="roi-pain-feedback" style="background: #fdfaf0; border-left: 4px solid #f2c94c; padding: 20px; border-radius: 4px; margin-bottom: 40px; display: none;">
                <!-- dynamic -->
            </div>

            <!-- Investment Blur -->
            <div class="roi-investment-card">
                <h3 style="font-size: 26px; margin-bottom: 20px; font-weight: 600;">您的 Panshaker 专属投资方案</h3>
                <p style="font-size: 16px; opacity: 0.9; margin-bottom: 30px;">根据您的餐厅规模 / 签约时长 / 所在州，我们会为您提供最优报价。</p>
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 30px; text-align: left;">
                    <div style="font-size: 18px; margin-bottom: 10px;">回本周期：仅需 <strong style="font-size: 24px;" id="roi-val-blur-pb">3</strong> <strong>个月</strong></div>
                    <div style="font-size: 18px;">之后每月净利：<strong style="font-size: 24px;" id="roi-val-blur-net">$5,200+</strong></div>
                </div>
                <br>
                <a href="contact.html" class="roi-btn" style="background: #fff; color: #0E427E;">获取我的专属报价</a>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <p style="font-size: 14px; color: #888;">如果不想现在预约联系，也可以 <a href="#" style="color: #0E427E; text-decoration: underline;">下载 PDF 版 ROI 分析报告</a> (需输入邮箱)</p>
                <div style="margin-top: 20px;">
                     <button class="roi-btn roi-btn-outline" onclick="ROIGoToStep('roi-questions-view', 1)">重新计算</button>
                </div>
            </div>
        </div>

        <!-- Tier 6 Soft Landing View -->
        <div id="roi-soft-landing" class="roi-step-view">
            <div class="roi-soft-landing">
                <h3>感谢您的坦诚分享</h3>
                <p>Panshaker 的核心优势是全自动“炒菜/快炒”。对于您这类炒菜占比较低的业态（火锅 / 烧烤 / 寿司），炒菜机器人的帮助可能有限 —— 我们不会劝您购买不适用的产品。<br><br>但我们的姊妹产品可能仍然对您有用：</p>
                
                <div style="text-align:left; max-width: 600px; margin: 0 auto; background: #f0f4f8; padding: 30px; border-radius: 12px; margin-bottom: 40px;">
                    <ul class="roi-checklist" style="margin-bottom: 0;">
                        <li>完全免费的 POS + 扫码点餐 + 会员系统（为您每年省 $3,600+）</li>
                        <li>Tilled 零抽成极速支付通道（砍掉超额费率）</li>
                        <li>免费客流分析与菜品排行数据后台</li>
                    </ul>
                </div>
                
                <a href="synapse_os.html" class="roi-btn">了解免费 SaaS 与软件方案</a>
                
                <div style="margin-top: 40px;">
                     <button class="roi-btn roi-btn-outline" onclick="ROIGoToStep('roi-questions-view', 1)">修改计算条件</button>
                </div>
            </div>
        </div>

    </div>
  `;

  // Init selection highlight
  ROISelectRevenue(1);
  ROISelectTier(2);
  ROISelectChef(2);
}

// Nav Logic
function ROIGoToStep(viewId, stepId) {
    document.querySelectorAll('.roi-step-view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if (viewId === 'roi-questions-view') {
        ROIProceedStep(stepId);
    }
}

function ROIProceedStep(step) {
    for(let i=1; i<=4; i++) {
        document.getElementById(`roi-step-${i}`).style.display = 'none';
    }
    document.getElementById(`roi-step-${step}`).style.display = 'block';
    
    // update state from input if needed
    if (step === 2) {
        ROI_STATE.input.zipCode = document.getElementById('roi-input-zip').value || '90012';
    }
    window.scrollTo({ top: document.getElementById('roi-main-container').offsetTop - 50, behavior: 'smooth' });
}

// Select Logic
function ROISelectRevenue(index) {
    ROI_STATE.input.revenueRangeMid = REVENUE_RANGES[index].mid;
    document.querySelectorAll('#roi-grid-revenue .roi-card').forEach(e => e.classList.remove('selected'));
    document.getElementById(`roi-rev-${index}`).classList.add('selected');
    setTimeout(() => ROIProceedStep(3), 300); // 自动进入下一步
}

function ROISelectTier(tierId) {
    ROI_STATE.input.tier = tierId;
    document.querySelectorAll('#roi-grid-tier .roi-card').forEach(e => e.classList.remove('selected'));
    document.getElementById(`roi-tier-${tierId}`).classList.add('selected');
    setTimeout(() => ROIProceedStep(4), 300); // 自动进入下一步
}

function ROISelectChef(count) {
    ROI_STATE.input.chefCount = count;
    document.querySelectorAll('#roi-grid-chef .roi-card').forEach(e => e.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function ROITogglePain(id) {
    const el = document.getElementById(`roi-pain-${id}`);
    if (el.classList.contains('selected')) {
        el.classList.remove('selected');
        ROI_STATE.input.currentPainPoints = ROI_STATE.input.currentPainPoints.filter(i => i !== id);
    } else {
        el.classList.add('selected');
        ROI_STATE.input.currentPainPoints.push(id);
    }
}

// Calculate
function calculateAggressive(input) {
  const { zipCode, revenueRangeMid, tier, chefCount } = input;
  
  if (tier == 6) { return { isSoftLanding: true }; }
  
  const chefSalaryInfo = lookupChefSalary(zipCode);
  const chefMonthlyCostStr = chefSalaryInfo.cost;
  const regionName = chefSalaryInfo.region;
  
  const tierInfo = TIER_CONFIG[tier];
  const { stirFryRatio, replaceEfficiency, revenuePerRobot } = tierInfo;
  
  const robotCount = Math.max(1, Math.min(5, Math.round(revenueRangeMid / revenuePerRobot)));
  
  // Current Costs (Loading factor 1.4 applied implicitly as base is full cost, wait, the doc says lookup returns ~75 percentile. Let's make sure it's 1.4x of base)
  // Actually doc says "查工资（已经是 75th percentile 的上限值）" "Loading factor 从 1.3x 提到 1.4x"
  // So the base labor cost is directly chefMonthlyCost * chefCount.
  const baseLaborCost = chefMonthlyCostStr * chefCount;
  const turnoverCost = 375 * chefCount;  // $375/month/chef
  const peakOvertimeCost = revenueRangeMid > 40000 ? baseLaborCost * 0.15 : 0;
  const foodWasteCost = tier <= 4 ? revenueRangeMid * 0.02 : 0;
  const customerComplaintCost = tier <= 4 ? revenueRangeMid * 0.015 : 0;
  const sickLeaveCost = baseLaborCost * 0.08;
  const saasCost = 300;
  const paymentSurcharge = revenueRangeMid * 0.007;  // 0.7%
  
  const currentMonthlyTotalCost = 
    baseLaborCost + turnoverCost + peakOvertimeCost + 
    foodWasteCost + customerComplaintCost + sickLeaveCost + 
    saasCost + paymentSurcharge;
    
  // Savings
  const laborSaved = baseLaborCost * stirFryRatio * replaceEfficiency;
  const turnoverSaved = turnoverCost * stirFryRatio * replaceEfficiency;
  const overtimeSaved = peakOvertimeCost;
  const wasteSaved = foodWasteCost * 0.8;
  const complaintSaved = customerComplaintCost * 0.8;
  const sickLeaveSaved = sickLeaveCost * 0.5;
  const saasSaved = saasCost;
  const paymentSaved = paymentSurcharge;
  
  const totalMonthlySavings = 
    laborSaved + turnoverSaved + overtimeSaved + 
    wasteSaved + complaintSaved + sickLeaveSaved + 
    saasSaved + paymentSaved;
    
  const annualSavings = totalMonthlySavings * 12;
  const threeYearSavings = annualSavings * 3;
  const fiveYearSavings = annualSavings * 5;
  
  // First year investment (internal calc)
  const firstYearInvestment = 13800 * robotCount;
  const paybackMonths = Math.ceil(firstYearInvestment / totalMonthlySavings);
  
  const laborReductionPct = Math.round((laborSaved / baseLaborCost) * 100);
  
  return {
      isSoftLanding: false,
      regionName,
      tierName: tierInfo.name,
      threeYearSavings,
      annualSavings,
      fiveYearSavings,
      paybackMonths,
      laborReductionPct,
      currentMonthlyTotalCost,
      monthlySavings: totalMonthlySavings,
      breakdown: [
          baseLaborCost,
          turnoverCost,
          peakOvertimeCost,
          foodWasteCost + customerComplaintCost,
          sickLeaveCost,
          saasCost + paymentSurcharge
      ]
  };
}

// Result Renderer
function ROICalculateAndShow() {
    const res = calculateAggressive(ROI_STATE.input);
    
    if (res.isSoftLanding) {
        ROIGoToStep('roi-soft-landing');
        return;
    }
    
    // Fill data
    document.getElementById('roi-result-subtitle').innerHTML = `您在 ${res.regionName} 的餐厅<br>3年可以多赚`;
    document.getElementById('roi-val-reduction').innerText = `${res.laborReductionPct}%`;
    document.getElementById('roi-val-reduction-sub').innerText = `每月立省 $${Math.round(res.breakdown[0] * (res.laborReductionPct/100)).toLocaleString()}`;
    document.getElementById('roi-val-payback').innerText = `${res.paybackMonths} 个月`;
    document.getElementById('roi-val-5year').innerText = `$${Math.round(res.fiveYearSavings).toLocaleString()}+`;
    
    document.getElementById('roi-val-current-cost').innerText = `$${Math.round(res.currentMonthlyTotalCost).toLocaleString()}`;
    
    document.getElementById('roi-val-blur-pb').innerText = res.paybackMonths;
    document.getElementById('roi-val-blur-net').innerText = `$${Math.round(res.monthlySavings - 1600).toLocaleString()}+`; // roughly net

    // Pain points
    const painBox = document.getElementById('roi-pain-feedback');
    if (ROI_STATE.input.currentPainPoints.length > 0) {
        painBox.style.display = 'block';
        const p1 = PAIN_POINTS.find(p => p.id === ROI_STATE.input.currentPainPoints[0]);
        painBox.innerHTML = `<strong>针对您目前的困扰：</strong><br><br>${p1.text}`;
    } else {
        painBox.style.display = 'none';
    }

    // Breakdown values
    const legVals = res.breakdown.map(v => Math.round(v));
    for (let i=0; i<6; i++) {
        document.getElementById(`roi-leg-${i+1}`).innerText = `$${legVals[i].toLocaleString()}`;
    }

    ROIGoToStep('roi-result-view');
    window.scrollTo({ top: document.getElementById('roi-main-container').offsetTop - 50, behavior: 'smooth' });

    // Animate Hero Number
    animateValue(document.getElementById('roi-number-hero'), 0, Math.round(res.threeYearSavings), 1500);

    // Animate Bar Chart
    setTimeout(() => {
        const total = res.currentMonthlyTotalCost;
        res.breakdown.forEach((val, i) => {
            const pct = (val / total) * 100;
            document.getElementById(`roi-bar-${i+1}`).style.width = `${pct}%`;
        });
    }, 500);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProg = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProg * (end - start) + start).toLocaleString() + "+";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Auto Init on script loaded
document.addEventListener('DOMContentLoaded', () => {
    initROICalculator();
});
