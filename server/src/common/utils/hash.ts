import * as argon2 from 'argon2'

export const hash = (value: string | Buffer): Promise<string> =>
  argon2.hash(value)

export const verifyHash = (
  value: string,
  hashValue: string,
): Promise<boolean> => argon2.verify(hashValue, value)
