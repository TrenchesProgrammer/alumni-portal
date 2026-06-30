-- 1. Custom Types
create type user_role as enum ('student', 'alumni', 'admin');
create type user_status as enum ('pending', 'approved', 'rejected');
create type request_status as enum ('pending', 'accepted', 'rejected');

-- 2. Tables

-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'student'::user_role not null,
  status user_status default 'pending'::user_status not null,
  full_name text,
  avatar_url text,
  bio text,
  github_url text,
  linkedin_url text,
  matric_number text,
  graduation_year integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tech Stacks Master Table
create table public.tech_stacks (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

-- Insert some default tech stacks
insert into public.tech_stacks (name) values 
('React'), ('Next.js'), ('TypeScript'), ('JavaScript'), ('Python'), 
('Django'), ('Node.js'), ('Express'), ('PostgreSQL'), ('MongoDB'), 
('AWS'), ('Docker'), ('Kubernetes'), ('Java'), ('Spring Boot'), ('C#'), ('.NET');

-- User Tech Stacks Mapping Table (Many-to-Many)
create table public.user_tech_stacks (
  user_id uuid references public.profiles(id) on delete cascade not null,
  tech_id uuid references public.tech_stacks(id) on delete cascade not null,
  primary key (user_id, tech_id)
);

-- Mentorship Requests Table
create table public.mentorship_requests (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  alumni_id uuid references public.profiles(id) on delete cascade not null,
  status request_status default 'pending'::request_status not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs Table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  alumni_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  company text not null,
  description text not null,
  link text,
  visibility text default 'public' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tech_stacks enable row level security;
alter table public.user_tech_stacks enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.jobs enable row level security;

-- Profiles: Anyone can view, users can update their own
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Jobs: Anyone can view, alumni can manage their own
create policy "Jobs are viewable by everyone." on public.jobs for select using (true);
create policy "Alumni can insert jobs." on public.jobs for insert with check (auth.uid() = alumni_id);
create policy "Alumni can update own jobs." on public.jobs for update using (auth.uid() = alumni_id);
create policy "Alumni can delete own jobs." on public.jobs for delete using (auth.uid() = alumni_id);

-- Tech Stacks: Anyone can view
create policy "tech_stacks viewable by everyone" on public.tech_stacks for select using (true);

-- User Tech Stacks: Anyone can view, users manage their own
create policy "user_tech_stacks viewable by everyone" on public.user_tech_stacks for select using (true);
create policy "Users can insert their own tech stacks" on public.user_tech_stacks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own tech stacks" on public.user_tech_stacks for delete using (auth.uid() = user_id);

-- Mentorship Requests: Students/Alumni can view their own, students can insert, alumni can update
create policy "Students can view their requests" on public.mentorship_requests for select using (auth.uid() = student_id);
create policy "Alumni can view requests sent to them" on public.mentorship_requests for select using (auth.uid() = alumni_id);
create policy "Students can create requests" on public.mentorship_requests for insert with check (auth.uid() = student_id);
create policy "Alumni can update requests sent to them" on public.mentorship_requests for update using (auth.uid() = alumni_id);


-- 4. Triggers
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role, matric_number, graduation_year)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    new.raw_user_meta_data->>'matric_number',
    NULLIF(new.raw_user_meta_data->>'graduation_year', '')::integer
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
