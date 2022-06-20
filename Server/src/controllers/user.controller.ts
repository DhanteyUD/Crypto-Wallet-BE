import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../db/connection';
import { sendEmail } from '../utils/sendEmail';
import { token } from '../utils/sha256Encode';
import { token as generateToken } from '../services/generateToken.service';
import { passLink } from '../template/verifyEmail.template';
import { createAccount } from '../services/wallet.service';
import { UserData } from '../models/user.model';
import { hashPassword } from '../utils/encrypt';
dotenv.config();

// Register User...
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, fullname, mobile, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const newToken = token({ email, fullname, currentDate: new Date() });

    const signupQuery = `INSERT into "Users" (email, fullname, mobile, password, "createdAt", "updatedAt", "verifyToken")
                        values ('${email}', '${fullname}', '${mobile}', '${hashedPassword}', (to_timestamp(${Date.now()} / 1000.0)), (to_timestamp(${Date.now()} / 1000.0)), '${newToken}')
    `;

    pool.query(signupQuery, async (err: any, result: any) => {
      if (!err) {
        const link = `https://lightpay-cw.netlify.app/auth/verify-email/?verifyToken=${newToken}`

        const verifiedEmail = passLink(fullname.split(' ')[0], link);
        sendEmail(email, 'Verify your LightPay Account', verifiedEmail);

        res.status(201).json({
          message:
            'Registration Successful. Check your email to verify your account.',
        });
      } else {
        res
          .status(500)
          .send('An account already exists with this email, Please sign in.');
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login User...
export const login = async (req: Request, res: Response) => {
  let { email } = req.body;
  let plainPassword = req.body.password;

  const signinQuery = `SELECT id, mobile, email, fullname, password, status, "verifyToken" FROM "Users" WHERE email='${email}'`;

  pool.query(signinQuery, (err: any, result: any) => {
    if (!err) {
      if (!result.rows[0]) {
        return res.json({ message: 'Invalid email or password.' });
      }

      const { id, email, fullname, mobile, password, verifyToken } =
        result.rows[0];

      if (bcrypt.compareSync(plainPassword, password)) {
        if (result.rows[0].status) {
          const user = { id, email, mobile };
          const user_secret = process.env.SECRET as string;
          const token = jwt.sign(user, user_secret, { expiresIn: '1h' });

          console.log(token);

          res.status(200).json({ message: 'Login successful.', token });
        } else {
          // send verification email.
          const link = `http://localhost:3000/auth/verify-email/?verifyToken=${verifyToken}`;
          const verifiedEmail = passLink(fullname.split(' ')[0], link);
          sendEmail(email, 'Verify your LightPay Email', verifiedEmail);
          res.status(200).json({
            message:
              'Account not verified. Please check your email to verify your account.',
          });
        }
      } else {
        console.log('Sign in failed');
        res.status(403).json({ message: 'Invalid email or password.' });
      }
    }
  });
};

// Get Username...
export const getUsername = async (req: Request, res: Response) => {
  try {
    const query = `SELECT fullname FROM "Users" WHERE id='${req.user.id}'`;

    pool.query(query, (err: any, result: any) => {
      if (!err) {
        if (!result.rows[0]) {
          return res.status(404).json({
            message: 'User not found.',
          });
        }

        return res.status(200).json({
          username: result.rows[0].fullname,
        });
      }
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: 'An Unexpected Error Occurred.',
    });
  }
};

// Reset Password...
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resetUrl = req.url;
    const resetToken = resetUrl.slice(resetUrl.lastIndexOf('/') + 1);

    const targetUser = await pool.query(
      `SELECT * FROM "Users" WHERE "resetToken" = $1`,
      [resetToken]
    );

    if (targetUser.rows.length) {
      const { password } = req.body;
      const hashedPassword = await hashPassword(password);

      pool.query(
        `UPDATE "Users" SET "password" = $1, "resetToken" = $2 WHERE "resetToken" = $3`,
        [hashedPassword, null, resetToken]
      );
      res.status(200).send('Password updated successfully.');
    } else {
      console.log('Password reset link has expired.');
      res.status(403).send('Password reset link has expired.');
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

// Verify Email...
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let str = req.url;
    const emailToken = str.slice(str.lastIndexOf('/') + 1);

    const verifiedToken = await pool.query(
      `SELECT * FROM "Users" WHERE "verifyToken" = $1`,
      [emailToken]
    );
    console.log(verifiedToken, 'verified');

    const walletCreated: Boolean = await createAccount(
      verifiedToken.rows[0].id,
      res
    );

    if (walletCreated && verifiedToken.rows.length) {
      pool.query(
        `UPDATE "Users" SET "status" = true, "emailVerifiedDate" = (to_timestamp(${Date.now()} / 1000.0)), "verifyToken" = null WHERE "verifyToken" = '${emailToken}'`
      );

      console.log('Account verified successfully.');
      return res
        .status(200)
        .json({ message: 'Account verified successfully.' });
    } else {
      console.log('forbidden!');
      return res.status(403).json({ message: 'Invalid verification link.' });
    }
  } catch (err: any) {
    return res.status(403).json({ message: 'Invalid verification link.' });
  }
};

// Forgot Password...
export const forgotPassword = async (req: Request, res: Response) => {
  let userData: UserData = req.body as unknown as UserData;

  try {
    const email = userData.email;

    const targetUser = await pool.query(
      `SELECT * FROM "Users" WHERE "email" = $1`,
      [email]
    );

    if (targetUser.rows.length) {
      const user = targetUser.rows[0];
      const payload = {
        email: user.email,
        phone: user.phone,
        fullname: user.fullname,
        date: new Date(),
      };

      let getToken = generateToken({ ...payload });
      pool.query(`UPDATE "Users" SET "resetToken" = $1 WHERE "email" = $2`, [
        getToken,
        email,
      ]);

      const link = `http://localhost:3000/auth/reset-password?resetToken=${getToken}`;

      const formattedEmail = passLink(user.fullname.split(' ')[0], link);

      await sendEmail(email, 'Reset your LightPay Password', formattedEmail);
      return res.status(200).json({
        message:
          'Please check your email to proceed with resetting your LightPay password.',
      });
    } else {
      res
        .status(403)
        .json({ message: 'No account was found for email provided.' });
    }
  } catch (err: any) {
    console.error(err.message);
    res.json({ message: err.message });
  }
};
