// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: String,
  title: String,
  bio: String,
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
