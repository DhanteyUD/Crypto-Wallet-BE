import { Request, Response, NextFunction } from 'express';
require('dotenv').config();
import jwt from 'jsonwebtoken';

const Auth = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Using Config module to read token validities.
      const decoded = jwt.verify(token, `${process.env.SECRET}`);

      req.user = decoded;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No Access Token Provided.' });
  }

  next();
};

export default Auth;
