# 🌿 El Patero GrowShop - Guía de Despliegue

## 📋 Índice
1. [Características Implementadas](#características-implementadas)
2. [Desplegar Frontend en Vercel](#desplegar-frontend-en-vercel)
3. [Conectar con Supabase (Backend)](#conectar-con-supabase-backend)
4. [Variables de Entorno](#variables-de-entorno)
5. [Próximos Pasos](#próximos-pasos)

---

## ✨ Características Implementadas

### Pantallas
- ✅ **Home**: Hero con slogan, categorías destacadas, productos featured
- ✅ **Catálogo**: Filtros por categoría, precio, nuevo, ofertas. Búsqueda integrada
- ✅ **Ficha de Producto**: Galería de imágenes, especificaciones, reviews, selector de talle/color
- ✅ **Carrito**: Persistente (localStorage), gestión de cantidades
- ✅ **Checkout**: 3 pasos (Envío, Pago, Confirmación)
- ✅ **Login/Registro**: Autenticación completa
- ✅ **Perfil de Usuario**: Historial de pedidos, dirección, métodos de pago
- ✅ **Ofertas**: Catálogo especial de productos en oferta
- ✅ **Info & Multimedia**: Guías, videos y artículos

### Funcionalidades
- ✅ **Modo Oscuro**: Toggle entre tema claro y oscuro
- ✅ **Búsqueda**: Buscador integrado en header
- ✅ **Responsive**: Mobile + Desktop optimizado
- ✅ **Carrito Persistente**: Se mantiene entre sesiones
- ✅ **Paleta de Colores El Patero**:
  - Verde Oscuro: #2E5D3C
  - Verde Lima: #7FC06E
  - Gris Oscuro: #1E1E1E
  - Blanco: #F9F9F9
  - Acento Coral: #FF7E5F

### Componentes Reutilizables
- `Header`: Navegación, búsqueda, carrito, modo oscuro
- `Footer`: Info de contacto, enlaces, redes sociales
- `ProductCard`: Tarjeta de producto con badges de oferta/nuevo
- `CategoryCard`: Tarjeta de categoría con imagen y descripción
- `Button`, `Input`, `Badge`, y todos los componentes de shadcn/ui

---

## 🚀 Desplegar Frontend en Vercel

### Opción 1: Despliegue desde Figma Make (Recomendado)
Este proyecto ya está listo para desplegarse directamente desde Figma Make con un solo click.

### Opción 2: Despliegue Manual
Si deseas desplegar manualmente:

1. **Crear cuenta en Vercel**
   - Visita [vercel.com](https://vercel.com)
   - Registrate con GitHub

2. **Preparar el proyecto**
   ```bash
   # Clonar el repositorio
   git clone [tu-repo]
   cd el-patero-growshop
   
   # Instalar dependencias
   npm install
   ```

3. **Desplegar**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Desplegar
   vercel
   ```

4. **Configurar dominio**
   - En el dashboard de Vercel, ve a Settings > Domains
   - Agrega tu dominio personalizado (ej: elpaterogrowshop.com)

---

## 🗄️ Conectar con Supabase (Backend)

### ¿Por qué Supabase?
Supabase te permite:
- **Autenticación real** con email/password, OAuth (Google, Facebook)
- **Base de datos PostgreSQL** para productos, usuarios, pedidos
- **Storage** para imágenes de productos
- **Real-time** para actualizaciones en vivo del stock
- **APIs automáticas** sin necesidad de código backend

⚠️ **Importante**: Figma Make no está diseñado para recopilar información personal identificable (PII) ni datos sensibles. Usa Supabase solo para funcionalidades de demostración y pruebas.

### Paso 1: Crear Proyecto en Supabase

1. Visita [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto:
   - Nombre: "el-patero-growshop"
   - Password de base de datos: [guárdala de forma segura]
   - Región: South America (São Paulo)

### Paso 2: Configurar Base de Datos

Ejecuta estos SQL commands en el SQL Editor de Supabase:

```sql
-- Tabla de Productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  description TEXT,
  specifications JSONB,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1),
  sizes TEXT[],
  colors TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Usuarios (extender auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  address JSONB,
  saved_payment_method JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products,
  user_id UUID REFERENCES auth.users,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Productos: todos pueden leer
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

-- Perfiles: los usuarios solo ven y editan el suyo
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Pedidos: los usuarios solo ven los suyos
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Reviews: todos pueden leer, solo autenticados pueden crear
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

### Paso 3: Insertar Datos de Ejemplo

```sql
-- Insertar productos de ejemplo
INSERT INTO products (name, category, price, description, images, stock, is_featured, is_new)
VALUES 
  ('Panel LED Quantum Board 240W', 'indoor', 89990, 'Panel LED de alta eficiencia', 
   ARRAY['https://images.unsplash.com/photo-1681313409698-dbe22c68cfce'], 15, true, true),
  ('Kit Nutrientes Orgánicos BioBizz', 'fertilizantes', 34990, 'Kit completo de fertilizantes', 
   ARRAY['https://images.unsplash.com/photo-1676083826533-1997f6a8dc28'], 25, true, true);
```

### Paso 4: Integrar en el Código

1. **Instalar Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Crear archivo de configuración** (`/lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

3. **Actualizar contextos para usar Supabase**:

   **AuthContext.tsx**:
   ```typescript
   import { supabase } from '../lib/supabase';

   // Login
   const login = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     if (error) throw error;
     setUser(data.user);
   };

   // Register
   const register = async (email: string, password: string, name: string) => {
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
     });
     if (error) throw error;
     
     // Create profile
     await supabase.from('user_profiles').insert({
       id: data.user?.id,
       name,
     });
   };
   ```

   **Para productos** (reemplazar mockData):
   ```typescript
   // Fetch products
   const { data: products } = await supabase
     .from('products')
     .select('*');
   ```

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Mercado Pago (opcional)
NEXT_PUBLIC_MP_PUBLIC_KEY=tu-public-key
MP_ACCESS_TOKEN=tu-access-token
```

Para Vercel, agrega estas variables en:
**Project Settings > Environment Variables**

---

## 📦 Próximos Pasos

### Funcionalidades Adicionales Recomendadas:

1. **Mercado Pago Integration**
   - Instalar SDK: `npm install mercadopago`
   - Configurar checkout pro
   - Webhook para confirmación de pagos

2. **Email Notifications**
   - Usar Resend o SendGrid
   - Confirmación de pedidos
   - Notificaciones de envío

3. **Admin Panel**
   - Gestión de productos
   - Procesamiento de pedidos
   - Estadísticas de ventas

4. **Analytics**
   - Google Analytics 4
   - Tracking de conversiones
   - Funnel de ventas

5. **SEO Optimization**
   - Meta tags dinámicos
   - Sitemap.xml
   - Schema.org markup

6. **Performance**
   - Image optimization (Next.js Image)
   - Lazy loading
   - Code splitting

---

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Payments**: Mercado Pago (integración futura)

---

## 📞 Soporte

Para más información:
- Email: info@elpatero.com
- Instagram: [@elpaterogrowshop](https://instagram.com/elpaterogrowshop)

---

## 📝 Notas Importantes

1. **Datos actuales**: La aplicación usa datos mock. Conecta con Supabase para datos reales.
2. **Autenticación**: El usuario demo es `demo@elpatero.com` (cualquier contraseña)
3. **Pagos**: Actualmente son simulados. Integra Mercado Pago para pagos reales.
4. **Imágenes**: Las imágenes son de Unsplash. Reemplaza con imágenes reales de productos.
5. **Legal**: Asegúrate de cumplir con las regulaciones locales sobre venta de productos de cultivo.

---

¡Tu e-commerce está listo para despegar! 🚀🌿
