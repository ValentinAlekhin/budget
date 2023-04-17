// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const { DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env

import * as pg from 'pg'
pg.defaults.parseInputDatesAsUTC = true
pg.types.setTypeParser(
  1114,
  (stringValue: string) => new Date(`${stringValue}Z`),
)

export const ormconfig: DataSourceOptions = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}

const connectionSource = new DataSource(ormconfig)

export default connectionSource
