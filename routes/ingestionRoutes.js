const express = require('express');
const router = express.Router();
const { ingestData, getStatus } = require('../controllers/ingestionController');

router.post('/ingest', ingestData);
router.get('/status/:ingestionId', getStatus);

module.exports = router;