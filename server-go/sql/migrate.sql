ROLLBACK;

CREATE EXTENSION if not exists postgres_fdw;

CREATE SERVER if not exists r_server FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (dbname 'budget', host 'localhost');

CREATE USER MAPPING if not exists FOR CURRENT_USER SERVER r_server
    OPTIONS (user 'admin', password 'admin');

CREATE FOREIGN TABLE if not exists r_users (
    id VARCHAR ,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    username VARCHAR NOT NULL ,
    email VARCHAR NOT NULL ,
    password VARCHAR NOT NULL,
    deleted_at TIMESTAMP
    ) SERVER r_server OPTIONS (schema_name 'public', table_name 'users');


CREATE FOREIGN TABLE if not exists r_categories (
    id VARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR NOT NULL,
    type categories_type_enum NOT NULL,
    "order" INTEGER NOT NULL,
    comment VARCHAR,
    user_id VARCHAR NOT NULL,
    deleted_at TIMESTAMP,
    icon VARCHAR,
    plan INTEGER,
    color VARCHAR,
    plan_period categories_plan_period_enum NOT NULL DEFAULT 'month'
    ) SERVER r_server OPTIONS (schema_name 'public', table_name 'categories');

CREATE FOREIGN TABLE if not exists r_records (
    id VARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    amount INTEGER NOT NULL,
    comment VARCHAR,
    timestamp TIMESTAMP NOT NULL,
    category_id VARCHAR NOT NULL,
    deleted_at TIMESTAMP
    ) SERVER r_server OPTIONS (schema_name 'public', table_name 'records');


alter table users
    add column if not exists old_id varchar;

alter table categories
    add column if not exists old_id varchar;
alter table categories
    add column if not exists old_user_id varchar;
alter table categories
    alter column user_id drop not null;

alter table records
    add column if not exists old_id varchar;
alter table records
    add column if not exists old_category_id varchar;
alter table records
    alter column category_id drop not null;

-- Теперь можно делать запросы
begin;
insert into users (created_at, updated_at, username, email, password, deleted_at, old_id) (SELECT created_at,
                                                                                                  updated_at,
                                                                                                  username,
                                                                                                  email,
                                                                                                  password,
                                                                                                  deleted_at,
                                                                                                  id
                                                                                           FROM r_users);

insert into categories (old_id, created_at, updated_at, name, type, "order", comment, deleted_at, icon,
                        plan,
                        color, plan_period, old_user_id)
select id,
       created_at,
       updated_at,
       name,
       type,
       "order",
       coalesce(comment, '') as comment,
       deleted_at,
       coalesce(comment, '') as icon,
       plan,
       coalesce(comment, '') as color,
       plan_period,
       user_id
from r_categories;


insert into records (old_id, created_at, updated_at, amount, comment, timestamp, old_category_id, deleted_at)
select id,
       created_at,
       updated_at,
       amount,
       coalesce(comment, '') as comment,
    timestamp,
    category_id,
    deleted_at
from r_records;

update categories as c
set user_id = u.id
    from users as u
where c.old_user_id = u.old_id;

update records as r
set category_id = c.id
    from categories as c
where c.old_id = r.old_category_id;

commit;


alter table users
drop column old_id;

alter table categories
drop column old_id;
alter table categories
drop column old_user_id;
alter table categories
    alter column user_id set not null;

alter table records
drop column old_id;
alter table records
drop column old_category_id;
alter table records
    alter column category_id set not null;


drop foreign table r_users;
drop foreign table r_categories;
drop foreign table r_records;
drop user mapping for current_user server r_server;
drop server r_server;
drop extension postgres_fdw;
