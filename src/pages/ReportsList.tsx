import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button as MuiButton,
  Chip,
  Grid,
  InputAdornment,
  Skeleton,
  CircularProgress
} from "@mui/material";
import { Search, Filter, Calendar, MapPin, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StatusBadge from "@/components/ui/status-badge";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import { fetchResumenSemanal, categoriaMapping, ResumenSemanal, DenunciaResumen, ApiResponse } from "@/services/apiService";

const ReportsList = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ResumenSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filters, setFilters] = useState({
    zona: "",
    categoria: "",
    limite: 50
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: ApiResponse<ResumenSemanal> = await fetchResumenSemanal({
        zona: searchTerm || undefined,
        categoria: filterType === "all" ? undefined : filterType,
        limite: 50
      });
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        toast({
          title: "Error al cargar denuncias",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Client-side filtering for status (since API doesn't have status filter)
  const filteredReports = data?.denuncias.filter((report) => {
    const matchesSearch = !searchTerm || 
      report.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.descripcion_completa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || report.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
      <Container maxWidth="lg" sx={{ px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
            Catálogo de Denuncias
          </Typography>
          <Typography sx={{ 
            color: 'hsl(var(--muted-foreground))', 
            maxWidth: '42rem', 
            mx: 'auto',
            mb: 1
          }}>
            Explora todas las denuncias ambientales reportadas por la comunidad. 
            Utiliza los filtros para encontrar información específica.
          </Typography>
          {data && (
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
              Mostrando denuncias de los últimos 7 días
            </Typography>
          )}
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Filter style={{ width: 20, height: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                Filtros de Búsqueda
              </Typography>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar"
                  placeholder="Buscar en descripción o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Type Filter */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Delito</InputLabel>
                  <Select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Tipo de Delito"
                  >
                    <MenuItem value="all">Todos los tipos</MenuItem>
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

              {/* Status Filter */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Estado"
                  >
                    <MenuItem value="all">Todos los estados</MenuItem>
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="en_proceso">En Proceso</MenuItem>
                    <MenuItem value="resuelta">Resuelta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiButton 
                variant="contained"
                onClick={applyFilters}
                sx={{
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' }
                }}
              >
                Aplicar Filtros
              </MuiButton>
              <MuiButton 
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setTimeout(() => fetchData(), 100);
                }}
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
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
            {loading ? 'Cargando...' : `Mostrando ${filteredReports.length} denuncias`}
          </Typography>
        </Box>

        {/* Reports Grid */}
        <Box sx={{ display: 'grid', gap: 3 }}>
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <Card key={i} sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" width={96} height={24} />
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </Box>
                    <Skeleton variant="rectangular" width="75%" height={24} />
                    <Skeleton variant="rectangular" width="100%" height={64} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton variant="rectangular" width={128} height={16} />
                      <Skeleton variant="rectangular" width={64} height={16} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : filteredReports.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              py: 6, 
              bgcolor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))' 
            }}>
              <CardContent>
                <Box sx={{ color: 'hsl(var(--muted-foreground))' }}>
                  <Search style={{ 
                    width: 48, 
                    height: 48, 
                    margin: '0 auto 16px', 
                    opacity: 0.5 
                  }} />
                  <Typography variant="h6" sx={{ mb: 1, color: 'inherit' }}>
                    No se encontraron denuncias
                  </Typography>
                  <Typography sx={{ color: 'inherit' }}>
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report: DenunciaResumen) => (
              <Card 
                key={report.id} 
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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'grid', gap: 1, flex: 1, mr: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <CrimeTypeBadge type={report.tipo_problema as any} />
                        <StatusBadge status={report.estado as any} />
                        {report.prioridad && (
                          <Chip 
                            variant="outlined"
                            size="small"
                            label={`Prioridad ${report.prioridad}`}
                            sx={{
                              fontSize: '0.75rem',
                              height: 24,
                              color: report.prioridad === 'alta' ? 'hsl(var(--destructive))' :
                                     report.prioridad === 'media' ? 'hsl(var(--warning))' :
                                     'hsl(var(--muted-foreground))',
                              borderColor: report.prioridad === 'alta' ? 'hsl(var(--destructive))' :
                                          report.prioridad === 'media' ? 'hsl(var(--warning))' :
                                          'hsl(var(--muted-foreground))'
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold',
                        color: 'hsl(var(--foreground))'
                      }}>
                        {report.descripcion_corta}
                      </Typography>
                    </Box>
                    
                    <Link to={`/denuncia/${report.id}`} style={{ textDecoration: 'none' }}>
                      <MuiButton 
                        variant="outlined" 
                        size="small"
                        startIcon={<Eye style={{ width: 16, height: 16 }} />}
                        sx={{
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))',
                          '&:hover': {
                            bgcolor: 'hsl(var(--accent))',
                            borderColor: 'hsl(var(--accent-foreground))'
                          }
                        }}
                      >
                        Ver Detalles
                      </MuiButton>
                    </Link>
                  </Box>
                  
                  <Typography variant="body1" sx={{ 
                    color: 'hsl(var(--muted-foreground))', 
                    mb: 2,
                    fontSize: '1rem'
                  }}>
                    {report.descripcion_completa}
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin style={{ 
                        width: 16, 
                        height: 16, 
                        color: 'hsl(var(--muted-foreground))' 
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontSize: '0.875rem'
                      }}>
                        {report.ubicacion}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar style={{ 
                        width: 16, 
                        height: 16, 
                        color: 'hsl(var(--muted-foreground))' 
                      }} />
                      <Typography variant="body2" sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontSize: '0.875rem'
                      }}>
                        {report.fecha} ({report.fecha_relativa})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      pt: 1 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {report.imagen && (
                          <Chip 
                            variant="outlined" 
                            size="small"
                            label="📷 Con evidencia"
                            sx={{ 
                              fontSize: '0.75rem',
                              height: 24,
                              borderColor: 'hsl(var(--border))',
                              color: 'hsl(var(--muted-foreground))'
                            }}
                          />
                        )}
                        <Chip 
                          variant="outlined" 
                          size="small"
                          label={`${report.dias_transcurridos} días transcurridos`}
                          sx={{ 
                            fontSize: '0.75rem',
                            height: 24,
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--muted-foreground))'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="caption" sx={{ 
                        color: 'hsl(var(--muted-foreground))',
                        fontSize: '0.75rem'
                      }}>
                        ID: #{report.id.toString().padStart(4, '0')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Results summary */}
        {!loading && filteredReports.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ 
              color: 'hsl(var(--muted-foreground))',
              fontSize: '0.875rem'
            }}>
              Mostrando {filteredReports.length} denuncias de los últimos 7 días
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ReportsList;