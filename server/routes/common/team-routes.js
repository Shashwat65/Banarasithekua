const express = require('express');
const { listActiveMembers } = require('../../controllers/common/team-controller');

const router = express.Router();

router.get('/get', listActiveMembers);

module.exports = router;
