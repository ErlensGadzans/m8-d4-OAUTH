const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  "google", //GIVING NAME TO STRATEGY
  new GoogleStrategy(
    {
      //CODE HANDLE ENTIRE PROCESS. CODE FROM http://www.passportjs.org/packages/passport-google-oauth20/
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
    }
  )
);
