import { Request, Response } from 'express';
import pool from '../db/connection';
import dotenv from 'dotenv';
import Web3 from 'web3';
import { decryptData } from '../utils/encrypt';

dotenv.config();

// Get Balances...
export const getBalances = async (req: Request | any, res: Response) => {
  try {
    const web3 = new Web3(process.env.BSC_TESTNET_NODE!);
    const id = req.user.id;
    const coin = req.params.coin;
    const myWallet = await pool.query(
      `SELECT address FROM "Wallets" WHERE "UserId"=${id} AND "coin"='${coin}'`
    );
    const address = myWallet.rows[0].address;

    let balance: any = await web3.eth.getBalance(address);
    let decimal = process.env.BSC_TOKEN_DECIMAL! as unknown as number;
    balance = (balance as unknown as number) / decimal;

    return res.status(200).json({
      balance,
    });
  } catch (error: String | String[] | any) {
    if (error.message.includes(`(reading 'address')`)) {
      return res.status(404).json({
        message: 'Unsupported Token',
      });
    }
    return res.status(500).json({
      message: 'An Unexpected Error Occurred',
    });
  }
};

// Get Crypto Wallets...
export const getCryptoWallets = async (req: Request, res: Response) => {
  try {
    const allWallets = await pool.query(`SELECT address, coin FROM "Wallets"`);
    return res.status(200).send(allWallets.rows);
  } catch (error: any) {
    console.log(error.message);
  }
};

// Get Balance...
export const getBalance2 = async (
  req: Request | any,
  res: Response,
  address: string
) => {
  try {
    const web3 = new Web3(process.env.BSC_TESTNET_NODE!);
    let balance: any = await web3.eth.getBalance(address);
    let decimal = process.env.BSC_TOKEN_DECIMAL! as unknown as number;
    balance = (balance as unknown as number) / decimal;
    return balance;
  } catch (error: String | String[] | any) {
    if (error.message.includes(`(reading 'address')`)) {
      return res.status(404).json({
        message: 'Unsupported Token',
      });
    }
    return res.status(500).json({
      message: 'An Unexpected Error Occurred',
    });
  }
};

// Get User Wallet...
export const getUserWallet = async (req: Request, res: Response) => {
  const id = req.user.id;
  try {
    const myWallet = await pool.query(
      `SELECT address, coin FROM "Wallets" WHERE "UserId"=${id}`
    );

    /**
     * development code start
     */

    const wallets = myWallet.rows;

    const walletsWithBal = [];
    for (let i = 0; i < wallets.length; i++) {
      const coin = wallets[i].coin;
      const address = wallets[i].address;

      const balance = await getBalance2(req, res, address);
      walletsWithBal.push({
        address,
        coin,
        balance,
      });
    }

    /**
     * development code end
     */
    return res.status(200).json(walletsWithBal);
  } catch (error: any) {
    console.log(error.message);
  }
};

// Get User Wallet...
export const getUserWallet2 = async (req: Request, res: Response) => {
  const id = req.user.id;
  try {
    const myWallet = await pool.query(
      `SELECT address, coin FROM "Wallets" WHERE "UserId"=${id}`
    );

    return res.status(200).json(myWallet.rows);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: 'An Unexpected Error Occurred',
    });
  }
};

// Get Transfer...
export const transfer = async (req: Request, res: Response) => {
  const web3 = new Web3(process.env.BSC_TESTNET_NODE!);
  const { toAddress, amount, fromAddress } = req.body;
  try {
    let data = await pool.query(
      `SELECT "private_key" FROM "Wallets" WHERE address='${fromAddress}'`
    );

    let newdata = data.rows[0].private_key;
    console.log(data.rows[0].private_key);

    let keyLocation =
      '/Users/okpalaanayo/Documents/weekly task/live-project-node-sq010-banking-app-lightpay/server/private_key.pem';

    let privateKey = decryptData(keyLocation, newdata) as unknown as string;

    let weiamount = amount * parseInt(process.env.BSC_TOKEN_DECIMAL!);
    let balance = await web3.eth.getBalance(fromAddress);

    if (weiamount < +balance * parseInt(process.env.BSC_TOKEN_DECIMAL!)) {
      const nonce = await web3.eth.getTransactionCount(toAddress, 'latest'); // nonce starts counting from 0

      const gas = await web3.eth.estimateGas({
        to: toAddress,
        from: fromAddress,
        value: amount,
        nonce,
      });
      const gasPrice = await web3.eth.getGasPrice();
      const signed: any = await web3.eth.accounts.signTransaction(
        {
          to: toAddress,
          from: fromAddress,
          value: amount,
          gas,
          gasPrice,
          nonce,
        },
        privateKey
      );
      let txHash = await web3.eth.sendSignedTransaction(signed.rawTransaction);
      return res.status(200).json({
        txHash,
        message: `Transfer Of ${
          amount / parseInt(process.env.BSC_TOKEN_DECIMAL!)
        } BNB Successful`,
      });
    }
    return res.status(403).json({
      message: 'Insufficient Balance',
    });
  } catch (err) {
    console.log(err);
  }
};
