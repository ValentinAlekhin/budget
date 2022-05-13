const { PORT, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } =
  process.env

export default {
  port: parseInt(PORT, 10) || 3000,
  db: {
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT, 10) || 5432,
    database: DB_NAME || 'budget',
    username: DB_USERNAME || 'admin',
    password: DB_PASSWORD || 'admin',
  },
}
