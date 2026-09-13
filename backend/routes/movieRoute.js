import express from "express";
import {listMovies,getMovie,listGenres} from "../controllers/movieController.js";


const movieRouter = express.Router();
// GET /api/movies
movieRouter.get("/", listMovies);
// GET /api/movies/categories
movieRouter.get("/categories", listGenres);
// GET /api/movies/:movieId
movieRouter.get("/:movieId", getMovie);


export default movieRouter;