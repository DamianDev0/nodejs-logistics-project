const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ "error": err.message, "message": "Ocurrió un error en el servidor" });
};

export default errorHandler