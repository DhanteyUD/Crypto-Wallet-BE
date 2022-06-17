import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Web3 from 'web3';
import pool from '../db/connection';
import { encryptData } from '../utils/encrypt';
dotenv.config();
export const createAccount = async (id: number, res: Response) => {
    const web3 = new Web3(process.env.BSC_TESTNET_NODE!);
    console.log('connection successful');
  
    const account = web3.eth.accounts.create();
    const coin = 'BNB';
  
    let publicKey = account.address;
    let privateKey = account.privateKey;
    let enPrivateKey = encryptData('public_key.pem', privateKey);
  
    const query = `INSERT into "Wallets" ("address", private_key, coin, "UserId", "createdAt", "updatedAt") 
                                  values ('${publicKey}', '${enPrivateKey}', '${coin}', '${id}', (to_timestamp(${Date.now()} / 1000.0)), (to_timestamp(${Date.now()} / 1000.0)))`;
    pool.query(query, (err, result) => {
      if (!err) {
        // res.status(200).json();
        console.log(result.rows);
      } else {
        console.log(err.message);
        // res.status(409).json({ msg: "error occurred" });
      }
    });
    return true;
    // })
  };

export const storeTransaction = async()=>{
    
}