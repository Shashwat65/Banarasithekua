const express = require('express');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const { createMember, listMembers, updateMember, deleteMember } = require('../../controllers/admin/team-controller');

const router = express.Router();
router.use(authMiddleware, (req,res,next)=>{ if (req.user?.role !== 'admin') return res.status(403).json({ success:false, message:'Admins only'}); next(); });

router.post('/add', createMember);
router.get('/get', listMembers);
router.put('/edit/:id', updateMember);
router.delete('/delete/:id', deleteMember);

module.exports = router;
