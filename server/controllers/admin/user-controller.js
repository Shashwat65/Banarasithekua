const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// List users (with optional search)
const listUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = { $or: [{ email: regex }, { userName: regex }] };
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Update role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// Bootstrap first admin (no auth required, guarded by secret)
const bootstrapAdmin = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body;
    if (!email || !password || !adminSecret) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ success: false, message: 'Invalid admin secret' });
    }
    // if any admin exists, deny bootstrap
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const adminUser = await User.create({ email, userName: email.split('@')[0], password: hashPassword, role: 'admin' });
    res.status(201).json({ success: true, data: { id: adminUser._id, email: adminUser.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to bootstrap admin' });
  }
};

module.exports = { listUsers, updateUserRole, deleteUser, bootstrapAdmin };
