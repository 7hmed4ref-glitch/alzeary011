name: Pull Request
description: إرسال Pull Request
title: "[PR]: "
labels: ["needs-review"]
body:
  - type: markdown
    attributes:
      value: |
        شكراً لمساهمتك! يرجى ملء المعلومات التالية لمساعدتنا على مراجعة Pull Request الخاص بك.

  - type: textarea
    id: description
    attributes:
      label: وصف التغييرات
      description: اشرح التغييرات التي قمت بها
      placeholder: اشرح التغييرات هنا...
    validations:
      required: true

  - type: dropdown
    id: type
    attributes:
      label: نوع التغيير
      description: ما نوع التغيير الذي قمت به؟
      options:
        - ميزة جديدة (Feature)
        - إصلاح خطأ (Bug fix)
        - تحسين أداء (Performance)
        - تحسين توثيق (Documentation)
        - إعادة هيكلة (Refactor)
        - تغييرات في التصميم (UI/UX)
        - أخرى (Other)
    validations:
      required: true

  - type: textarea
    id: related-issues
    attributes:
      label: Issues المرتبطة
      description: هل هذا PR مرتبط بـ Issue معين؟
      placeholder: |
        Fixes #(issue number)
        Closes #(issue number)
        Related to #(issue number)

  - type: textarea
    id: testing
    attributes:
      label: كيفية الاختبار
      description: كيف يمكن للمراجع اختبار التغييرات؟
      placeholder: |
        1. اذهب إلى '...'
        2. اضغط على '...'
        3. تحقق من '...'
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: لقطات شاشة
      description: أضف لقطات شاشة إذا كانت التغييرات تتعلق بالواجهة
      placeholder: اسحب وأفلت الصور هنا...

  - type: checkboxes
    id: checklist
    attributes:
      label: قائمة التحقق
      options:
        - label: الكود يعمل بدون أخطاء
          required: true
        - label: جميع الاختبارات ناجحة
          required: true
        - label: التوثيق محدث
          required: true
        - label: لا توجد تحذيرات ESLint
          required: true
        - label: التغييرات مختبرة محلياً
          required: true
        - label: رسائل Commit واضحة
          required: true

  - type: textarea
    id: additional
    attributes:
      label: معلومات إضافية
      description: أي معلومات إضافية تريد إضافتها؟
      placeholder: أضف أي معلومات إضافية هنا...
