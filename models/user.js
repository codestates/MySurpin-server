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
    validGoogleData(googleData) {
      return bcrypt.compareSync(googleData.toString(), this.googleData);
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
      googleData: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user) => {
          if (user.password !== "" && user.password)
            user.password = bcrypt.hashSync(user.password.toString(), 10);
          if (user.googleData)
            user.googleData = bcrypt.hashSync(user.googleData.toString(), 10);
        },
      },
      instanceMethods: {},
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
