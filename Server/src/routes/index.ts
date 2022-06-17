import express from 'express';
import userValidate from '../middlewares/user.validate';
import { registerUser, login, resetPassword, verifyToken, forgotPassword, getUsername } from '../controllers/user.controller';
import { getCryptoWallets, getUserWallet, getBalances } from '../controllers/wallets.controller';
import { getTransactions } from '../controllers/transactions.controller';
import Auth from '../middlewares/Auth';

const router = express.Router();

/* Home page */
router.get('/', function (req, res) {
  res.render('index', { title: 'LightPay' });
});

/* Registration page */
router.post('/auth/register', userValidate, registerUser);

/* Verify email */
router.post('/auth/verify-email/:verifyToken', verifyToken);

/* Login */
router.post('/auth/login', login);

/* Get user's name */
router.get('/auth/username', Auth, getUsername);

/* Forgot password */
router.post('/auth/forgot-password', forgotPassword);

/* Reset password */
router.post('/auth/reset-password/:resetToken', resetPassword);

/* Get wallet balance */
router.get('/wallets/:coin/balance', Auth, getBalances);

/* Get all wallets */
router.get('/wallets', getCryptoWallets);

/* Get all user's wallets */
router.get('/wallets/userwallet', Auth, getUserWallet)

/* Get all transactions */
router.get('/transactions', Auth, getTransactions);


export default router;