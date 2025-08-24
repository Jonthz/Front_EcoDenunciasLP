// 🚨 MOCK DATA INTEGRATION - SET USE_MOCK_DATA = false TO USE REAL API
import { 
  USE_MOCK_DATA, 
  mockResumenSemanal, 
  mockDenunciaDetalle, 
  mockComentarios, 
  mockHistorial, 
  mockReporteGeneral, 
  mockReporteCategorias, 
  mockReporteUbicaciones, 
  mockCreateSuccess, 
  mockExportSuccess, 
  simulateApiDelay 
} from './mockData';

import { APP_CONFIG } from '@/config/app.config';

const api_url =  'http://localhost/EcoDenunciasLP/api';

// Type definitions based on API documentation
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
  errores?: string[];
  campos_requeridos?: string[];
  tipos_permitidos?: string[];
  meta?: any;
}

export interface ResumenSemanal {
  resumen: {
    total_denuncias: number;
    pendientes: number;
    en_proceso: number;
    resueltas: number;
    periodo: string;
    fecha_consulta: string;
  };
  filtros_aplicados: {
    zona?: string;
    categoria?: string;
    limite?: number;
  };
  denuncias: DenunciaResumen[];
}

export interface DenunciaResumen {
  id: number;
  tipo_problema: string;
  descripcion_corta: string;
  descripcion_completa: string;
  ubicacion: string;
  estado: string;
  fecha: string;
  fecha_relativa: string;
  dias_transcurridos: number;
  imagen: string | null;
  prioridad: string;
}

export interface DenunciaDetalle {
  id: number;
  tipo_problema: string;
  descripcion: string;
  ubicacion_direccion: string;
  ubicacion_lat?: number;
  ubicacion_lng?: number;
  imagen_url?: string;
  estado: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  dias_transcurridos: number;
  total_comentarios: number;
}

export interface Comentario {
  id: number;
  nombre_usuario: string;
  comentario: string;
  fecha: string;
  fecha_iso: string;
  tiempo_transcurrido: string;
}

export interface ComentariosResponse {
  denuncia_id: number;
  comentarios: Comentario[];
  estadisticas: {
    total_comentarios: number;
    ultimo_comentario: string;
    primer_comentario: string;
  };
  paginacion: {
    pagina_actual: number;
    total_paginas: number;
    limite_por_pagina: number;
    total_elementos: number;
    tiene_siguiente: boolean;
    tiene_anterior: boolean;
  };
}

export interface HistorialEstado {
  estado: string;
  fecha: string;
  usuario: string;
  notas: string | null;
}

export interface ReporteGeneral {
  periodo: { inicio: string; fin: string };
  totales: {
    total: number;
    pendientes: number;
    en_proceso: number;
    resueltas: number;
  };
  promedios: { por_dia: number };
  tendencias: { ultima_semana: string };
}

export interface ReporteCategorias {
  periodo: { inicio: string; fin: string };
  categorias: Array<{ categoria: string; total: number }>;
  explicacion: string;
}

export interface ReporteUbicaciones {
  periodo: { inicio: string; fin: string };
  ubicaciones: Array<{ ubicacion: string; total: number }>;
  explicacion: string;
}

// Helper function for making API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${api_url}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      error_code: 'NETWORK_ERROR'
    };
  }
}

// Helper function for form data uploads
async function apiFormDataCall<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${api_url}${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      error_code: 'NETWORK_ERROR'
    };
  }
}

// API Service functions

// Jonathan's functions
export const fetchResumenSemanal = async (params: {
  zona?: string;
  categoria?: string;
  limite?: number;
} = {}): Promise<ApiResponse<ResumenSemanal>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(800);
    
    // Filter mock data based on params
    let filteredData = { ...mockResumenSemanal };
    if (filteredData.data) {
      let denuncias = filteredData.data.denuncias;
      
      if (params.zona) {
        denuncias = denuncias.filter(d => 
          d.ubicacion.toLowerCase().includes(params.zona!.toLowerCase())
        );
      }
      
      if (params.categoria) {
        denuncias = denuncias.filter(d => d.tipo_problema === params.categoria);
      }
      
      if (params.limite) {
        denuncias = denuncias.slice(0, params.limite);
      }
      
      filteredData.data.denuncias = denuncias;
      filteredData.data.filtros_aplicados = params;
    }
    
    return filteredData;
  }

  const searchParams = new URLSearchParams();
  if (params.zona) searchParams.append('zona', params.zona);
  if (params.categoria) searchParams.append('categoria', params.categoria);
  if (params.limite) searchParams.append('limite', params.limite.toString());

  const query = searchParams.toString();
  return apiCall<ResumenSemanal>(`/denuncias/resumen-semanal${query ? `?${query}` : ''}`);
};

export const crearComentario = async (payload: {
  denuncia_id: number;
  nombre_usuario: string;
  comentario: string;
}): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(500);
    return {
      ...mockCreateSuccess,
      message: "Comentario creado exitosamente",
      data: {
        comentario_id: Math.floor(Math.random() * 1000) + 10,
        denuncia_id: payload.denuncia_id,
        nombre_usuario: payload.nombre_usuario,
        comentario: payload.comentario,
        fecha_creacion: new Date().toISOString(),
        total_comentarios_denuncia: 4
      }
    };
  }

  return apiCall('/comentarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const fetchComentarios = async (
  denunciaId: number,
  pagina: number = 1,
  limite: number = 20
): Promise<ApiResponse<ComentariosResponse>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(600);
    return mockComentarios;
  }

  return apiCall<ComentariosResponse>(`/comentarios/${denunciaId}?pagina=${pagina}&limite=${limite}`);
};

// Darwin's functions
export const actualizarEstado = async (
  id: number,
  payload: {
    estado: 'pendiente' | 'en_proceso' | 'resuelta';
    notas?: string;
    usuario_responsable?: string;
  }
): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(700);
    return {
      success: true,
      message: "Estado actualizado exitosamente",
      data: {
        id: id,
        estado_anterior: "pendiente",
        estado_nuevo: payload.estado,
        notas: payload.notas,
        fecha_actualizacion: new Date().toISOString()
      }
    };
  }

  return apiCall(`/denuncias/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const fetchHistorial = async (id: number): Promise<ApiResponse<{ denuncia_id: number; historial: HistorialEstado[] }>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(400);
    return mockHistorial;
  }

  return apiCall(`/denuncias/${id}/historial`);
};

export const fetchReporteGeneral = async (params: {
  fecha_inicio?: string;
  fecha_fin?: string;
} = {}): Promise<ApiResponse<ReporteGeneral>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(900);
    return mockReporteGeneral;
  }

  const searchParams = new URLSearchParams();
  if (params.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
  if (params.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);

  const query = searchParams.toString();
  return apiCall<ReporteGeneral>(`/reportes${query ? `?${query}` : ''}`);
};

export const fetchReporteCategorias = async (params: {
  fecha_inicio?: string;
  fecha_fin?: string;
  limite?: number;
} = {}): Promise<ApiResponse<ReporteCategorias>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(800);
    return mockReporteCategorias;
  }

  const searchParams = new URLSearchParams();
  if (params.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
  if (params.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);
  if (params.limite) searchParams.append('limite', params.limite.toString());

  const query = searchParams.toString();
  return apiCall<ReporteCategorias>(`/reportes/categorias${query ? `?${query}` : ''}`);
};

export const fetchReporteUbicaciones = async (params: {
  fecha_inicio?: string;
  fecha_fin?: string;
  limite?: number;
} = {}): Promise<ApiResponse<ReporteUbicaciones>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(750);
    return mockReporteUbicaciones;
  }

  const searchParams = new URLSearchParams();
  if (params.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
  if (params.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);
  if (params.limite) searchParams.append('limite', params.limite.toString());

  const query = searchParams.toString();
  return apiCall<ReporteUbicaciones>(`/reportes/ubicaciones${query ? `?${query}` : ''}`);
};

export const exportarReporte = async (params: {
  formato: 'json' | 'csv';
  tipo: 'general';
  fecha_inicio?: string;
  fecha_fin?: string;
}): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(1200);
    return {
      ...mockExportSuccess,
      message: `Datos exportados exitosamente en formato ${params.formato.toUpperCase()}`,
      data: mockReporteGeneral.data
    };
  }

  const searchParams = new URLSearchParams();
  searchParams.append('formato', params.formato);
  searchParams.append('tipo', params.tipo);
  if (params.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio);
  if (params.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin);

  return apiCall(`/reportes/exportar?${searchParams.toString()}`);
};

// Giovanni's functions
export const crearDenuncia = async (payload: {
  descripcion: string;
  categoria: string;
  ubicacion: string;
  latitud?: number;
  longitud?: number;
  imagen?: File;
  nombre_reportante?: string;
  email_reportante?: string;
  telefono_reportante?: string;
}): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(1500);
    return {
      success: true,
      message: "Denuncia creada exitosamente",
      data: {
        denuncia_id: Math.floor(Math.random() * 1000) + 100,
        numero_folio: `ECO-2025-${String(Math.floor(Math.random() * 1000) + 100).padStart(6, '0')}`,
        estado: "pendiente",
        prioridad: "media",
        fecha_creacion: new Date().toISOString(),
        imagen_subida: !!payload.imagen,
        coordenadas_registradas: !!(payload.latitud && payload.longitud),
        contacto_registrado: !!(payload.nombre_reportante || payload.email_reportante)
      }
    };
  }

  // If there's an image, use FormData
  if (payload.imagen) {
    const formData = new FormData();
    formData.append('descripcion', payload.descripcion);
    formData.append('categoria', payload.categoria);
    formData.append('ubicacion', payload.ubicacion);
    if (payload.latitud) formData.append('latitud', payload.latitud.toString());
    if (payload.longitud) formData.append('longitud', payload.longitud.toString());
    if (payload.nombre_reportante) formData.append('nombre_reportante', payload.nombre_reportante);
    if (payload.email_reportante) formData.append('email_reportante', payload.email_reportante);
    if (payload.telefono_reportante) formData.append('telefono_reportante', payload.telefono_reportante);
    formData.append('imagen', payload.imagen);

    return apiFormDataCall('/denuncias', formData);
  } else {
    // Use JSON for requests without images
    const { imagen, ...jsonPayload } = payload;
    return apiCall('/denuncias', {
      method: 'POST',
      body: JSON.stringify(jsonPayload),
    });
  }
};

export const fetchDenuncia = async (id: number): Promise<ApiResponse<DenunciaDetalle>> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(600);
    return {
      ...mockDenunciaDetalle,
      data: { ...mockDenunciaDetalle.data!, id }
    };
  }

  return apiCall<DenunciaDetalle>(`/denuncias/${id}`);
};

// Health check and auxiliary endpoints
export const checkHealth = async (): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(300);
    return {
      success: true,
      message: "API funcionando correctamente",
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0-mock"
      }
    };
  }

  return apiCall('/health');
};

export const fetchApiDocs = async (): Promise<ApiResponse> => {
  // 🚨 MOCK DATA - Remove when backend is ready
  if (USE_MOCK_DATA) {
    await simulateApiDelay(400);
    return {
      success: true,
      message: "Documentación de API",
      data: {
        title: "EcoDenuncias API",
        version: "1.0.0",
        description: "API para gestión de denuncias ambientales"
      }
    };
  }

  return apiCall('/docs');
};

// Category mappings for frontend
export const categoriaMapping: Record<string, string> = {
  'contaminacion_agua': 'Contaminación de Agua',
  'contaminacion_aire': 'Contaminación de Aire',
  'deforestacion': 'Deforestación',
  'manejo_residuos': 'Manejo de Residuos',
  'ruido_excesivo': 'Ruido Excesivo',
  'contaminacion_suelo': 'Contaminación de Suelo',
  'otros': 'Otros',
  // Legacy mappings for compatibility
  'incendio': 'deforestacion',
  'contaminacion': 'contaminacion_agua',
  'mineria_ilegal': 'contaminacion_suelo'
};

export const estadoMapping: Record<string, string> = {
  'pendiente': 'Pendiente',
  'en_proceso': 'En Proceso',
  'resuelta': 'Resuelta'
};

export const prioridadMapping: Record<string, string> = {
  'alta': 'Alta',
  'media': 'Media',
  'baja': 'Baja'
};