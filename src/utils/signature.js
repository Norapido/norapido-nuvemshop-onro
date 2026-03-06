const crypto = require('crypto');

function getSignatureHeader(headers) {
  return headers['x-linkedstore-hmac-sha256'] || headers['x-nuvemshop-hmac-sha256'];
}

function validateSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) {
    return { valid: true, reason: 'no_signature_header' };
  }

  if (!secret) {
    return { valid: false, reason: 'missing_secret' };
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  const valid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signatureHeader),
  );

  return { valid, reason: valid ? 'ok' : 'invalid_signature' };
}

module.exports = {
  getSignatureHeader,
  validateSignature,
};
