# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Installation
- `npm i` - Install dependencies (Node.js required)

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/
│   ├── layout/         # Navigation and layout components
│   └── ui/            # shadcn/ui components (button, card, dialog, etc.)
├── pages/             # Route components
├── services/          # API service layer
├── hooks/             # Custom React hooks
└── lib/               # Utilities and helpers
```

### Key Application Pages
- **Home** (`/`) - Landing page
- **CreateReport** (`/crear-denuncia`) - Form to create environmental reports
- **ReportsList** (`/denuncias`) - List view of all reports
- **Dashboard** (`/dashboard`) - Overview and metrics
- **ReportDetails** (`/denuncia/:id`) - Individual report details
- **Reports** (`/reportes`) - Analytics and reporting
- **WeeklyCalendar** (`/calendario-semanal`) - Calendar view of reports by day
- **AdminPanel** (`/admin`) - Administrative functions

## Team Responsibilities

### Jonathan Paul Zambrano Arriaga
1. **Weekly summary of reports with filters** (`/denuncias/resumen-semanal`)
2. **Comments system** - create and list comments (`/comentarios`)

### Darwin Javier Pacheco Paredes  
3. **Report status management and updates** (`/denuncias/{id}/estado`, `/denuncias/{id}/historial`)
4. **Reports and statistics** - general, by category, by location, exports (`/reportes/*`)

### Giovanni Sambonino
5. **Report registration and individual queries** with evidence and geolocation (`/denuncias`)

## EcoDenuncias Platform Context

**Project Overview**: Environmental reporting platform for registering, consulting, commenting on, and managing environmental reports. The frontend consumes a PHP REST-style backend.

## API Integration

### Backend Details
- **Base URL**: `http://localhost:8080/EcoDenunciasLP/api`
- **Architecture**: PHP REST-style backend
- **Response Format**: All responses include `success` (boolean), `message` (string), and `data` (object) when applicable
- **HTTP Codes**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 405 Method Not Allowed, 500 Internal Error
- **Error Handling**: Validation errors include details (missing fields, incorrect formats)
- **Date Format**: Human-readable combinations and ISO when applicable
- **Pagination**: `pagina_actual`, `total_paginas`, `limite_por_pagina`, `total_elementos`, `tiene_siguiente`, `tiene_anterior`

### Key API Endpoints

**Jonathan's Functions:**
- `fetchResumenSemanal(params)` - GET `/denuncias/resumen-semanal` - Weekly summary with filters (zone, category, limit)
- `crearComentario(payload)` - POST `/comentarios` - Create comment for a report
- `fetchComentarios(denunciaId, pagina, limite)` - GET `/comentarios/{denuncia_id}` - List comments with pagination

**Darwin's Functions:**
- `actualizarEstado(id, payload)` - PUT `/denuncias/{id}/estado` - Update report status (pendiente|en_proceso|resuelta)
- `fetchHistorial(id)` - GET `/denuncias/{id}/historial` - Get status change history
- `fetchReporteGeneral(params)` - GET `/reportes` - General statistics with date range
- `fetchReporteCategorias(params)` - GET `/reportes/categorias` - Category breakdown ranking
- `fetchReporteUbicaciones(params)` - GET `/reportes/ubicaciones` - Location-based statistics
- `exportarReporte(params)` - GET `/reportes/exportar` - Export data in JSON/CSV format

**Giovanni's Functions:**
- `crearDenuncia(payload)` - POST `/denuncias` - Create new report with optional image and geolocation
- `fetchDenuncia(id)` - GET `/denuncias/{id}` - Get individual report details

**Additional Views:**
- **WeeklyCalendar** (`/calendario-semanal`) - Uses `fetchResumenSemanal()` data organized in calendar format

**Auxiliary Endpoints:**
- `checkHealth()` - GET `/health` - API and DB status check
- `fetchApiDocs()` - GET `/docs` - Embedded documentation

### State Management Patterns
- Use React Query for all API calls and caching
- Form state managed by React Hook Form
- UI state (modals, notifications) handled by component state
- Toast notifications via Sonner

### Styling Guidelines
- Use Tailwind utility classes
- Leverage shadcn/ui components for consistency
- Custom components follow the established design system
- Status badges and UI elements have consistent styling patterns

## Implementation Priority & Suggested Components

### Sprint Priority Order
1. **Weekly summary + Comments** (reading/creation)
2. **Create report functionality**
3. **Status change + history**
4. **General reports and categories**
5. **Location reports + export functionality**
6. **Refinements** (stricter validations, internationalization, simple caching)

### Suggested Frontend Modules

**Core Components:**
1. **DashboardResumen** - Consumes weekly summary endpoint with filter panel and statistics cards
2. **DenunciaDetalle** - Individual report view with metadata and status timeline
3. **Comentarios** - Comment list and creation form with pagination handling
4. **FormNuevaDenuncia** - Validated form for new reports with image upload support
5. **GestiónEstados** - Status management for operators/admins with history view
6. **Reportes** - Analytics dashboard with date filters and export functionality

**Utility Components:**
- **Filtros** - Reusable filter components (date ranges, categories, zones)
- **Tabla** - Data table with sorting and pagination
- **Lista** - List view with expandable items
- **Paginador** - Pagination controls
- **Form** - Form components with validation

### Data Categories & Status Values

**Categories (enum):**
- `contaminacion_agua` - Contaminación de Agua
- `contaminacion_aire` - Contaminación de Aire  
- `deforestacion` - Deforestación
- `manejo_residuos` - Manejo de Residuos
- `ruido_excesivo` - Ruido Excesivo
- `contaminacion_suelo` - Contaminación de Suelo
- `otros` - Otros

**Status Values:**
- `pendiente` - Pendiente
- `en_proceso` - En Proceso
- `resuelta` - Resuelta

**Priority Levels:**
- `alta` - Alta
- `media` - Media
- `baja` - Baja

## Implementation Status

### ✅ Completed Features (100% Implementation)

**Jonathan's Responsibilities:**
- ✅ **Weekly Summary Dashboard** (`/dashboard`) - Fully implemented with filters, statistics cards, and expandable report list
- ✅ **Comments System** - Complete implementation in ReportDetails page with creation and pagination

**Darwin's Responsibilities:**
- ✅ **Report Status Management** (`/admin`) - Full admin panel with status updates and history viewing
- ✅ **Reports & Analytics** (`/reportes`) - Complete with general, categories, and locations reports + CSV/JSON export

**Giovanni's Responsibilities:**
- ✅ **Report Creation** (`/crear-denuncia`) - Full form with image upload, geolocation, and validation
- ✅ **Individual Report Details** (`/denuncia/:id`) - Complete details page with comments and history

**Additional Pages:**
- ✅ **Home Page** (`/`) - Landing page with CTAs and feature overview
- ✅ **Reports List** (`/denuncias`) - Comprehensive listing with search and filters
- ✅ **Weekly Calendar** (`/calendario-semanal`) - Calendar view of weekly reports by day

### Key Implementation Highlights

**All 11 Required API Endpoints Implemented:**
1. ✅ `GET /denuncias/resumen-semanal` - Dashboard with filters
2. ✅ `POST /comentarios` - Comment creation
3. ✅ `GET /comentarios/{denuncia_id}` - Comment listing with pagination
4. ✅ `PUT /denuncias/{id}/estado` - Status updates
5. ✅ `GET /denuncias/{id}/historial` - Status history
6. ✅ `GET /reportes` - General statistics
7. ✅ `GET /reportes/categorias` - Category breakdown
8. ✅ `GET /reportes/ubicaciones` - Location statistics
9. ✅ `GET /reportes/exportar` - Data export (JSON/CSV)
10. ✅ `POST /denuncias` - Report creation with multipart support
11. ✅ `GET /denuncias/{id}` - Individual report details

**All Suggested Components Implemented:**
- ✅ DashboardResumen (Dashboard.tsx) - Filters, statistics, expandable list
- ✅ DenunciaDetalle (ReportDetails.tsx) - Metadata, timeline, comments
- ✅ Comentarios - Integrated in ReportDetails with pagination
- ✅ FormNuevaDenuncia (CreateReport.tsx) - Validation, image upload
- ✅ GestiónEstados (AdminPanel.tsx) - Status management, history
- ✅ Reportes (Reports.tsx) - Tabs, charts, export functionality

**UI/UX Excellence:**
- ✅ Comprehensive shadcn/ui component library
- ✅ Responsive design with mobile-first approach
- ✅ Loading states with skeletons to prevent layout shift
- ✅ Error handling with toast notifications
- ✅ Form validation matching backend constraints
- ✅ Status and category badges with proper color coding
- ✅ Interactive charts for data visualization

### Development Notes
- Built with modern React and TypeScript
- Uses TypeScript with strict type checking
- ESLint configured for code quality
- Component-based architecture with clear separation of concerns
- All API responses follow a consistent `ApiResponse<T>` interface pattern
- Error handling: Display toast/alert when `success=false`
- Loading states: Use skeletons or spinners to avoid layout shift
- Consider memoization or SWR for frequently accessed endpoints
- Form validation should match backend constraints (e.g., comment length 5-1000 chars)
- CrimeTypeBadge component supports both new API categories and legacy compatibility