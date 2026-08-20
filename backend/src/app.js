const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const productsRoutes = require('./routes/products.routes');
const paymentsRoutes = require('./routes/payments.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({ origin: env.corsOrigin }));

app.use('/api/products', productsRoutes);
app.use('/', paymentsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;
