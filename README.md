# 🚀 Sistema de Gestión de Inventario Retail - Backend API

API RESTful construida con AdonisJS v6 para la gestión integral de inventarios, ventas y análisis de datos para tiendas de ropa. Base de datos PostgreSQL con autenticación JWT.

## ✨ Características Principales

- **🔐 Autenticación JWT**: Sistema seguro de autenticación y autorización
- **📊 Analytics Avanzado**: Estadísticas de ventas, productos y tallas
- **📦 Gestión de Inventario**: CRUD completo de productos y stock
- **🏢 Multi-Sucursal**: Soporte para múltiples ubicaciones (preparado para multi-tenant)
- **📈 Reportes**: Productos más vendidos, baja rotación y descuentos sugeridos
- **🗄️ PostgreSQL**: Base de datos relacional robusta
- **📤 Import/Export**: Carga masiva de datos desde archivos

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd HackatomVentaPrendasBack
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env`:
   ```env
   PORT=3333
   HOST=0.0.0.0
   NODE_ENV=development
   APP_KEY=<generar-con-node-ace-generate:key>
   
   # Database
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_DATABASE=inventario_retail
   
   # JWT
   JWT_SECRET=<tu-secret-key>
   ```

4. **Crear base de datos**:
   ```bash
   createdb inventario_retail
   ```

5. **Ejecutar migraciones**:
   ```bash
   node ace migration:run
   ```

6. **Iniciar servidor de desarrollo**:
   ```bash
   node ace serve --watch
   ```
   
   La API estará disponible en `http://localhost:3333`

## 📁 Estructura del Proyecto

```
app/
├── controllers/
│   ├── AuthController.ts           # Autenticación y autorización
│   ├── EstadisticasController.ts   # Analytics y reportes
│   ├── InventarioController.ts     # Gestión de inventario
│   ├── ProductoController.ts       # Gestión de productos
│   ├── FacturacionController.ts    # Facturación y ventas
│   └── ImportController.ts         # Importación de datos
├── models/
│   ├── User.ts                     # Usuario del sistema
│   ├── Inventario.ts               # Modelo de inventario
│   ├── Producto.ts                 # Modelo de producto
│   ├── Sucursal.ts                 # Modelo de sucursal
│   ├── Factura.ts                  # Modelo de factura
│   ├── Detalle.ts                  # Detalle de factura
│   ├── Cliente.ts                  # Modelo de cliente
│   ├── Categoria.ts                # Categorías de productos
│   ├── Subcategoria.ts             # Subcategorías
│   ├── Municipio.ts                # Municipios
│   └── Departamento.ts             # Departamentos
├── middleware/
│   └── jwt.ts                      # Middleware de autenticación JWT
└── services/
    └── import_productos_service.ts # Servicio de importación

start/
├── routes/
│   ├── auth.ts                     # Rutas de autenticación
│   ├── estadisticas.ts             # Rutas de estadísticas
│   ├── inventario.ts               # Rutas de inventario
│   ├── producto.ts                 # Rutas de productos
│   ├── facturacion.ts              # Rutas de facturación
│   └── imports.ts                  # Rutas de importación
└── routes.ts                       # Registro de rutas

database/
└── migrations/                     # Migraciones de base de datos
```

## 🗄️ Modelo de Base de Datos

### Entidades Principales

```
Usuario
├── id, nombres, apellidos, email, password, rol
└── Relaciones: Sucursal

Producto
├── id, nombre, marca, precio, talla, descripcion
├── Relaciones: Subcategoria
└── Cascada: Inventario, Detalle

Inventario
├── id, stock
└── Relaciones: Producto, Sucursal

Factura
├── id, numero_factura, fecha
├── Relaciones: Cliente, Sucursal
└── Cascada: Detalle

Sucursal
├── id, nit, nombre, direccion, email
├── Relaciones: Municipio
└── Cascada: Inventario, Factura, Usuario

Categoria → Subcategoria → Producto
Departamento → Municipio → Sucursal
```

## 📡 API Endpoints

### Autenticación
```http
POST   /auth/login          # Login de usuario
POST   /auth/register       # Registrar nuevo usuario
POST   /auth/logout         # Cerrar sesión
GET    /auth/me             # Usuario actual
```

### Inventario
```http
GET    /inventario/obtener              # Lista de inventario
GET    /inventario/obtenerPorId/:id     # Inventario por ID
POST   /inventario/crear                # Crear inventario
PUT    /inventario/actualizar/:id       # Actualizar inventario
DELETE /inventario/eliminar/:id         # Eliminar inventario
```

### Productos
```http
GET    /productos/obtener               # Lista de productos
GET    /productos/obtenerPorId/:id      # Producto por ID
POST   /productos/crear                 # Crear producto
PUT    /productos/actualizar/:id        # Actualizar producto
DELETE /productos/eliminar/:id          # Eliminar producto
```

### Estadísticas
```http
GET    /estadisticas/masVendidos              # Productos más vendidos
GET    /estadisticas/tallasMayorSalida        # Tallas más vendidas
GET    /estadisticas/menosVendidos            # Productos de baja rotación
GET    /estadisticas/descuentoBajaRotacion    # Descuentos sugeridos
```

**Query Parameters**:
- `mes`: Número del mes (1-12)
- `idsucursal`: ID de la sucursal

### Facturación
```http
GET    /facturacion/obtener             # Lista de facturas
GET    /facturacion/obtenerPorId/:id    # Factura por ID
POST   /facturacion/crear               # Crear factura
```

### Sucursales
```http
GET    /sucursal/obtener                # Lista de sucursales
GET    /sucursal/obtenerPorId/:id       # Sucursal por ID
POST   /sucursal/crear                  # Crear sucursal
PUT    /sucursal/actualizar/:id         # Actualizar sucursal
DELETE /sucursal/eliminar/:id           # Eliminar sucursal
```

### Usuarios
```http
GET    /usuarios/obtener                # Lista de usuarios
GET    /usuarios/obtenerPorId/:id       # Usuario por ID
PUT    /usuarios/actualizar/:id         # Actualizar usuario
```

### Municipios
```http
GET    /municipios/obtener              # Lista de municipios
```

### Importación
```http
POST   /api/imports/productos           # Importar productos
POST   /api/imports/inventario          # Importar inventario
POST   /api/imports/ventas              # Importar ventas
GET    /api/imports/plantilla/:type     # Descargar plantilla
```

## 🔐 Autenticación

### JWT Token
Todas las rutas (excepto `/auth/login`) requieren autenticación JWT.

**Header requerido**:
```http
Authorization: Bearer <token>
```

### Ejemplo de Login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Respuesta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "nombres": "Admin",
    "rol": "administrador"
  }
}
```

## 🛠️ Stack Tecnológico

### Core
- **AdonisJS v6** - Framework Node.js full-stack
- **TypeScript** - Tipado estático
- **Lucid ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional

### Autenticación & Seguridad
- **JWT** - JSON Web Tokens
- **Bcrypt** - Hash de contraseñas
- **CORS** - Cross-Origin Resource Sharing

### Utilidades
- **Luxon** - Manejo de fechas
- **Validator** - Validación de datos

## 🏗️ Arquitectura

### Patrón MVC
- **Models**: Definición de entidades y relaciones (Lucid ORM)
- **Controllers**: Lógica de negocio y manejo de requests
- **Routes**: Definición de endpoints y middleware

### Middleware Chain
```
Request → CORS → JWT Auth → Controller → Response
```

### Query Optimization
- Uso de `preload()` para relaciones
- Índices en columnas frecuentemente consultadas
- Paginación en listados grandes

## 🔮 Roadmap y Desarrollo Futuro

### ✅ Implementado
- [x] Sistema de autenticación JWT completo
- [x] CRUD de inventario y productos
- [x] CRUD de sucursales (crear, leer, actualizar, eliminar)
- [x] CRUD de usuarios (registro, obtener, actualizar)
- [x] Analytics de ventas y productos
- [x] Facturación completa con detalles
- [x] Importación masiva de datos (productos, inventario, ventas)
- [x] Relaciones entre entidades con preloads
- [x] Gestión de categorías y subcategorías
- [x] Gestión de municipios y departamentos
- [x] Middleware JWT para protección de rutas
- [x] Validaciones de datos (email, contraseñas)
- [x] Sistema de roles (administrador, empleado)

### 🚧 En Desarrollo
- [ ] **Multi-Tenant**: Soporte para múltiples empresas
  - Middleware de tenant
  - Aislamiento de datos por tenant
  - Configuración por tenant
- [ ] Reportes avanzados exportables (PDF/Excel)
- [ ] Sistema de permisos granular por rol

### 📋 Planificado
- [ ] **Multi-Tenant Avanzado**:
  - Database per tenant
  - Tenant switching
  - Configuración granular
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Sistema de permisos granular (RBAC)
- [ ] Auditoría de cambios
- [ ] Backup automático
- [ ] API rate limiting
- [ ] Caché con Redis
- [ ] Queue system para tareas pesadas

## 🏢 Multi-Tenant Architecture (Planificado)

### Estrategia
- **Shared Database, Shared Schema**: Columna `tenant_id` en todas las tablas
- **Middleware de Tenant**: Filtrado automático por tenant
- **Tenant Context**: Contexto global del tenant actual

### Implementación
```typescript
// Middleware de tenant
export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const tenantId = ctx.request.header('X-Tenant-ID')
    ctx.tenant = await Tenant.find(tenantId)
    
    // Global scope para todas las queries
    Database.on('query', (query) => {
      query.where('tenant_id', tenantId)
    })
    
    await next()
  }
}
```

## 🧪 Testing

```bash
# Ejecutar tests
node ace test

# Tests con coverage
node ace test --coverage
```

## 🚀 Deploy

### Variables de Entorno Producción
```env
NODE_ENV=production
PORT=3333
HOST=0.0.0.0
APP_KEY=<production-key>

DB_HOST=<production-db-host>
DB_PORT=5432
DB_USER=<production-db-user>
DB_PASSWORD=<production-db-password>
DB_DATABASE=<production-db-name>

JWT_SECRET=<production-jwt-secret>
```

### Plataformas Soportadas

#### Render
```yaml
# render.yaml
services:
  - type: web
    name: inventario-api
    env: node
    buildCommand: npm install && node ace build --production
    startCommand: node build/bin/server.js
```

#### Railway
- Conecta el repositorio
- Configura variables de entorno
- Deploy automático

#### Heroku
```bash
heroku create inventario-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

## 📊 Queries SQL Importantes

### Productos Más Vendidos
```sql
SELECT 
  p.nombre,
  p.marca,
  p.talla,
  SUM(d.cantidad) as unidades_vendidas,
  SUM(d.precio_total) as ventas_totales
FROM detalle d
JOIN producto p ON d.idproducto = p.idproducto
JOIN factura f ON d.idfactura = f.idfactura
WHERE EXTRACT(MONTH FROM f.fecha) = $mes
GROUP BY p.idproducto
ORDER BY unidades_vendidas DESC
LIMIT 10
```

### Tallas Más Vendidas
```sql
SELECT 
  p.talla,
  COUNT(*) as cantidad_vendida
FROM detalle d
JOIN producto p ON d.idproducto = p.idproducto
JOIN factura f ON d.idfactura = f.idfactura
WHERE EXTRACT(MONTH FROM f.fecha) = $mes
GROUP BY p.talla
ORDER BY cantidad_vendida DESC
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- **Controllers**: PascalCase (`InventarioController.ts`)
- **Models**: PascalCase singular (`Producto.ts`)
- **Routes**: camelCase (`inventario.ts`)
- **Métodos**: camelCase (`obtenerPorId`)
- **Tablas DB**: snake_case (`nombre_categoria`)
- **Columnas DB**: snake_case (`idproducto`)

## 📄 Licencia

Proyecto desarrollado para la gestión de inventarios retail con enfoque en escalabilidad y multi-tenant.

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Framework**: AdonisJS v6  
**Database**: PostgreSQL 14+
