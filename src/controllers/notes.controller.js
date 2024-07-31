import mongoose from "mongoose";
import Note from "../models/Note.js";

// Render the form to create a new note
export const renderNoteForm = (req, res) => res.render("notes/new-note");

// Create a new note
export const createNewNote = async (req, res) => {
  const { title, description, tag, customId } = req.body; // Ensure 'customId' is included

  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (!customId) {
    errors.push({ text: "Please Provide a Custom ID" }); // Added customId validation
  }

  // If there are errors, re-render the form with error messages
  if (errors.length > 0) {
    return res.render("notes/new-note", {
      errors,
      title,
      description,
      tag,
      customId, // Ensure 'customId' is included
    });
  }

  try {
    const newNote = new Note({ title, description, tag, customId });
    newNote.user = req.user.id; // Associate note with the logged-in user
    await newNote.save();
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error_msg", "Error adding note");
    res.redirect("/notes/new");
  }
};

// Render all notes for a user
export const renderNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ date: "desc" })
      .lean();
    res.render("notes/all-notes", { notes });
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error_msg", "Error fetching notes");
    res.redirect("/notes");
  }
};

// Render the form to edit a specific note
export const renderEditForm = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).lean();
    if (!note || note.user.toString() !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    }
    res.render("notes/edit-note", { note });
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error_msg", "Error fetching note");
    res.redirect("/notes");
  }
};

// Update a specific note
export const updateNote = async (req, res) => {
  const { title, description, customId } = req.body; // Include customId
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid ID format');
  }

  try {
    await Note.findByIdAndUpdate(id, { title, description, customId }, { new: true });
    req.flash("success_msg", "Note Updated Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error_msg", "Error updating note");
    res.redirect(`/notes/edit/${id}`);
  }
};

// Delete a specific note
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Note Deleted Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error_msg", "Error deleting note");
    res.redirect("/notes");
  }
};
