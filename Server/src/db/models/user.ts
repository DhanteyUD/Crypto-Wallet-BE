'use strict';
import { Model } from 'sequelize';


interface userAttributes {
  email: string;
  mobile: string;
  fullname: string;
  password: string;
  verifyToken: string;
  emailVerifiedDate: Date;
  status: Boolean;
  blocked: Boolean;
  resetToken: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<userAttributes> 
  implements userAttributes {
    email!: string;
    mobile!: string;
    fullname!: string;
    password!: string;
    verifyToken!: string;
    emailVerifiedDate!: Date;
    status!: Boolean;
    blocked!: Boolean;
    resetToken!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Wallet, {
        sourceKey: 'id',
        foreignKey: 'UserId',
        as: 'Wallets'
       });

      User.hasMany(models.Transaction, {
        sourceKey: 'id',
        foreignKey: 'UserId',
        as: 'Transcations'
      });
    }

    
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      // primaryKey: true,
      unique: true,
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
