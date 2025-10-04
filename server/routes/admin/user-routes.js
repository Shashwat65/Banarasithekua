const express = require('express');
const { listUsers, updateUserRole, deleteUser, bootstrapAdmin } = require('../../controllers/admin/user-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

// Bootstrap (no auth)
router.post('/bootstrap', bootstrapAdmin);

// Auth + admin guard for the rest
router.use(authMiddleware, (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  next();
});

router.get('/list', listUsers);
router.put('/role/:id', updateUserRole);
router.delete('/delete/:id', deleteUser);

module.exports = router;
