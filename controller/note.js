const { StatusCodes } = require("http-status-codes");
const Note = require("../models/note");
const { NotFoundError, BadRequestError } = require("../errors");

// GET ALL USERS NOTES
const getAllNotes = async (req, res) => {
  const { userId: userId } = req.user;
  const notes = await Note.find({ createdBy: userId }).sort("createdAt");
  return res.status(StatusCodes.OK).json({ notes, count: notes.length });
};

// GET SINGLE NOTE
const getNote = async (req, res) => {
  const {
    user: { userId },
    params: { id: noteId },
  } = req;

  const note = await Note.findOne({
    _id: noteId,
    createdBy: userId,
  });
  if (!note) {
    throw new NotFoundError(`no note with id: ${noteId}`);
  }
  console.log(req.params.id);
  return res.status(StatusCodes.OK).json({ note, info: req.params.id });
};

// CREATE NOTE FOR USER
const CreateNote = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const note = await Note.create(req.body);

  return res.status(StatusCodes.CREATED).json({ note });
};

// UPDATE USERS NOTE
const updateNote = async (req, res) => {
  const {
    body: { folder, note },
    user: userId,
    params: { id: noteId },
  } = req;
  if (folder == "" || note == "") {
    throw new BadRequestError(" folder or note cannot be empty");
  }
  const updatedNote = await Note.findByIdAndUpdate(
    { _id: noteId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedNote) {
    throw new NotFoundError(`no note with id: ${noteId}`);
  }
  return res.status(StatusCodes.OK).json({ updatedNote });
};

// DELETE A NOTE
const deleteNote = async (req, res) => {
  const {
    user: userId,
    params: { id: noteId },
  } = req;
  const note = await Note.findByIdAndDelete({ _id: noteId, createdBy: userId });

  if (!note) {
    throw new NotFoundError(`no note with id: ${noteId}`);
  }
  return res.status(StatusCodes.OK).send();
};

module.exports = { getAllNotes, getNote, CreateNote, updateNote, deleteNote };
