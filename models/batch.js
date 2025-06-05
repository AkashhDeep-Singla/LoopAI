const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchId: String,
    ids: [Number],
    status: String,
    ingestion: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingestion' }
});

module.exports = mongoose.model('Batch', batchSchema);