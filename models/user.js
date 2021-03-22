"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    updatePassword(password) {
      this.password = bcrypt.hashSync(password.toString(), 10);
    }
    validPassword(password) {
      return bcrypt.compareSync(password.toString(), this.password);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.SavedUser, {
        foreignKey: "userId",
      });
      models.User.hasMany(models.Surpin, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = bcrypt.hashSync(user.password.toString(), 10);
          // user.token = bcrypt.hashSync(user.token, 10);
        },
      },
      instanceMethods: {},
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
