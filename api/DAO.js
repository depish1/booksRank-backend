import mongodb from "mongodb";
let db = null;

export default class DAO {
  constructor() {
    this.ObjectId = mongodb.ObjectId;
  }

  async injectDB(conn) {
    if (db) {
      return;
    }
    try {
      db = await conn.db(process.env.BOOKS_NS);
    } catch (err) {
      console.error(
        `Unable to establish a collection handle in booksDAO: ${err}`
      );
    }
  }

  async getBooks({ filters = null, page = 0, booksPerPage = 20 } = {}) {
    let query = {};
    if (filters.title) {
      query = { $text: { $search: filters["title"] } };
    } else if (filters.genre) {
      query = { genre: { $eq: filters["genre"] } };
    } else if ("isReaded" in filters) {
      query = { isReaded: { $eq: filters["isReaded"] } };
    }

    let cursor;

    try {
      cursor = await db.collection("books").find(query).sort({ rating: -1 });
    } catch (err) {
      console.error(`Unable to issue find command, ${err}`);
      return { booksList: [], totalNumBooks: 0 };
    }

    const displayCursor = cursor.limit(booksPerPage).skip(booksPerPage * page);

    try {
      const booksList = await displayCursor.toArray();
      const totalNumBooks = await db.collection("books").countDocuments(query);

      return { booksList, totalNumBooks };
    } catch (err) {
      console.error(
        `Unable to convert cursor to array or counting documents, ${err}`
      );

      y = getBool();
      return { booksList: [], totalNumBooks: 0 };
    }
  }

  async addBook(title, author, rating, genre, createDate, isReaded) {
    try {
      const bookDoc = {
        title: title,
        author: author,
        rating: rating,
        genre: genre,
        createDate: createDate,
        isReaded: isReaded,
      };

      return await db.collection("books").insertOne(bookDoc);
    } catch (e) {
      console.error(`Unable to post new book: ${e}`);
      return { error: e };
    }
  }

  async updateBook(id, title, author, rating, genre, isReaded) {
    try {
      const updateResponse = await db.collection("books").updateOne(
        { _id: this.ObjectId(id) },
        {
          $set: {
            title: title,
            author: author,
            rating: rating,
            genre: genre,
            isReaded: isReaded,
          },
        }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update book: ${e}`);
      return { error: e };
    }
  }

  async deleteBook(bookId) {
    try {
      const deleteResponse = await db.collection("books").deleteOne({
        _id: this.ObjectId(bookId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete book: ${e}`);
      return { error: e };
    }
  }
}
