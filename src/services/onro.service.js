const config = require('../config');

function mapNuvemshopOrderToOnro(order) {
  const customer = order?.customer || {};
  const shippingAddress = order?.shipping_address || order?.billing_address || {};

  return {
    external_id: String(order.id),
    service_type: 'pickup_delivery',
    pickup: {
      name: config.defaultPickupName,
      phone: config.defaultPickupPhone,
      address: config.defaultPickupAddress,
      instructions: `Retirar pedido #${order.number || order.id}`,
    },
    delivery: {
      name: `${customer.name || ''} ${customer.last_name || ''}`.trim() || 'Cliente',
      phone: customer.phone || customer.mobile || '',
      address: [
        shippingAddress.address,
        shippingAddress.number,
        shippingAddress.floor,
        shippingAddress.locality,
        shippingAddress.city,
        shippingAddress.province,
        shippingAddress.country,
        shippingAddress.zipcode,
      ]
        .filter(Boolean)
        .join(', '),
      instructions: order.customer_note || order.note || '',
    },
    items: (order.products || []).map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: Number(product.price || 0),
    })),
    metadata: {
      nuvemshop_order_id: order.id,
      nuvemshop_order_number: order.number,
      payment_status: order.payment_status,
      total: order.total,
      currency: order.currency,
    },
  };
}

async function createOnroPdOrder(onroPayload) {
  if (!config.onroBaseUrl || !config.onroApiKey) {
    throw new Error('ONRO_BASE_URL e ONRO_API_KEY são obrigatórios para criar ordem na Onro.');
  }

  const url = `${config.onroBaseUrl}${config.onroCreateOrderPath}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.onroApiKey}`,
    },
    body: JSON.stringify(onroPayload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao criar ordem na Onro: ${response.status} ${text}`);
  }

  const data = await response.json();

  return {
    raw: data,
    trackingUrl:
      data.tracking_url ||
      data.data?.tracking_url ||
      data.order?.tracking_url ||
      data.task?.tracking_url ||
      null,
  };
}

module.exports = {
  mapNuvemshopOrderToOnro,
  createOnroPdOrder,
};
