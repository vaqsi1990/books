module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch((error) => {
          res.status(500).json({ message: error.message });
      });
  };
};
