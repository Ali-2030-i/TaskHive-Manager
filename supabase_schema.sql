-- 1. تنظيف القديم (عشان ميعملكش مشاكل)
DROP TABLE IF EXISTS public.sub_tasks CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. جدول البروفايلات
create table public.user_profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 3. جدول المشاريع
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  name text not null,
  description text,
  user_id uuid references auth.users
);

-- 4. جدول المهام (العمود الفقري)
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  description text,
  status text default 'todo',
  priority text default 'medium',
  due_date timestamp with time zone,
  project_id uuid references public.projects on delete cascade,
  user_id uuid references auth.users
);

-- 5. جدول المهام الفرعية (Sub Tasks) - المهم جداً ❗
create table public.sub_tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  task_id uuid not null references public.tasks on delete cascade,
  title text not null,
  completed boolean default false,
  user_id uuid references auth.users
);

-- 6. جدول النشاطات
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  action text not null,
  details text,
  user_id uuid references auth.users
);

-- 7. تفعيل الأمان وسياسات الوصول (عشان الموقع يقدر يكتب ويقرأ)
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.sub_tasks enable row level security;
alter table public.activities enable row level security;

create policy "Allow all" on public.tasks for all using (true) with check (true);
create policy "Allow all" on public.projects for all using (true) with check (true);
create policy "Allow all" on public.sub_tasks for all using (true) with check (true);
create policy "Allow all" on public.activities for all using (true) with check (true);
create policy "Allow all" on public.user_profiles for all using (true) with check (true);

-- 8. إنشاء indexes للأداء الأسرع
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_sub_tasks_task_id on public.sub_tasks(task_id);
create index idx_activities_user_id on public.activities(user_id);
