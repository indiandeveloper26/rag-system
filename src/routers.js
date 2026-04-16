import express from "express";
import { handleAskAI } from "./controllers.js";
import { setupRAG } from "./controllers/pdfsave.js";



const ragrouter = express.Router();

ragrouter.get("/", handleAskAI);
ragrouter.post("/", setupRAG);

export default ragrouter;