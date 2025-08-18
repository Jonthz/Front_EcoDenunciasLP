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
- **`/dashboard`** - Dashboard con resumen semanal
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
1. **Resumen Semanal con Filtros** (`/denuncias`)
   - Implementación del endpoint `GET /denuncias/resumen-semanal`
   - Componente `Reports` 
   - Componente que muestra las denuncias
   - Funcionalidad compartida con Giovanni Sambonino

2. **Resumen Semanal en calendario** (`/calendario-semanal`)
   - Implementación del endpoint `GET /denuncias/resumen-semanal`
   - Componente `WeeklyCalendar` 
   - Componente que muestra las denuncias por secciones semanales
 

3. **Sistema de Comentarios** (`/comentarios`)
   - Implementación del endpoint `POST /comentarios`
   - Implementación del endpoint `GET /comentarios/{denuncia_id}`
   - Componente de lista de comentarios con paginación
   - Formulario de creación de comentarios con validaciones
   - Integración en página de detalles de denuncias

**Componentes desarrollados:**
- `WeeklyCalendar.tsx` - Vista principal con resumen semanal
- `Reports.tsx` - Vista de reportes con gráficos
- Sistema de comentarios integrado en `ReportDetails.tsx`
- Componentes de filtros y estadísticas
- Manejo de paginación para comentarios

#### **Darwin Javier Pacheco Paredes**
**Responsabilidades:**
4. **Gestión de Estados de Denuncias** (`/admin`)
   - Implementación del endpoint `PUT /denuncias/{id}/estado`
   - Implementación del endpoint `GET /denuncias/{id}/historial`
   - Panel de administración para operadores
   - Actualización de estados (pendiente → en_proceso → resuelta)
   - Historial de cambios con notas administrativas

5. **Reportes y Estadísticas** (`/reportes`)
   - Implementación del endpoint `GET /reportes` (estadísticas generales)
   - Implementación del endpoint `GET /reportes/categorias`
   - Implementación del endpoint `GET /reportes/ubicaciones`
   - Implementación del endpoint `GET /reportes/exportar`
   - Gráficos interactivos y visualización de datos
   - Exportación en formatos JSON y CSV

**Componentes desarrollados:**
- `AdminPanel.tsx` - Panel completo de administración
- Componentes de gestión de estados
- Sistema de exportación de datos

#### **Giovanni Sambonino**
**Responsabilidades:**
6. **Registro de Denuncias** (`/crear-denuncia`)
   - Implementación del endpoint `POST /denuncias`
   - Formulario completo con validaciones
   - Subida de imágenes (multipart/form-data)
   - Geolocalización opcional (latitud/longitud)
   - Información de contacto del reportante

7. **Consulta de Denuncias** (`/denuncia/:id`) 
   - Implementación del endpoint `GET /denuncias/{id}`
   - Vista detallada de denuncias individuales
   - Integración con sistema de comentarios
   - Navegación entre denuncias relacionadas

**Componentes desarrollados:**
- `CreateReport.tsx` - Formulario de nueva denuncia
- `ReportDetails.tsx` - Vista detallada individual
- `ReportsList.tsx` - Lista general de denuncias
- Componentes de formularios y validación

### 🔧 Funcionalidades Transversales

#### **Componentes Compartidos Desarrollados:**
- `Home.tsx` - Página de inicio con CTAs
- `Navbar.tsx` - Navegación principal
- `StatusBadge.tsx` y  aparte`CrimeTypeBadge.tsx` - Componentes de estado
- `apiService.ts` - Capa de servicios API centralizada

#### **Integración:**

- **Responsive Design**: Optimización para dispositivos móviles y desktop
- **State Management**: Implementación con React Query para cache inteligente
- **Error Handling**: Manejo consistente de errores en toda la aplicación
- **Loading States**: Estados de carga con skeletons para mejor UX

### 📊 Endpoints API en los que se basa el front

Serán consumidos en la entrega final, por ahora usamos mock data.


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



## Contacto

**Equipo de Desarrollo:**
- **Jonathan Paul Zambrano Arriaga** - Dashboard y Sistema de Comentarios
- **Darwin Javier Pacheco Paredes** - Administración y Reportes
- **Giovanni Sambonino** - Registro y Consulta de Denuncias

Proyecto EcoDenuncia - Plataforma de Denuncias Ambientales

Enlace del Proyecto: [proyecto](https://github.com/username/eco-guardia-web)