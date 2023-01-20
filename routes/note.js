const express = require("express");
const router = express.Router();
const {
  getAllNotes,
  getNote,
  updateNote,
  CreateNote,
  deleteNote,
} = require("../controller/note");

router.route("/").get(getAllNotes).post(CreateNote);
router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote);

module.exports = router;
