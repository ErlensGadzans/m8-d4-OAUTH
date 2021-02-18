const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthorSchema = require("../authors/schema");
const { authenticate } = require("../auth/index");

passport.use(
  "google", //GIVING NAME TO STRATEGY
  new GoogleStrategy(
    {
      //CODE HANDLE ENTIRE PROCESS. CODE FROM http://www.passportjs.org/packages/passport-google-oauth20/
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      //REGISTERING NEW USER
      try {
        const author = await AuthorSchema.findOne({ googleId: profile.id }); //LOOKING FOR AUTHOR
        //IF GOOGLE USER DO NOT EXISTS JUST SAVE IT INTO THE DB AND GENERATE TOKENS FOR HIM
        if (!author) {
          const newAuthor = new AuthorSchema({
            googleId: profile.id,
            name: profile.name.familyName,
            img: profile.photos.value,
            email: profile.emails[0].value,
          });
          const savedAuthor = await newAuthor.save();
          const accessToken = await authenticate(savedAuthor);
          done(null, { newAuthor, accessToken }); //NULL NOT ERROR SITUATION
        } else {
          //IF GOOGLE USER EXISTS JUST GENERATE TOKENS FOR HIM
          const accessToken = await authenticate(author);
          done(null, { author, accessToken });
        }
      } catch (error) {
        console.log(error);
        // next(error);
      }
    }
  )
);
//GETTING AUTHOR FROM PROVIDER & CONVERTED INTO A JSON
passport.serializeUser(function (author, done) {
  done(null, author);
});

passport.deserializeUser(function (author, done) {
  done(author, null);
});
