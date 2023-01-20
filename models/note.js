const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    folder: {
      type: String,
      required: [true, "notes must have a folder"],
      unique: true,
    },
    note: {
      type: String,
      required: [true, "notes can not be empty"],
      maxLength: 150,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
