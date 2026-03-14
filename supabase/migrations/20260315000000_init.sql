-- ============================================================
-- 선비샵 (SeonbiShop) Database Schema
-- Korean Traditional Souvenir E-Commerce
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS & ADDRESSES
-- ============================================================

create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  label text not null,                -- e.g. '집', '회사'
  recipient_name text not null,
  phone text not null,
  postal_code text not null,
  address_line1 text not null,        -- 기본주소
  address_line2 text,                 -- 상세주소
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  detail_html text not null default '',
  base_price integer not null check (base_price >= 0),  -- 원 단위
  category text not null default 'general',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on public.products(category);
create index idx_products_slug on public.products(slug);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,                 -- e.g. '색상: 청자색'
  additional_price integer not null default 0,
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_product_options_product on public.product_options(product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on public.product_images(product_id);

create table public.product_tags (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  tag text not null,
  unique(product_id, tag)
);

create index idx_product_tags_tag on public.product_tags(tag);

-- ============================================================
-- 3. CART
-- ============================================================

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  option_id uuid references public.product_options(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, option_id)
);

create index idx_cart_items_user on public.cart_items(user_id);

-- ============================================================
-- 4. ORDERS & PAYMENTS & SHIPMENTS
-- ============================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  order_number text not null unique,  -- 주문번호 (ORD-YYYYMMDD-XXXXX)
  status text not null default 'payment_completed'
    check (status in ('payment_completed', 'preparing', 'shipping', 'delivered', 'cancelled')),
  recipient_name text not null,
  phone text not null,
  postal_code text not null,
  address_line1 text not null,
  address_line2 text,
  total_amount integer not null check (total_amount >= 0),
  discount_amount integer not null default 0 check (discount_amount >= 0),
  shipping_fee integer not null default 0 check (shipping_fee >= 0),
  final_amount integer not null check (final_amount >= 0),
  coupon_id uuid,  -- FK added after coupons table creation
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  option_id uuid references public.product_options(id) on delete set null,
  product_name text not null,         -- 주문 시점 스냅샷
  option_name text,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  total_price integer not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order on public.order_items(order_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method text not null default 'mock_card'
    check (method in ('mock_card', 'mock_bank_transfer', 'mock_virtual_account')),
  amount integer not null check (amount >= 0),
  status text not null default 'completed'
    check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,                -- Mock PG 트랜잭션 ID
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_payments_order on public.payments(order_id);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text not null default '한진택배',
  tracking_number text,
  status text not null default 'preparing'
    check (status in ('preparing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered')),
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_shipments_order on public.shipments(order_id);

-- ============================================================
-- 5. COUPONS
-- ============================================================

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  type text not null check (type in ('fixed', 'percent')),
  discount_value integer not null check (discount_value > 0),  -- 원 or %
  min_order_amount integer not null default 0,
  max_discount_amount integer,        -- 정률할인 시 최대 할인금액
  product_id uuid references public.products(id) on delete cascade,  -- null이면 전체 상품
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  max_uses integer,                   -- null이면 무제한
  used_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Add deferred FK from orders → coupons
alter table public.orders
  add constraint orders_coupon_id_fkey
  foreign key (coupon_id) references public.coupons(id) on delete set null;

create table public.user_coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  is_used boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, coupon_id)
);

create index idx_user_coupons_user on public.user_coupons(user_id);

-- ============================================================
-- 6. REVIEWS
-- ============================================================

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_reviews_product on public.reviews(product_id);
create index idx_reviews_user on public.reviews(user_id);

create table public.review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. INQUIRIES & CS
-- ============================================================

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  type text not null check (type in ('product', 'shipping', 'general')),
  title text not null,
  content text not null,
  status text not null default 'pending'
    check (status in ('pending', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_inquiries_user on public.inquiries(user_id);
create index idx_inquiries_status on public.inquiries(status);

create table public.inquiry_replies (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,  -- admin user
  content text not null,
  created_at timestamptz not null default now()
);

create table public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  session_id text not null,
  role text not null check (role in ('user', 'bot', 'admin')),
  message text not null,
  escalated boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_chat_logs_session on public.chat_logs(session_id);

-- ============================================================
-- 8. EVENTS
-- ============================================================

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  body_html text not null default '',
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_comments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_event_comments_event on public.event_comments(event_id);

create table public.event_coupons (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  unique(event_id, coupon_id)
);

-- ============================================================
-- 9. UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply trigger to all tables with updated_at
create trigger set_updated_at before update on public.users
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.addresses
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.cart_items
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.shipments
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.reviews
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.inquiries
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.events
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 10. NEW USER HANDLER (auth.users → public.users sync)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Helper: check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- USERS
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);
create policy "Admins can view all users"
  on public.users for select using (public.is_admin());
create policy "Admins can update all users"
  on public.users for update using (public.is_admin());

-- ADDRESSES
alter table public.addresses enable row level security;

create policy "Users can manage own addresses"
  on public.addresses for all using (auth.uid() = user_id);
create policy "Admins can view all addresses"
  on public.addresses for select using (public.is_admin());

-- PRODUCTS (public read, admin write)
alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select using (is_active = true);
create policy "Admins can manage products"
  on public.products for all using (public.is_admin());

-- PRODUCT OPTIONS
alter table public.product_options enable row level security;

create policy "Anyone can view active product options"
  on public.product_options for select
  using (
    is_active = true
    and exists (
      select 1 from public.products where id = product_id and is_active = true
    )
  );
create policy "Admins can manage product options"
  on public.product_options for all using (public.is_admin());

-- PRODUCT IMAGES
alter table public.product_images enable row level security;

create policy "Anyone can view product images"
  on public.product_images for select using (true);
create policy "Admins can manage product images"
  on public.product_images for all using (public.is_admin());

-- PRODUCT TAGS
alter table public.product_tags enable row level security;

create policy "Anyone can view product tags"
  on public.product_tags for select using (true);
create policy "Admins can manage product tags"
  on public.product_tags for all using (public.is_admin());

-- CART ITEMS
alter table public.cart_items enable row level security;

create policy "Users can manage own cart"
  on public.cart_items for all using (auth.uid() = user_id);

-- ORDERS
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Users can create own orders"
  on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update own orders"
  on public.orders for update using (auth.uid() = user_id);
create policy "Admins can manage all orders"
  on public.orders for all using (public.is_admin());

-- ORDER ITEMS
alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Users can create own order items"
  on public.order_items for insert
  with check (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Admins can manage all order items"
  on public.order_items for all using (public.is_admin());

-- PAYMENTS
alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Users can create own payments"
  on public.payments for insert
  with check (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Admins can manage all payments"
  on public.payments for all using (public.is_admin());

-- SHIPMENTS
alter table public.shipments enable row level security;

create policy "Users can view own shipments"
  on public.shipments for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "Admins can manage all shipments"
  on public.shipments for all using (public.is_admin());

-- COUPONS
alter table public.coupons enable row level security;

create policy "Anyone can view active coupons"
  on public.coupons for select using (is_active = true);
create policy "Admins can manage coupons"
  on public.coupons for all using (public.is_admin());

-- USER COUPONS
alter table public.user_coupons enable row level security;

create policy "Users can view own coupons"
  on public.user_coupons for select using (auth.uid() = user_id);
create policy "Users can claim coupons"
  on public.user_coupons for insert with check (auth.uid() = user_id);
create policy "Admins can manage user coupons"
  on public.user_coupons for all using (public.is_admin());

-- REVIEWS
alter table public.reviews enable row level security;

create policy "Anyone can view reviews"
  on public.reviews for select using (true);
create policy "Users can create own reviews"
  on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews"
  on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews"
  on public.reviews for delete using (auth.uid() = user_id);
create policy "Admins can manage all reviews"
  on public.reviews for all using (public.is_admin());

-- REVIEW IMAGES
alter table public.review_images enable row level security;

create policy "Anyone can view review images"
  on public.review_images for select using (true);
create policy "Users can manage own review images"
  on public.review_images for all
  using (exists (select 1 from public.reviews where id = review_id and user_id = auth.uid()));
create policy "Admins can manage all review images"
  on public.review_images for all using (public.is_admin());

-- INQUIRIES
alter table public.inquiries enable row level security;

create policy "Users can view own inquiries"
  on public.inquiries for select using (auth.uid() = user_id);
create policy "Users can create own inquiries"
  on public.inquiries for insert with check (auth.uid() = user_id);
create policy "Users can update own inquiries"
  on public.inquiries for update using (auth.uid() = user_id);
create policy "Admins can manage all inquiries"
  on public.inquiries for all using (public.is_admin());

-- INQUIRY REPLIES
alter table public.inquiry_replies enable row level security;

create policy "Users can view replies to own inquiries"
  on public.inquiry_replies for select
  using (exists (select 1 from public.inquiries where id = inquiry_id and user_id = auth.uid()));
create policy "Admins can manage all inquiry replies"
  on public.inquiry_replies for all using (public.is_admin());

-- CHAT LOGS
alter table public.chat_logs enable row level security;

create policy "Users can view own chat logs"
  on public.chat_logs for select using (auth.uid() = user_id);
create policy "Users can create own chat logs"
  on public.chat_logs for insert with check (auth.uid() = user_id);
create policy "Admins can view all chat logs"
  on public.chat_logs for select using (public.is_admin());

-- EVENTS
alter table public.events enable row level security;

create policy "Anyone can view active events"
  on public.events for select using (is_active = true);
create policy "Admins can manage events"
  on public.events for all using (public.is_admin());

-- EVENT COMMENTS
alter table public.event_comments enable row level security;

create policy "Anyone can view event comments"
  on public.event_comments for select using (true);
create policy "Users can create event comments"
  on public.event_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own event comments"
  on public.event_comments for delete using (auth.uid() = user_id);
create policy "Admins can manage all event comments"
  on public.event_comments for all using (public.is_admin());

-- EVENT COUPONS
alter table public.event_coupons enable row level security;

create policy "Anyone can view event coupons"
  on public.event_coupons for select using (true);
create policy "Admins can manage event coupons"
  on public.event_coupons for all using (public.is_admin());
