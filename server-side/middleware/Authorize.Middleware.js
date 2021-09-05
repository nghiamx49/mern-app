const db = require("../services/db.Service");
const User = db.Users;

const objMiddlewareCustom = {
  isAdmin: async (req, res, next) => {
    try {
      const { _id } = req.user;
      let foundAccount = await User.findById(_id);
      if (foundAccount.role !== process.env.ADMIN) {
        res.status(403).json({
          message: "Your dont have permission to access this page",
          mesErorr: true,
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  isUser: async (req, res, next) => {
    try {
      const { _id } = req.user;
      let foundAccount = await User.findById(_id);
      if (foundAccount.role !== process.env.USER) {
        res.status(403).json({
          message: "Your dont have permission to access this page",
          mesErorr: true,
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = objMiddlewareCustom;
