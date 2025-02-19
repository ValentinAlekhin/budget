create type categories_type_enum as enum ('inc', 'cost', 'adjustment');
create type categories_plan_period_enum as enum ('day', 'week', 'month', 'quarter', 'year');

create table if not exists users
(
    id         serial       not null primary key,
    created_at timestamp    not null default now(),
    updated_at timestamp    not null default now(),
    username   varchar(50)  not null unique,
    email      varchar(100) not null unique,
    password   varchar(200) not null,
    deleted_at timestamp    null
);

create table if not exists categories
(
    id          bigserial                   not null primary key,
    created_at  timestamp                   not null default now(),
    updated_at  timestamp                   not null default now(),
    name        varchar(50)                 not null,
    type        categories_type_enum        not null,
    "order"     integer                     not null,
    comment     varchar(100)                not null default '',
    user_id     int                         not null,
    deleted_at  timestamp                   null,
    icon        varchar(50)                 not null default '',
    plan        numeric(12, 2)              null,
    color       varchar(50)                 not null default '',
    plan_period categories_plan_period_enum not null default 'month',
    constraint "fk_categories_users" foreign key (user_id) references users (id) on update cascade on delete cascade
);

create table if not exists records
(
    id          bigserial      not null primary key,
    created_at  timestamp      not null default now(),
    updated_at  timestamp      not null default now(),
    amount      numeric(12, 2) not null,
    comment     varchar(100)   not null default '',
    timestamp   timestamp      not null,
    category_id bigint         not null,
    deleted_at  timestamp      null,
    constraint "fk_records_categories" foreign key (category_id) references categories (id) on update cascade on delete cascade
);

create table if not exists refresh_tokens
(
    id            bigserial not null primary key,
    created_at    timestamp not null default now(),
    updated_at    timestamp not null default now(),
    refresh_token text      not null,
    expires_at    timestamp not null,
    user_id       integer   not null,
    deleted_at    timestamp null,
    constraint "fk_refresh_tokens_users" foreign key (user_id) references users (id) on update cascade on delete cascade
);

create index if not exists idx_categories_user_id on categories (user_id);
create index if not exists idx_records_category_id on records (category_id);
create index if not exists idx_refresh_tokens_user_id on refresh_tokens (user_id);