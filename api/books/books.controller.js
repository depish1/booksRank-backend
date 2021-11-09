import DAO from "../DAO.js";

export default class BooksController {
  constructor() {
    this.dao = new DAO();
  }

  async apiGetBooks(req, res) {
    const booksPerPage = req.query.booksPerPage
      ? parseInt(req.query.booksPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    let filters = {};
    if ("isReaded" in req.query) {
      filters.isReaded = req.query.isReaded === "true";
    }

    const { booksList, totalNumBooks } = await this.dao.getBooks({
      filters,
      page,
      booksPerPage,
    });

    let response = {
      books: booksList,
      page: page,
      filters: filters,
      entries_per_page: booksPerPage,
      total_results: totalNumBooks,
    };

    res.json(response);
  }

  async apiAddBook(req, res) {
    try {
      const { title, author, rating, genre, isReaded } = req.body;
      console.log(title, author, rating, genre, isReaded);
      console.log(req.body);
      const createDate = Date.now();
      const booksResponse = await this.dao.addBook(
        title,
        author,
        rating,
        genre,
        createDate,
        isReaded
      );
      res.status(201).json({ status: "created" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async apiUpdateBook(req, res) {
    try {
      const { id, title, author, rating, genre, isReaded } = req.body;

      const booksResponse = await this.dao.updateBook(
        id,
        title,
        author,
        rating,
        genre,
        isReaded
      );
      res.status(200).json({ status: "ok" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async apiDeleteBook(req, res) {
    try {
      const bookId = req.body.book_id;
      await this.dao.deleteBook(bookId);
      res.status(200).json({ status: "ok" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
