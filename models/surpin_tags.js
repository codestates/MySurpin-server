"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Surpin_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Surpin_Tags.belongsTo(models.Surpin, {
        foreignKey: "listId",
      });
      models.Surpin_Tags.belongsTo(models.Tags, {
        foreignKey: "tagsId",
      });
    }
  }
  Surpin_Tags.init(
    {
      tagsId: DataTypes.INTEGER,
      listId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Surpin_Tags",
    }
  );
  return Surpin_Tags;
};
