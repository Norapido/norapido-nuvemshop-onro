const fs = require('fs/promises');
const path = require('path');
const config = require('../config');

async function saveOrderMapping({ orderId, trackingUrl }) {
  const filepath = config.mappingsFilePath;

  await fs.mkdir(path.dirname(filepath), { recursive: true });

  let records = [];
  try {
    const file = await fs.readFile(filepath, 'utf-8');
    records = JSON.parse(file);
    if (!Array.isArray(records)) {
      records = [];
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  records.push({
    order_id: String(orderId),
    tracking_url: trackingUrl,
    created_at: new Date().toISOString(),
  });

  await fs.writeFile(filepath, JSON.stringify(records, null, 2));
}

module.exports = {
  saveOrderMapping,
};
