# EcoDenuncia - Plataforma de Denuncias Ambientales

## Descripción del Proyecto

EcoDenuncia es una plataforma web diseñada para registrar, consultar, comentar y gestionar denuncias ambientales. La aplicación permite a los ciudadanos reportar delitos ambientales y realizar un seguimiento de su estado.

## Tecnologías Utilizadas

Este proyecto está construido con:

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

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

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Proyecto EcoDenuncia - Plataforma de Denuncias Ambientales

Enlace del Proyecto: [https://github.com/username/eco-guardia-web](https://github.com/username/eco-guardia-web)