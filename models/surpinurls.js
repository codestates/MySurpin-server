"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SurpinUrls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SurpinUrls.belongsTo(models.Surpin, {
        foreignKey: "listId",
      });
    }
  }
  SurpinUrls.init(
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      listId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SurpinUrls",
    }
  );
  return SurpinUrls;
};
