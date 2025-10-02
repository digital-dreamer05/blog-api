const { Sequelize } = require('sequelize');
const configs = require('./configs');

/*
const db = new Sequelize({
  host: configs.db.host,
  port: configs.db.port,
  username: configs.db.user,
  password: configs.db.password,
  database: configs.db.name,
  dialect: configs.db.dialect,
  logging: configs.isProduction ? false : console.log,
});
*/

const db = new Sequelize(
  configs.db.name,
  configs.db.user,
  configs.db.password,
  {
    host: configs.db.host,
    port: configs.db.port,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: require('fs').readFileSync(process.env.DB_SSL_CA_PATH),
      },
    },
  }
);

db.authenticate()
  .then(() => console.log('Connected to TiDB with SSL ✅'))
  .catch((err) => console.error('Connection failed:', err));

//* JsDoc
/**
 * @typedef {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 */
const User = require('./models/User')(db);

/**
 * @typedef {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 */
const Tag = require('./models/Tag')(db);

/**
 * @typedef {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 */
const TagsArticles = require('./models/TagsArticles')(db);

/**
 * @typedef {import('sequelize').ModelCtor<import('sequelize').Model<any, any>>}
 */
const Article = require('./models/Article')(db);

User.hasMany(Article, {
  foreignKey: 'author_id',
  onDelete: 'CASCADE',
});

Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Article.belongsToMany(Tag, {
  through: TagsArticles,
  onDelete: 'CASCADE',
  foreignKey: 'article_id',
});

Tag.belongsToMany(Article, {
  through: TagsArticles,
  onDelete: 'CASCADE',
  foreignKey: 'tag_id',
});

module.exports = { db, User, Tag, Article, TagsArticles };
