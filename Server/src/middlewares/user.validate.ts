import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { joiPassword } from 'joi-password';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .min(12)
    .max(50)
    .messages({ 'string.empty': 'Email cannot be empty' })
    .required(),
  fullname: Joi.string()
    .min(3)
    .max(200)
    .messages({ 'string.empty': 'Fullname cannot be empty' })
    .required(),
  mobile: Joi.string()
    .max(15)
    .messages({ 'string.empty': 'Mobile cannot be empty' })
    .required(),
  password: joiPassword
    .string()
    .min(8)
    .max(100)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .messages({
      'string.empty': 'Password cannot be empty',
      'string.min': 'Minimum of 8 characters',
      'string.max': 'Maximum of 100 characters',
      'password.minOfUppercase': 'At least {#min} uppercase',
      'password.minOfSpecialCharacters': 'At least {#min} symbol',
      'password.minOfLowercase': 'At least {#min} lowercase',
      'password.minOfNumeric': 'At least {#min} number',
      'password.noWhiteSpaces':
        'Password {Password} should not contain white spaces',
    })
    .required(),
});

const userValidate = (req: Request, res: Response, next: NextFunction) => {
  schema
    .validateAsync(req.body, { abortEarly: false })
    .then(() => next())
    .catch((err: { message: any }) => {
      res.status(403).send(err.message);
    });
};

export default userValidate;
