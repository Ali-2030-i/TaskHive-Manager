-- 1. تنظيف القديم (Clean Slate) 🧹
DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.sub_tasks CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. جدول البروفايلات (تم تحديثه ليدعم صفحة البروفايل) 👤
create table public.user_profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'Member',
  focus_hours int default 0,
  avatar_initials text,
  avatar_color text default 'bg-blue-500',
  
  -- معلومات شخصية جديدة 📝
  phone text,
  bio text,
  timezone text default 'UTC',
  status text default 'offline', -- online, offline, away
  
  -- التفضيلات 🎨
  theme_preference text default 'system', -- light, dark, system
  language_preference text default 'ar', -- ar, en
  notification_email boolean default true,
  notification_push boolean default true,
  notification_on_comment boolean default true,
  notification_on_task_complete boolean default true,
  
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 3. جدول المشاريع 📁
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  description text,
  user_id uuid references auth.users not null -- لازم يكون مربوط بمستخدم
);

-- 4. جدول المهام (Tasks) ✅
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  due_date timestamp with time zone,
  project_id uuid references public.projects on delete cascade,
  user_id uuid references auth.users not null
);

-- 5. جدول المهام الفرعية (Sub Tasks) 📋
create table public.sub_tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  task_id uuid not null references public.tasks on delete cascade,
  title text not null,
  completed boolean default false,
  user_id uuid references auth.users not null
);

-- 6. جدول النشاطات (Activities) ⚡
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  action text not null,
  details text,
  user_id uuid references auth.users not null
);

-- 9. تفعيل الأمان (RLS Enablement) 🛡️
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.sub_tasks enable row level security;
alter table public.activities enable row level security;

-- 8. سياسات الأمان الصارمة (Policies) 🔐
-- (كل مستخدم يشوف ويعدل حاجته هو بس)

-- سياسات البروفايل
-- السماح للنظام بإنشاء البروفايل تلقائياً عند التسجيل
create policy "System can create profiles" on public.user_profiles 
  for insert with check (true);

-- السماح للمستخدم برؤية بروفايله الخاص
create policy "Users can view own profile" on public.user_profiles 
  for select using (auth.uid() = id);

-- السماح للمستخدم بتحديث بروفايله الخاص
create policy "Users can update own profile" on public.user_profiles 
  for update using (auth.uid() = id);

-- سياسات المشاريع
create policy "Users can CRUD own projects" on public.projects 
  for all using (auth.uid() = user_id);

-- سياسات التاسكات
create policy "Users can CRUD own tasks" on public.tasks 
  for all using (auth.uid() = user_id);

-- سياسات التاسكات الفرعية
create policy "Users can CRUD own sub_tasks" on public.sub_tasks 
  for all using (auth.uid() = user_id);

-- سياسات النشاطات
create policy "Users can CRUD own activities" on public.activities 
  for all using (auth.uid() = user_id);


-- 9. إنشاء Indexes للأداء العالي 🚀
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_sub_tasks_task_id on public.sub_tasks(task_id);
create index idx_activities_user_id on public.activities(user_id);
create index idx_projects_user_id on public.projects(user_id);


-- 10. دالة سحرية: إنشاء بروفايل تلقائي عند التسجيل (Auto Profile Creation) ✨
-- دي بتخليك لما تعمل Sign Up، يقوم النظام عامل صف في جدول البروفايل لوحده
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, avatar_initials)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', -- لو الاسم جاي من جوجل مثلاً
    substring(new.email from 1 for 2) -- ياخد أول حرفين من الايميل كـ Initials
  );
  return new;
end;
$$ language plpgsql security definer;

-- ربط الدالة بحدث التسجيل
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 11. دالة RPC لإنشاء البروفايل يدويً في حالة الفشل التلقائي
create or replace function public.ensure_profile_exists(
  p_user_id uuid,
  p_email text,
  p_full_name text default ''
)
returns public.user_profiles as $$
declare
  v_profile public.user_profiles;
begin
  -- تحقق من وجود البروفايل
  select * into v_profile from public.user_profiles where id = p_user_id;
  
  if v_profile is null then
    -- إنشاء بروفايل جديد
    insert into public.user_profiles (id, email, full_name, avatar_initials)
    values (
      p_user_id,
      p_email,
      p_full_name,
      coalesce(substring(p_email from 1 for 2), 'US')
    )
    returning * into v_profile;
  end if;
  
  return v_profile;
end;
$$ language plpgsql security definer;

