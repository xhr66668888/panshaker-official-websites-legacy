import json
import os
import glob
import re

# 1. Update roi-i18n.js
with open('js/roi-i18n.js', 'r', encoding='utf-8') as f:
    roi_content = f.read()

roi_content = roi_content.replace('由华盛顿大学团队研发', '中科院研发团队')
roi_content = roi_content.replace('由華盛頓大學團隊研發', '中科院研發團隊')

with open('js/roi-i18n.js', 'w', encoding='utf-8') as f:
    f.write(roi_content)

# 2. Update JSON files
def update_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        return
        
    # Update ads
    if 'solution.price_desc' in data:
        data['solution.price_desc'] = data['solution.price_desc'].replace('实现无人化烹饪', '彻底解决流失焦虑，告别招工难').replace('實現無人化烹飪', '徹底解決流失焦慮，告別招工難')
    if 'home.solution.price_desc' in data:
        data['home.solution.price_desc'] = data['home.solution.price_desc'].replace('实现无人化烹饪', '彻底解决流失焦虑，告别招工难').replace('實現無人化烹飪', '徹底解決流失焦慮，告別招工難')

    # Add missing keys
    if 'about.brand.subdesc' not in data:
        data['about.brand.subdesc'] = '商务厅出海企业服务站'
    if 'footer.support' not in data:
        data['footer.support'] = '售后服务'
    if 'footer.hotline' not in data:
        data['footer.hotline'] = '24小时售后服务热线: 216-255-0563'

    # Special handling for Traditional Chinese
    if 'zh-TW' in filepath or 'Hokkien' in filepath:
        data['about.brand.subdesc'] = 'logo panshaker是 四川省商務廳出海企業服務站'
        data['footer.support'] = '售後服務'
        data['footer.hotline'] = '24小時售後服務熱線: 216-255-0563'

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

for filepath in glob.glob('js/lang/*.json'):
    update_json(filepath)

# 3. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the specific block in index.html to avoid ad-copy change missing
html_content = html_content.replace(
'''<p data-i18n-html="home.solution.price_desc"
                        style="font-size: 22px; color: #333; font-weight: 500; line-height: 1.6;">竞品价格
                        1/2<br>&lt; 2周 低成本改装<br>实现无人化烹饪</p>''',
'''<p data-i18n-html="home.solution.price_desc"
                        style="font-size: 22px; color: #333; font-weight: 500; line-height: 1.6;">竞品价格
                        1/2<br>&lt; 2周 低成本改装<br>彻底解决流失焦虑，告别招工难</p>
                    <a href="x7_ai.html" data-i18n="home.solution.learn_more" class="learn-more-btn" style="margin-top:20px;">了解更多 →</a>'''
)

# Replace "实现无人化烹饪" anywhere else in the file if present
html_content = html_content.replace('实现无人化烹饪', '彻底解决流失焦虑，告别招工难')

after_sales_html = '''
    <!-- 售后服务 -->
    <section class="section after-sales" id="after-sales" style="background: #fff; text-align: center;">
        <div class="container">
            <h2 style="font-size: 36px; font-weight: 800; color: #1d1d1f; margin-bottom: 15px;">全美最好售后服务，没有之一！</h2>
            <p style="font-size: 20px; color: #d32f2f; font-weight: 700; margin-bottom: 40px; text-transform: uppercase;">100% 满意保证 · 24小时极速响应</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 50px;">
                <div style="padding: 30px; background: #fff; border: 2px solid #d32f2f; border-radius: 12px; box-shadow: 0 10px 20px rgba(211,47,47,0.1); transition: transform 0.3s;">
                    <h3 style="color: #d32f2f; font-size: 24px; font-weight: 800; margin-bottom: 15px;">7天无理由退货</h3>
                    <p style="font-size: 16px; color: #333; font-weight: 500; line-height: 1.6;">如果菜谱味道无法 100% 还原本店配方，<br>直接退回，绝不废话！</p>
                </div>
                
                <div style="padding: 30px; background: #0E427E; color: #fff; border-radius: 12px; box-shadow: 0 10px 20px rgba(14,66,126,0.2); transition: transform 0.3s;">
                    <h3 style="color: #62BA46; font-size: 24px; font-weight: 800; margin-bottom: 15px;">3年质量保证</h3>
                    <p style="font-size: 16px; color: #f0f0f0; line-height: 1.6;">三年内任何非人为损坏，免费上门维修，<br>零部件全包！</p>
                </div>
                
                <div style="padding: 30px; background: #f8f8fa; border: 1px solid #e0e0e0; border-radius: 12px; transition: transform 0.3s;">
                    <h3 style="color: #1d1d1f; font-size: 24px; font-weight: 800; margin-bottom: 15px;">24小时极速热线</h3>
                    <p style="font-size: 16px; color: #666; margin-bottom: 15px; line-height: 1.6;">机器坏了？不会用？断网了？<br>随时拨打专线，立即为您解决问题！</p>
                    <div style="font-size: 24px; font-weight: 800; color: #0E427E; letter-spacing: 1px;">☎ 216-255-0563</div>
                </div>
            </div>

            <div style="background: #fafafa; border-radius: 16px; padding: 40px; border-left: 6px solid #0E427E; margin-top: 20px;">
                <h3 style="font-size: 22px; font-weight: 700; color: #0E427E; margin-bottom: 30px;">以绝对的数据，证明绝对的可靠 (中国市场数据)</h3>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;">
                    <div style="text-align: center; flex: 1; min-width: 150px;">
                        <div style="font-size: 42px; font-weight: 900; color: #d32f2f; margin-bottom: 8px;">8000+</div>
                        <div style="font-size: 15px; color: #666; font-weight: 600;">出货量无退货*</div>
                    </div>
                    <div style="font-size: 40px; color: #e0e0e0; font-weight: 100; align-self: center;" class="mobile-hide-pipe">|</div>
                    <div style="text-align: center; flex: 1; min-width: 150px;">
                        <div style="font-size: 42px; font-weight: 900; color: #d32f2f; margin-bottom: 8px;">0</div>
                        <div style="font-size: 15px; color: #666; font-weight: 600;">无产品不满意退货</div>
                    </div>
                    <div style="font-size: 40px; color: #e0e0e0; font-weight: 100; align-self: center;" class="mobile-hide-pipe">|</div>
                    <div style="text-align: center; flex: 1; min-width: 150px;">
                        <div style="font-size: 42px; font-weight: 900; color: #d32f2f; margin-bottom: 8px;">&lt;0.5%</div>
                        <div style="font-size: 15px; color: #666; font-weight: 600;">极低故障率</div>
                    </div>
                    <div style="font-size: 40px; color: #e0e0e0; font-weight: 100; align-self: center;" class="mobile-hide-pipe">|</div>
                    <div style="text-align: center; flex: 1; min-width: 150px;">
                        <div style="font-size: 42px; font-weight: 900; color: #d32f2f; margin-bottom: 8px;">7年</div>
                        <div style="font-size: 15px; color: #666; font-weight: 600;">实验室稳定运行 0 故障</div>
                    </div>
                </div>
                <div style="font-size: 13px; color: #999; margin-top: 25px;">* 排除因餐厅经营不善倒闭结业引起的退换设备</div>
            </div>
        </div>
    </section>

'''

if 'id="after-sales"' not in html_content:
    # Insert right before   <!-- 获取方式 -->
    html_content = html_content.replace('    <!-- 获取方式 -->', after_sales_html + '    <!-- 获取方式 -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Done making script modifications!")
