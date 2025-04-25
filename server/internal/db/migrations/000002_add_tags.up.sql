create table if not exists tags
(
    id         bigserial   not null primary key,
    created_at timestamp   not null default now(),
    updated_at timestamp   not null default now(),
    name       varchar(50) not null,
    color      varchar(50) not null default '',
    icon       varchar(50) not null default '',
    user_id    integer     not null,
    deleted_at timestamp   null,
    constraint fk_tags_users foreign key (user_id) references users (id) on delete cascade
);

create table if not exists category_tags
(
    category_id bigint not null,
    tag_id      bigint not null,
    primary key (category_id, tag_id),
    constraint fk_category_tags_category foreign key (category_id) references categories (id) on delete cascade,
    constraint fk_category_tags_tag foreign key (tag_id) references tags (id) on delete cascade
);

alter table records
    add column if not exists tag_id bigint null,
    add constraint fk_records_tag foreign key (tag_id) references tags (id) on delete set null;

create index if not exists idx_tags_user_id on tags (user_id);
create index if not exists idx_category_tags_category_id on category_tags (category_id);
create index if not exists idx_category_tags_tag_id on category_tags (tag_id);
create index if not exists idx_records_tag_id on records (tag_id);
