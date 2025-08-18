// 🚨 CONFIGURACIÓN DE LA APLICACIÓN
// 🚨 Para cambiar entre Mock Data y API Real, modifica las variables aquí

export const APP_CONFIG = {
  // 🔥 CAMBIAR A false PARA USAR API REAL
  USE_MOCK_DATA: true,
  
  // URL del backend real
  API_BASE_URL: 'http://localhost:8080/EcoDenunciasLP/api',
  
  // Configuración de Mock Data
  MOCK_CONFIG: {
    // Delays simulados (en milisegundos)
    API_DELAY_MIN: 300,
    API_DELAY_MAX: 1500,
    
    // Habilitar logs de mock data en consola
    ENABLE_MOCK_LOGS: true,
  },
  
  // Configuración de la aplicación
  APP_INFO: {
    NAME: 'EcoDenuncia',
    VERSION: '1.0.0',
    DESCRIPTION: 'Plataforma de Denuncias Ambientales',
  }
};