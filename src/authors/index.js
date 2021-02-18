const express = require("express");
const AuthorSchema = require("./schema");
const { authenticate } = require("../auth");
const { authorize } = require("../auth/middlewares");
const passport = require("passport");

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const { _id } = await newAuthor.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body);
    const { _id } = await newAuthor.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body; //check credentials
    const author = await AuthorSchema.findByCredentials(username, password); //generate token
    const accessToken = await authenticate(author);
    res.send({ accessToken }); //send back token
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", authorize, async (req, res, next) => {
  try {
    const author = await AuthorSchema.find();
    res.send(author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//END POINTS
authorsRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] }) //INFO WHITCH IS REQUESTED FROM GOOGLE
);

authorsRouter.get(
  "/googleRedirect",
  passport.authenticate("google"), //PASSPORT AUTHENTICATE
  async (req, res, next) => {
    res.cookie("accessToken", req.user.accessToken);
    res.redirect(process.env.LOCAL_URL + "accessToken=" + req.user.accessToken);
  }
);

// usersRouter.get(
//   "/googleRedirect",
//   passport.authenticate("google"), //passport auth
//   async (req, res, next) => {
//     try {
//       res.cookie("accessToken", req.user.tokens.accessToken, {
//         //RETURNING FROM GOOGLE TOKEN. COOKIES ARE STORING TOKENS
//         httpOnly: true, //FROM FRONTEND JS IS NOT ABLE CHECK CONTENT. PROTECTING TOKENS.
//       });
//       res.cookie("refreshToken", req.user.tokens.refreshToken, {
//         httpOnly: true,
//         path: "/users/refreshToken", //COOKIES WILL BE PERFORMED ONLY WHEN THEY ARE NEEDED
//       });

//       res.status(200).redirect(process.env.LOCAL_URL); //tell the brower go to main page. PUT IN DOT ENV FILE.
//     } catch (error) {
//       next(error);
//     }
//   }
// );
module.exports = authorsRouter;
