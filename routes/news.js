const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Display all news
router.get('/', async (req, res) => {
  const newsList = await News.find();
  res.render('news/index', { news: newsList });
});

// Add a news article
router.get('/add', (req, res) => res.render('news/add'));

router.post('/add', async (req, res) => {
  const { title, content, author } = req.body;
  await News.create({ title, content, author });
  res.redirect('/news');
});

// Edit news article
router.get('/edit/:id', async (req, res) => {
  const newsItem = await News.findById(req.params.id);
  res.render('news/edit', { news: newsItem });
});

router.post('/edit/:id', async (req, res) => {
  const { title, content, author } = req.body;
  await News.findByIdAndUpdate(req.params.id, { title, content, author });
  res.redirect('/news');
});

// Delete a news article
router.post('/delete/:id', async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.redirect('/news');
});

module.exports = router;
