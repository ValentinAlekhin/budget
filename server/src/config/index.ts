import * as Joi from 'joi'

const { PORT, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST } =
  process.env

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
})

export const validationOptions = {
  abortEarly: true,
}

export default {
  port: parseInt(PORT, 10) || 3000,
  db: {
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT, 10) || 5433,
    database: DB_NAME || 'budget',
    username: DB_USERNAME || 'admin',
    password: DB_PASSWORD || 'admin',
  },
}
