# 🚀 دليل النشر - Deployment Guide

هذا الدليل يشرح كيفية نشر منصة التعليمية على مختلف المنصات.

---

## 📋 المحتويات

- [المتطلبات](#-المتطلبات)
- [النشر على Vercel](#-النشر-على-vercel)
- [النشر على Netlify](#-النشر-على-netlify)
- [النشر على GitHub Pages](#-النشر-على-github-pages)
- [النشر على AWS](#-النشر-على-aws)
- [النشر على خادم خاص](#-النشر-على-خادم-خاص)

---

## 🔧 المتطلبات

### المتطلبات الأساسية

- Node.js 18+
- npm أو yarn أو pnpm
- حساب GitHub
- حساب على منصة النشر (Vercel, Netlify, إلخ)

### بناء المشروع

```bash
# تثبيت المكتبات
npm install

# بناء المشروع
npm run build

# الملفات الناتجة ستكون في مجلد dist/
```

---

## ▲ النشر على Vercel

### الطريقة 1: النشر التلقائي (موصى به)

1. **ارفع المشروع على GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/educational-platform.git
   git push -u origin main
   ```

2. **استيراد المشروع على Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اضغط "Import Project"
   - اختر repository من GitHub
   - اضغط "Import"

3. **إعدادات Vercel**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **النشر**
   - اضغط "Deploy"
   - انتظر حتى اكتمال النشر
   - ستحصل على رابط مثل: `https://your-project.vercel.app`

### الطريقة 2: النشر اليدوي

```bash
# تثبيت Vercel CLI
npm install -g vercel

# الدخول إلى مجلد المشروع
cd educational-platform

# بناء المشروع
npm run build

# النشر
vercel --prod
```

---

## 🌐 النشر على Netlify

### الطريقة 1: النشر التلقائي

1. **ارفع المشروع على GitHub** (كما في Vercel)

2. **استيراد المشروع على Netlify**
   - اذهب إلى [netlify.com](https://netlify.com)
   - اضغط "Add new site" → "Import an existing project"
   - اختر GitHub
   - اختر repository

3. **إعدادات Netlify**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **النشر**
   - اضغط "Deploy site"
   - ستحصل على رابط مثل: `https://your-site.netlify.app`

### الطريقة 2: Drag & Drop

```bash
# بناء المشروع
npm run build

# اسحب مجلد dist وأفلته على Netlify Drop
# https://app.netlify.com/drop
```

### الطريقة 3: Netlify CLI

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# الدخول
netlify login

# النشر
netlify deploy --prod --dir=dist
```

---

## 📄 النشر على GitHub Pages

### الطريقة 1: GitHub Actions (موصى به)

1. **أنشئ ملف workflow**

```bash
mkdir -p .github/workflows
```

أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **ارفع التغييرات**
   ```bash
   git add .
   git commit -m "Add GitHub Pages workflow"
   git push
   ```

3. **تفعيل GitHub Pages**
   - اذهب إلى Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - احفظ

### الطريقة 2: النشر اليدوي

```bash
# تثبيت gh-pages
npm install -D gh-pages

# إضافة script في package.json
# "deploy": "gh-pages -d dist"

# بناء ونشر
npm run build
npm run deploy
```

---

## ☁️ النشر على AWS

### استخدام AWS S3 + CloudFront

1. **إنشاء S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **تفعيل Static Website Hosting**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

3. **رفع الملفات**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **إعداد CloudFront** (اختياري)
   - أنشئ CloudFront Distribution
   - Origin: S3 bucket
   - Default Root Object: index.html

### استخدام AWS Amplify

1. **ارفع المشروع على GitHub**

2. **استيراد المشروع على Amplify**
   - اذهب إلى AWS Amplify Console
   - اضغط "Connect app"
   - اختر GitHub
   - اختر repository

3. **إعدادات البناء**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **النشر**
   - اضغط "Save and deploy"

---

## 🖥️ النشر على خادم خاص

### استخدام Nginx

1. **بناء المشروع**
   ```bash
   npm run build
   ```

2. **نقل الملفات إلى الخادم**
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. **إعداد Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **إعادة تشغيل Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### استخدام Docker

1. **أنشئ Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **بناء الصورة**
   ```bash
   docker build -t educational-platform .
   ```

3. **تشغيل الحاوية**
   ```bash
   docker run -d -p 80:80 educational-platform
   ```

---

## 🔒 إعداد SSL/HTTPS

### Let's Encrypt (مجاني)

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com
```

### Cloudflare (مجاني)

1. **إضافة الموقع إلى Cloudflare**
2. **تغيير DNS servers**
3. **تفعيل SSL/TLS**
   - SSL/TLS → Full (strict)

---

## 📊 مراقبة الأداء

### Lighthouse

```bash
# تثبيت Lighthouse
npm install -g lighthouse

# تشغيل التقرير
lighthouse https://your-domain.com
```

### Google PageSpeed Insights

- اذهب إلى [PageSpeed Insights](https://pagespeed.web.dev/)
- أدخل رابط موقعك
- راجع النتائج

---

## 🔄 التحديث التلقائي

### Vercel / Netlify

- يتم النشر تلقائياً عند كل push إلى main
- لا حاجة لإعدادات إضافية

### GitHub Pages

- يتم النشر تلقائياً عبر GitHub Actions
- تأكد من تفعيل workflow

### خادم خاص

استخدم CI/CD مثل GitHub Actions:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build
      run: |
        npm install
        npm run build
    
    - name: Deploy to Server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        source: "dist/*"
        target: "/var/www/html"
```

---

## 🐛 حل المشاكل

### المشكلة: الصفحة البيضاء

**الحل:**
- تحقق من console للأخطاء
- تأكد من أن base path صحيح
- تحقق من CORS

### المشكلة: الروابط لا تعمل

**الحل:**
```javascript
// vite.config.js
export default {
  base: '/your-repo-name/', // لـ GitHub Pages
}
```

### المشكلة: الملفات لا تظهر

**الحل:**
- تحقق من مسار الملفات
- تأكد من رفع جميع الملفات
- تحقق من permissions

---

<div align="center">

**تم التحديث آخر مرة: 2024**

[🔙 العودة إلى README](README.md)

</div>
