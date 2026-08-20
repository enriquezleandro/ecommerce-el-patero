// Singleton de PrismaClient: evita abrir una conexión nueva por cada reload
// de `node --watch`, y es el punto único de acceso a la base desde toda la app.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
