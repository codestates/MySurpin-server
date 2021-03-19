"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SavedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SavedUser.belongsTo(models.User, {
        foreignKey: "userId",
      });
      models.SavedUser.belongsTo(models.Surpin, {
        foreignKey: "listId",
      });
    }
  }
  SavedUser.init(
    {
      userId: DataTypes.INTEGER,
      listId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SavedUser",
    }
  );
  return SavedUser;
};
