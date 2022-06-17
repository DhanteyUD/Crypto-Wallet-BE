import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { TokenPayload } from '../models/user.model';

// Token
const token = (details: TokenPayload) => {
  return createHash('sha256')
    .update(details.email + details.fullname + details.phone + details.date)
    .digest('hex');
};

// Compare Password...
const comparePasswords = (plainText: string, hash: string) => {
  return bcrypt.compare(plainText, hash);
};

export { token, comparePasswords };
