import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    customId: { // Renamed to avoid confusion
      type: String,
      required: true,
      unique: true,
    },
    tag: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Note', NoteSchema);
