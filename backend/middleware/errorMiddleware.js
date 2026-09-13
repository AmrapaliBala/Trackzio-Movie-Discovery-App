export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message:
            `Route not found: ${req.method} ${req.originalUrl}`
    });
};

export const errorHandler = (error,req,res,next)=> {
    console.error(error);
    // TMDB request timeout
    if (error.code === "ECONNABORTED" ||error.code === "ETIMEDOUT") {
        return res.status(504).json({ success: false, message:"The movie service is taking too long to respond. Please try again."});
    }


    // TMDB rate limit
    if (error.response?.status === 429) {
        return res.status(503).json({ success: false,message:"The movie service is temporarily rate-limited. Please try again shortly."});
    }
    const statusCode =error.response?.status ||error.statusCode ||500;
    res.status(statusCode).json({success: false,message:error.response?.data?.status_message ||error.message ||"Something went wrong on the server."});
};