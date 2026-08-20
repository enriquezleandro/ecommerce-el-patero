const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const productsRoutes = require('./routes/products.routes');
const paymentsRoutes = require('./routes/payments.routes');
const authRoutes = require('./routes/auth.routes');
const ordersRoutes = require('./routes/orders.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({ origin: env.corsOrigin }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/', paymentsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
