// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  userId: String,
  personalInfo: {
    type: mongoose.Schema.Types.Mixed
  }
});

export default mongoose.model('User', userSchema);
