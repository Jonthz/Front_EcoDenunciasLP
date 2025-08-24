// 🚨 MOCK DATA FOR PRESENTATION PURPOSES ONLY
// 🚨 Configure in src/config/app.config.ts
// 🚨 DELETE THIS FILE WHEN BACKEND IS READY

import { APP_CONFIG } from '@/config/app.config';

export const USE_MOCK_DATA = false;

import type { 
  ResumenSemanal, 
  DenunciaDetalle, 
  ComentariosResponse, 
  HistorialEstado, 
  ReporteGeneral, 
  ReporteCategorias, 
  ReporteUbicaciones,
  ApiResponse 
} from './apiService';

// Mock data for weekly summary
export const mockResumenSemanal: ApiResponse<ResumenSemanal> = {
  success: true,
  message: "Resumen semanal obtenido exitosamente",
  data: {
    resumen: {
      total_denuncias: 9,
      pendientes: 6,
      en_proceso: 2,
      resueltas: 1,
      periodo: "Últimos 7 días",
      fecha_consulta: "2025-01-17 14:30:15"
    },
    filtros_aplicados: {
      limite: 10
    },
    denuncias: [
      // Lunes 13/01/2025
      {
        id: 1,
        tipo_problema: "manejo_residuos",
        descripcion_corta: "Botadero clandestino en zona urbana",
        descripcion_completa: "Acumulación de basura y desechos industriales en terreno baldío del norte de la ciudad. La comunidad reporta malos olores y presencia de roedores.",
        ubicacion: "Av. Francisco de Orellana, Km 5.5, Guayaquil",
        estado: "pendiente",
        fecha: "13/01/2025 18:45",
        fecha_relativa: "Hace 4 días",
        dias_transcurridos: 4,
        imagen: "/placeholder.svg",
        prioridad: "media"
      },
      // Martes 14/01/2025
      {
        id: 2,
        tipo_problema: "deforestacion",
        descripcion_corta: "Tala ilegal en bosque protegido",
        descripcion_completa: "Maquinaria pesada realizando tala indiscriminada en zona de reserva ecológica. Se han derribado aproximadamente 50 árboles nativos de gran tamaño.",
        ubicacion: "Reserva Ecológica Manglares Churute",
        estado: "en_proceso",
        fecha: "14/01/2025 14:15",
        fecha_relativa: "Hace 3 días",
        dias_transcurridos: 3,
        imagen: null,
        prioridad: "alta"
      },
      {
        id: 7,
        tipo_problema: "contaminacion_aire",
        descripcion_corta: "Humo industrial nocturno",
        descripcion_completa: "Fábrica de productos químicos emitiendo gases tóxicos durante la noche, violando horarios permitidos.",
        ubicacion: "Parque Industrial Pascuales, Guayaquil",
        estado: "pendiente",
        fecha: "14/01/2025 23:30",
        fecha_relativa: "Hace 3 días",
        dias_transcurridos: 3,
        imagen: null,
        prioridad: "alta"
      },
      // Miércoles 15/01/2025
      {
        id: 3,
        tipo_problema: "contaminacion_agua",
        descripcion_corta: "Vertido de químicos en el río Guayas",
        descripcion_completa: "Se observó una empresa descargando líquidos de color rojizo directamente al río Guayas, causando mal olor y muerte de peces en la zona. El vertido ocurrió durante la madrugada del 15 de enero.",
        ubicacion: "Río Guayas, sector Malecón 2000, Guayaquil",
        estado: "pendiente",
        fecha: "15/01/2025 06:30",
        fecha_relativa: "Hace 2 días",
        dias_transcurridos: 2,
        imagen: "/placeholder.svg",
        prioridad: "alta"
      },
      // Jueves 16/01/2025
      {
        id: 4,
        tipo_problema: "contaminacion_aire",
        descripcion_corta: "Emisiones tóxicas de fábrica",
        descripcion_completa: "Fábrica textil emitiendo humo negro constante sin filtros aparentes. Los vecinos reportan irritación en ojos y garganta.",
        ubicacion: "Zona Industrial Las Lojas, Durán",
        estado: "resuelta",
        fecha: "16/01/2025 09:20",
        fecha_relativa: "Hace 1 día",
        dias_transcurridos: 1,
        imagen: null,
        prioridad: "alta"
      },
      {
        id: 8,
        tipo_problema: "ruido_excesivo",
        descripcion_corta: "Construcción nocturna ilegal",
        descripcion_completa: "Empresa de construcción operando maquinaria pesada durante horas no permitidas, afectando el descanso de la comunidad.",
        ubicacion: "Urbanización La Garzota, Samborondón",
        estado: "en_proceso",
        fecha: "16/01/2025 22:15",
        fecha_relativa: "Hace 1 día",
        dias_transcurridos: 1,
        imagen: null,
        prioridad: "media"
      },
      // Viernes 17/01/2025
      {
        id: 5,
        tipo_problema: "contaminacion_suelo",
        descripcion_corta: "Derrame de combustible en zona agrícola",
        descripcion_completa: "Camión cisterna volcó derramando aproximadamente 5000 litros de diesel en terrenos de cultivo, afectando la producción de arroz de la zona.",
        ubicacion: "Vía Daule-Balzar, Km 45",
        estado: "pendiente",
        fecha: "17/01/2025 16:30",
        fecha_relativa: "Hoy",
        dias_transcurridos: 0,
        imagen: "/placeholder.svg",
        prioridad: "alta"
      },
      {
        id: 9,
        tipo_problema: "contaminacion_agua",
        descripcion_corta: "Descarga de aguas residuales sin tratamiento",
        descripcion_completa: "Hotel de lujo descargando aguas negras directamente al estero, sin pasar por planta de tratamiento.",
        ubicacion: "Estero Salado, Vía a la Costa",
        estado: "pendiente",
        fecha: "17/01/2025 11:45",
        fecha_relativa: "Hoy",
        dias_transcurridos: 0,
        imagen: "/placeholder.svg",
        prioridad: "alta"
      },
      // Sábado 18/01/2025 - Sin denuncias (día tranquilo)
      
      // Domingo 19/01/2025
      {
        id: 6,
        tipo_problema: "otros",
        descripcion_corta: "Actividad industrial en área protegida",
        descripcion_completa: "Empresa procesadora de camarón operando ilegalmente dentro de zona de manglar protegido.",
        ubicacion: "Manglares de Churute, El Oro",
        estado: "pendiente",
        fecha: "19/01/2025 12:15",
        fecha_relativa: "Mañana",
        dias_transcurridos: -1,
        imagen: null,
        prioridad: "media"
      }
    ]
  },
  meta: {
    categorias_disponibles: [
      "contaminacion_agua",
      "contaminacion_aire", 
      "deforestacion",
      "manejo_residuos",
      "ruido_excesivo",
      "contaminacion_suelo",
      "otros"
    ],
    zonas_disponibles: [
      "Guayaquil",
      "Quito", 
      "Cuenca",
      "Machala",
      "Durán",
      "Samborondón"
    ]
  }
};

// Mock data for individual report details
export const mockDenunciaDetalle: ApiResponse<DenunciaDetalle> = {
  success: true,
  message: "Denuncia obtenida exitosamente",
  data: {
    id: 1,
    tipo_problema: "contaminacion_agua",
    descripcion: "Se observó una empresa descargando líquidos de color rojizo directamente al río Guayas, causando mal olor y muerte de peces en la zona. El vertido ocurrió durante la madrugada del 15 de enero. Los residentes de la zona han reportado que esta no es la primera vez que ocurre.",
    ubicacion_direccion: "Río Guayas, sector Malecón 2000, Guayaquil",
    ubicacion_lat: -2.1894,
    ubicacion_lng: -79.8847,
    imagen_url: "/placeholder.svg",
    estado: "pendiente",
    fecha_creacion: "2025-01-15 06:30:00",
    fecha_actualizacion: null,
    dias_transcurridos: 2,
    total_comentarios: 3
  }
};

// Mock data for comments
export const mockComentarios: ApiResponse<ComentariosResponse> = {
  success: true,
  message: "Comentarios obtenidos exitosamente",
  data: {
    denuncia_id: 1,
    comentarios: [
      {
        id: 1,
        nombre_usuario: "María González",
        comentario: "Yo también he visto esto varias veces. Es urgente que las autoridades tomen medidas.",
        fecha: "16/01/2025 08:15",
        fecha_iso: "2025-01-16T08:15:00-05:00",
        tiempo_transcurrido: "Hace 1 día"
      },
      {
        id: 2,
        nombre_usuario: "Carlos Mendoza",
        comentario: "Mi familia vive cerca y ya no podemos usar el agua del río. Los peces están muriendo.",
        fecha: "16/01/2025 14:30",
        fecha_iso: "2025-01-16T14:30:00-05:00", 
        tiempo_transcurrido: "Hace 18 horas"
      },
      {
        id: 3,
        nombre_usuario: "Ana Rodríguez",
        comentario: "Tengo fotos adicionales del vertido. ¿Cómo puedo contactar a las autoridades?",
        fecha: "17/01/2025 09:45",
        fecha_iso: "2025-01-17T09:45:00-05:00",
        tiempo_transcurrido: "Hace 5 horas"
      }
    ],
    estadisticas: {
      total_comentarios: 3,
      ultimo_comentario: "17/01/2025 09:45",
      primer_comentario: "16/01/2025 08:15"
    },
    paginacion: {
      pagina_actual: 1,
      total_paginas: 1,
      limite_por_pagina: 20,
      total_elementos: 3,
      tiene_siguiente: false,
      tiene_anterior: false
    }
  }
};

// Mock data for status history
export const mockHistorial: ApiResponse<{ denuncia_id: number; historial: HistorialEstado[] }> = {
  success: true,
  message: "Historial obtenido exitosamente",
  data: {
    denuncia_id: 1,
    historial: [
      {
        estado: "pendiente",
        fecha: "2025-01-15 06:30:00",
        usuario: "Sistema",
        notas: null
      },
      {
        estado: "en_proceso",
        fecha: "2025-01-16 10:15:00",
        usuario: "Inspector García",
        notas: "Asignada a equipo de inspección ambiental para verificación en campo"
      }
    ]
  }
};

// Mock data for general reports
export const mockReporteGeneral: ApiResponse<ReporteGeneral> = {
  success: true,
  message: "Reporte general generado exitosamente",
  data: {
    periodo: { inicio: "2025-01-01", fin: "2025-01-17" },
    totales: {
      total: 45,
      pendientes: 18,
      en_proceso: 15,
      resueltas: 12
    },
    promedios: { por_dia: 2.6 },
    tendencias: { ultima_semana: "+15%" }
  }
};

// Mock data for categories report
export const mockReporteCategorias: ApiResponse<ReporteCategorias> = {
  success: true,
  message: "Reporte por categorías generado exitosamente",
  data: {
    periodo: { inicio: "2025-01-01", fin: "2025-01-17" },
    categorias: [
      { categoria: "contaminacion_agua", total: 15 },
      { categoria: "deforestacion", total: 12 },
      { categoria: "manejo_residuos", total: 8 },
      { categoria: "contaminacion_aire", total: 6 },
      { categoria: "contaminacion_suelo", total: 3 },
      { categoria: "ruido_excesivo", total: 1 }
    ],
    explicacion: "Las categorías con mayor cantidad de denuncias en el período seleccionado"
  }
};

// Mock data for locations report
export const mockReporteUbicaciones: ApiResponse<ReporteUbicaciones> = {
  success: true,
  message: "Reporte por ubicaciones generado exitosamente",
  data: {
    periodo: { inicio: "2025-01-01", fin: "2025-01-17" },
    ubicaciones: [
      { ubicacion: "Guayaquil", total: 18 },
      { ubicacion: "Quito", total: 12 },
      { ubicacion: "Cuenca", total: 7 },
      { ubicacion: "Machala", total: 4 },
      { ubicacion: "Durán", total: 2 },
      { ubicacion: "Samborondón", total: 2 }
    ],
    explicacion: "Las ubicaciones con mayor cantidad de denuncias reportadas"
  }
};

// Mock success responses for write operations
export const mockCreateSuccess: ApiResponse = {
  success: true,
  message: "Operación realizada exitosamente",
  data: {
    id: Math.floor(Math.random() * 1000) + 100,
    timestamp: new Date().toISOString()
  }
};

export const mockExportSuccess: ApiResponse = {
  success: true,
  message: "Datos exportados exitosamente",
  data: {
    export_url: "#",
    format: "json",
    timestamp: new Date().toISOString()
  }
};

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));