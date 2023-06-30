const config = require('../config');
const {
  BadRequestError,
  AlreadyExistsError,
  NotExistError
} = require('../errors');
const moment = require('moment');
const organizationApi = require('./organizationApi');
module.exports = class BookService {
  constructor(repository) {
    this.repository = repository;
  }

  async addBook(body, organizationId) {
    if (
      !body ||
      !body.isbn ||
      !body.title ||
      !body.authors ||
      !body.year > 0 ||
      !body.quantity > 0
    ) {
      throw new BadRequestError('add', 'book');
    }
    if (!(await organizationApi.getOrganizationById(organizationId))) {
      throw new NotExistError('organization', organizationId);
    }

    const book = await this.repository.getBook(body.isbn, organizationId);
    if (book && !book.is_deleted) {
      throw new AlreadyExistsError('book', body.isbn);
    }
    let addedBook;
    if (book && book.is_deleted) {
      addedBook = await this.repository.addDeletedBook(
        body.isbn,
        body.title,
        body.authors,
        body.year,
        body.quantity,
        organizationId
      );
    } else {
      addedBook = await this.repository.addBook(
        body.isbn,
        body.title,
        body.authors,
        body.year,
        body.quantity,
        organizationId
      );
    }
    return addedBook.id;
  }

  async updateBook(isbn, body, organizationId) {
    if (!isbn || !body.title || !body.authors || !body.year || !body.quantity) {
      throw new BadRequestError('update', 'book');
    }
    const book = await this.repository.getBook(isbn, organizationId);
    if (!book || book.is_deleted) {
      throw new NotExistError('Book', isbn);
    }
    const bookId = this.repository.updateBook(
      isbn,
      body.title,
      body.authors,
      body.year,
      body.quantity,
      organizationId
    );
    return bookId;
  }

  async getBooks(name, page, limit, organizationId) {
    if (!page || page < 0 || !limit || limit < 0 || !organizationId) {
      throw new BadRequestError('get', 'book pagination');
    }

    const books = await this.repository.searchNameAuthor(organizationId, name);

    const startIndex = (parseInt(page) - 1) * limit;
    const endIndex = parseInt(page) * limit;
    const results = {};

    if (endIndex < books.length) {
      results.next = {
        page: parseInt(page) + 1,
        limit: limit
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: parseInt(page) - 1,
        limit: limit
      };
    }
    results.results = books.slice(startIndex, endIndex);
    return results;
  }

  async deleteBook(isbn, organizationId) {
    if (!isbn || !organizationId) {
      throw new BadRequestError('delete', 'book');
    }
    const book = await this.repository.getBook(isbn, organizationId);
    if (!book || book.is_deleted) {
      return isbn;
    }
    const bookIsbn = await this.repository.deleteBook(isbn, organizationId);
    return bookIsbn;
  }

  async getTopBooks(organizationId, amount) {
    if (!organizationId || !amount) {
      throw new BadRequestError('get', 'top books');
    }
    const books = await this.repository.getBooksOrderedByReservations(
      organizationId,
      amount
    );
    return books;
  }

  async getAllBooks(organizationId) {
    return await this.repository.getAllBooks(organizationId);
  }

  async getBooksByOrganizationId(organizationId) {
    return await this.repository.getBooksByOrganizationId(organizationId);
  }

  //PRIVATE METHODS

  async getBookById(id) {
    const book = await this.repository.getBookById(id);
    if (!book) {
      throw new NotExistError('Book', id);
    }
    return book;
  }

  async getBookByIsbnAndOrgId(organizationId, isbn) {
    const book = await this.repository.getBook(isbn, organizationId);
    if (!book) {
      throw new NotExistError('Book', isbn);
    }
    return book;
  }

  async increaseTimesRead(organizationId, isbn) {
    const book = await this.repository.getBook(isbn, organizationId);
    if (!book) {
      throw new NotExistError('Book', isbn);
    }
    const times_read = await this.repository.increaseTimesRead(
      isbn,
      organizationId
    );
    return times_read;
  }
};
