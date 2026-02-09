const express = require('express');
const { listBanners, createBanner, updateBanner, deleteBanner } = require('../../controllers/admin/banner-controller');

const router = express.Router();

router.get('/', listBanners);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
