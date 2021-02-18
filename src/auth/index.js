const jwt = require("jsonwebtoken");

const authenticate = async (author) => {
  try {
    const accessToken = await generateJWT({ _id: author._id });

    return accessToken;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GENERATING TOKEN
const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    )
  );
//VEREFYING TOKEN
const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    })
  );

module.exports = { authenticate, verifyJWT };
