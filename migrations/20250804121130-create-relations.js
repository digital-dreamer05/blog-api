'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transcation = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('articles', 'author_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },

        onDelete: 'CASCADE',
      });

      await queryInterface.createTable('tags_articles', {
        article_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'articles',
            key: 'id',
          },

          onDelete: 'CASCADE',
        },

        tag_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'tags',
            key: 'id',
          },

          onDelete: 'CASCADE',
        },
      });

      await queryInterface.addConstraint('tags_articles', {
        fields: ['article_id', 'tag_id'],
        type: 'unique',
        name: 'unique_article_tag',
      });

      await transcation.commit();
    } catch (err) {
      await transcation.rollback();
      throw err;
    }
  },
  async down(queryInterface) {
    const transcation = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('articles', 'author_id');
      await queryInterface.dropTable('tags_articles');
      await queryInterface.commit();
    } catch (err) {
      await transcation.rollback();
      throw err;
    }

    await queryInterface.dropTable('relations');
  },
};
