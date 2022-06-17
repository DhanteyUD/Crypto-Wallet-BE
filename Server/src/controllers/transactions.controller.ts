import { Request, Response } from 'express';
import pool from '../db/connection';

// Get all Transactions...
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const allTransactions = await pool.query(`
        SELECT * FROM "Transactions" WHERE "UserId"='${req.user.id}'
        ORDER BY "createdAt" DESC
        `);
    res.status(200).send(allTransactions.rows);
  } catch (error: any) {
    console.log(error.message);
  }
};
