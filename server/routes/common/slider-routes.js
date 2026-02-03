const express = require('express');
const { listActiveSliderImages } = require('../../controllers/common/slider-controller');

const router = express.Router();

router.get('/get', listActiveSliderImages);

module.exports = router;
