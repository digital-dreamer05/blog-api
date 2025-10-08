const { Article, Tag, User } = require('./../db');
const catchAsync = require('../utils/catchAsync');
const { marked } = require('marked');
const { calculateRelativeTimeDifference } = require('../utils/differenceTime');

exports.homePage = catchAsync(async (req, res, next) => {
  const articles = await Article.findAll({
    include: [
      {
        model: Tag,
        attributes: ['title'],
        through: { attributes: [] },
      },
      {
        model: User,
        attributes: { exclude: ['password', 'role', 'provider'] },
        as: 'author',
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const formattedArticles = articles.map((article) => {
    const timeInfo = calculateRelativeTimeDifference(article.createdAt);

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      slug: article.slug,
      cover: article.cover ? `/${article.cover}` : '/images/default-cover.jpg',
      relative_time: timeInfo.relative,
      full_date: timeInfo.fullDate,
      days_since: timeInfo.days,
      author: article.author.name || article.author.username,
      tags: article.tags.map((tag) => tag.title),
    };
  });

  res.render('index', { articles: formattedArticles });
});

exports.articleDetailPage = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({
    where: { slug: req.params.slug },
    attributes: { exclude: ['author_id'] },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'role', 'provider'] },
        as: 'author',
      },
      {
        model: Tag,
        attributes: ['title'],
        through: { attributes: [] },
      },
    ],
  });

  if (!article) return res.status(404).send('Article not found');

  const timeInfo = calculateRelativeTimeDifference(article.createdAt);

  const formattedArticle = {
    id: article.id,
    title: article.title,
    content: marked(article.content),
    slug: article.slug,
    cover: article.cover ? `/${article.cover}` : '/images/default-cover.jpg',
    relative_time: timeInfo.relative,
    full_date: timeInfo.fullDate,
    days_since: timeInfo.days,
    author: article.author.name || article.author.username,
    tags: article.tags.map((tag) => tag.title),
  };

  res.render('article', { article: formattedArticle });
});

exports.createArticlePage = (req, res) => {
  res.render('create-article');
};

exports.dashboardPage = catchAsync(async (req, res, next) => {
  res.render('dashboard');
});

exports.editArticlePage = catchAsync(async (req, res, next) => {
  res.render('edit-article');
});

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.registerPage = (req, res) => {
  res.render('register');
};

exports.verifyPage = (req, res) => {
  const email = req.query.email || '';
  res.render('verify', { email });
};

exports.authFailedPage = (req, res) => {
  const message = req.query.message || 'Authentication failed';
  res.render('auth-failed', { message });
};

exports.authSuccessPage = (req, res) => {
  const { accessToken, refreshToken } = req.query;
  res.render('auth-success', { accessToken, refreshToken });
};
