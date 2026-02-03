const express = require('express');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const { listSliderImages, createSliderImage, updateSliderImage, deleteSliderImage } = require('../../controllers/admin/slider-controller');

const router = express.Router();

router.use(authMiddleware, (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admins only' });
  next();
});

router.get('/get', listSliderImages);
router.post('/add', createSliderImage);
router.put('/edit/:id', updateSliderImage);
router.delete('/delete/:id', deleteSliderImage);

module.exports = router;
