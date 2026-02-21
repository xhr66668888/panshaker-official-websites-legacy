# Panshaker Services 官网 — 部署指南

> 本站为纯静态网站（HTML/CSS/JS），无需后端运行时。  
> 将项目文件复制到 Web 服务器的根目录即可运行。

---

## 目录

1. [前置检查清单](#1-前置检查清单)
2. [方案一：Linux + Nginx](#2-方案一linux--nginx)
3. [方案二：Windows + IIS](#3-方案二windows--iis)
4. [方案三：阿里云](#4-方案三阿里云)
5. [方案四：Azure](#5-方案四azure)
6. [HTTPS 配置](#6-https-配置)
7. [常见问题](#7-常见问题)

---

## 1. 前置检查清单

部署前确认以下事项：

- [ ] `assets/images/logo-transparent.png` 文件已提供（Favicon 用）
- [ ] 所有页面在本地浏览器打开正常
- [ ] 域名已购买并完成备案（中国大陆服务器需要 ICP 备案）
- [ ] DNS 解析已指向服务器 IP

**项目文件清单（必须部署的文件）：**

```
index.html
about.html
careers.html
investors.html
synapse_os.html
profile_xu.html
profile_sun.html
profile_unknown.html
web.config              ← 仅 IIS 需要
assets/                 ← 整个目录
js/                     ← 整个目录
```

**不需要部署的文件：**

```
docs/                   ← 内部文档，不需要公开
README.md
.git/
```

---

## 2. 方案一：Linux + Nginx

### 2.1 安装 Nginx

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y nginx

# CentOS / RHEL / AlmaLinux
sudo yum install -y epel-release && sudo yum install -y nginx

# 启动并设置开机自启
sudo systemctl enable --now nginx
```

### 2.2 部署文件

```bash
# 创建网站目录
sudo mkdir -p /var/www/panshaker

# 将项目文件复制到网站目录（排除 docs/ 和 .git/）
rsync -av --exclude='docs/' --exclude='.git/' --exclude='.gitignore' \
  /path/to/panshaker-official-websites-legacy/ /var/www/panshaker/

# 设置权限
sudo chown -R www-data:www-data /var/www/panshaker
sudo chmod -R 755 /var/www/panshaker
```

### 2.3 配置 Nginx

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/panshaker.conf
```

写入以下内容：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name panshaker.com www.panshaker.com;  # ← 替换为你的域名

    root /var/www/panshaker;
    index index.html;
    charset utf-8;

    # 中文文件名支持（截图文件名包含中文）
    location / {
        try_files $uri $uri/ =404;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|webp|avif|ico|svg|mp3|mp4|ttf|otf|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # JS/CSS 缓存（较短，方便更新）
    location ~* \.(js|css|json)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # WebP MIME 类型（Nginx 默认已支持，这里确保一下）
    types {
        image/webp webp;
        image/avif avif;
        font/ttf   ttf;
        font/otf   otf;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript application/json;
    gzip_min_length 1024;

    # 禁止访问隐藏文件和文档
    location ~ /\. {
        deny all;
    }
    location /docs/ {
        deny all;
    }
}
```

### 2.4 启用站点

```bash
# 创建符号链接启用站点
sudo ln -sf /etc/nginx/sites-available/panshaker.conf /etc/nginx/sites-enabled/

# 移除默认站点（可选）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

### 2.5 验证

```bash
curl -I http://localhost
# 应返回 200 OK
```

浏览器访问 `http://你的服务器IP` 应看到首页。

---

## 3. 方案二：Windows + IIS

### 3.1 启用 IIS

```
控制面板 → 程序和功能 → 启用或关闭 Windows 功能
→ 勾选 "Internet Information Services"
→ 勾选 "World Wide Web Services" 下所有子项
→ 确定，等待安装完成
```

或 PowerShell（以管理员运行）：

```powershell
Install-WindowsFeature -Name Web-Server -IncludeManagementTools
```

### 3.2 部署文件

**是的，你可以直接把文件放到 `wwwroot` 目录：**

```
C:\inetpub\wwwroot\
```

1. 删除 `wwwroot` 中的默认文件（`iisstart.htm`、`iisstart.png`）
2. 将项目所有文件复制到 `C:\inetpub\wwwroot\`（排除 `docs/` 和 `.git/`）

最终结构：

```
C:\inetpub\wwwroot\
├── index.html          ✅
├── about.html          ✅
├── careers.html        ✅
├── investors.html      ✅
├── synapse_os.html     ✅
├── profile_xu.html     ✅
├── profile_sun.html    ✅
├── profile_unknown.html ✅
├── web.config          ✅ (WebP MIME 类型已配置)
├── assets\             ✅
└── js\                 ✅
```

### 3.3 验证 MIME 类型

项目的 `web.config` 已配置了 `.webp` MIME 类型。如需额外添加 AVIF 支持：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <staticContent>
            <mimeMap fileExtension=".webp" mimeType="image/webp" />
            <mimeMap fileExtension=".avif" mimeType="image/avif" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <mimeMap fileExtension=".mp4"  mimeType="video/mp4" />
            <mimeMap fileExtension=".ttf"  mimeType="font/ttf" />
            <mimeMap fileExtension=".otf"  mimeType="font/otf" />
        </staticContent>
        <httpProtocol>
            <customHeaders>
                <add name="X-Frame-Options" value="SAMEORIGIN" />
                <add name="X-Content-Type-Options" value="nosniff" />
            </customHeaders>
        </httpProtocol>
    </system.webServer>
</configuration>
```

### 3.4 中文文件名问题

截图文件名包含中文（如 `屏幕截图 2026-01-28 131913.png`）。IIS 默认支持中文路径，但如果遇到 404，检查：

1. IIS Manager → 站点 → 请求筛选 → 确保"允许双重转义"已启用
2. 或在 `web.config` 添加：

```xml
<security>
    <requestFiltering allowDoubleEscaping="true" />
</security>
```

### 3.5 绑定域名

1. 打开 **IIS 管理器**（`inetmgr`）
2. 左侧展开 → 站点 → Default Web Site → 右键 → 编辑绑定
3. 添加绑定：类型 `http`，端口 `80`，主机名填域名（如 `panshaker.com`）
4. 再添加一个 `www.panshaker.com`

---

## 4. 方案三：阿里云

阿里云提供多种方式部署静态网站，从简单到专业排列：

### 方案 A：OSS + CDN（推荐，最简单，最便宜）

适合纯静态网站，无需管理服务器。

#### 步骤 1：创建 OSS Bucket

1. 登录 [阿里云控制台](https://oss.console.aliyun.com/)
2. 创建 Bucket：
   - 名称：`panshaker-web`
   - 地域：选择离用户最近的地域
   - 存储类型：标准存储
   - 读写权限：**公共读**
3. 进入 Bucket → 基础设置 → **静态页面**：
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`（或自定义 404 页面）

#### 步骤 2：上传文件

方式一：网页控制台上传（文件少时）

方式二：ossutil 命令行（推荐）

```bash
# 安装 ossutil
curl -o ossutil https://gosspublic.alicdn.com/ossutil/install.sh && bash install.sh

# 配置（需要 AccessKey）
ossutil config

# 上传整个目录（排除文档目录）
ossutil cp -r /path/to/panshaker-official-websites-legacy/ \
  oss://panshaker-web/ \
  --exclude "docs/*" --exclude ".git/*" --exclude ".gitignore"
```

#### 步骤 3：绑定域名 + CDN

1. OSS Bucket → 传输管理 → 绑定自定义域名
2. 填入域名 → 自动开通 CDN 加速
3. 在域名 DNS 添加 CNAME 记录，指向阿里云提供的 CDN 域名
4. CDN 控制台 → 缓存配置：
   - HTML 文件缓存: 10 分钟
   - 图片/字体/媒体: 30 天
   - JS/JSON: 7 天

#### 步骤 4：HTTPS

CDN 控制台 → HTTPS 配置 → 免费申请 SSL 证书 → 开启

### 方案 B：ECS 云服务器

如果已有 ECS 实例，按照 [方案一 (Linux + Nginx)](#2-方案一linux--nginx) 部署即可。

```bash
# SSH 连接到 ECS
ssh root@你的ECS公网IP

# 后续步骤同方案一
```

### 方案 C：函数计算 FC（Serverless）

1. 阿里云函数计算控制台 → 创建服务
2. 创建函数 → 选择"HTTP 函数"
3. 运行环境选择 `custom`，上传代码包
4. 绑定自定义域名

> 对于纯静态网站，**方案 A (OSS + CDN)** 成本最低，维护最简单，推荐使用。

---

## 5. 方案四：Azure

### 方案 A：Azure Static Web Apps（推荐）

免费层即可满足需求，支持自定义域名和 HTTPS。

#### 步骤 1：通过 GitHub 部署（最简单）

1. 将代码推送到 GitHub 仓库
2. Azure Portal → 创建资源 → 搜索 **Static Web Apps** → 创建
3. 配置：
   - 名称：`panshaker-web`
   - 计划类型：Free
   - 源：GitHub
   - 选择仓库和分支
   - 构建预设：Custom
   - App 位置：`/`（根目录）
   - API 位置：留空
   - 输出位置：留空
4. 点击创建 → Azure 自动生成 GitHub Actions workflow 文件
5. 每次 `git push` 自动部署

#### 步骤 2：通过 CLI 部署（无 GitHub）

```bash
# 安装 Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# 安装 SWA CLI
npm install -g @azure/static-web-apps-cli

# 登录
az login

# 创建资源组（首次）
az group create --name panshaker-rg --location eastasia

# 创建 Static Web App
az staticwebapp create \
  --name panshaker-web \
  --resource-group panshaker-rg \
  --location eastasia2

# 获取部署 token
DEPLOY_TOKEN=$(az staticwebapp secrets list \
  --name panshaker-web \
  --resource-group panshaker-rg \
  --query "properties.apiKey" -o tsv)

# 部署
swa deploy /path/to/panshaker-official-websites-legacy/ \
  --deployment-token $DEPLOY_TOKEN \
  --env production
```

#### 步骤 3：自定义域名

1. Azure Portal → Static Web Apps → 自定义域名 → 添加
2. 域名 DNS 添加 CNAME 记录指向 `panshaker-web.azurestaticapps.net`
3. HTTPS 证书自动签发

#### 步骤 4：路由配置（可选）

在项目根目录创建 `staticwebapp.config.json`：

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "mimeTypes": {
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".json": "application/json",
    ".ttf": "font/ttf",
    ".otf": "font/otf"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=3600"
  },
  "routes": [
    {
      "route": "/docs/*",
      "statusCode": 404
    },
    {
      "route": "/assets/*",
      "headers": {
        "Cache-Control": "public, max-age=2592000, immutable"
      }
    }
  ]
}
```

### 方案 B：Azure Blob Storage + CDN

类似阿里云 OSS 方案：

```bash
# 创建存储账户
az storage account create \
  --name panshakerweb \
  --resource-group panshaker-rg \
  --location eastasia \
  --sku Standard_LRS

# 启用静态网站托管
az storage blob service-properties update \
  --account-name panshakerweb \
  --static-website \
  --index-document index.html \
  --404-document index.html

# 上传文件
az storage blob upload-batch \
  --account-name panshakerweb \
  --source /path/to/panshaker-official-websites-legacy/ \
  --destination '$web' \
  --pattern '*' \
  --exclude-pattern 'docs/*;.git/*'
```

### 方案 C：Azure VM

如果已有 Azure VM，按照 [方案一 (Linux + Nginx)](#2-方案一linux--nginx) 或 [方案二 (IIS)](#3-方案二windows--iis) 部署即可。

---

## 6. HTTPS 配置

### Nginx + Let's Encrypt（免费）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（自动修改 Nginx 配置）
sudo certbot --nginx -d panshaker.com -d www.panshaker.com

# 自动续期（Certbot 默认已配置 cron）
sudo certbot renew --dry-run
```

### IIS + Let's Encrypt

使用 [win-acme](https://www.win-acme.com/) 工具：

```powershell
# 下载 win-acme
Invoke-WebRequest -Uri "https://github.com/win-acme/win-acme/releases/latest/download/win-acme.v2.x.zip" -OutFile win-acme.zip
Expand-Archive win-acme.zip -DestinationPath C:\win-acme

# 运行（交互式，按提示操作）
C:\win-acme\wacs.exe
```

### 阿里云 / Azure

均在各自控制台的 HTTPS/SSL 设置中申请免费证书，一键开启。

---

## 7. 常见问题

### Q: 直接放到 wwwroot 就能用吗？

**是的。** 将项目根目录下所有文件（不含 `docs/` 和 `.git/`）复制到 `C:\inetpub\wwwroot\`，浏览器访问 `http://localhost` 即可看到首页。`web.config` 已包含 WebP MIME 类型配置。

### Q: 中文文件名无法访问（404）？

截图文件名包含中文和空格。解决方案：
- **Nginx**: 默认支持，确保 `charset utf-8;` 已设置
- **IIS**: 启用"允许双重转义"（见 3.4 节）
- **长期方案**: 将文件名改为英文（如 `screenshot-ai-assistant.png`）

### Q: 字体文件返回 404？

服务器需要配置 MIME 类型：
- `.ttf` → `font/ttf`
- `.otf` → `font/otf`

各方案的配置已在上文中包含。

### Q: 语言包 JSON 加载失败？

确认服务器支持 `.json` MIME 类型 `application/json`。部分旧版 IIS 可能未默认配置。

### Q: 音乐/视频无法播放？

确认 `.mp3` (`audio/mpeg`) 和 `.mp4` (`video/mp4`) MIME 类型已配置。Nginx 默认支持，IIS 需在 `web.config` 中确认。

### Q: 微信分享链接没有缩略图？

需要添加 OpenGraph meta 标签：
```html
<meta property="og:title" content="Panshaker Services">
<meta property="og:description" content="AI 赋能餐饮自动化">
<meta property="og:image" content="https://panshaker.com/assets/images/logo-transparent.png">
<meta property="og:url" content="https://panshaker.com">
```

### Q: 如何更新网站？

- **IIS / Nginx**: 直接替换文件，清除浏览器缓存
- **阿里云 OSS**: 重新 `ossutil cp` 上传
- **Azure SWA (GitHub)**: 直接 `git push`，自动部署
- **Azure SWA (CLI)**: 重新 `swa deploy`

---

*文档版本: 1.0.0 | 2026-02-20*
