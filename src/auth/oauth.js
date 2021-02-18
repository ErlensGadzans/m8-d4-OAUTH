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
    async function (accessToken, refreshToken, profile, next) {
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
          await newAuthor.save();
          const tokens = await authenticate(newAuthor);
          done(null, { newAuthor, tokens }); //NULL NOT ERROR SITUATION
        } else {
          //IF GOOGLE USER EXISTS JUST GENERATE TOKENS FOR HIM
          const tokens = await authenticate(author);
          done(null, { author, tokens });
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
);
//GETTING AUTHOR FROM PROVIDER & CONVERTED INTO A JSON
passport.serializeUser(function (author, done) {
  done(null, author);
});
