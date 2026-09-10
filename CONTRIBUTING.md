# 🤝 دليل المساهمة - Contributing Guide

شكراً لاهتمامك بالمساهمة في منصة التعليمية! هذا الدليل سيساعدك على البدء.

---

## 📋 محتويات

- [كود السلوك](#-كود-السلوك)
- [كيف يمكنني المساهمة؟](#-كيف-يمكنني-المساهمة)
- [إعداد بيئة التطوير](#-إعداد-بيئة-التطوير)
- [إرشادات الكود](#-إرشادات-الكود)
- [عملية Pull Request](#-عملية-pull-request)
- [أسئلة شائعة](#-أسئلة-شائعة)

---

## 📜 كود السلوك

هذا المشروع يلتزم بـ [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). بالمشاركة، يُتوقع منك الالتزام بهذا الكود.

---

## 🎯 كيف يمكنني المساهمة؟

### 🐛 الإبلاغ عن الأخطاء

1. تحقق من [Issues](https://github.com/your-username/educational-platform/issues) للتأكد من عدم الإبلاغ مسبقاً
2. افتح Issue جديد باستخدام قالب "Bug Report"
3. اكتب وصفاً واضحاً للمشكلة
4. أضف خطوات لإعادة إنتاج المشكلة
5. أرفق لقطات شاشة إذا أمكن

### 💡 اقتراح ميزات جديدة

1. تحقق من Issues الحالية
2. افتح Issue جديد باستخدام قالب "Feature Request"
3. اكتب وصفاً واضحاً للميزة المقترحة
4. اشرح الفائدة من هذه الميزة

### 📝 تحسين التوثيق

- إصلاح الأخطاء الإملائية
- إضافة أمثلة جديدة
- تحسين الشروحات
- ترجمة المحتوى

### 💻 المساهمة بالكود

1. Fork المشروع
2. أنشئ فرع جديد
3. اكتب الكود
4. اختبر التغييرات
5. أرسل Pull Request

---

## 🛠️ إعداد بيئة التطوير

### المتطلبات

- Node.js 18+
- npm أو yarn أو pnpm
- Git
- محرر نصوص (VS Code موصى به)

### الخطوات

```bash
# 1. Fork المشروع على GitHub

# 2. Clone المشروع
git clone https://github.com/YOUR-USERNAME/educational-platform.git
cd educational-platform

# 3. أضف remote للأصل
git remote add upstream https://github.com/original-owner/educational-platform.git

# 4. تثبيت المكتبات
npm install

# 5. تشغيل المشروع
npm run dev

# 6. افتح المتصفح على http://localhost:5173
```

---

## 📏 إرشادات الكود

### 🎨 نمط الكود

- استخدم TypeScript لجميع الملفات الجديدة
- اتبع نمط الكود الموجود
- استخدم ESLint و Prettier
- اكتب تعليقات واضحة

### 📁 هيكل الملفات

```
src/
├── components/    # مكونات React
├── services/      # الخدمات
├── types.ts       # التعريفات
└── App.tsx        # المكون الرئيسي
```

### 📝 تسمية الملفات

- المكونات: `PascalCase.tsx` (مثال: `AdminDashboard.tsx`)
- الخدمات: `camelCase.ts` (مثال: `database.ts`)
- الأنماط: `kebab-case.css` (مثال: `admin-dashboard.css`)

### 💬 التعليقات

```typescript
// ✅ جيد
/**
 * حساب متوسط الدرجات للطلاب
 * @param students - قائمة الطلاب
 * @returns المتوسط الحسابي
 */
function calculateAverage(students: Student[]): number {
  // ...
}

// ❌ سيئ
// حساب المتوسط
function calc(s) {
  // ...
}
```

### 🧪 الاختبارات

- اكتب اختبارات للميزات الجديدة
- تأكد من نجاح جميع الاختبارات قبل الإرسال
- استخدم `npm test` لتشغيل الاختبارات

---

## 🔄 عملية Pull Request

### 1. إنشاء فرع جديد

```bash
# تحديث الفرع الرئيسي
git checkout main
git pull upstream main

# إنشاء فرع جديد
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/your-bug-fix
```

### 2. كتابة الكود

- اتبع إرشادات الكود
- اكتب تعليقات واضحة
- اختبر التغييرات محلياً

### 3. Commit التغييرات

```bash
# أضف التغييرات
git add .

# اكتب رسالة commit واضحة
git commit -m "feat: إضافة ميزة البث المباشر"
# أو
git commit -m "fix: إصلاح مشكلة تسجيل الدخول"
```

### 📝 صيغة رسائل Commit

نستخدم [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` ميزة جديدة
- `fix:` إصلاح خطأ
- `docs:` تغييرات في التوثيق
- `style:` تغييرات في التنسيق
- `refactor:` إعادة هيكلة الكود
- `test:` إضافة اختبارات
- `chore:` تغييرات في الإعدادات

### 4. Push للفرع

```bash
git push origin feature/your-feature-name
```

### 5. فتح Pull Request

1. اذهب إلى GitHub
2. اضغط "New Pull Request"
3. اختر الفرع الخاص بك
4. املأ قالب Pull Request
5. اشرح التغييرات بوضوح
6. أضف لقطات شاشة إذا لزم الأمر

---

## ✅ قائمة التحقق قبل الإرسال

- [ ] الكود يعمل بدون أخطاء
- [ ] جميع الاختبارات ناجحة
- [ ] التوثيق محدث
- [ ] لا توجد تحذيرات ESLint
- [ ] التغييرات مختبرة محلياً
- [ ] رسائل Commit واضحة
- [ ] لا توجد ملفات غير ضرورية

---

## ❓ أسئلة شائعة

### كيف أبدأ إذا كنت مبتدئاً؟

1. ابحث عن Issues موسومة بـ `good first issue`
2. ابدأ بمهام بسيطة مثل إصلاح الأخطاء الإملائية
3. لا تتردد في طرح الأسئلة

### كيف أختبر التغييرات؟

```bash
# تشغيل المشروع
npm run dev

# بناء المشروع
npm run build

# فحص الكود
npm run lint
```

### ماذا أفعل إذا واجهت تعارضات (Conflicts)؟

```bash
# تحديث الفرع الرئيسي
git checkout main
git pull upstream main

# العودة لفرعك
git checkout your-branch

# دمج التغييرات
git merge main

# حل التعارضات يدوياً
git add .
git commit -m "merge: حل التعارضات"
```

### هل يمكنني المساهمة في التوثيق فقط؟

نعم! التوثيق مهم جداً ونرحب بأي تحسينات فيه.

### كم من الوقت يستغرق مراجعة Pull Request؟

عادة خلال 24-48 ساعة. قد يستغرق وقتاً أطول إذا كانت التغييرات كبيرة.

---

## 🎉 شكراً لمساهمتك!

مساهمتك تجعل هذا المشروع أفضل للجميع. نقدر وقتك وجهدك!

---

<div align="center">

**إذا كان لديك أي أسئلة، لا تتردد في فتح Issue أو التواصل معنا**

[📧 البريد الإلكتروني](mailto:7hmed4ref@gmail.com) • [💬 فتح Issue](https://github.com/your-username/educational-platform/issues)

</div>
