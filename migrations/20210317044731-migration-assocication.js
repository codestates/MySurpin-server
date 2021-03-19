"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addConstraint("SavedUsers", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_SavedUsers_Users",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("SavedUsers", {
      fields: ["listId"],
      type: "foreign key",
      name: "fk_SavedUsers_Surpin",
      references: {
        table: "Surpins",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("Surpins", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_Surpins_Users",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("SurpinUrls", {
      fields: ["listId"],
      type: "foreign key",
      name: "fk_SurpinUrls_Surpins",
      references: {
        table: "Surpins",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("Surpin_Tags", {
      fields: ["listId"],
      type: "foreign key",
      name: "fk_Surpin_Tags_Surpins",
      references: {
        table: "Surpins",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("Surpin_Tags", {
      fields: ["tagsId"],
      type: "foreign key",
      name: "fk_Surpin_Tags_Tags",
      references: {
        table: "Tags",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      "SavedUsers",
      "fk_SavedUsers_Users",
      {}
    );
    await queryInterface.removeConstraint(
      "SavedUsers",
      "fk_SavedUsers_Surpin",
      {}
    );
    await queryInterface.removeConstraint("Surpins", "fk_Surpins_Users", {});
    await queryInterface.removeConstraint(
      "SurpinUrls",
      "fk_SurpinUrls_Surpins",
      {}
    );
    await queryInterface.removeConstraint(
      "Surpin_Tags",
      "fk_Surpin_Tags_Surpins",
      {}
    );
    await queryInterface.removeConstraint(
      "Surpin_Tags",
      "fk_Surpin_Tags_Tags",
      {}
    );
  },
};
