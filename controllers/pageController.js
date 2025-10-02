const { Article, Tag, User } = require('./../db');
const catchAsync = require('../utils/catchAsync');
const { marked } = require('marked');

// صفحه اصلی - لیست مقالات
exports.homePage = catchAsync(async (req, res, next) => {
  const articles = await Article.findAll({
    include: [
      {
        model: Tag,
        attributes: ['title'],
        through: {
          attributes: [],
        },
      },
      {
        model: User,
        attributes: { exclude: ['password', 'role', 'provider'] },
        as: 'author',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const formattedArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    slug: article.slug,
    cover: article.cover ? `/${article.cover}` : '/images/default-cover.jpg',
    published_date: article.createdAt,
    author: article.author.name || article.author.username,
    tags: article.tags.map((tag) => tag.title),
  }));

  res.render('index', { articles: formattedArticles });
});

// صفحه جزئیات مقاله
exports.articleDetailPage = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({
    where: {
      slug: req.params.slug,
    },
    attributes: {
      exclude: ['author_id'],
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'role', 'provider'] },
        as: 'author',
      },
      {
        model: Tag,
        attributes: ['title'],
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!article) {
    return res.status(404).send('Article not found');
  }

  const formattedArticle = {
    id: article.id,
    title: article.title,
    content: article.content, // اگر Markdown هست، از marked(article.content) استفاده کن
    slug: article.slug,
    cover: article.cover ? `/${article.cover}` : '/images/default-cover.jpg',
    published_date: article.createdAt,
    author: article.author.name || article.author.username,
    tags: article.tags.map((tag) => tag.title),
  };

  res.render('article', { article: formattedArticle });
});

// صفحه ساخت مقاله
exports.createArticlePage = (req, res) => {
  res.render('create-article');
};

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.registerPage = (req, res) => {
  res.render('register');
};
