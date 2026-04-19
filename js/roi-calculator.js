// Panshaker ROI Calculator Logic

const ROI_STATE = {
  currentView: 'roi-hero-view', // roi-hero-view, roi-step-view, roi-result-view, roi-soft-landing
  currentStep: 1, // 1 to 4
  input: {
    zipCode: '90012',
    revenueRangeMid: 45000,
    tier: 2,
    chefCount: 2,
    currentPainPoints: [],
    wageInflation: 0,
    revGrowth: 0
  }
};

let currentROILang = "zh-CN";

const REVENUE_RANGES = [
  { label: "$15,000 - $30,000", mid: 22500 },
  { label: "$30,000 - $60,000", mid: 45000 },
  { label: "$60,000 - $100,000", mid: 80000 },
  { label: "$100,000 - $200,000", mid: 150000 },
  { label: "$200,000+", mid: 250000 }
];



function initROICalculator() {
  const container = document.getElementById('roi-calculator-section');
  if (!container) return;
  
  if (window.PanI18n && window.PanI18n.currentLang) {
      currentROILang = window.PanI18n.currentLang;
  }
  const s = ROI_I18N[currentROILang] || ROI_I18N['zh-CN'];
  
  // Set default tier for this lang
  const availableTiers = Object.keys(s.tierConfig);
  if (!availableTiers.includes(String(ROI_STATE.input.tier))) {
      ROI_STATE.input.tier = parseInt(availableTiers[0]);
  }

  container.innerHTML = `
    <!-- 跑马灯 -->
    <div class="roi-marquee">
        <p>${ROI_I18N['zh-CN'].marquee}</p>
    </div>

    <!-- 容器 -->
    <div class="roi-container" id="roi-main-container">
        
        <!-- Hero View -->
        <div id="roi-hero-view" class="roi-step-view active">
            <div class="roi-hero">
                <h2>${s.heroTitle}</h2>
                
                <div style="margin-bottom: 40px;">
                     <button class="roi-btn" onclick="ROIGoToStep('roi-questions-view', 1)">${s.btnStart}</button>
                </div>
                <div class="roi-hero-badges">
                    <span class="roi-badge">${s.badge1}</span>
                    <span class="roi-badge">${s.badge2}</span>
                    <span class="roi-badge">${s.badge3}</span>
                </div>
            </div>
        </div>

        <!-- Questions View -->
        <div id="roi-questions-view" class="roi-step-view">
            <!-- Step 1: ZIP -->
            <div id="roi-step-1" class="roi-form-group">
                <h3>${s.q1Title}</h3>
                
                <input type="text" id="roi-input-zip" class="roi-input" placeholder="${s.q1Placeholder}" value="90012" maxlength="5">
                <div style="margin-top: 30px;">
                    <button class="roi-btn" onclick="ROIProceedStep(2)">${s.btnNext}</button>
                </div>
            </div>

            <!-- Step 2: Revenue -->
            <div id="roi-step-2" class="roi-form-group" style="display:none;">
                <h3>${s.q2Title}</h3>
                <p class="roi-form-hint">${s.q2Hint}</p>
                <div class="roi-card-grid" id="roi-grid-revenue">
                    ${REVENUE_RANGES.map((r, i) => `
                        <div class="roi-card" onclick="ROISelectRevenue(${i})" id="roi-rev-${i}">
                            <div class="roi-card-title">${r.label}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(1)">${s.btnBack}</button>
                </div>
            </div>

            <!-- Step 3: Tier -->
            <div id="roi-step-3" class="roi-form-group" style="display:none;">
                <h3>${s.q3Title}</h3>
                <p class="roi-form-hint">${s.q3Hint}</p>
                <div class="roi-card-grid" id="roi-grid-tier">
                    ${Object.keys(s.tierConfig).map(tierId => `
                        <div class="roi-card" onclick="ROISelectTier(${tierId})" id="roi-tier-${tierId}">
                            <div class="roi-card-title">${s.tierConfig[tierId].name}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(2)">${s.btnBack}</button>
                </div>
            </div>

            <!-- Step 4: Chef Count -->
            <div id="roi-step-4" class="roi-form-group" style="display:none;">
                <h3>${s.q4Title}</h3>
                
                <div class="roi-card-grid" id="roi-grid-chef">
                    <div class="roi-card" onclick="ROISelectChef(1)" id="roi-chef-1">1 ${s.chefPlural}</div>
                    <div class="roi-card selected" onclick="ROISelectChef(2)" id="roi-chef-2">2 ${s.chefPlural}</div>
                    <div class="roi-card" onclick="ROISelectChef(3)" id="roi-chef-3">3 ${s.chefPlural}</div>
                    <div class="roi-card" onclick="ROISelectChef(4)" id="roi-chef-4">4 ${s.chefPlural}</div>
                    <div class="roi-card" onclick="ROISelectChef(5)" id="roi-chef-5">5+ ${s.chefPlural}</div>
                </div>
                <br>
                <!-- Optional Pain points -->
                <div style="margin-top: 20px;">
                    <p class="roi-form-hint">${s.q4Hint}</p>
                    <div class="roi-tag-grid" id="roi-grid-pain">
                        ${s.painPoints.map(p => `
                            <div class="roi-tag" onclick="ROITogglePain('${p.id}')" id="roi-pain-${p.id}">${p.label}</div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <button class="roi-btn roi-btn-outline" onclick="ROIProceedStep(3)">${s.btnBack}</button>
                    <button class="roi-btn" onclick="ROICalculateAndShow()">${s.btnSubmit}</button>
                </div>
            </div>

        </div>

        <!-- Result View -->
        <div id="roi-result-view" class="roi-step-view">
            <div class="roi-result-header">
                <p id="roi-result-subtitle" style="color: #666; font-size: 24px; font-weight: 500;">${s.resTitlePt1}XX${s.resTitlePt2}</p>
                <div class="roi-hero-number-wrap" style="margin-top: 40px;">
                    <span style="font-size: 40px; font-weight: bold; color: #0E427E;">$</span>
                    <span class="roi-hero-number" id="roi-number-hero">0</span>
                </div>
                <p style="font-size: 12px; color: #999;">${s.resDataSrc}</p>
                
                <div class="roi-slider-group" style="margin-top: 30px;">
                    <label>${s.resSliderWage} <span id="roi-val-wage-slider">0%</span></label>
                    <input type="range" min="0" max="25" step="5" value="0" id="roi-slider-wage" oninput="ROIUpdateSliders()">
                    <div class="roi-slider-ticks"><span>0%</span><span>5%</span><span>10%</span><span>15%</span><span>20%</span><span>25%</span></div>
                    
                    <label style="margin-top: 25px;">${s.resSliderRev} <span id="roi-val-rev-slider">0%</span></label>
                    <input type="range" min="0" max="25" step="5" value="0" id="roi-slider-rev" oninput="ROIUpdateSliders()">
                    <div class="roi-slider-ticks"><span>0%</span><span>5%</span><span>10%</span><span>15%</span><span>20%</span><span>25%</span></div>
                </div>
            </div>

            <div class="roi-stats-grid">
                <div class="roi-stat-card">
                    <div class="roi-stat-title">${s.resStat1T}</div>
                    <div class="roi-stat-value" id="roi-val-reduction">0%</div>
                    <div class="roi-stat-sub" id="roi-val-reduction-sub">${s.resStat1S}0</div>
                </div>
                <div class="roi-stat-card">
                    <div class="roi-stat-title">${s.resStat2T}</div>
                    <div class="roi-stat-value" id="roi-val-payback">0 ${s.resStat2M}</div>
                    <div class="roi-stat-sub">${s.resStat2S}</div>
                </div>
                <div class="roi-stat-card">
                    <div class="roi-stat-title">${s.resStat3T}</div>
                    <div class="roi-stat-value" id="roi-val-5year">$0</div>
                    <div class="roi-stat-sub">${s.resStat3S}</div>
                </div>
            </div>

            <!-- Detailed Insights (Now open) -->
            <div id="roi-breakdown-wrapper">
                    <!-- Breakdown -->
                    <div class="roi-breakdown-section">
                        <h3 style="font-size: 22px; color: #333; margin-bottom: 20px;">${s.resBrTitle1}</h3>
                        <p style="color: #666;">${s.resBrSub1}<strong style="color: #d32f2f; font-size: 20px;" id="roi-val-current-cost">$0</strong></p>
                        
                        <div class="roi-bar-container" id="roi-bar-container">
                            <div class="roi-bar-segment" id="roi-bar-1"></div>
                            <div class="roi-bar-segment" id="roi-bar-2"></div>
                            <div class="roi-bar-segment" id="roi-bar-3"></div>
                            <div class="roi-bar-segment" id="roi-bar-4"></div>
                            <div class="roi-bar-segment" id="roi-bar-5"></div>
                            <div class="roi-bar-segment" id="roi-bar-6"></div>
                        </div>

                        <div class="roi-legend">
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#0E427E"></div>${s.leg1} <span id="roi-leg-1" style="margin-left:auto; font-weight:500;">$0</span></div>
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#2c5ba3"></div>${s.leg2} <span id="roi-leg-2" style="margin-left:auto; font-weight:500;">$0</span></div>
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#4a74c8"></div>${s.leg3} <span id="roi-leg-3" style="margin-left:auto; font-weight:500;">$0</span></div>
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#688dee"></div>${s.leg4} <span id="roi-leg-4" style="margin-left:auto; font-weight:500;">$0</span></div>
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#85a6ff"></div>${s.leg5} <span id="roi-leg-5" style="margin-left:auto; font-weight:500;">$0</span></div>
                            <div class="roi-legend-item"><div class="roi-legend-color" style="background:#a3bfff"></div>${s.leg6} <span id="roi-leg-6" style="margin-left:auto; font-weight:500;">$0</span></div>
                        </div>
                    </div>
                    
                    <!-- Comparison Table -->
                    <h3 style="font-size: 22px; color: #333; margin: 40px 0 20px;">${s.resBrTitle2}</h3>
                    <table class="roi-comparison-table">
                        <tr>
                            <th></th>
                            <th>${s.tbTh1}</th>
                            <th class="panshaker-col">${s.tbTh2}</th>
                        </tr>
                        <tr>
                            <td>${s.tbRow1k}</td>
                            <td class="roi-table-bad">${s.tbRow1b}</td>
                            <td class="roi-table-good">${s.tbRow1g}</td>
                        </tr>
                        <tr>
                            <td>${s.tbRow2k}</td>
                            <td class="roi-table-bad">${s.tbRow2b}</td>
                            <td class="roi-table-good">${s.tbRow2g}</td>
                        </tr>
                    </table>

                    <!-- Savings Checklist -->
                    <div>
                        <h3 style="font-size: 22px; color: #333; margin-bottom: 20px;">${s.resBrTitle3}</h3>
                        <ul class="roi-checklist">
                            <li>${s.chk1}</li>
                            <li>${s.chk2}</li>
                            <li>${s.chk3}</li>
                            <li>${s.chk4}</li>
                            <li><strong>${s.chk5}</strong></li>
                            <li><strong>${s.chk6}</strong></li>
                        </ul>
                    </div>
                </div> <!-- End of Breakdown Wrapper -->
            
            <!-- Painpoints dynamic section -->
            <div id="roi-pain-feedback" style="background: #fdfaf0; border-left: 4px solid #f2c94c; padding: 20px; border-radius: 4px; margin-bottom: 40px; display: none;">
                <!-- dynamic pain inject -->
            </div>

            <!-- Investment Blur -->
            <div class="roi-investment-card">
                <h3 style="font-size: 26px; margin-bottom: 20px; font-weight: 600;">${s.cardTitle}</h3>
                <p style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">${s.cardSub}</p>
                
                <div id="roi-lease-highlight" style="background: rgba(255,255,255,0.9); color: #333; padding: 20px; border-radius: 8px; margin-bottom: 30px; font-weight: 500; font-size: 16px; border-left: 5px solid #0E427E; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- dynamic rent html -->
                </div>

                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; display: inline-block; margin-bottom: 30px; text-align: left;">
                    <div style="font-size: 18px; margin-bottom: 10px;">${s.pbTimePrefix}<strong style="font-size: 24px;" id="roi-val-blur-pb">3</strong> <strong>${s.pbTimeSuffix}</strong></div>
                    <div style="font-size: 18px;">${s.pbNetPrefix}<strong style="font-size: 24px;" id="roi-val-blur-net">$5,200+</strong></div>
                </div>
                <br>
                <a href="contact.html" class="roi-btn" style="background: #fff; color: #0E427E;">${s.btnQuote}</a>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <p style="font-size: 14px; color: #888;">${s.pdfTextHtml}</p>
                <div style="margin-top: 20px;">
                     <button class="roi-btn roi-btn-outline" onclick="ROIGoToStep('roi-questions-view', 1)">${s.btnRestart}</button>
                </div>
            </div>
        </div>

        <!-- Tier 6 Soft Landing View -->
        <div id="roi-soft-landing" class="roi-step-view">
            <div class="roi-soft-landing">
                <h3>${s.softTitle}</h3>
                <p>${s.softP1}</p>
                <ul>
                    <li>${s.softS1}</li>
                    <li>${s.softS2}</li>
                </ul>
                <div style="margin-top: 30px;">
                    <a href="contact.html" class="roi-btn roi-btn-outline">${s.softQuote}</a>
                </div>
                <div style="margin-top: 20px;">
                     <button class="roi-btn" style="background: transparent; color: #666; border: none; box-shadow: none;" onclick="ROIGoToStep('roi-questions-view', 1)">${s.btnRestart}</button>
                </div>
            </div>
        </div>
    </div>
  `;

  // Init selection highlight without triggering navigation
  ROI_STATE.input.revenueRangeMid = REVENUE_RANGES[1].mid;
  document.getElementById('roi-rev-1').classList.add('selected');
  
  ROI_STATE.input.tier = 2;
  document.getElementById('roi-tier-2').classList.add('selected');
  
  ROI_STATE.input.chefCount = 2;
  document.getElementById('roi-chef-2').classList.add('selected');
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
    
    // Fix jump to top scroll by using bounded bounding client rectangle relative to page
    const el = document.getElementById('roi-main-container');
    if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
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
    document.getElementById(`roi-chef-` + count) ? document.getElementById(`roi-chef-` + count).classList.add('selected') : null;
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
function calculateAggressive({ zipCode, revenueRangeMid, tier, chefCount, wageInflation, revGrowth }) {
  const s = ROI_I18N[currentROILang] || ROI_I18N['zh-CN'];
  
  const chefSalaryInfo = lookupChefSalary(zipCode);
  const regionName = chefSalaryInfo.region;
  const baseSalaryMultiplier = 1 + (wageInflation / 100);
  const revGrowthMultiplier = 1 + (revGrowth / 100);
  
  const chefMonthlyCostStr = chefSalaryInfo.cost * baseSalaryMultiplier;
  
  // Make sure tier defaults nicely if they changed language and current tier is invalid
  let tierInfo = s.tierConfig[tier];
  if (!tierInfo) {
      tierInfo = Object.values(s.tierConfig)[0];
  }
  const { stirFryRatio, replaceEfficiency, revenuePerRobot } = tierInfo;
  
  const projectedRevenue = revenueRangeMid * revGrowthMultiplier;
  let robotCount = 1;
  if (tierInfo.revenuePerRobot > 0) {
      robotCount = Math.max(1, Math.min(5, Math.round(projectedRevenue / tierInfo.revenuePerRobot)));
  }
  
  const baseLaborCost = chefMonthlyCostStr * chefCount;
  const turnoverCost = 375 * chefCount * baseSalaryMultiplier;  // Scales with wages
  const peakOvertimeCost = projectedRevenue > 40000 ? baseLaborCost * 0.15 : 0;
  
  // Generic fallback tier keys heuristic: 'tier' might be > 100.
  // Just use a flag if efficiency is > 0.
  const foodWasteCost = tierInfo.replaceEfficiency > 0 ? projectedRevenue * 0.02 : 0;
  const customerComplaintCost = tierInfo.replaceEfficiency > 0 ? projectedRevenue * 0.015 : 0;
  const sickLeaveCost = baseLaborCost * 0.08;
  const saasCost = 300;
  const paymentSurcharge = projectedRevenue * 0.007;  // 0.7%
  
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
  
  const firstYearInvestment = 13800 * robotCount;
  const paybackMonths = totalMonthlySavings > 0 ? (firstYearInvestment / totalMonthlySavings).toFixed(1) : 999;
  
  const laborReductionPct = baseLaborCost > 0 ? Math.round((laborSaved / baseLaborCost) * 100) : 0;
  
  return {
      isSoftLanding: (tierInfo.replaceEfficiency === 0),
      regionName,
      tierName: tierInfo.name,
      threeYearSavings,
      annualSavings,
      fiveYearSavings,
      paybackMonths,
      laborReductionPct,
      currentMonthlyTotalCost,
      monthlySavings: totalMonthlySavings,
      saasSaved,
      paymentSaved,
      robotCount,
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
function ROICalculateAndShow(isUpdate = false) {
    const res = calculateAggressive(ROI_STATE.input);
    const s = ROI_I18N[currentROILang] || ROI_I18N['zh-CN'];
    
    if (res.isSoftLanding) {
        ROIGoToStep('roi-soft-landing');
        return;
    }
    
    // Fill data
    document.getElementById('roi-result-subtitle').innerHTML = `${s.resTitlePt1}${res.regionName}${s.resTitlePt2}`;
    document.getElementById('roi-val-reduction').innerText = `${res.laborReductionPct}%`;
    document.getElementById('roi-val-reduction-sub').innerText = `${s.resStat1S}${Math.round(res.breakdown[0] * (res.laborReductionPct/100)).toLocaleString()}`;
    document.getElementById('roi-val-payback').innerText = `${res.paybackMonths}${s.resStat2M}`;
    document.getElementById('roi-val-5year').innerText = `$${Math.round(res.fiveYearSavings).toLocaleString()}+`;
    
    document.getElementById('roi-val-current-cost').innerText = `$${Math.round(res.currentMonthlyTotalCost).toLocaleString()}`;
    
    document.getElementById('roi-val-blur-pb').innerText = res.paybackMonths;
    const netTxt = Math.round(res.monthlySavings - 1800).toLocaleString();
    if (currentROILang === 'ja') {
        document.getElementById('roi-val-blur-net').innerText = `$${netTxt}`; // Custom for JP logic
    } else {
        document.getElementById('roi-val-blur-net').innerText = `$${netTxt}+`;
    }

    // Store state for interactive lease updates
    window.tempROISoftwareBonus = res.saasSaved + res.paymentSaved;
    window.tempROIRentBase = 1800;
    ROIRenderLeaseHighlight();

    // Pain points
    const painBox = document.getElementById('roi-pain-feedback');
    if (ROI_STATE.input.currentPainPoints.length > 0) {
        painBox.style.display = 'block';
        const targetId = ROI_STATE.input.currentPainPoints[0];
        const pObj = s.painPoints.find(p => p.id === targetId) || s.painPoints[0];
        const prefix = currentROILang.startsWith('zh') ? "<strong>针对您目前的困扰：</strong><br><br>" : "";
        painBox.innerHTML = `${prefix}${pObj.text}`;
    } else {
        painBox.style.display = 'none';
    }

    // Breakdown values
    const legVals = res.breakdown.map(v => Math.round(v));
    for (let i=0; i<6; i++) {
        document.getElementById(`roi-leg-1`).innerText = `$${legVals[0].toLocaleString()}`;
        document.getElementById(`roi-leg-2`).innerText = `$${legVals[1].toLocaleString()}`;
        document.getElementById(`roi-leg-3`).innerText = `$${legVals[2].toLocaleString()}`;
        document.getElementById(`roi-leg-4`).innerText = `$${legVals[3].toLocaleString()}`;
        document.getElementById(`roi-leg-5`).innerText = `$${legVals[4].toLocaleString()}`;
        document.getElementById(`roi-leg-6`).innerText = `$${legVals[5].toLocaleString()}`;
    }

    if (!isUpdate) {
        ROIGoToStep('roi-result-view');
        const el = document.getElementById('roi-main-container');
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

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

// B2B Feature Handlers
function ROIUpdateSliders() {
    ROI_STATE.input.wageInflation = parseInt(document.getElementById('roi-slider-wage').value);
    ROI_STATE.input.revGrowth = parseInt(document.getElementById('roi-slider-rev').value);
    
    document.getElementById('roi-val-wage-slider').innerText = ROI_STATE.input.wageInflation + '%';
    document.getElementById('roi-val-rev-slider').innerText = ROI_STATE.input.revGrowth + '%';
    
    ROICalculateAndShow(true); // Is update, don't auto scroll
}

function ROIRenderLeaseHighlight(customVal) {
    const rentValStr = customVal !== undefined ? customVal : window.tempROIRentBase;
    const rentVal = parseInt(rentValStr) || 0;
    const softwareBonus = window.tempROISoftwareBonus || 0;
    
    let netRent = rentVal - softwareBonus;
    const s = ROI_I18N[currentROILang] || ROI_I18N['zh-CN'];
    
    const bonusStr = Math.round(softwareBonus - 300).toLocaleString();
    let netStr = `$${Math.round(Math.abs(netRent)).toLocaleString()}`;
    
    let rentHtml = "";
    if (netRent > 0) {
        rentHtml = s.rentTemplateBasic.replace('{rentVal}', rentVal).replace('${softwareBonus_300}', `$${bonusStr}`).replace('${netRent}', netStr);
    } else {
        rentHtml = s.rentTemplateZero.replace('{rentVal}', rentVal).replace('${softwareBonus_300}', `$${bonusStr}`).replace('${netRent}', netStr);
    }
    
    rentHtml += `<p style="margin-top:10px; font-size:14px; opacity:0.8;">${s.disclaimerTax}</p>`;
    
    document.getElementById('roi-lease-highlight').innerHTML = rentHtml;
}

// Auto Init on script loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initROICalculator);
} else {
    initROICalculator();
}

document.addEventListener('langchange', function(e) {
    if (window.PanI18n) {
        currentROILang = window.PanI18n.currentLang;
        initROICalculator();
        if (ROI_STATE.currentView === 'roi-result-view') {
           ROICalculateAndShow(true);
        }
    }
});
