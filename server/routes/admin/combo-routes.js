const express = require('express');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const { createCombo, listCombos, updateCombo, deleteCombo } = require('../../controllers/admin/combo-controller');

const router = express.Router();

router.use(authMiddleware, (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  next();
});

router.post('/add', createCombo);
router.get('/get', listCombos);
router.put('/edit/:id', updateCombo);
router.delete('/delete/:id', deleteCombo);

module.exports = router;
