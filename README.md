# EcoDenuncia - Plataforma de Denuncias Ambientales

## Descripción del Proyecto

EcoDenuncia es una plataforma web diseñada para registrar, consultar, comentar y gestionar denuncias ambientales. La aplicación permite a los ciudadanos reportar delitos ambientales y realizar un seguimiento de su estado.

## Tecnologías Utilizadas

Este proyecto está construido con:

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) v6 + shadcn/ui components (migrado)
- **Styling**: Tailwind CSS with custom theme + MUI theming
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Arquitectura del Backend

El frontend consume una API REST desarrollada en PHP:
- **Base URL**: `http://localhost:8080/EcoDenunciasLP/api`
- **Patrón de respuesta**: Todas las respuestas incluyen `success`, `message` y `data`
- **Manejo de errores**: Códigos HTTP estándar (200, 201, 400, 404, 500)
- **Paginación**: Implementada con metadatos completos

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <URL_DEL_REPOSITORIO>
cd eco-guardia-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar el backend**
El frontend se conecta a un backend PHP en:
```
http://localhost:8080/EcoDenunciasLP/api
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## Funcionalidades Principales

### 📊 Dashboard Resumen Semanal
- Visualización de denuncias de los últimos 7 días
- Filtros por zona, categoría y límite de resultados
- Estadísticas por estado (pendiente, en proceso, resuelta)

### 💬 Sistema de Comentarios
- Crear comentarios en denuncias
- Listar comentarios con paginación
- Estadísticas de comentarios por denuncia

### 🏛️ Panel de Administración
- Gestión y actualización de estados de denuncias
- Historial de cambios de estado
- Notas administrativas

### 📈 Reportes y Estadísticas
- Reportes generales con gráficos
- Análisis por categorías
- Ranking de ubicaciones
- Exportación de datos (JSON/CSV)

### 📝 Registro de Denuncias
- Formulario completo con validaciones
- Subida de imágenes como evidencia
- Geolocalización opcional
- Información de contacto opcional

### 🔍 Consulta de Denuncias
- Vista detallada de denuncias individuales
- Lista completa con filtros de búsqueda
- Enlaces entre páginas relacionadas

## Estructura del Proyecto

```
src/
├── components/
│   ├── layout/         # Componentes de navegación y layout
│   └── ui/            # Componentes de UI (shadcn/ui)
├── pages/             # Páginas de la aplicación
├── services/          # Servicios de API
├── hooks/             # Custom React hooks
└── lib/               # Utilidades y helpers
```

## Páginas Disponibles

- **`/`** - Página de inicio
- **`/crear-denuncia`** - Formulario de nueva denuncia
- **`/denuncias`** - Lista de todas las denuncias
- **`/dashboard`** - Dashboard con resumen semanal (en evaluación de permanencia por ser muy similar a /denuncias)
- **`/denuncia/:id`** - Detalles de denuncia específica
- **`/reportes`** - Reportes y análisis estadísticos
- **`/admin`** - Panel de administración

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Construcción en modo desarrollo
npm run build:dev

# Linting
npm run lint

# Preview de la build de producción
npm run preview
```

## Contribuciones del Equipo

### 🎯 División de Responsabilidades

Este proyecto fue desarrollado colaborativamente por un equipo de 3 integrantes, cada uno responsable de funcionalidades específicas del frontend:

#### **Jonathan Paul Zambrano Arriaga**
**Responsabilidades:**
1. **Ver resumen semanal de denuncias recientes en su zona**
   - Implementación del endpoint `GET /denuncias/resumen-semanal`
   - Listado de denuncias de los últimos 7 días con filtros simples
   - Filtros por zona y categoría según requerimiento
   - Tarjetas de estadísticas y métricas agregadas
   - Lista resumida con información básica de cada denuncia

2. **Permitir a los usuarios dejar comentarios en denuncias existentes**
   - Implementación del endpoint `POST /comentarios`
   - Implementación del endpoint `GET /comentarios/{denuncia_id}`
   - Formulario básico de envío de comentarios
   - Lista de comentarios con paginación
   - Integración en página de detalles de denuncias

3. **Vista Calendario Semanal** (`/calendario-semanal`)
   - Visualización de denuncias organizadas por días de la semana
   - Reutilización de datos del resumen semanal en formato calendario

**Componentes desarrollados:**
- `WeeklyCalendar.tsx` - Vista calendario de denuncias por día
- Sistema de comentarios integrado en `ReportDetails.tsx`
- Componentes de filtros para el resumen semanal
- Manejo de paginación para comentarios

#### **Darwin Javier Pacheco Paredes**
**Responsabilidades:**
1. **Actualizar estado de denuncia**
   - Implementación del endpoint `PUT /denuncias/{id}/estado`
   - Implementación del endpoint `GET /denuncias/{id}/historial`
   - Interfaz de gestión de estados para operadores
   - Funcionalidad para marcar denuncias como resueltas o editarlas
   - Historial de cambios con notas administrativas

2. **Generar reportes de denuncias**
   - Implementación del endpoint `GET /reportes` (estadísticas generales)
   - Implementación del endpoint `GET /reportes/categorias`
   - Implementación del endpoint `GET /reportes/ubicaciones`
   - Implementación del endpoint `GET /reportes/exportar`
   - Reportes de denuncias más frecuentes por categoría y ubicación
   - Visualización de reportes con gráficos interactivos
   - Exportación en formatos JSON y CSV

**Componentes desarrollados:**
- `AdminPanel.tsx` - Panel completo de administración
- `Reports.tsx` - Vista de reportes con gráficos
- Componentes de gestión de estados
- Sistema de exportación de datos

#### **Giovanni Andre Sambonino Pincay**
**Responsabilidades:**
1. **Registrar nueva denuncia**
   - Implementación del endpoint `POST /denuncias`
   - Formulario completo para crear denuncias ambientales
   - Descripción del problema, categoría y ubicación geográfica automática
   - Carga de imagen como evidencia (multipart/form-data)
   - Información de contacto opcional del reportante

2. **Consultar denuncias por categoría**
   - Implementación del endpoint `GET /denuncias/{id}` (consulta individual)
   - Interfaz de filtros para visualizar denuncias por tipo de problema ambiental
   - Vista detallada con información completa de cada caso
   - Integración con sistema de comentarios

**Componentes desarrollados:**
- `CreateReport.tsx` - Formulario de nueva denuncia
- `ReportDetails.tsx` - Vista detallada individual
- `ReportsList.tsx` - Lista general con filtros por categoría
- Componentes de formularios y validación

### 🔧 Funcionalidades Transversales

#### **Componentes Compartidos Desarrollados:**
- `Home.tsx` - Página de inicio con CTAs
- `Dashboard.tsx` - **Resumen Semanal** (compartido, consumido por Jonathan)
- `Navbar.tsx` - Navegación principal
- `StatusBadge.tsx` y `CrimeTypeBadge.tsx` - Componentes de estado
- `apiService.ts` - Capa de servicios API centralizada

#### **Integración y Migración Técnica:**
- **Migración shadcn/ui → Material-UI**: Actualización completa de la UI hacia MUI v6
- **Responsive Design**: Optimización para dispositivos móviles y desktop
- **State Management**: Implementación con React Query para cache inteligente
- **Error Handling**: Manejo consistente de errores en toda la aplicación
- **Loading States**: Estados de carga con skeletons para mejor UX

### 📊 Endpoints API Implementados

**Total: 11 endpoints del backend consumidos**

| Endpoint | Método | Responsable | Funcionalidad |
|----------|--------|-------------|---------------|
| `/denuncias/resumen-semanal` | GET | Jonathan | Dashboard con filtros |
| `/comentarios` | POST | Jonathan | Crear comentarios |
| `/comentarios/{id}` | GET | Jonathan | Listar comentarios |
| `/denuncias/{id}/estado` | PUT | Darwin | Actualizar estados |
| `/denuncias/{id}/historial` | GET | Darwin | Historial de cambios |
| `/reportes` | GET | Darwin | Estadísticas generales |
| `/reportes/categorias` | GET | Darwin | Reporte por categorías |
| `/reportes/ubicaciones` | GET | Darwin | Reporte por ubicaciones |
| `/reportes/exportar` | GET | Darwin | Exportación de datos |
| `/denuncias` | POST | Giovanni | Crear denuncias |
| `/denuncias/{id}` | GET | Giovanni | Detalles individuales |

### 🎨 Arquitectura de Componentes

```
src/
├── components/
│   ├── layout/          # Navegación (Navbar)
│   └── ui/             # Badges, componentes reutilizables
├── pages/              # Páginas principales por responsable
│   ├── Dashboard.tsx    # Compartido - Resumen semanal (consumido por Jonathan)
│   ├── WeeklyCalendar.tsx # Jonathan - Calendario semanal
│   ├── AdminPanel.tsx   # Darwin - Gestión de estados
│   ├── Reports.tsx      # Darwin - Reportes y gráficos
│   ├── CreateReport.tsx # Giovanni - Formulario nueva denuncia
│   ├── ReportDetails.tsx# Giovanni - Vista individual
│   └── ReportsList.tsx  # Giovanni - Lista con filtros por categoría
├── services/           # apiService.ts - Capa de API
└── hooks/             # Custom hooks compartidos
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Estado del Proyecto

✅ **Proyecto Completado al 100%**

Todas las funcionalidades especificadas en el prompt inicial han sido implementadas exitosamente:

### ✅ Funcionalidades Core Implementadas:
- [x] **GET /denuncias/resumen-semanal** - Dashboard con filtros completos
- [x] **POST /comentarios** - Creación de comentarios con validación
- [x] **GET /comentarios/{id}** - Lista paginada de comentarios
- [x] **PUT /denuncias/{id}/estado** - Gestión de estados administrativos
- [x] **GET /denuncias/{id}/historial** - Historial de cambios
- [x] **POST /denuncias** - Formulario completo de denuncias
- [x] **GET /denuncias/{id}** - Vista detallada individual
- [x] **GET /reportes** - Estadísticas y analytics completos
- [x] **Exportación de datos** - JSON y CSV funcional

### ✅ Componentes Sugeridos Desarrollados:
- [x] **FiltrosDenuncias** - Implementado en Dashboard
- [x] **ListaDenuncias** - Múltiples vistas (lista, dashboard, admin)
- [x] **ResumenEstadistico** - Tarjetas de métricas interactivas
- [x] **Comentarios** - Sistema completo con paginación
- [x] **Estados de carga** - Skeletons y loading states
- [x] **Manejo de errores** - Toast notifications consistentes
- [x] **Validaciones** - Formularios con React Hook Form + Zod
- [x] **apiService.ts** - Capa de servicios centralizada

### 🔄 Mejoras Técnicas Adicionales:
- **Migración completa a Material-UI** para cumplir requerimientos académicos
- **Responsive design** optimizado para todas las pantallas
- **React Query** para cache inteligente y mejor performance
- **TypeScript** para type safety completo
- **Arquitectura escalable** con separación clara de responsabilidades

## Contacto

**Equipo de Desarrollo:**
- **Jonathan Paul Zambrano Arriaga** - Dashboard y Sistema de Comentarios
- **Darwin Javier Pacheco Paredes** - Administración y Reportes
- **Giovanni Sambonino** - Registro y Consulta de Denuncias

Proyecto EcoDenuncia - Plataforma de Denuncias Ambientales

