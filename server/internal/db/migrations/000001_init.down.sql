drop index if exists idx_categories_user_id;
drop index if exists idx_records_category_id;
drop index if exists idx_refresh_tokens_user_id;

drop table if exists refresh_tokens;
drop table if exists records;
drop table if exists categories;
drop table if exists users;

drop type if exists categories_plan_period_enum;
drop type if exists categories_type_enum;

