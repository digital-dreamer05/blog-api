const express = require('express');
const passport = require('passport');
const articleController = require('../controllers/articleController');
const validate = require('../middlewares/validate');
const articleSchema = require('../validators/articleValidator');
const uploader = require('../utils/uploder');

const router = express.Router();

router
  .route('/')
  .post(
    passport.authenticate('accessToken', { session: false }),
    uploader.single('cover'),
    validate(articleSchema),
    articleController.createArticle
  )
  .get(articleController.findAllArticles);

router.route('/:slug').get(articleController.findBySlug);

router
  .route('/:id')
  .delete(
    passport.authenticate('accessToken', { session: false }),
    articleController.deleteArticle
  )
  .patch(
    passport.authenticate('accessToken', { session: false }),
    uploader.single('cover'),
    validate(articleSchema),
    articleController.updateArticle
  );

module.exports = router;
