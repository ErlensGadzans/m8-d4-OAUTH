const jwt = require("jsonwebtoken");

const authenticate = async (author) => {
  try {
    const accessToken = await generateJWT({ _id: author._id });

    return accessToken;
  } catch (error) {
    console.log(error);
    // next(error);
  }
};

module.exports = { authenticate, verifyJWT };
