const express = require('express');
const router = express.Router();
const { Book } = require('../models');

//Shows the full list of books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('index', { books });
  } catch (error) {
    next(error);
  }
});

// Show the create new book form
router.get('/new', (req, res) => {
  res.render('books/new-book');
});

// Post a new book to the database
router.post('/new', async (req, res, next) => {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const books = await Book.findAll();
      res.render('books/new-book', { books, errors: error.errors });
    } else {
      next(error);
    }
  }
});

// Show book detail form
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/update-book', { book });
    } else {
      res.status(404).render('error', { message: 'Book not found', error: {} });
    }
  } catch (error) {
    next(error);
  }
});

// Update book info in the database
router.post('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.status(404).render('error', { message: 'Book not found', error: {} });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const book = await Book.findByPk(req.params.id);
      res.render('books/update-book', { book, errors: error.errors });
    } else {
      next(error);
    }
  }
});

// Delete a book
router.post('/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.status(404).render('error', { message: 'Book not found', error: {} });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;