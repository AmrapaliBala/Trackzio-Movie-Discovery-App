import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import movieRouter from "./routes/movieRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import { apiLimiter} from "./middleware/rateLimitMiddleware.js";
import { notFound, errorHandler} from "./middleware/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 5000;

// ---------------------------------------// DATABASE// ---------------------------------------
connectDB();
// ---------------------------------------// MIDDLEWARE// ---------------------------------------
app.use(cors({origin:process.env.FRONTEND_URL ||"http://localhost:5173"}));
app.use( express.json());
// ---------------------------------------// RATE LIMIT//---------------------------------------
app.use("/api",apiLimiter);
// ---------------------------------------// API ROUTES// ---------------------------------------
app.use( "/api/movies", movieRouter);
app.use("/api/wishlist",wishlistRouter);
// ---------------------------------------// TEST ROUTE// ---------------------------------------
app.get("/", (req, res) => {res.json({success: true,message:"Trackzio Movie Discovery API Working"});});
// ---------------------------------------// ERROR HANDLING// ---------------------------------------
app.use(notFound);
app.use(errorHandler);
// ---------------------------------------// START SERVER// ---------------------------------------
app.listen( port,() => {console.log(`Server started on PORT:${port}`);});

// For movies:
// React → server → movieRoute → movieController → movieService → movieApi → TMDB

// For wishlist:
// React → server → wishlistRoute → wishlistController → wishlistModel → MongoDB