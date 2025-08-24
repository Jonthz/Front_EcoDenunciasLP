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
  CircularProgress,
  Skeleton
} from "@mui/material";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Calendar, MapPin, MessageSquare, Save, Eye, User, History } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import { 
  fetchResumenSemanal, 
  actualizarEstado, 
  fetchHistorial,
  ResumenSemanal, 
  DenunciaResumen,
  HistorialEstado,
  ApiResponse 
} from "@/services/apiService";

const AdminPanel = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ResumenSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<'pendiente' | 'en_proceso' | 'resuelta'>('pendiente');
  const [usuarioResponsable, setUsuarioResponsable] = useState("");
  const [historial, setHistorial] = useState<HistorialEstado[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: ApiResponse<ResumenSemanal> = await fetchResumenSemanal({ limite: 50 });
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
         console.error("❌ Error al cargar denuncias");
          console.error("Mensaje:", response.message);
          console.error("Success:", response.success);
          console.error("Data:", response.data);
          console.error("Respuesta completa:", response);
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

  const fetchHistorialData = async (denunciaId: number) => {
    setLoadingHistorial(true);
    try {
      const response = await fetchHistorial(denunciaId);
      
      if (response.success && response.data) {
        setHistorial(response.data.historial);
      } else {
        console.error("Error al cargar historial:", response.message);
        setHistorial([]);
      }
    } catch (error) {
      console.error("Error de conexión al cargar historial");
      setHistorial([]);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleSelectReport = (reportId: number) => {
    setSelectedReport(reportId);
    const report = data?.denuncias.find(r => r.id === reportId);
    if (report) {
      setAdminNotes("");
      setNewStatus(report.estado as 'pendiente' | 'en_proceso' | 'resuelta');
      setUsuarioResponsable("");
      fetchHistorialData(reportId);
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    setUpdating(true);
    try {
      const response = await actualizarEstado(selectedReport, {
        estado: newStatus,
        notas: adminNotes || undefined,
        usuario_responsable: usuarioResponsable || undefined
      });

      if (response.success) {
        toast({
          title: "Estado actualizado",
          description: "El estado de la denuncia ha sido actualizado exitosamente.",
        });
        
        // Reload data and historial
        await fetchData();
        await fetchHistorialData(selectedReport);
        
        // Clear form
        setAdminNotes("");
        setUsuarioResponsable("");
      } else {
        toast({
          title: "Error al actualizar",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedReportData = data?.denuncias.find(r => r.id === selectedReport);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'hsl(var(--primary) / 0.1)', 
              borderRadius: '50%'
            }}>
              <Shield style={{ width: 40, height: 40, color: 'hsl(var(--primary))' }} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: 'hsl(var(--foreground))' }}>
            Panel de Administración
          </Typography>
          <Typography variant="h6" sx={{ color: 'hsl(var(--muted-foreground))', maxWidth: '56rem', mx: 'auto', lineHeight: 1.6 }}>
            Gestiona y actualiza el estado de las denuncias ambientales reportadas por la comunidad.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4, lg: 6 }} sx={{ justifyContent: 'center' }}>
          {/* Lista de Denuncias */}
          <Grid xs={12} lg={6} xl={5}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', height: 'fit-content' }}>
              <CardContent sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
                  Denuncias para Gestión
                </Typography>
                <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', mb: 4 }}>
                  Selecciona una denuncia para revisar y actualizar su estado
                </Typography>
                <Box sx={{ '& > *': { mb: 2 } }}>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <Card key={i} sx={{ p: 2, border: '1px solid hsl(var(--border))' }}>
                        <Box sx={{ '& > *': { mb: 1.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Skeleton width={96} height={24} />
                            <Skeleton width={80} height={24} />
                          </Box>
                          <Skeleton width="75%" height={20} />
                          <Skeleton width="50%" height={16} />
                        </Box>
                      </Card>
                    ))
                  ) : data?.denuncias.map((report: DenunciaResumen) => (
                    <Card
                      key={report.id}
                      sx={{
                        p: 2,
                        border: selectedReport === report.id ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                        bgcolor: selectedReport === report.id ? 'hsl(var(--primary) / 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'hsl(var(--muted) / 0.5)'
                        }
                      }}
                      onClick={() => handleSelectReport(report.id)}
                    >
                      <Box sx={{ '& > *': { mb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CrimeTypeBadge type={report.tipo_problema as any} />
                            <StatusBadge status={report.estado as any} />
                          </Box>
                          <Chip 
                            label={`Prioridad ${report.prioridad}`}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              color: report.prioridad === 'alta' ? 'hsl(var(--destructive))' : 
                                     report.prioridad === 'media' ? 'hsl(var(--warning))' : 
                                     'hsl(var(--muted-foreground))',
                              borderColor: report.prioridad === 'alta' ? 'hsl(var(--destructive))' : 
                                          report.prioridad === 'media' ? 'hsl(var(--warning))' : 
                                          'hsl(var(--muted-foreground))'
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                          {report.descripcion_corta}
                        </Typography>
                        
                        <Box sx={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', '& > *': { mb: 0.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Calendar style={{ width: 12, height: 12 }} />
                            <span>{report.fecha} ({report.fecha_relativa})</span>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin style={{ width: 12, height: 12 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.ubicacion}</span>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                          <span>
                            {report.dias_transcurridos} días transcurridos
                          </span>
                          <span>
                            ID: #{report.id.toString().padStart(4, '0')}
                          </span>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de Detalles */}
          <Grid xs={12} lg={6} xl={7}>
            {selectedReportData ? (
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', height: 'fit-content' }}>
                <CardContent sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Eye style={{ width: 24, height: 24 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                      Detalles de la Denuncia
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', mb: 4 }}>
                    ID: #{selectedReportData.id.toString().padStart(4, '0')}
                  </Typography>
                  
                  {/* Información básica */}
                  <Box sx={{ '& > *': { mb: 2 } }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                        Descripción Corta
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'hsl(var(--foreground))' }}>
                        {selectedReportData.descripcion_corta}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                        Descripción Completa
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                        {selectedReportData.descripcion_completa}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                        Ubicación
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                        {selectedReportData.ubicacion}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid xs={12} md={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                          Tipo
                        </Typography>
                        <CrimeTypeBadge type={selectedReportData.tipo_problema as any} />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                          Estado Actual
                        </Typography>
                        <StatusBadge status={selectedReportData.estado as any} />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                          Prioridad
                        </Typography>
                        <Chip
                          label={selectedReportData.prioridad}
                          size="small"
                          sx={{
                            color: selectedReportData.prioridad === 'alta' ? 'hsl(var(--destructive))' :
                                   selectedReportData.prioridad === 'media' ? 'hsl(var(--warning))' :
                                   'hsl(var(--muted-foreground))',
                            bgcolor: selectedReportData.prioridad === 'alta' ? 'hsl(var(--destructive) / 0.1)' :
                                     selectedReportData.prioridad === 'media' ? 'hsl(var(--warning) / 0.1)' :
                                     'hsl(var(--muted) / 0.3)'
                          }}
                        />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                          Fecha
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                          {selectedReportData.fecha}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Actualizar Estado */}
                  <Box sx={{ pt: 2, mt: 2 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <MessageSquare style={{ width: 16, height: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                        Gestión Administrativa
                      </Typography>
                    </Box>
                    
                    <Box sx={{ '& > *': { mb: 2 } }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Cambiar Estado</InputLabel>
                        <Select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as 'pendiente' | 'en_proceso' | 'resuelta')}
                          label="Cambiar Estado"
                        >
                          <MenuItem value="pendiente">Pendiente</MenuItem>
                          <MenuItem value="en_proceso">En Proceso</MenuItem>
                          <MenuItem value="resuelta">Resuelta</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        size="small"
                        label="Usuario Responsable"
                        placeholder="Nombre del operador o responsable"
                        value={usuarioResponsable}
                        onChange={(e) => setUsuarioResponsable(e.target.value)}
                      />
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        label="Notas Administrativas"
                        placeholder="Agrega comentarios sobre el estado de la investigación, acciones tomadas, etc."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                    </Box>
                    
                    <MuiButton
                      onClick={handleUpdateReport}
                      disabled={updating}
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        bgcolor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'hsl(var(--primary) / 0.9)'
                        },
                        '&:disabled': {
                          bgcolor: 'hsl(var(--muted))',
                          color: 'hsl(var(--muted-foreground))'
                        }
                      }}
                    >
                      {updating ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: 'inherit' }} />
                          <span>Actualizando...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Save style={{ width: 16, height: 16 }} />
                          <span>Guardar Cambios</span>
                        </Box>
                      )}
                    </MuiButton>

                    {/* Historial section */}
                    <Box sx={{ pt: 2, mt: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <History style={{ width: 16, height: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                          Historial de Cambios
                        </Typography>
                      </Box>
                      
                      {loadingHistorial ? (
                        <Box sx={{ '& > *': { mb: 1 } }}>
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} height={64} />
                          ))}
                        </Box>
                      ) : historial.length > 0 ? (
                        <Box sx={{ maxHeight: 200, overflowY: 'auto', '& > *': { mb: 1.5 } }}>
                          {historial.map((entry, index) => (
                            <Box key={index} sx={{ borderLeft: '2px solid hsl(var(--primary) / 0.2)', pl: 1.5, '& > *': { mb: 0.5 } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <StatusBadge status={entry.estado as any} />
                                <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                                  {new Date(entry.fecha).toLocaleDateString('es-ES')}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ fontSize: '0.875rem', '& > *': { mb: 0.5 } }}>
                                <Box sx={{ color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <User style={{ width: 12, height: 12 }} />
                                  <span>Por: <Box component="span" sx={{ fontWeight: 500 }}>{entry.usuario}</Box></span>
                                </Box>
                                
                                {entry.notas && (
                                  <Typography variant="body2" sx={{ 
                                    bgcolor: 'hsl(var(--muted) / 0.3)', 
                                    p: 1, 
                                    borderRadius: 1, 
                                    color: 'hsl(var(--muted-foreground))' 
                                  }}>
                                    {entry.notas}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))', py: 2 }}>
                          No hay historial disponible
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', height: 'fit-content' }}>
                <CardContent sx={{ textAlign: 'center', py: { xs: 6, md: 8, lg: 10 } }}>
                  <Shield style={{ width: 64, height: 64, margin: '0 auto 24px', color: 'hsl(var(--muted-foreground))', opacity: 0.5 }} />
                  <Typography variant="h5" sx={{ fontWeight: 500, mb: 2, color: 'hsl(var(--foreground))' }}>
                    Selecciona una denuncia
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', maxWidth: '24rem', mx: 'auto' }}>
                    Elige una denuncia de la lista para ver sus detalles y actualizar su estado.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Estadísticas rápidas */}
        <Grid container spacing={{ xs: 2, md: 3, lg: 4 }} sx={{ mt: { xs: 4, md: 6, lg: 8 }, justifyContent: 'center', maxWidth: '800px', mx: 'auto' }}>
          <Grid xs={12} sm={4}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 } }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--warning))', mb: 1.5 }}>
                  {loading ? '...' : data?.resumen.pendientes || 0}
                </Typography>
                <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={12} sm={4}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 } }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--primary))', mb: 1.5 }}>
                  {loading ? '...' : data?.resumen.en_proceso || 0}
                </Typography>
                <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                  En Proceso
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid xs={12} sm={4}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 } }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'hsl(var(--success))', mb: 1.5 }}>
                  {loading ? '...' : data?.resumen.resueltas || 0}
                </Typography>
                <Typography variant="body1" sx={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                  Resueltas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminPanel;