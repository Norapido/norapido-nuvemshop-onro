const config = require('../config');

async function fetchNuvemshopOrder(orderId) {
  if (!config.storeId || !config.accessToken) {
    throw new Error('STORE_ID e ACCESS_TOKEN são obrigatórios para buscar pedido na Nuvemshop.');
  }

  const url = `${config.nuvemshopBaseUrl}/${config.storeId}/orders/${orderId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authentication: `bearer ${config.accessToken}`,
      'User-Agent': 'Nuvemshop-Onro-Middleware (contato@example.com)',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao buscar pedido na Nuvemshop: ${response.status} ${text}`);
  }

  return response.json();
}

module.exports = {
  fetchNuvemshopOrder,
};
