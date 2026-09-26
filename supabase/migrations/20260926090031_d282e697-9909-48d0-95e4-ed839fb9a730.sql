create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Seminer',
  event_date date not null,
  event_time text not null default '',
  location text not null default '',
  description text not null default '',
  image_url text,
  is_next boolean not null default false,
  created_at timestamptz not null default now(),
  constraint events_category_check check (category in ('Seminer','Atölye','Teknik Gezi','Söyleşi','Topluluk'))
);
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "Etkinlikler herkese açık" on public.events for select using (true);
create policy "Girişli kullanıcı ekler" on public.events for insert to authenticated with check (true);
create policy "Girişli kullanıcı günceller" on public.events for update to authenticated using (true) with check (true);
create policy "Girişli kullanıcı siler" on public.events for delete to authenticated using (true);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  role text not null default 'Üye',
  program text not null default '',
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint team_department_check check (department in ('Topluluk','Organizasyon','Dış İlişkiler','Sosyal Medya','Tanıtım')),
  constraint team_role_check check (role in ('Topluluk Başkanı','Departman Başkanı','Üye'))
);
grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "Ekip herkese açık" on public.team_members for select using (true);
create policy "Girişli kullanıcı ekler" on public.team_members for insert to authenticated with check (true);
create policy "Girişli kullanıcı günceller" on public.team_members for update to authenticated using (true) with check (true);
create policy "Girişli kullanıcı siler" on public.team_members for delete to authenticated using (true);

create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  post_date date not null default current_date,
  link_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.social_posts to anon, authenticated;
grant insert, update, delete on public.social_posts to authenticated;
grant all on public.social_posts to service_role;
alter table public.social_posts enable row level security;
create policy "Paylaşımlar herkese açık" on public.social_posts for select using (true);
create policy "Girişli kullanıcı ekler" on public.social_posts for insert to authenticated with check (true);
create policy "Girişli kullanıcı günceller" on public.social_posts for update to authenticated using (true) with check (true);
create policy "Girişli kullanıcı siler" on public.social_posts for delete to authenticated using (true);

create policy "Site medyası okunur" on storage.objects for select using (bucket_id = 'site-media');
create policy "Girişli yükler" on storage.objects for insert to authenticated with check (bucket_id = 'site-media');
create policy "Girişli günceller" on storage.objects for update to authenticated using (bucket_id = 'site-media');
create policy "Girişli siler" on storage.objects for delete to authenticated using (bucket_id = 'site-media');

insert into public.events (title, category, event_date, event_time, location, description, is_next) values
('Yapay Zekâ 101','Seminer','2026-10-14','19:00','Kırıkkale Üniversitesi','Temel kavramlardan güncel üretken yapay zekâ araçlarına, sağlam bir başlangıç.', true),
('Veriden Ürüne: ML Atölyesi','Atölye','2026-10-28','','Kırıkkale Üniversitesi','Gerçek bir veri setiyle model kurma, değerlendirme ve sonuçları anlatma pratiği.', false),
('Sektörde Yapay Zekâ','Söyleşi','2026-05-22','','','Mezunlarımızla yapay zekâ ekiplerini, kariyer yollarını ve ilk adımları konuştuk.', false),
('Ankara Teknokent Gezisi','Teknik Gezi','2026-04-18','','Ankara','Ürün ekipleriyle buluştuk; fikirlerin prototipten ürüne dönüşümünü yerinde gördük.', false),
('Prompt Tasarımı Laboratuvarı','Atölye','2026-03-12','','','İyi soru sormanın sistematiğini birlikte denediğimiz uygulamalı bir buluşma.', false),
('YZT Tanışma Buluşması','Topluluk','2025-10-04','','','Yeni üyelerimizle tanıştık, dönemin yol haritasını birlikte şekillendirdik.', false);

insert into public.team_members (name, department, role, program, photo_url, sort_order) values
('Ceren Öz','Topluluk','Topluluk Başkanı','Endüstri Mühendisliği','/__l5e/assets-v1/59767c05-9796-4db5-8017-519369ccb7a0/ceren-oz.jpeg',0),
('Bartu Bayram','Organizasyon','Departman Başkanı','Endüstri Mühendisliği','/__l5e/assets-v1/1bef4069-3594-46da-b827-19b40325674d/bartu-bayram.jpg',1),
('Naz Mermeroğlu','Organizasyon','Üye','Endüstri Mühendisliği',null,2),
('Yahya Ay','Organizasyon','Üye','Endüstri Mühendisliği',null,3),
('Ceren Öz','Dış İlişkiler','Departman Başkanı','Endüstri Mühendisliği','/__l5e/assets-v1/59767c05-9796-4db5-8017-519369ccb7a0/ceren-oz.jpeg',4),
('Berk Bıçakcı','Dış İlişkiler','Üye','Endüstri Mühendisliği',null,5),
('Utku Ilgaz','Dış İlişkiler','Üye','Endüstri Mühendisliği',null,6),
('Edanur Yıldırım','Dış İlişkiler','Üye','Endüstri Mühendisliği',null,7),
('Eray Taşpunar','Sosyal Medya','Departman Başkanı','Endüstri Mühendisliği','/__l5e/assets-v1/0f6bffbe-5927-436d-a79f-a210df502568/eray-taspunar.jpg',8),
('Fatma Nur Güzel','Sosyal Medya','Üye','Endüstri Mühendisliği',null,9),
('Şadan Aydoğan','Tanıtım','Departman Başkanı','Endüstri Mühendisliği','/__l5e/assets-v1/539dac9c-e26a-498c-9a8c-902d06900207/sadan-aydogan.jpg',10),
('Yağmur Karasüleymanoğlu','Tanıtım','Üye','Endüstri Mühendisliği',null,11);