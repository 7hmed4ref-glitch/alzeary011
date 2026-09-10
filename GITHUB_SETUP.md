# 📤 خطوات رفع المشروع على GitHub

هذا الملف يشرح الخطوات التفصيلية لرفع مشروع منصة التعليمية على GitHub.

---

## 📋 المتطلبات

- ✅ حساب GitHub
- ✅ Git مثبت على جهازك
- ✅ المشروع جاهز للرفع

---

## 🚀 الخطوات

### 1️⃣ إنشاء مستودع على GitHub

1. اذهب إلى [github.com](https://github.com)
2. اضغط على زر "+" في الأعلى ثم "New repository"
3. املأ البيانات:
   - **Repository name**: `educational-platform` (أو أي اسم تريده)
   - **Description**: `منصة تعليمية متكاملة مع نظام إدارة حصص، امتحانات، بث مباشر`
   - **Public** أو **Private** (حسب تفضيلك)
   - ✅ ضع علامة على "Add a README file" (اختياري - نحن لدينا README بالفعل)
   - ❌ لا تضع علامة على "Add .gitignore" (لدينا واحد بالفعل)
   - ❌ لا تضع علامة على "Choose a license" (لدينا واحد بالفعل)
4. اضغط "Create repository"

### 2️⃣ تهيئة Git محلياً

افتح Terminal أو Command Prompt في مجلد المشروع:

```bash
# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "Initial commit: منصة تعليمية متكاملة"

# تغيير اسم الفرع إلى main
git branch -M main
```

### 3️⃣ ربط المستودع المحلي بـ GitHub

```bash
# إضافة remote (استبدل YOUR-USERNAME باسم المستخدم الخاص بك)
git remote add origin https://github.com/YOUR-USERNAME/educational-platform.git

# التحقق من remote
git remote -v
```

### 4️⃣ رفع المشروع

```bash
# رفع المشروع
git push -u origin main
```

---

## 🔄 الخطوات البديلة (إذا كان المستودع موجوداً بالفعل)

إذا قمت بإنشاء المستودع على GitHub مع README:

```bash
# استنساخ المستودع
git clone https://github.com/YOUR-USERNAME/educational-platform.git
cd educational-platform

# نسخ ملفات مشروعك إلى المجلد
# (انسخ جميع الملفات ما عدا README.md و .git)

# إضافة الملفات
git add .

# commit
git commit -m "Initial commit: منصة تعليمية متكاملة"

# رفع
git push origin main
```

---

## 📝 رسائل Commit الموصى بها

استخدم صيغة Conventional Commits:

```bash
# الميزات الجديدة
git commit -m "feat: إضافة ميزة البث المباشر"

# إصلاح الأخطاء
git commit -m "fix: إصلاح مشكلة تسجيل الدخول"

# التوثيق
git commit -m "docs: تحديث README"

# التحسينات
git commit -m "refactor: إعادة هيكلة الكود"

# الاختبارات
git commit -m "test: إضافة اختبارات جديدة"

# الإعدادات
git commit -m "chore: تحديث إعدادات المشروع"
```

---

## 🌐 تفعيل GitHub Pages

### الطريقة 1: استخدام GitHub Actions (موصى به)

1. تأكد من وجود ملف `.github/workflows/deploy.yml`
2. اذهب إلى **Settings** → **Pages**
3. في قسم **Source**، اختر **GitHub Actions**
4. سيتم استخدام workflow الموجود
5. انتظر حتى اكتمال النشر
6. الموقع سيكون متاحاً على: `https://YOUR-USERNAME.github.io/educational-platform/`

### الطريقة 2: استخدام gh-pages

```bash
# تثبيت gh-pages
npm install -D gh-pages

# إضافة script في package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# بناء ونشر
npm run build
npm run deploy
```

ثم في GitHub:
1. اذهب إلى **Settings** → **Pages**
2. في قسم **Source**، اختر **Deploy from a branch**
3. اختر فرع **gh-pages**
4. احفظ

---

## 🔧 إعدادات إضافية

### إضافة Collaborators

1. اذهب إلى **Settings** → **Collaborators**
2. اضغط "Add people"
3. ابحث عن المستخدم وأضفه

### حماية الفرع الرئيسي

1. اذهب إلى **Settings** → **Branches**
2. اضغط "Add branch protection rule"
3. Branch name pattern: `main`
4. ✅ Require pull request reviews before merging
5. ✅ Require status checks to pass before merging
6. احفظ

### إضافة Labels

1. اذهب إلى **Issues** → **Labels**
2. أضف labels مثل:
   - `bug` - للأخطاء
   - `enhancement` - للتحسينات
   - `documentation` - للتوثيق
   - `good first issue` - للمبتدئين
   - `help wanted` - للمساعدة

---

## 📊 إحصائيات المشروع

### إضافة Badge في README

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/educational-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR-USERNAME/educational-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR-USERNAME/educational-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR-USERNAME/educational-platform)
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "fatal: remote origin already exists"

```bash
# احذف remote القديم
git remote remove origin

# أضف remote الجديد
git remote add origin https://github.com/YOUR-USERNAME/educational-platform.git
```

### المشكلة: "Updates were rejected because the remote contains work"

```bash
# اسحب التغييرات أولاً
git pull origin main --rebase

# ثم ارفع
git push origin main
```

### المشكلة: "Permission denied (publickey)"

```bash
# تحقق من SSH key
ssh -T git@github.com

# إذا لم يكن هناك SSH key، أنشئ واحد
ssh-keygen -t ed25519 -C "your_email@example.com"

# أضف المفتاح إلى GitHub
cat ~/.ssh/id_ed25519.pub
# انسخ المفتاح وأضفه في GitHub → Settings → SSH and GPG keys
```

### المشكلة: الموقع لا يظهر على GitHub Pages

```bash
# تأكد من أن الملفات موجودة في مجلد dist
npm run build

# تحقق من إعدادات GitHub Pages
# Settings → Pages → Source

# إذا كنت تستخدم GitHub Actions، تحقق من:
# Actions tab → Deploy to GitHub Pages workflow
```

### المشكلة: "File index.html not found"

تأكد من أن:
1. ملف `index.html` موجود في الجذر
2. ملف `src/main.tsx` موجود (وليس `main.jsx`)
3. ملف `vite.config.js` موجود
4. قمت بتشغيل `npm run build` قبل الرفع

---

## ✅ قائمة التحقق النهائية

قبل الرفع، تأكد من:

- [ ] جميع الملفات محفوظة
- [ ] `.gitignore` موجود ومضبط بشكل صحيح
- [ ] `README.md` شامل ومفصل
- [ ] `LICENSE` موجود
- [ ] لا توجد ملفات حساسة (كلمات مرور، مفاتيح API)
- [ ] المشروع يعمل محلياً (`npm run dev`)
- [ ] المشروع يبني بنجاح (`npm run build`)
- [ ] جميع الاختبارات ناجحة
- [ ] التوثيق محدث
- [ ] ملف `index.html` يشير إلى `src/main.tsx` (وليس `main.jsx`)

---

## 🎉 بعد الرفع

بعد الرفع بنجاح:

1. ✅ شارك الرابط مع الآخرين
2. ✅ أضف نجوم للمشروع
3. ✅ اطلب من الأصدقاء مراجعة المشروع
4. ✅ ابدأ في جمع الملاحظات
5. ✅ استمر في التطوير والتحسين

---

## 📚 موارد إضافية

- [GitHub Docs](https://docs.github.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Learning Lab](https://lab.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

<div align="center">

**حظاً موفقاً في مشروعك! 🚀**

[🔙 العودة إلى README](README.md)

</div>
