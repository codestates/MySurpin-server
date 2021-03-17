'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SurpinList_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SurpinList_Tags.belongsTo(models.SurpinList,{
        foreignKey: 'listId'
      });
      models.SurpinList_Tags.belongsTo(models.Tags,{
        foreignKey: 'tagsId'
      });
    }
  };
  SurpinList_Tags.init({
    tagsId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SurpinList_Tags',
  });
  return SurpinList_Tags;
};