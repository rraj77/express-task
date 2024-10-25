const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

module.exports = { errorHandler, notFoundHandler };
