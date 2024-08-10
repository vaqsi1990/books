const { isValidObjectId } = require('mongoose');
// exports.checkId = async(req, res, next) => {
//  if(!isValidObjectId(req.params.id)) {
//     res.status(404)
//     throw new Error(`Invalid Object of: ${req.params.id}`);
//  }
//  next();
// }

module.exports = function checkId(fn) {
   return function (req, res, next) {
      if(!isValidObjectId(req.params.id)) {
         res.status(404)
         throw new Error(`Invalid Object of: ${req.params.id}`);
      }
      next();
   };
 };
 