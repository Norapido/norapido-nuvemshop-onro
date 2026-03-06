const express = require('express');
const { getSignatureHeader, validateSignature } = require('./utils/signature');
const { fetchNuvemshopOrder } = require('./services/nuvemshop.service');
const { createOnroPdOrder, mapNuvemshopOrderToOnro } = require('./services/onro.service');
const { saveOrderMapping } = require('./services/storage.service');
const config = require('./config');

const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/webhooks/nuvemshop', async (req, res) => {
  try {
    const signatureHeader = getSignatureHeader(req.headers);
    const signatureResult = validateSignature(req.rawBody || Buffer.from(''), signatureHeader, config.nuvemshopWebhookSecret);

    if (!signatureResult.valid) {
      return res.status(401).json({
        message: 'Assinatura inválida do webhook.',
        reason: signatureResult.reason,
      });
    }

    const event = req.body?.event || req.body?.topic || req.headers['x-nuvemshop-event'] || req.headers['x-linkedstore-topic'];

    if (event !== 'order/paid') {
      return res.status(202).json({
        message: 'Evento ignorado. Apenas order/paid é processado.',
        received_event: event,
      });
    }

    const orderId = req.body?.id || req.body?.order_id;

    if (!orderId) {
      return res.status(400).json({ message: 'order_id não encontrado no payload.' });
    }

    const orderDetails = await fetchNuvemshopOrder(orderId);
    const onroPayload = mapNuvemshopOrderToOnro(orderDetails);
    const onroOrder = await createOnroPdOrder(onroPayload);

    await saveOrderMapping({
      orderId,
      trackingUrl: onroOrder.trackingUrl,
    });

    return res.status(201).json({
      message: 'Pedido processado com sucesso.',
      order_id: orderId,
      tracking_url: onroOrder.trackingUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao processar webhook.',
      error: error.message,
    });
  }
});

module.exports = app;
