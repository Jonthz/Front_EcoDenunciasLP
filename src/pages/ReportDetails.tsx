import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button as MuiButton,
  TextField,
  Skeleton,
  Grid,
  CircularProgress,
  Divider
} from "@mui/material";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, MapPin, Calendar, MessageSquare, Send, User, Image as ImageIcon, History } from "lucide-react";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import StatusBadge from "@/components/ui/status-badge";
import { 
  fetchDenuncia, 
  fetchComentarios, 
  crearComentario, 
  fetchHistorial,
  DenunciaDetalle, 
  ComentariosResponse, 
  Comentario,
  HistorialEstado,
  ApiResponse 
} from "@/services/apiService";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [denuncia, setDenuncia] = useState<DenunciaDetalle | null>(null);
  const [comentarios, setComentarios] = useState<ComentariosResponse | null>(null);
  const [historial, setHistorial] = useState<HistorialEstado[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComentarios, setLoadingComentarios] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const [newComment, setNewComment] = useState({
    nombre_usuario: "",
    comentario: ""
  });

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response: ApiResponse<DenunciaDetalle> = await fetchDenuncia(parseInt(id));
      
      if (response.success && response.data) {
        setDenuncia(response.data);
      } else {
        toast({
          title: "Error al cargar denuncia",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo cargar la denuncia",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComentariosData = async (pagina: number = 1) => {
    if (!id) return;
    
    setLoadingComentarios(true);
    try {
      const response: ApiResponse<ComentariosResponse> = await fetchComentarios(parseInt(id), pagina);
      
      if (response.success && response.data) {
        setComentarios(response.data);
      } else {
        console.error("Error al cargar comentarios:", response.message);
      }
    } catch (error) {
      console.error("Error de conexión al cargar comentarios");
    } finally {
      setLoadingComentarios(false);
    }
  };

  const fetchHistorialData = async () => {
    if (!id) return;
    
    setLoadingHistorial(true);
    try {
      const response = await fetchHistorial(parseInt(id));
      
      if (response.success && response.data) {
        setHistorial(response.data.historial);
      } else {
        console.error("Error al cargar historial:", response.message);
      }
    } catch (error) {
      console.error("Error de conexión al cargar historial");
    } finally {
      setLoadingHistorial(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !newComment.nombre_usuario.trim() || !newComment.comentario.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa tu nombre y comentario",
        variant: "destructive"
      });
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await crearComentario({
        denuncia_id: parseInt(id),
        nombre_usuario: newComment.nombre_usuario.trim(),
        comentario: newComment.comentario.trim()
      });

      if (response.success) {
        toast({
          title: "Comentario enviado",
          description: "Tu comentario ha sido registrado exitosamente"
        });
        
        // Reset form and reload comments
        setNewComment({ nombre_usuario: "", comentario: "" });
        fetchComentariosData();
        
        // Update report data to get new comment count
        fetchData();
      } else {
        toast({
          title: "Error al enviar comentario",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar el comentario",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
      fetchComentariosData();
      fetchHistorialData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
        <Container maxWidth="lg" sx={{ px: 2 }}>
          <Box sx={{ mb: 3 }}>
            <MuiButton 
              variant="outlined" 
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
              sx={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  bgcolor: 'hsl(var(--accent))',
                  borderColor: 'hsl(var(--accent-foreground))'
                }
              }}
            >
              Volver
            </MuiButton>
          </Box>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="75%" height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="66%" height={16} />
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" width="50%" height={24} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={96} />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" width="50%" height={24} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={96} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!denuncia) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
        <Container maxWidth="lg" sx={{ px: 2 }}>
          <Box sx={{ mb: 3 }}>
            <MuiButton 
              variant="outlined" 
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
              sx={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  bgcolor: 'hsl(var(--accent))',
                  borderColor: 'hsl(var(--accent-foreground))'
                }
              }}
            >
              Volver
            </MuiButton>
          </Box>

          <Card sx={{ 
            textAlign: 'center', 
            py: 6, 
            bgcolor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                Denuncia no encontrada
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
      <Container maxWidth="lg" sx={{ px: 2 }}>
        {/* Navigation */}
        <Box sx={{ mb: 3 }}>
          <MuiButton 
            variant="outlined" 
            onClick={() => navigate(-1)}
            startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
            sx={{
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
              '&:hover': {
                bgcolor: 'hsl(var(--accent))',
                borderColor: 'hsl(var(--accent-foreground))'
              }
            }}
          >
            Volver
          </MuiButton>
        </Box>

        {/* Report Details */}
        <Card sx={{ mb: 3, bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'grid', gap: 1.5, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <CrimeTypeBadge type={denuncia.tipo_problema as any} />
                  <StatusBadge status={denuncia.estado as any} />
                </Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold',
                  color: 'hsl(var(--foreground))'
                }}>
                  Denuncia #{denuncia.id.toString().padStart(4, '0')}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                  Descripción
                </Typography>
                <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
                  {denuncia.descripcion}
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
                      <Typography variant="body2">
                        {denuncia.ubicacion_direccion}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
                      <Typography variant="body2">
                        Reportado el {new Date(denuncia.fecha_creacion).toLocaleDateString('es-ES')}
                        {denuncia.dias_transcurridos > 0 && (
                          <Box component="span" sx={{ color: 'hsl(var(--muted-foreground))', ml: 1 }}>
                            (hace {denuncia.dias_transcurridos} días)
                          </Box>
                        )}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MessageSquare style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
                      <Typography variant="body2">
                        {denuncia.total_comentarios} comentarios
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {(denuncia.ubicacion_lat && denuncia.ubicacion_lng) && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: 'hsl(var(--foreground))' }}>
                        Coordenadas
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                        Lat: {denuncia.ubicacion_lat}, Lng: {denuncia.ubicacion_lng}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {denuncia.imagen_url && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ImageIcon style={{ width: 16, height: 16 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                      Evidencia fotográfica
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: 2, 
                    p: 1, 
                    display: 'inline-block' 
                  }}>
                    <Box
                      component="img"
                      src={denuncia.imagen_url}
                      alt="Evidencia de la denuncia"
                      sx={{
                        maxWidth: 384,
                        maxHeight: 256,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}>
          {/* Comments Section */}
          <Box>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MessageSquare style={{ width: 20, height: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                    Comentarios
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mb: 3 }}>
                  {comentarios?.estadisticas.total_comentarios || 0} comentarios
                </Typography>
                
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {/* Comments List */}
                  {loadingComentarios ? (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {[...Array(3)].map((_, i) => (
                        <Box key={i} sx={{ display: 'grid', gap: 1 }}>
                          <Skeleton variant="rectangular" width="33%" height={16} />
                          <Skeleton variant="rectangular" width="100%" height={48} />
                        </Box>
                      ))}
                    </Box>
                  ) : comentarios && comentarios.comentarios.length > 0 ? (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      {comentarios.comentarios.map((comentario: Comentario) => (
                        <Box 
                          key={comentario.id} 
                          sx={{ 
                            borderLeft: '2px solid hsl(var(--primary) / 0.2)', 
                            pl: 2, 
                            display: 'grid', 
                            gap: 1 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <User style={{ width: 12, height: 12 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                              {comentario.nombre_usuario}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                              •
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                              {comentario.tiempo_transcurrido}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {comentario.comentario}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography sx={{ 
                      textAlign: 'center', 
                      color: 'hsl(var(--muted-foreground))', 
                      py: 3
                    }}>
                      No hay comentarios aún. ¡Sé el primero en comentar!
                    </Typography>
                  )}

                  
                  {/* Comment Form */}
                  <Box 
                    component="form" 
                    onSubmit={handleSubmitComment} 
                    sx={{ 
                      display: 'grid', 
                      gap: 2, 
                      borderTop: '1px solid hsl(var(--border))', 
                      pt: 2 
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                      Agregar comentario
                    </Typography>
                    
                    <TextField
                      fullWidth
                      placeholder="Tu nombre"
                      value={newComment.nombre_usuario}
                      onChange={(e) => setNewComment(prev => ({ ...prev, nombre_usuario: e.target.value }))}
                      required
                      size="small"
                    />
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Escribe tu comentario..."
                      value={newComment.comentario}
                      onChange={(e) => setNewComment(prev => ({ ...prev, comentario: e.target.value }))}
                      required
                    />
                    
                    <MuiButton 
                      type="submit" 
                      variant="contained"
                      fullWidth
                      disabled={submittingComment}
                      sx={{
                        bgcolor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' },
                        '&:disabled': {
                          bgcolor: 'hsl(var(--muted))',
                          color: 'hsl(var(--muted-foreground))'
                        }
                      }}
                    >
                      {submittingComment ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: 'inherit' }} />
                          <span>Enviando...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Send style={{ width: 16, height: 16 }} />
                          <span>Enviar comentario</span>
                        </Box>
                      )}
                    </MuiButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* History Section */}
          <Box>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <History style={{ width: 20, height: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                    Historial de cambios
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mb: 3 }}>
                  Seguimiento de los cambios de estado
                </Typography>
                
                {loadingHistorial ? (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {[...Array(3)].map((_, i) => (
                      <Box key={i} sx={{ display: 'grid', gap: 1 }}>
                        <Skeleton variant="rectangular" width="50%" height={16} />
                        <Skeleton variant="rectangular" width="100%" height={32} />
                      </Box>
                    ))}
                  </Box>
                ) : historial.length > 0 ? (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {historial.map((entry, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          borderLeft: '2px solid hsl(var(--primary) / 0.2)', 
                          pl: 2, 
                          display: 'grid', 
                          gap: 1 
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <StatusBadge status={entry.estado as any} />
                          <Typography variant="caption" sx={{ 
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '0.75rem'
                          }}>
                            {new Date(entry.fecha).toLocaleDateString('es-ES')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'grid', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ 
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '0.875rem'
                          }}>
                            Por: <Box component="span" sx={{ fontWeight: 500 }}>{entry.usuario}</Box>
                          </Typography>
                          
                          {entry.notas && (
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                              {entry.notas}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ 
                    textAlign: 'center', 
                    color: 'hsl(var(--muted-foreground))', 
                    py: 3
                  }}>
                    No hay historial de cambios disponible
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportDetails;