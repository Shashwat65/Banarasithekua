const mongoose = require('mongoose');

const VideoReviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoType: { 
    type: String, 
    enum: ['upload', 'youtube'], 
    required: true 
  },
  videoUrl: { type: String, required: true }, // For uploaded videos or YouTube URLs
  thumbnailUrl: String,
  public_id: String, // For uploaded videos
  youtubeId: String, // For YouTube videos
  duration: Number,
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('VideoReview', VideoReviewSchema);
