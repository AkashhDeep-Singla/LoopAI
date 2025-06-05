let jobQueue = [];

exports.enqueueJob = (priority, createdAt, ingestionId, batch) => {
    jobQueue.push({ priority, createdAt, ingestionId, batch });
};

exports.getNextBatch = () => {
    if (jobQueue.length === 0) return null;
    jobQueue.sort((a, b) => {
        const p = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return p[a.priority] - p[b.priority] || a.createdAt - b.createdAt;
    });
    return jobQueue.shift();
};

exports.queue = jobQueue;