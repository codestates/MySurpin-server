'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

     await queryInterface.addConstraint('SavedUsers', {
      fields: ['userId'],
      type:"foreign key",
      name:"fk_SavedUsers_Users",
      references:{
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('SavedUsers', {
      fields: ['listId'],
      type:"foreign key",
      name:"fk_SavedUsers_SurpinList",
      references:{
        table: 'SurpinLists',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('SurpinLists', {
      fields: ['userId'],
      type:"foreign key",
      name:"fk_SurpinLists_Users",
      references:{
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('SurpinUrls', {
      fields: ['listId'],
      type:"foreign key",
      name:"fk_SurpinUrls_SurpinLists",
      references:{
        table: 'SurpinLists',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('SurpinList_Tags', {
      fields: ['listId'],
      type:"foreign key",
      name:"fk_SurpinList_Tags_SurpinLists",
      references:{
        table: 'SurpinLists',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint('SurpinList_Tags', {
      fields: ['tagsId'],
      type:"foreign key",
      name:"fk_SurpinList_Tags_Tags",
      references:{
        table: 'Tags',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("SavedUsers", "fk_SavedUsers_Users", {})
    await queryInterface.removeConstraint("SavedUsers", "fk_SavedUsers_SurpinList", {})
    await queryInterface.removeConstraint("SurpinLists", "fk_SurpinLists_Users", {})
    await queryInterface.removeConstraint("SurpinUrls", "fk_SurpinUrls_SurpinLists", {})
    await queryInterface.removeConstraint("SurpinList_Tags", "fk_SurpinList_Tags_SurpinLists", {})
    await queryInterface.removeConstraint("SurpinList_Tags", "fk_SurpinList_Tags_Tags", {})
  }
};
