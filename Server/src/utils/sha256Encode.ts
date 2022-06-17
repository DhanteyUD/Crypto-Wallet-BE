import bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { Payload } from '../models/user.model';

// Email Token - User Signup...
const token = (details: Payload) => {
  return createHash('sha256')
    .update(details.email + details.fullname + details.currentDate)
    .digest('hex');
};

// Compare Password - User Signin...
const comparePasswords = (plainText: string, hash: string) => {
  return bcrypt.compare(plainText, hash);
};

export { token, comparePasswords };
