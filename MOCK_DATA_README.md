# 🚨 MOCK DATA CONFIGURATION

## ⚠️ IMPORTANTE - Solo para Presentación

Este archivo documenta la configuración de datos mock (simulados) implementados temporalmente para presentaciones del frontend antes de conectar el backend real.

## 🔧 Cómo Activar/Desactivar Mock Data

### Para Presentación (Mock Data Activo):
1. Abrir el archivo: `src/services/mockData.ts`
2. Verificar que la línea 5 esté configurada como:
   ```typescript
   export const USE_MOCK_DATA = true;
   ```

### Para Producción (API Real):
1. Abrir el archivo: `src/services/mockData.ts`
2. Cambiar la línea 5 a:
   ```typescript
   export const USE_MOCK_DATA = false;
   ```

## 📊 Datos Mock Incluidos

### Dashboard y Resumen Semanal
- ✅ 6 denuncias de ejemplo con diferentes tipos y estados
- ✅ Estadísticas realistas por estado
- ✅ Filtros funcionales por zona, categoría y límite
- ✅ Fechas relativas y cálculos de días transcurridos

### Sistema de Comentarios
- ✅ 3 comentarios de ejemplo por denuncia
- ✅ Nombres de usuarios realistas
- ✅ Fechas y tiempos transcurridos
- ✅ Estadísticas de comentarios
- ✅ Paginación funcional

### Reportes y Estadísticas
- ✅ Reporte general con 45 denuncias totales
- ✅ Distribución por categorías (Contaminación de agua: 15, Deforestación: 12, etc.)
- ✅ Ranking de ubicaciones (Guayaquil: 18, Quito: 12, etc.)
- ✅ Tendencias y promedios
- ✅ Exportación funcional (simula descarga)

### Gestión de Estados
- ✅ Actualización de estados con respuestas exitosas
- ✅ Historial de cambios con usuarios y notas
- ✅ Simulación de operaciones administrativas

### Creación de Denuncias
- ✅ Respuestas exitosas con IDs únicos
- ✅ Números de folio generados automáticamente
- ✅ Simulación de carga de imágenes
- ✅ Validación de coordenadas y contactos

### Detalles de Denuncias
- ✅ Información completa de denuncias individuales
- ✅ Coordenadas geográficas
- ✅ URLs de imágenes
- ✅ Contadores de comentarios

## ⏱️ Simulación de Latencia

Cada endpoint mock incluye delays realistas:
- **Consultas rápidas**: 300-600ms
- **Consultas complejas**: 800-1200ms
- **Operaciones de escritura**: 500-1500ms

Esto simula una experiencia real de uso con el backend.

## 🗂️ Estructura de Archivos Mock

```
src/services/
├── mockData.ts          # Datos y configuración mock
├── apiService.ts        # API service con integración mock
└── MOCK_DATA_README.md  # Esta documentación
```

## 🚀 Para Eliminar Mock Data Completamente

Cuando el backend esté listo:

1. **Cambiar configuración**:
   ```typescript
   export const USE_MOCK_DATA = false;
   ```

2. **Opcional - Eliminar archivos**:
   ```bash
   rm src/services/mockData.ts
   rm MOCK_DATA_README.md
   ```

3. **Limpiar apiService.ts**:
   - Remover import de mockData
   - Eliminar todos los bloques `if (USE_MOCK_DATA)`
   - Mantener solo las llamadas API reales

## 🎯 Funcionalidades Probadas

### ✅ Páginas Completamente Funcionales:
- **Home** (`/`) - Landing page
- **Dashboard** (`/dashboard`) - Resumen semanal con filtros
- **Crear Denuncia** (`/crear-denuncia`) - Formulario completo
- **Lista Denuncias** (`/denuncias`) - Catálogo con búsqueda
- **Detalles** (`/denuncia/:id`) - Vista individual con comentarios
- **Reportes** (`/reportes`) - Analytics con gráficos
- **Admin Panel** (`/admin`) - Gestión administrativa

### ✅ Funcionalidades Interactivas:
- Filtros dinámicos en Dashboard y Lista
- Creación de comentarios en tiempo real
- Actualización de estados administrativos
- Exportación de reportes (JSON/CSV)
- Búsqueda y paginación
- Carga de imágenes simulada
- Toast notifications para todas las acciones

## 🎨 Datos Realistas

Los datos mock están basados en casos reales de Ecuador:
- **Ubicaciones**: Guayaquil, Quito, Cuenca, Machala, Durán, Samborondón
- **Tipos de problemas**: Contaminación de agua/aire/suelo, deforestación, manejo de residuos, ruido excesivo
- **Contextos**: Río Guayas, Malecón 2000, reservas ecológicas, zonas industriales
- **Fechas**: Últimos 7 días con distribución realista
- **Estados**: Pendiente, en proceso, resuelta con workflows lógicos

## 📞 Soporte

Si necesitas ajustar los datos mock o tienes problemas:
1. Revisa que `USE_MOCK_DATA = true` en `mockData.ts`
2. Verifica la consola del navegador para errores
3. Los delays se pueden ajustar en la función `simulateApiDelay()`