const Ingestion = require('../models/ingestion');
const Batch = require('../models/batch');
const { enqueueJob } = require('../utils/queue');
const { v4: uuidv4 } = require('uuid');

exports.ingestData = async (req, res) => {
    const { ids, priority } = req.body;
    const ingestionId = uuidv4();

    const newIngestion = new Ingestion({ ingestionId, priority, status: 'yet_to_start' });
    const batches = [];

    for (let i = 0; i < ids.length; i += 3) {
        const batchIds = ids.slice(i, i + 3);
        const batch = new Batch({
            batchId: uuidv4(),
            ids: batchIds,
            status: 'yet_to_start',
            ingestion: newIngestion._id
        });
        await batch.save();
        batches.push(batch);
        enqueueJob(priority, newIngestion.createdAt, ingestionId, batch);
    }

    newIngestion.batches = batches.map(b => b._id);
    await newIngestion.save();

    res.json({ ingestion_id: ingestionId });
};

exports.getStatus = async (req, res) => {
    const ingestion = await Ingestion.findOne({ ingestionId: req.params.ingestionId }).populate('batches');
    if (!ingestion) return res.status(404).json({ error: 'Not found' });

    const statuses = ingestion.batches.map(b => b.status);
    let overallStatus = 'yet_to_start';
    if (statuses.every(s => s === 'completed')) overallStatus = 'completed';
    else if (statuses.some(s => s === 'triggered')) overallStatus = 'triggered';

    res.json({
        ingestion_id: ingestion.ingestionId,
        status: overallStatus,
        batches: ingestion.batches.map(b => ({
            batch_id: b.batchId,
            ids: b.ids,
            status: b.status
        }))
    });
};