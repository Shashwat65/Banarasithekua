const TeamMember = require('../../models/TeamMember');

const listActiveMembers = async (_req, res) => {
  try {
    const members = await TeamMember.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch team' });
  }
};

module.exports = { listActiveMembers };
