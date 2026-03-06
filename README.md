# Middleware Nuvemshop -> Onro (Node.js + Express)

Este projeto recebe o webhook `order/paid` da Nuvemshop, busca os detalhes do pedido via API da Nuvemshop, mapeia os dados para o formato esperado pela Onro (Pickup & Delivery), cria a ordem na Onro e salva `order_id` + `tracking_url` em um arquivo JSON local.

## Requisitos

- Node.js 18+
- Credenciais da Nuvemshop:
  - `STORE_ID`
  - `ACCESS_TOKEN`
- Credenciais da Onro:
  - `ONRO_BASE_URL`
  - `ONRO_API_KEY`

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Preencha as variáveis no `.env`.

## Rodando localmente

```bash
npm run start
```

Servidor padrão em `http://localhost:3000`.

## Endpoint de webhook

- **POST** `/webhooks/nuvemshop`
- Processa somente `order/paid`
- Valida assinatura se o header de assinatura for enviado (`x-linkedstore-hmac-sha256` ou `x-nuvemshop-hmac-sha256`)

### Exemplo de payload webhook

```json
{
  "event": "order/paid",
  "id": 123456789
}
```

## Simulação de webhook

Com o servidor rodando:

```bash
npm run simulate:webhook
```

Opcionalmente defina `SIMULATOR_WEBHOOK_URL` se quiser enviar para outro endpoint.

## Testes

```bash
npm test
```

## Persistência local

Os registros são salvos no arquivo definido em `MAPPINGS_FILE_PATH` (padrão: `data/orders.json`) no formato:

```json
[
  {
    "order_id": "123456789",
    "tracking_url": "https://...",
    "created_at": "2025-01-01T12:00:00.000Z"
  }
]
```

## Observação sobre payload da Onro

A estrutura enviada para criação da ordem P&D usa os campos mais comuns (`pickup`, `delivery`, `items`, `metadata`) e endpoint default `ONRO_CREATE_ORDER_PATH=/v1/pd/orders`.
Caso seu workspace da Onro use outro endpoint/campos, ajuste `ONRO_CREATE_ORDER_PATH` e a função `mapNuvemshopOrderToOnro` em `src/services/onro.service.js`.
