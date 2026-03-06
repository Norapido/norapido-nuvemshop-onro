const test = require('node:test');
const assert = require('node:assert/strict');

const { validateSignature } = require('../src/utils/signature');
const { mapNuvemshopOrderToOnro } = require('../src/services/onro.service');

test('deve validar assinatura correta', () => {
  const body = Buffer.from('{"event":"order/paid"}');
  const secret = 'abc123';
  const crypto = require('crypto');
  const signature = crypto.createHmac('sha256', secret).update(body).digest('base64');

  const result = validateSignature(body, signature, secret);

  assert.equal(result.valid, true);
});

test('deve mapear pedido da Nuvemshop para payload Onro', () => {
  const order = {
    id: 10,
    number: 99,
    payment_status: 'paid',
    total: '150.00',
    currency: 'BRL',
    customer: {
      name: 'Maria',
      last_name: 'Silva',
      phone: '+5511999999999',
    },
    shipping_address: {
      address: 'Rua A',
      number: '100',
      city: 'São Paulo',
      province: 'SP',
      country: 'Brasil',
      zipcode: '01000-000',
    },
    products: [
      {
        name: 'Produto 1',
        quantity: 2,
        price: '50',
      },
    ],
  };

  const payload = mapNuvemshopOrderToOnro(order);

  assert.equal(payload.external_id, '10');
  assert.equal(payload.delivery.name, 'Maria Silva');
  assert.equal(payload.items.length, 1);
  assert.equal(payload.metadata.payment_status, 'paid');
});
