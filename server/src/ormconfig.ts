// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { CategoryEntity } from '@app/category/category.entity'
import { DataSource, DataSourceOptions } from 'typeorm'
import { UserEntity } from '@app/user/user.entity'
import { RecordEntity } from '@app/record/record.entity'

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'admin',
  password: 'admin',
  database: 'budget',
  synchronize: true,
  entities: [UserEntity, CategoryEntity, RecordEntity],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}

const connectionSource = new DataSource(ormconfig)

export default connectionSource
