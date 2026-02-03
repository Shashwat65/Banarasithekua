const TeamMember = require('../../models/TeamMember');

const createMember = async (req,res) => {
  try {
    const { name, role, photo, order = 0, active = true } = req.body;
    if (!name || !role) return res.status(400).json({ success:false, message:'name & role required'});
    const member = await TeamMember.create({ name, role, photo, order, active });
    res.status(201).json({ success:true, data: member });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to create member'}); }
};

const listMembers = async (req,res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (typeof active !== 'undefined') {
      filter.active = String(active) === 'true';
    }
    const members = await TeamMember.find(filter).sort({ order:1, createdAt:-1 });
    res.json({ success:true, data: members });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to fetch members'}); }
};

const updateMember = async (req,res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    if (!member) return res.status(404).json({ success:false, message:'Member not found'});
    ['name','role','photo','order','active'].forEach(f => { if (typeof req.body[f] !== 'undefined') member[f] = req.body[f]; });
    await member.save();
    res.json({ success:true, data: member });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to update member'}); }
};

const deleteMember = async (req,res) => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success:false, message:'Member not found'});
    res.json({ success:true, message:'Member deleted'});
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to delete member'}); }
};

module.exports = { createMember, listMembers, updateMember, deleteMember };
