import express from "express";

import {listWishlist,addToWishlist,removeFromWishlist} from "../controllers/wishlistController.js";
const wishlistRouter = express.Router();
// GET /api/wishlist
wishlistRouter.get("/", listWishlist);
// POST /api/wishlist
wishlistRouter.post("/", addToWishlist);
// DELETE /api/wishlist/:movieId
wishlistRouter.delete("/:movieId", removeFromWishlist);


export default wishlistRouter;