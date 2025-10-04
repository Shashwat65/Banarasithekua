const express = require("express");
const { createCategory, listCategories, updateCategory, deleteCategory } = require("../../controllers/admin/category-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Basic auth guard (admin only) - can be enhanced later
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  }
  next();
});

router.post('/add', createCategory);
router.get('/get', listCategories);
router.put('/edit/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;
