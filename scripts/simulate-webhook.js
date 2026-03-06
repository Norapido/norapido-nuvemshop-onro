require('dotenv').config();
const crypto = require('crypto');

const WEBHOOK_URL = process.env.SIMULATOR_WEBHOOK_URL || 'http://localhost:3000/webhooks/nuvemshop';
const secret = process.env.NUVEMSHOP_WEBHOOK_SECRET;

const payload = {
  event: 'order/paid',
  id: 123456789,
};

async function run() {
  const body = JSON.stringify(payload);
  const headers = {
    'Content-Type': 'application/json',
    'x-nuvemshop-event': 'order/paid',
  };

  if (secret) {
    headers['x-nuvemshop-hmac-sha256'] = crypto.createHmac('sha256', secret).update(body).digest('base64');
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers,
    body,
  });

  const text = await response.text();

  // eslint-disable-next-line no-console
  console.log('Status:', response.status);
  // eslint-disable-next-line no-console
  console.log('Resposta:', text);
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
