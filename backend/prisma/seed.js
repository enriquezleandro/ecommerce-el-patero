// Transcripción fiel de los 16 productos que estaban en mockData.ts del
// frontend (E-commerce para El Patero - sin back/src/lib/mockData.ts), para
// no perder el contenido curado (ratings, destacados, ofertas) que ya calza
// con la lógica de Home/Catálogo/Ofertas.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productos = [
  {
    name: 'Panel LED Quantum Board 240W',
    category: 'indoor',
    price: 89990,
    description:
      'Panel LED de alta eficiencia con espectro completo para todas las etapas del cultivo. Tecnología Samsung LM301B.',
    specifications: {
      Potencia: '240W',
      Cobertura: '90x90cm',
      Espectro: 'Completo 3000K-5000K',
      'Vida útil': '50,000 horas',
    },
    images: [
      'https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    stock: 15,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: 'Extractor Inline 150mm',
    category: 'indoor',
    price: 45990,
    originalPrice: 52990,
    description: 'Extractor de aire silencioso con motor de alta eficiencia. Perfecto para armarios de cultivo medianos.',
    specifications: {
      Diámetro: '150mm',
      Caudal: '420 m³/h',
      'Nivel de ruido': '35 dB',
      Voltaje: '220V',
    },
    images: ['https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 8,
    isOnSale: true,
    isFeatured: true,
    rating: 4.5,
  },
  {
    name: 'Carpa de Cultivo 120x120x200cm',
    category: 'indoor',
    price: 67990,
    description: 'Carpa de cultivo interior con estructura reforzada y material mylar reflectante 600D.',
    specifications: {
      Dimensiones: '120x120x200cm',
      Material: 'Oxford 600D + Mylar',
      Reflectividad: '95%',
      Ventanas: 'Múltiples con malla anti-insectos',
    },
    images: ['https://images.unsplash.com/photo-1536505935294-3acc42ccd0b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 5,
    rating: 4.7,
  },
  {
    name: 'Kit Nutrientes Orgánicos BioBizz',
    category: 'fertilizantes',
    price: 34990,
    description: 'Kit completo de fertilizantes orgánicos para ciclo completo. Incluye Grow, Bloom y Top-Max.',
    specifications: {
      Contenido: '3x 500ml',
      Tipo: 'Orgánico',
      Etapas: 'Crecimiento y Floración',
      Origen: 'Países Bajos',
    },
    images: ['https://images.unsplash.com/photo-1676083826533-1997f6a8dc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 25,
    isFeatured: true,
    isNew: true,
    rating: 4.9,
  },
  {
    name: 'Fertilizante Floración Advanced Nutrients',
    category: 'fertilizantes',
    price: 28990,
    originalPrice: 35990,
    description: 'Nutriente premium para la fase de floración. Maximiza la producción de flores.',
    specifications: {
      Volumen: '1 litro',
      NPK: '0-5-4',
      Tipo: 'Mineral',
      pH: 'pH Perfect',
    },
    images: ['https://images.unsplash.com/photo-1676083826533-1997f6a8dc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 18,
    isOnSale: true,
    rating: 4.6,
  },
  {
    name: 'Maceta Textil Air-Pot 20L',
    category: 'macetas',
    price: 8990,
    description: 'Maceta de tela que permite la poda aérea de raíces. Mejora el desarrollo radicular.',
    specifications: {
      Capacidad: '20 litros',
      Material: 'Tela geotextil',
      Dimensiones: '35x30cm',
      Reutilizable: 'Sí',
    },
    images: ['https://images.unsplash.com/photo-1697813769280-0b46901aabb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 50,
    rating: 4.4,
  },
  {
    name: 'Sustrato Premium Light Mix 50L',
    category: 'macetas',
    price: 12990,
    description: 'Sustrato orgánico pre-fertilizado con perlita. Ideal para todo tipo de cultivos.',
    specifications: {
      Volumen: '50 litros',
      Composición: 'Turba, perlita, compost',
      pH: '6.0-6.5',
      EC: '1.0-1.5',
    },
    images: ['https://images.unsplash.com/photo-1697813769280-0b46901aabb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 30,
    isFeatured: true,
    rating: 4.7,
  },
  {
    name: 'Kit Medidor pH y EC Digital',
    category: 'parafernalia',
    price: 19990,
    description: 'Medidores digitales de pH y conductividad eléctrica. Esenciales para el control de nutrientes.',
    specifications: {
      'Rango pH': '0-14',
      'Rango EC': '0-9999 µS/cm',
      'Precisión pH': '±0.01',
      Calibración: 'Automática',
    },
    images: ['https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 22,
    isNew: true,
    rating: 4.5,
  },
  {
    name: 'Tijera de Poda Profesional',
    category: 'parafernalia',
    price: 7990,
    originalPrice: 9990,
    description: 'Tijera de precisión con mango ergonómico y hoja de acero inoxidable.',
    specifications: {
      Material: 'Acero inoxidable',
      Longitud: '17cm',
      Tipo: 'Poda de precisión',
      Incluye: 'Funda protectora',
    },
    images: ['https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 35,
    isOnSale: true,
    rating: 4.6,
  },
  {
    name: 'Timer Digital Programable',
    category: 'parafernalia',
    price: 5990,
    description: 'Temporizador digital para automatizar iluminación y ventilación.',
    specifications: {
      Programas: '8 ciclos diarios',
      Voltaje: '220V',
      'Carga máxima': '3500W',
      Pantalla: 'LCD',
    },
    images: ['https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 40,
    rating: 4.3,
  },
  {
    name: 'Remera "El Patero" Original',
    category: 'indumentaria',
    price: 12990,
    description: 'Remera 100% algodón con diseño exclusivo de El Patero. Estampado de alta calidad.',
    images: ['https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Blanco', 'Verde Oliva'],
    isFeatured: true,
    rating: 4.8,
  },
  {
    name: 'Buzo Hoodie Cannabis Leaf',
    category: 'indumentaria',
    price: 24990,
    originalPrice: 29990,
    description: 'Buzo con capucha y bolsillo canguro. Diseño de hoja estampado en el pecho.',
    images: ['https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 28,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Gris', 'Verde Oscuro'],
    isOnSale: true,
    rating: 4.7,
  },
  {
    name: 'Gorra Trucker "Grow Life"',
    category: 'indumentaria',
    price: 8990,
    description: 'Gorra estilo trucker con bordado frontal. Ajustable y con malla transpirable.',
    images: ['https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 60,
    colors: ['Negro/Verde', 'Camo', 'Blanco/Negro'],
    isNew: true,
    isFeatured: true,
    rating: 4.5,
  },
  {
    name: 'Remera Tie-Dye Psicodélica',
    category: 'indumentaria',
    price: 14990,
    description: 'Remera con técnica tie-dye artesanal. Cada prenda es única.',
    images: ['https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Multicolor 1', 'Multicolor 2', 'Verde/Amarillo'],
    rating: 4.6,
  },
  {
    name: 'Buzo Oversized Streetwear',
    category: 'indumentaria',
    price: 27990,
    description: 'Buzo de corte oversize con diseño urbano exclusivo. Máxima comodidad.',
    images: ['https://images.unsplash.com/photo-1696086152504-4843b2106ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 15,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Negro', 'Gris Oscuro'],
    isNew: true,
    rating: 4.9,
  },
  {
    name: 'Medidor de Humedad Digital',
    category: 'parafernalia',
    price: 15990,
    originalPrice: 19990,
    description: 'Medidor digital 3 en 1: humedad, temperatura y luz. Indispensable para el control del cultivo.',
    specifications: {
      Funciones: 'Humedad, Temperatura, Luz',
      'Rango Humedad': '10-99%',
      'Rango Temperatura': '0-50°C',
      Pantalla: 'LCD retroiluminada',
    },
    images: ['https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'],
    stock: 30,
    isOnSale: true,
    rating: 4.7,
  },
];

async function main() {
  // Idempotente: si se re-corre el seed, arranca de cero en vez de duplicar
  // (no hay un campo único natural como "slug" para hacer upsert).
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();

  for (const p of productos) {
    await prisma.product.create({ data: p });
  }

  console.log(`Seed completo: ${productos.length} productos.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
