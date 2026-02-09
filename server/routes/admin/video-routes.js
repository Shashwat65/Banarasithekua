const express = require('express');
const { listVideos, createVideo, updateVideo, deleteVideo } = require('../../controllers/admin/video-controller');

const router = express.Router();

router.get('/', listVideos);
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
