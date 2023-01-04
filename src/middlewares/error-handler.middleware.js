module.exports = function (err, req, res, next) {
  const error = toHttpError(err);

  res.status(error.statusCode).send(error);
};

const toHttpError = (err) => {
  if (err.statusCode) {
    return {
      statusCode: err.statusCode,
      error: err.message,
    };
  }

  console.error(err);
  return {
    statusCode: 500,
    error: "Internal Server Error",
  };
};
