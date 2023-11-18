const express = require('express');
const router = express.Router();
const { Book } = require('../models');

// Redirect the home route to /books
router.get('/', (req, res) => {
  res.redirect('/books');
});

// Show the full list of books
router.get('/books', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('books/index', { books });
  } catch (error) {
    next(error);
  }
});

// Show the create new book form
router.get('/books/new', (req, res) => {
  res.render('books/new-book');
});

// Post a new book to the database
router.post('/books/new', async (req, res, next) => {
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
router.get('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/update-book', { book });
    } else {
      res.render('error', { message: 'Book not found', error: {} });
    }
  } catch (error) {
    next(error);
  }
});

// Update book info in the database
router.post('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('error', { message: 'Book not found', error: {} });
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
router.post('/books/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.render('error', { message: 'Book not found', error: {} });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;