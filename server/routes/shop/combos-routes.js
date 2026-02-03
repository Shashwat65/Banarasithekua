const express = require('express');
const { listActiveCombos, getComboDetails } = require('../../controllers/shop/combos-controller');

const router = express.Router();

router.get('/get', listActiveCombos);
router.get('/get/:idOrSlug', getComboDetails);

module.exports = router;
