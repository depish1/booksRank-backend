import express from "express";
import BooksController from "./books.controller.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const controller = new BooksController();

router.get("/", (req, res) => controller.apiGetBooks(req, res));
router.post("/", (req, res) => controller.apiAddBook(req, res));
router.put("/", (req, res) => controller.apiUpdateBook(req, res));
router.delete("/", (req, res) => controller.apiDeleteBook(req, res));

export default router;
