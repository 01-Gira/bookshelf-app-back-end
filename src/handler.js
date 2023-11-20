const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = async (req, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (name == null) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
    }

    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message:
            'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage,
      reading,
      insertedAt,
      updatedAt,
    };

    await books.push(newBook);

    const isSuccess = (await books.filter((book) => book.id === id).length) > 0;

    if (isSuccess) {
      return h
        .response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        })
        .code(201);
    } else {
      return h
        .response({
          status: 'fail',
          message: 'Buku gagal ditambahkan',
        })
        .code(400);
    }
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(500);
  }
};

const getAllBooksHandler = async (req, h) => {
  try {
    const { name, reading, finished } = req.query;
    // return name.toLowerCase();
    let filteredBooks = books;

    if (name) {
      filteredBooks = await filteredBooks.filter((nm) =>
        nm.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (reading !== undefined) {
      filteredBooks = await filteredBooks.filter(
        (book) => Number(book.reading) === Number(reading)
      );
    }

    if (finished !== undefined) {
      filteredBooks = await filteredBooks.filter(
        (book) => Number(book.finished) === Number(finished)
      );
    }

    return h
      .response({
        status: 'success',
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal mendapatkan buku',
      })
      .code(500);
  }
};

const getBookByIdHandler = async (req, h) => {
  try {
    const { id } = req.params;
    const book = await books.filter((n) => n.id === id)[0];
    if (book !== undefined) {
      return h.response({
        status: 'success',
        data: {
          book,
        },
      });
    } else {
      return h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        })
        .code(404);
    }
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(500);
  }
};

const editBookByIdHandler = async (req, h) => {
  try {
    const { id } = req.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();

    if (name == null)
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
    if (readPage > pageCount)
      return h
        .response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);

    const index = await books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index] = await {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      return h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
    } else {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    }
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(500);
  }
};

const deleteBookByIdHandler = async (req, h) => {
  try {
    const { id } = req.params;
    const index = await books.findIndex((book) => book.id === id);

    if (index !== -1) {
      await books.splice(index, 1);
      return h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
    } else {
      return h
        .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    }
  } catch (error) {
    return h
      .response({
        status: 'fail',
        message: error.message,
      })
      .code(500);
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
