// eslint-disable-next-line @typescript-eslint/no-var-requires
import { CategoryEntity } from '@app/category/category.entity'
import { DataSource, DataSourceOptions } from 'typeorm'
import { UserEntity } from '@app/user/user.entity'

require('dotenv').config()

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'admin',
  password: 'admin',
  database: 'budget',
  synchronize: true,
  entities: [UserEntity, CategoryEntity],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}

const connectionSource = new DataSource(ormconfig)

export default connectionSource
