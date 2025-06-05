const mongoose = require('mongoose');

const ingestionSchema = new mongoose.Schema({
    ingestionId: String,
    priority: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }]
});

module.exports = mongoose.model('Ingestion', ingestionSchema);