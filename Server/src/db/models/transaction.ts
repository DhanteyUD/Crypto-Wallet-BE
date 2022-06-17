'use strict';
import { Model } from 'sequelize';

interface transcationAttributes {
  amount: number;
  To: string;
  From: string;
  Meta: string;
  Status: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Transaction extends Model<transcationAttributes> implements transcationAttributes {
    amount!: number
    To!: string;
    From!: string;
    Meta!: string;
    Status!: string

    static associate(models: any) {
    Transaction.belongsTo(models.User);
  };
}


  Transaction
    .init(
      {
        amount: {
          type: DataTypes.INTEGER(50),
          allowNull: false,
        },
        To: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        From: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Meta: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Transaction',
      }
    );
  return Transaction;
}