const errorMiddleware = (err, req, res, next) => {
    console.error("Error :", err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle Mongoose specific errors
    if (err.name === "CastError") {
        err.statusCode = 404;
        err.message = "Resource not found";
    }

    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = "Duplicate field value entered";
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        err.statusCode = 400;
        err.message = messages.join(', ');
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;