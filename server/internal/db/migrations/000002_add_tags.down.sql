alter table records
    drop constraint if exists fk_records_tag;
alter table records
    drop column if exists tag_id;

drop table if exists category_tags;

drop table if exists tags;
