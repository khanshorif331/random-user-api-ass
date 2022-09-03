//module scaffolding
const err = {}

err.errorHandler = (err, _, res, __) => {
    console.log({
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
    });
}

module.exports = err;
