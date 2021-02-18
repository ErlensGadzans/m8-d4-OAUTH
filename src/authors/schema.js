const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthorSchema = new Schema({
  name: String,
  img: String,
  username: String,
  password: String,
  email: String,
  googleId: String,
});

AuthorSchema.statics.findByCredentials = async function (username, plainPW) {
  const author = await this.findOne({ username });

  if (author) {
    const isMatch = await bcrypt.compare(plainPW, author.password);
    if (isMatch) return author;
    else return null;
  } else {
    return null;
  }
};

AuthorSchema.pre("save", async function (next) {
  //pre saving authors data
  const author = this;
  const plainPW = author.password;

  if (author.isModified("password")) {
    // modifying pasword of author
    author.password = await bcrypt.hash(plainPW, 12);
  }
  next();
});

module.exports = model("Author", AuthorSchema);
