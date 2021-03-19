"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Surpin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Surpin.hasMany(models.SavedUser, {
        foreignKey: "listId",
      });
      models.Surpin.hasMany(models.SurpinUrls, {
        foreignKey: "listId",
      });
      models.Surpin.hasMany(models.Surpin_Tags, {
        foreignKey: "listId",
      });
      models.Surpin.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Surpin.init(
    {
      title: DataTypes.STRING,
      desc: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      savedCount: DataTypes.INTEGER,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Surpin",
    }
  );
  return Surpin;
};
