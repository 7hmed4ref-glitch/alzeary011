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
   - **Repository name**: `educational-platform`
   - **Description**: `منصة تعليمية متكاملة مع نظام إدارة حصص، امتحانات، بث مباشر`
   - **Public** أو **Private** (حسب تفضيلك)
   - ❌ لا تضع علامة على "Add a README file" (لدينا واحد بالفعل)
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

## 🌐 تفعيل GitHub Pages

### الطريقة 1: استخدام GitHub Actions (موصى به)

1. تأكد من وجود ملف `.github/workflows/deploy.yml`
2. اذهب إلى **Settings** → **Pages**
3. في قسم **Source**، اختر **GitHub Actions**
4. سيتم استخدام workflow الموجود
5. انتظر حتى اكتمال النشر
6. الموقع سيكون متاحاً على: `https://YOUR-USERNAME.github.io/educational-platform/`

### ملاحظة مهمة

إذا كان اسم مستودعك مختلفاً عن `educational-platform`، يجب تحديث `base` في `vite.config.js`:

```javascript
export default defineConfig({
  // ...
  base: '/اسم-المستودع-الخاص-بك/',
  // ...
});
```

ثم قم بـ commit و push التغييرات:

```bash
git add vite.config.js
git commit -m "chore: تحديث base path لـ GitHub Pages"
git push
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

### المشكلة: الموقع لا يظهر على GitHub Pages

1. تأكد من أن GitHub Actions يعمل:
   - اذهب إلى **Actions** tab
   - تحقق من أن workflow اكتمل بنجاح

2. تحقق من إعدادات GitHub Pages:
   - **Settings** → **Pages**
   - تأكد من أن Source هو **GitHub Actions**

3. انتظر بضع دقائق بعد النشر

### المشكلة: "File not found" أو صفحة بيضاء

1. تأكد من أن `base` في `vite.config.js` صحيح:
   ```javascript
   base: '/educational-platform/', // يجب أن يطابق اسم المستودع
   ```

2. قم بـ commit و push التغييرات:
   ```bash
   git add vite.config.js
   git commit -m "fix: تحديث base path"
   git push
   ```

3. انتظر حتى يكتمل النشر

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
- [ ] `vite.config.js` يحتوي على `base` صحيح
- [ ] `.github/workflows/deploy.yml` موجود

---

## 🎉 بعد الرفع

بعد الرفع بنجاح:

1. ✅ شارك الرابط مع الآخرين
2. ✅ أضف نجوم للمشروع
3. ✅ اطلب من الأصدقاء مراجعة المشروع
4. ✅ ابدأ في جمع الملاحظات
5. ✅ استمر في التطوير والتحسين

---

<div align="center">

**حظاً موفقاً في مشروعك! 🚀**

[🔙 العودة إلى README](README.md)

</div>
