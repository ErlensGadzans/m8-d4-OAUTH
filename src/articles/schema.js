const { Schema, model } = require("mongoose");

const articleShema = new Schema(
  {
    headLine: String,
    subHead: String,
    content: String,
    category: String,
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    cover: String,
    reviews: [
      {
        text: String,
        user: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Article", articleShema);
