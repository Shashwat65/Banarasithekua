const VideoReview = require('../../models/VideoReview');

// Extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const listVideos = async (_req, res) => {
  try {
    const videos = await VideoReview.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, videoType, videoUrl, thumbnailUrl, public_id, duration, active = true, sortOrder = 0 } = req.body || {};
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'Video URL is required' });
    }
    if (!videoType || !['upload', 'youtube'].includes(videoType)) {
      return res.status(400).json({ success: false, message: 'Valid video type is required (upload or youtube)' });
    }

    let youtubeId = null;
    if (videoType === 'youtube') {
      youtubeId = extractYouTubeId(videoUrl);
      if (!youtubeId) {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
      }
    }

    const video = await VideoReview.create({
      title,
      description,
      videoType,
      videoUrl,
      thumbnailUrl,
      public_id,
      youtubeId,
      duration: Number(duration) || 0,
      active: typeof active === 'boolean' ? active : true,
      sortOrder: Number(sortOrder) || 0,
    });

    res.status(201).json({ success: true, data: video });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to add video' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoReview.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    const fields = ['title', 'description', 'videoType', 'videoUrl', 'thumbnailUrl', 'public_id', 'duration', 'active', 'sortOrder'];
    fields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        video[field] = req.body[field];
      }
    });

    if (req.body.videoType === 'youtube' && req.body.videoUrl) {
      video.youtubeId = extractYouTubeId(req.body.videoUrl);
    }

    await video.save();
    res.json({ success: true, data: video });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update video' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VideoReview.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoReview.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: video });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update views' });
  }
};

module.exports = { listVideos, createVideo, updateVideo, deleteVideo, incrementViews };
