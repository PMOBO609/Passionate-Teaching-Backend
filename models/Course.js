const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: String },
  isPreview: { type: Boolean, default: false }
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      'Web Development',
      'Cybersecurity',
      'AI & Machine Learning',
      'Programming',
      'Cloud Computing',
      'Networking'
    ],
    required: true
  },
  thumbnail: { type: String, default: '' },
  lessons: [lessonSchema],
  reviews: [reviewSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);