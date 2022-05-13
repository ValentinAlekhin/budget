import { DataSource, DataSourceOptions } from 'typeorm'
import config from '@app/config'

export const ormconfig: DataSourceOptions = {
  ...config.db,
  type: 'postgres',
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}

const connectionSource = new DataSource(ormconfig)

export default connectionSource
