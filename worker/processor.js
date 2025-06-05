const Batch = require('../models/batch');
const Ingestion = require('../models/ingestion');
const { getNextBatch } = require('../utils/queue');

setInterval(async () => {
    const job = getNextBatch();
    if (!job) return;

    const batch = await Batch.findOne({ batchId: job.batch.batchId });
    if (!batch) return;

    batch.status = 'triggered';
    await batch.save();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    batch.status = 'completed';
    await batch.save();

    const ingestion = await Ingestion.findById(batch.ingestion).populate('batches');
    const statuses = ingestion.batches.map(b => b.status);
    if (statuses.every(s => s === 'completed')) ingestion.status = 'completed';
    else if (statuses.some(s => s === 'triggered')) ingestion.status = 'triggered';
    await ingestion.save();

}, 5000); // Rate limit: 1 batch per 5 sec