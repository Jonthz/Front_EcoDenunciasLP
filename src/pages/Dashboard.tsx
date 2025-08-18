import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button as MuiButton,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Divider,
  Skeleton,
  Snackbar,
  Alert
} from "@mui/material";
import { CalendarDays, MapPin, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock, Calendar, BarChart3, Flame, Droplets, Mountain, Trees, Trash2, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchResumenSemanal, categoriaMapping, ResumenSemanal, DenunciaResumen, ApiResponse } from "@/services/apiService";

const Dashboard = () => {
  const [data, setData] = useState<ResumenSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [filters, setFilters] = useState({
    zona: "",
    categoria: "all",
    limite: 10
  });

  const showToast = (message: string, severity: 'error' | 'success' | 'warning' | 'info' = 'info') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiFilters = {
        ...filters,
        categoria: filters.categoria === "all" ? undefined : filters.categoria
      };
      const response: ApiResponse<ResumenSemanal> = await fetchResumenSemanal(apiFilters);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        showToast(response.message || "Error al cargar datos", "error");
      }
    } catch (error) {
      showToast("No se pudo conectar con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'limite' ? parseInt(value) || 10 : value
    }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const clearFilters = () => {
    setFilters({ zona: "", categoria: "all", limite: 10 });
    setTimeout(() => fetchData(), 100);
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return "error";
      case "media": return "warning";
      case "baja": return "default";
      default: return "default";
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return <AlertTriangle style={{ width: 12, height: 12 }} />;
      case "media": return <Clock style={{ width: 12, height: 12 }} />;
      case "baja": return <CheckCircle style={{ width: 12, height: 12 }} />;
      default: return <Clock style={{ width: 12, height: 12 }} />;
    }
  };

  const getCrimeTypeBadge = (type: string) => {
    const getTypeConfig = (type: string) => {
      switch (type) {
        case "contaminacion_agua":
          return {
            label: "Contaminación de Agua",
            icon: <Droplets style={{ width: 12, height: 12 }} />,
            color: "#2563eb" as const,
            bgcolor: "#dbeafe" as const
          };
        case "contaminacion_aire":
          return {
            label: "Contaminación de Aire",
            icon: <AlertTriangle style={{ width: 12, height: 12 }} />,
            color: "#6b7280" as const,
            bgcolor: "#f3f4f6" as const
          };
        case "deforestacion":
          return {
            label: "Deforestación",
            icon: <Trees style={{ width: 12, height: 12 }} />,
            color: "#16a34a" as const,
            bgcolor: "#dcfce7" as const
          };
        case "manejo_residuos":
          return {
            label: "Manejo de Residuos",
            icon: <Trash2 style={{ width: 12, height: 12 }} />,
            color: "#ca8a04" as const,
            bgcolor: "#fef3c7" as const
          };
        case "ruido_excesivo":
          return {
            label: "Ruido Excesivo",
            icon: <Volume2 style={{ width: 12, height: 12 }} />,
            color: "#9333ea" as const,
            bgcolor: "#f3e8ff" as const
          };
        case "contaminacion_suelo":
          return {
            label: "Contaminación de Suelo",
            icon: <Mountain style={{ width: 12, height: 12 }} />,
            color: "#ea580c" as const,
            bgcolor: "#fed7aa" as const
          };
        case "incendio":
          return {
            label: "Incendio Forestal",
            icon: <Flame style={{ width: 12, height: 12 }} />,
            color: "#dc2626" as const,
            bgcolor: "#fecaca" as const
          };
        default:
          return {
            label: "Otros",
            icon: <AlertTriangle style={{ width: 12, height: 12 }} />,
            color: "#6b7280" as const,
            bgcolor: "#f3f4f6" as const
          };
      }
    };

    const config = getTypeConfig(type);
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        variant="outlined"
        sx={{
          color: config.color,
          borderColor: config.color,
          backgroundColor: config.bgcolor,
          '& .MuiChip-icon': {
            color: config.color
          }
        }}
      />
    );
  };

  const getStatusBadge = (status: string) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case "pendiente":
          return {
            label: "Pendiente",
            color: "#ca8a04" as const,
            bgcolor: "#fef3c7" as const
          };
        case "en_proceso":
          return {
            label: "En Proceso",
            color: "#2563eb" as const,
            bgcolor: "#dbeafe" as const
          };
        case "resuelta":
          return {
            label: "Resuelta",
            color: "#16a34a" as const,
            bgcolor: "#dcfce7" as const
          };
        default:
          return {
            label: "Desconocido",
            color: "#6b7280" as const,
            bgcolor: "#f3f4f6" as const
          };
      }
    };

    const config = getStatusConfig(status);
    return (
      <Chip
        label={config.label}
        size="small"
        variant="outlined"
        sx={{
          color: config.color,
          borderColor: config.color,
          backgroundColor: config.bgcolor
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Resumen Semanal
            </Typography>
            <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
              Dashboard de denuncias ambientales de los últimos 7 días
            </Typography>
          </Box>

          {/* Loading skeleton */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[...Array(4)].map((_, i) => (
              <Grid key={i} xs={12} md={3}>
                <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Skeleton width={64} height={32} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton width={80} height={20} sx={{ mx: 'auto' }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ mb: 4, bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <Skeleton height={56} />
                </Grid>
                <Grid xs={12} md={4}>
                  <Skeleton height={56} />
                </Grid>
                <Grid xs={12} md={4}>
                  <Skeleton height={56} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ '& > *': { mb: 2 } }}>
            {[...Array(3)].map((_, i) => (
              <Card key={i} sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton height={96} />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
            Resumen Semanal
          </Typography>
          <Typography variant="h6" sx={{ color: 'hsl(var(--muted-foreground))', maxWidth: '48rem', mx: 'auto' }}>
            Dashboard de denuncias ambientales de los últimos 7 días
          </Typography>
          {data && (
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mt: 1 }}>
              Última actualización: {data.resumen.fecha_consulta}
            </Typography>
          )}
        </Box>

        {/* Statistics Cards */}
        {data && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} md={3}>
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--primary))', mb: 1 }}>
                    {data.resumen.total_denuncias}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                    Total Denuncias
                  </Typography>
                  <TrendingUp style={{ width: 16, height: 16, marginTop: 8, color: 'hsl(var(--primary))' }} />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} md={3}>
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--warning))', mb: 1 }}>
                    {data.resumen.pendientes}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                    Pendientes
                  </Typography>
                  <Clock style={{ width: 16, height: 16, marginTop: 8, color: 'hsl(var(--warning))' }} />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} md={3}>
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--accent))', mb: 1 }}>
                    {data.resumen.en_proceso}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                    En Proceso
                  </Typography>
                  <AlertTriangle style={{ width: 16, height: 16, marginTop: 8, color: 'hsl(var(--accent))' }} />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid xs={12} md={3}>
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--success))', mb: 1 }}>
                    {data.resumen.resueltas}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                    Resueltas
                  </Typography>
                  <CheckCircle style={{ width: 16, height: 16, marginTop: 8, color: 'hsl(var(--success))' }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Card sx={{ mb: 4, bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Filter style={{ width: 20, height: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                Filtros de Búsqueda
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mb: 3 }}>
              Filtra las denuncias por zona, categoría y cantidad de resultados
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Zona"
                  placeholder="Buscar por ubicación..."
                  value={filters.zona}
                  onChange={(e) => handleFilterChange('zona', e.target.value)}
                />
              </Grid>

              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filters.categoria}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    label="Categoría"
                  >
                    <MenuItem value="all">Todas las categorías</MenuItem>
                    <MenuItem value="contaminacion_agua">Contaminación de Agua</MenuItem>
                    <MenuItem value="contaminacion_aire">Contaminación de Aire</MenuItem>
                    <MenuItem value="deforestacion">Deforestación</MenuItem>
                    <MenuItem value="manejo_residuos">Manejo de Residuos</MenuItem>
                    <MenuItem value="ruido_excesivo">Ruido Excesivo</MenuItem>
                    <MenuItem value="contaminacion_suelo">Contaminación de Suelo</MenuItem>
                    <MenuItem value="otros">Otros</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Límite</InputLabel>
                  <Select
                    value={filters.limite.toString()}
                    onChange={(e) => handleFilterChange('limite', e.target.value)}
                    label="Límite"
                  >
                    <MenuItem value="5">5 resultados</MenuItem>
                    <MenuItem value="10">10 resultados</MenuItem>
                    <MenuItem value="20">20 resultados</MenuItem>
                    <MenuItem value="50">50 resultados</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                  <MuiButton
                    onClick={applyFilters}
                    variant="contained"
                    sx={{
                      flex: 1,
                      bgcolor: 'hsl(var(--primary))',
                      color: 'hsl(var(--primary-foreground))',
                      '&:hover': {
                        bgcolor: 'hsl(var(--primary) / 0.9)'
                      }
                    }}
                  >
                    Aplicar
                  </MuiButton>
                  <MuiButton
                    onClick={clearFilters}
                    variant="outlined"
                    sx={{
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      '&:hover': {
                        bgcolor: 'hsl(var(--accent))',
                        borderColor: 'hsl(var(--accent-foreground))'
                      }
                    }}
                  >
                    Limpiar
                  </MuiButton>
                </Box>
              </Grid>
            </Grid>

            {data?.filtros_aplicados && Object.keys(data.filtros_aplicados).length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                <span>Filtros activos:</span>
                {data.filtros_aplicados.zona && (
                  <Chip label={`Zona: ${data.filtros_aplicados.zona}`} size="small" variant="outlined" />
                )}
                {data.filtros_aplicados.categoria && (
                  <Chip 
                    label={`Categoría: ${categoriaMapping[data.filtros_aplicados.categoria] || data.filtros_aplicados.categoria}`}
                    size="small" 
                    variant="outlined" 
                  />
                )}
                <Chip label={`Límite: ${data.filtros_aplicados.limite}`} size="small" variant="outlined" />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Box sx={{ '& > *': { mb: 3 } }}>
          {data && data.denuncias.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent>
                <Filter style={{ width: 48, height: 48, margin: '0 auto 16px', color: 'hsl(var(--muted-foreground))', opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'hsl(var(--foreground))' }}>
                  No se encontraron denuncias
                </Typography>
                <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
                  Intenta ajustar los filtros de búsqueda
                </Typography>
              </CardContent>
            </Card>
          ) : (
            data?.denuncias.map((denuncia: DenunciaResumen) => (
              <Card 
                key={denuncia.id} 
                sx={{ 
                  bgcolor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {getCrimeTypeBadge(denuncia.tipo_problema)}
                        {getStatusBadge(denuncia.estado)}
                        <Chip
                          icon={getPriorityIcon(denuncia.prioridad)}
                          label={`Prioridad ${denuncia.prioridad}`}
                          size="small"
                          color={getPriorityColor(denuncia.prioridad) as any}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
                        {denuncia.descripcion_corta}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: 'hsl(var(--foreground))', mb: 2 }}>
                    {denuncia.descripcion_completa}
                  </Typography>
                  
                  <Box sx={{ '& > *': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                      <MapPin style={{ width: 16, height: 16 }} />
                      <span>{denuncia.ubicacion}</span>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                      <CalendarDays style={{ width: 16, height: 16 }} />
                      <span>{denuncia.fecha} ({denuncia.fecha_relativa})</span>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {denuncia.imagen && (
                          <Chip label="📷 Con evidencia" size="small" variant="outlined" />
                        )}
                        <Chip 
                          label={`${denuncia.dias_transcurridos} días transcurridos`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                        ID: #{denuncia.id.toString().padStart(4, '0')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Results count */}
        {data && data.denuncias.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
              Mostrando {data.denuncias.length} denuncias del periodo: {data.resumen.periodo}
            </Typography>
          </Box>
        )}

        {/* Quick Actions */}
        <Box sx={{ 
          mt: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          justifyContent: 'center' 
        }}>
          <MuiButton
            component={Link}
            to="/calendario-semanal"
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              '&:hover': {
                bgcolor: 'hsl(var(--accent))',
                borderColor: 'hsl(var(--accent-foreground))'
              }
            }}
          >
            <Calendar style={{ width: 16, height: 16 }} />
            <span>Ver Calendario Semanal</span>
          </MuiButton>
          <MuiButton
            component={Link}
            to="/reportes"
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              '&:hover': {
                bgcolor: 'hsl(var(--accent))',
                borderColor: 'hsl(var(--accent-foreground))'
              }
            }}
          >
            <BarChart3 style={{ width: 16, height: 16 }} />
            <span>Ver Reportes Completos</span>
          </MuiButton>
        </Box>

        {/* Toast/Snackbar */}
        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Dashboard;