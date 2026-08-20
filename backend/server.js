const app = require('./src/app');
const env = require('./src/config/env');

app.listen(env.port, () => {
  console.log(`Servidor de El Patero corriendo en http://localhost:${env.port}`);
});
