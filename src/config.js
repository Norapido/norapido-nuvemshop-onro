const path = require('path');

module.exports = {
  port: Number(process.env.PORT || 3000),
  storeId: process.env.STORE_ID,
  accessToken: process.env.ACCESS_TOKEN,
  nuvemshopBaseUrl: process.env.NUVEMSHOP_BASE_URL || 'https://api.tiendanube.com/v1',
  nuvemshopWebhookSecret: process.env.NUVEMSHOP_WEBHOOK_SECRET,
  onroBaseUrl: process.env.ONRO_BASE_URL,
  onroApiKey: process.env.ONRO_API_KEY,
  onroCreateOrderPath: process.env.ONRO_CREATE_ORDER_PATH || '/v1/pd/orders',
  mappingsFilePath: process.env.MAPPINGS_FILE_PATH || path.join(process.cwd(), 'data', 'orders.json'),
  defaultPickupName: process.env.DEFAULT_PICKUP_NAME || 'Loja Nuvemshop',
  defaultPickupPhone: process.env.DEFAULT_PICKUP_PHONE || '+5500000000000',
  defaultPickupAddress: process.env.DEFAULT_PICKUP_ADDRESS || 'Endereço da loja',
};
