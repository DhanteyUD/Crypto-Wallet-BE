import { decode } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token: any = localStorage.getItem('token');
  const refreshToken: any = localStorage.getItem('refreshToken');
  try {

    // decoded
    
    decode(token);
    const { exp } = token;
    if(Date.now() >= exp * 1000) {
      return false;
    }
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
  return true;
}