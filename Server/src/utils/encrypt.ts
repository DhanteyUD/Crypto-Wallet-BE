import crypto from 'crypto';
import fs from 'fs';
import bcrypt from 'bcryptjs';

export const generateKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      //set the first key pair to
      type: 'spki',
      format: 'pem', ///set the format
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  ///write it to a file
  fs.writeFileSync('public_key.pem', Buffer.from(publicKey));

  fs.writeFileSync('private_key.pem', Buffer.from(privateKey));
};

export const encryptData = (keyLocation: string, data: any) => {
  try {
    const public_key = fs.readFileSync(keyLocation, 'utf8');
    //turn the data into a buffer so you can use it
    data = Buffer.from(data, 'utf8');
    return crypto.publicEncrypt(public_key, data).toString('base64');
  } catch (err) {
    console.log('err');
  }
};

export const decryptData = (keyLocation: string, data: any) => {
  try {
    const private_key = fs.readFileSync(keyLocation, 'utf8');
    data = Buffer.from(data.toString('base64'), 'base64');
    return crypto.privateDecrypt(private_key, data).toString('utf8');
  } catch (error) {}
};

export const decryptData2 = (keyLocation: string, data: any) => {
  try {
    const private_key = fs.readFileSync(keyLocation, 'utf8');

    let newData = Buffer.from(data, 'base64');
    let nprivate_key = {
      key: private_key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    };
    return crypto.privateDecrypt(nprivate_key, newData).toString('base64');
  } catch (error) {
    console.log(error);
  }
};

// Hash Password...
export const hashPassword = async (password: string) => {
  const salt = process.env.SALT_ROUNDS as string;
  return bcrypt.hash(password, +salt);
};
