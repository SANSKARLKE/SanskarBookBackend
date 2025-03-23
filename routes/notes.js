const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const { findByIdAndDelete } = require("../models/User");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("content", "enter valid content").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, content, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "use my website properly", errors: errors.array() });
      }

      const note = new Note({
        title,
        content,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body("content", "enter valid content").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, content, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "use my website properly", errors: errors.array() });
      }

      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (content) {
        newNote.content = content;
      }
      if (tag) {
        newNote.tag = tag;
      }

      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found");
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, content, tag } = req.body;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "deletion successfull" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
