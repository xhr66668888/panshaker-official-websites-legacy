import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Move '食材配送' and update '售后服务' and add '24小时售后服务热线'
    original_footer1 = '''                        <li><a href="investors.html" data-i18n="footer.investors">投资者关系</a></li>
                        <li><a href="delivery.html" data-i18n="footer.delivery">食材配送</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 data-i18n="footer.tech">技术支持</h4>
                    <ul>
                        <li><a href="synapse_os.html" data-i18n="footer.synapse">PanOS</a></li>'''
    
    # If the file hasn't been changed yet
    if '<li><a href="delivery.html" data-i18n="footer.delivery">食材配送</a></li>' in content and '<li><a href="index.html#after-sales" data-i18n="footer.support">售后服务</a></li>' not in content:
        # Move delivery from col1, and we will place it in col2
        content = content.replace(
            '''<li><a href="investors.html" data-i18n="footer.investors">投资者关系</a></li>\n                        <li><a href="delivery.html" data-i18n="footer.delivery">食材配送</a></li>''',
            '''<li><a href="investors.html" data-i18n="footer.investors">投资者关系</a></li>'''
        )
        content = content.replace(
            '''<li><a href="synapse_os.html" data-i18n="footer.synapse">PanOS</a></li>''',
            '''<li><a href="synapse_os.html" data-i18n="footer.synapse">PanOS</a></li>\n                        <li><a href="delivery.html" data-i18n="footer.delivery">食材配送</a></li>'''
        )

    # 售后服务 url update
    content = content.replace(
        '''<li><a href="#" data-i18n="footer.support">售后服务</a></li>''',
        '''<li><a href="index.html#after-sales" data-i18n="footer.support">售后服务</a></li>'''
    )

    # Email contact add 24h tel
    if '24小时售后服务热线: 216-255-0563' not in content:
        content = content.replace(
            '''<span data-i18n="footer.email">Email:\n                                    contact@panshaker.com</span></a></li>''',
            '''<span data-i18n="footer.email">Email:\n                                    contact@panshaker.com</span></a></li>\n                        <li><a href="tel:2162550563" data-i18n="footer.hotline">24小时售后服务热线: 216-255-0563</a></li>'''
        )
        # Also handle one-line version if exists
        content = content.replace(
            '''<span data-i18n="footer.email">Email: contact@panshaker.com</span></a></li>''',
            '''<span data-i18n="footer.email">Email: contact@panshaker.com</span></a></li>\n                        <li><a href="tel:2162550563" data-i18n="footer.hotline">24小时售后服务热线: 216-255-0563</a></li>'''
        )

    # Brand text replace
    brand_orig = '''<p style="font-size: 14px; color: #999; margin-bottom: 24px;" data-i18n="about.brand.desc">Panshaker
                Services 是芯厨师的海外品牌</p>'''
    
    brand_new = '''<p style="font-size: 14px; color: #999; margin-bottom: 24px;">
                <span data-i18n="about.brand.desc">Panshaker Services 是芯厨师的海外品牌</span><br>
                <span data-i18n="about.brand.subdesc">商务厅出海企业服务站</span>
            </p>'''

    content = content.replace(brand_orig, brand_new)

    # another format of brand text
    brand_orig2 = '''<p style="font-size: 14px; color: #999; margin-bottom: 24px;" data-i18n="about.brand.desc">Panshaker Services 是芯厨师的海外品牌</p>'''
    content = content.replace(brand_orig2, brand_new)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filepath in glob.glob('**/*.html', recursive=True):
    replace_in_file(filepath)

print("HTML transformations completed.")
