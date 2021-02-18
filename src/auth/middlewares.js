const { verifyJWT } = require("../auth/index");
const AuthorSchema = require("../authors/schema");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    const author = await AuthorSchema.findOne({
      _id: decoded._id,
    });
    if (!author) {
      throw new Error();
    }
    // req.token = token;
    req.author = author;
    next();
  } catch (error) {
    const err = new Error("Please authenticate");
    next(error);
  }
};

module.exports = { authorize };
