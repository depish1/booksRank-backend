import app from "./index.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import DAO from "./api/DAO.js";
import jwt from "jsonwebtoken";

dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
const dao = new DAO();

MongoClient.connect(process.env.BOOKS_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.log("xdddddd");
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await dao.injectDB(client);
    app.listen(port, () => {
      console.log(`listenning on port ${port}`);
    });
  });
