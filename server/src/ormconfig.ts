// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { CategoryEntity } from '@app/category/category.entity'
import { DataSource, DataSourceOptions } from 'typeorm'
import { UserEntity } from '@app/user/user.entity'
import { RecordEntity } from '@app/record/record.entity'

const { DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  entities: [UserEntity, CategoryEntity, RecordEntity],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}

const connectionSource = new DataSource(ormconfig)

export default connectionSource
