# form & function — React + Tailwind + Express storefront

A responsive e-commerce demo using React, Tailwind CSS, Express.js and FakeStoreAPI.

## Requirements
- Node.js 18+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open **http://localhost:5173**. Vite serves the React development app and proxies `/api` requests to Express on port 4000.

## Run as one Express-hosted app
```bash
npm install
npm run build
npm start
```
Open **http://localhost:4000**. Express serves the built React app and exposes the API from the same origin.

## API routes
- `GET /api/health` — server health check
- `GET /api/products` — cached product catalogue from FakeStoreAPI
- `GET /api/products/:id` — one product by ID

The Express server caches the product catalogue for five minutes and handles upstream API errors. In production, the React build and API are served from the same Express server.

## Cart and checkout
- Cart state is persisted in browser `localStorage`.
- Quantity can be increased/decreased; setting quantity to zero removes an item.
- Tax is estimated at 8%.
- Shipping is $8.95 for subtotals below $150 and free at/above $150.
- Checkout is simulated only; no payment details are processed and no order is sent to a real fulfilment service.

## Notes
FakeStoreAPI is a demo data source. Product images and catalogue availability depend on that third-party service. The UI uses USD for display.
