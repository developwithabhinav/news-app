const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { ensureAuthenticated } = require('../middleware/auth'); // Import the middleware

// Public - Display all news
router.get('/', async (req, res) => {
  const newsList = await News.find();
  const randomNumber = Math.floor(Math.random() * 12) + 1;
  res.render('news/index', { news: newsList });
});

// Protected - Add news (only authenticated users)
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('news/add');
});

router.post('/add', ensureAuthenticated, async (req, res) => {
  let { title, content, author, weblink } = req.body;
  content = content.slice(0, 128);
  const randomNumber = Math.floor(Math.random() * 12) + 1;
  let image = '/images/news' + randomNumber + '.jpg';
  let objectToCreate = { title, content, author, weblink, image }
  await News.create(objectToCreate);
  res.redirect('/news');
});

// Protected - Edit news
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const newsItem = await News.findById(req.params.id);
  res.render('news/edit', { news: newsItem });
});

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  let { title, content, author, weblink } = req.body;
  content = content.slice(0, 128);
  await News.findByIdAndUpdate(req.params.id, { title, content, author, weblink });
  res.redirect('/news');
});

// Protected - Delete news
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.redirect('/news');
});

module.exports = router;
