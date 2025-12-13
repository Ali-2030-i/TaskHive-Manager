#!/usr/bin/env python3
"""
تنفيذ Supabase Schema مباشرة
يمكنك تشغيل هذا الملف بـ: python setup_supabase.py
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# تحميل المتغيرات من .env
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ خطأ: متغيرات Supabase غير موجودة في .env")
    sys.exit(1)

print(f"✓ الاتصال بـ Supabase: {SUPABASE_URL}")

# قراءة السكيما
try:
    with open("supabase_schema.sql", "r", encoding="utf-8") as f:
        schema = f.read()
except FileNotFoundError:
    print("❌ خطأ: ملف supabase_schema.sql غير موجود")
    sys.exit(1)

print("✓ تم تحميل السكيما")
print(f"✓ عدد الأسطر: {len(schema.splitlines())}")

# للأسف، مكتبة Supabase الحالية لا تدعم تنفيذ SQL مباشرة
# يجب تنفيذ السكيما يدويً عبر Supabase Dashboard
print("""
⚠️  تنبيه: لا يمكن تنفيذ السكيما تلقائياً من هنا.
يجب تنفيذها يدويً عبر Supabase Dashboard:

1. اذهب إلى: https://app.supabase.com/
2. ادخل لمشروعك
3. اذهب إلى: SQL Editor → New Query
4. انسخ محتوى supabase_schema.sql
5. اضغط: Run

أو استخدم سطر الأوامر:
$ supabase db push

""")

print("✓ تم التحضير!")
