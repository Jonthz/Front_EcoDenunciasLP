import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button as MuiButton,
  Chip,
  Skeleton,
  CardHeader
} from "@mui/material";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, ChevronLeft, ChevronRight, Clock, TrendingUp, BarChart3 } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import { fetchResumenSemanal, ResumenSemanal, DenunciaResumen, ApiResponse } from "@/services/apiService";

interface DiaCalendario {
  fecha: string;
  dia_semana: string;
  denuncias: DenunciaResumen[];
}

const WeeklyCalendar = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ResumenSemanal | null>(null);
  const [diasCalendario, setDiasCalendario] = useState<DiaCalendario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usar la misma API del resumen semanal con más denuncias
      const response: ApiResponse<ResumenSemanal> = await fetchResumenSemanal({ limite: 50 });
      
      if (response.success && response.data) {
        setData(response.data);
        // Organizar las denuncias por día
        organizarPorDias(response.data.denuncias, currentWeek);
      } else {
        toast({
          title: "Error al cargar calendario",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo cargar el calendario semanal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

 // Función para organizar las denuncias por días de la semana
const organizarPorDias = (denuncias: DenunciaResumen[], fechaReferencia: Date) => {
  console.log('📅 Iniciando organización por días. Denuncias recibidas:', denuncias.length);
  
  // Crear estructura de 7 días de la semana
  const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Usar la semana de enero 2025 donde están los datos de mock
  // Usar la fecha actual (24 agosto 2025) y calcular el inicio de esa semana
  const hoy = new Date(fechaReferencia);
  const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, etc.
  const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana; // Calcular cuántos días restar para llegar al lunes
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() + diasParaLunes);

  const diasSemana: DiaCalendario[] = [];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + i);
    
    const fechaStr = fecha.toLocaleDateString('sv-SE'); // Formato YYYY-MM-DD
    console.log(`📅 Procesando día ${i}: ${nombresDias[i]} - ${fecha.toLocaleDateString('es-ES')} (ISO: ${fechaStr})`);
    
    // Filtrar denuncias que correspondan a este día
    const denunciasDia = denuncias.filter(denuncia => {
      // Convertir la fecha de la denuncia para comparar
      const partesFecha = denuncia.fecha.split(' ')[0].split('/');
      
      if (partesFecha.length === 3) {
        const dia = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]) - 1; // mes 0-indexado
        const año = parseInt(partesFecha[2]);
        
        // Validar que los valores sean números válidos
        if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
          const fechaDenuncia = new Date(año, mes, dia);
          const fechaDenunciaStr = fechaDenuncia.toLocaleDateString('sv-SE');
          
          console.log(`   🔍 Comparando denuncia #${denuncia.id}: ${denuncia.fecha} -> ${fechaDenunciaStr} === ${fechaStr}`, fechaDenunciaStr === fechaStr);
          
          return fechaDenunciaStr === fechaStr;
        } else {
          console.warn(`   ⚠️  Fecha inválida en denuncia #${denuncia.id}: ${denuncia.fecha}`);
        }
      } else {
        console.warn(`   ⚠️  Formato de fecha incorrecto en denuncia #${denuncia.id}: ${denuncia.fecha}`);
      }
      
      return false;
    });

    console.log(`   ✅ ${nombresDias[i]}: ${denunciasDia.length} denuncias encontradas`);

    diasSemana.push({
      fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dia_semana: nombresDias[i],
      denuncias: denunciasDia
    });
  }

  console.log('📅 Resultado final - días creados:', diasSemana.length);
  console.log('📅 Resumen por día:', diasSemana.map(d => `${d.dia_semana}: ${d.denuncias.length}`));
  
  setDiasCalendario(diasSemana);
};

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-destructive";
      case "media": return "text-warning";
      case "baja": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };
  const inicializarDiasVacios = (fechaReferencia: Date) => {
  const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
 const hoy = new Date(fechaReferencia);
  const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, etc.
  const diasParaLunes = diaSemana === 0 ? -6 : 1 - diaSemana; // Calcular cuántos días restar para llegar al lunes
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() + diasParaLunes);

  const diasVacios: DiaCalendario[] = [];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(inicioSemana.getDate() + i);

    diasVacios.push({
      fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      dia_semana: nombresDias[i],
      denuncias: []
    });
  }

  return diasVacios;
};
const cambiarSemana = (direccion: 'anterior' | 'siguiente') => {
  const nuevaSemana = new Date(currentWeek);
  if (direccion === 'anterior') {
    nuevaSemana.setDate(nuevaSemana.getDate() - 7);
  } else {
    nuevaSemana.setDate(nuevaSemana.getDate() + 7);
  }
  setCurrentWeek(nuevaSemana);
};

  useEffect(() => {
    fetchData();
  }, [currentWeek]);
  const diasParaMostrar = diasCalendario.length > 0 ? diasCalendario : inicializarDiasVacios(currentWeek);
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
        <Container maxWidth="xl" sx={{ px: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
              Calendario Semanal
            </Typography>
            <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
              Vista cronológica de las denuncias ambientales por día
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            {[...Array(4)].map((_, i) => (
              <Card key={i} sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                  <Skeleton variant="rectangular" width={64} height={32} sx={{ mb: 1, mx: 'auto' }} />
                  <Skeleton variant="rectangular" width={80} height={16} sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' },
            gap: 2
          }}>
            {[...Array(7)].map((_, i) => (
              <Card key={i} sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <CardContent sx={{ p: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={64} />
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
      <Container maxWidth="xl" sx={{ px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'hsl(var(--primary) / 0.1)', 
              borderRadius: '50%'
            }}>
              <Calendar style={{ width: 32, height: 32, color: 'hsl(var(--primary))' }} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
            Calendario Semanal de Denuncias
          </Typography>
          <Typography sx={{ 
            color: 'hsl(var(--muted-foreground))', 
            maxWidth: '42rem', 
            mx: 'auto'
          }}>
            Vista cronológica de las denuncias ambientales organizadas por día de la semana
          </Typography>
        </Box>

        {/* Week Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiButton 
              variant="outlined" 
              size="small"
              startIcon={<ChevronLeft style={{ width: 16, height: 16 }} />}
              onClick={() => cambiarSemana('anterior')}
              sx={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  bgcolor: 'hsl(var(--accent))',
                  borderColor: 'hsl(var(--accent-foreground))'
                }
              }}
            >
              Semana Anterior
            </MuiButton>
            
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                {data?.resumen.periodo || "Semana Actual"}
              </Typography>
              <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                Visualización en formato calendario
              </Typography>
            </Box>
            
            <MuiButton 
              variant="outlined" 
              size="small"
              endIcon={<ChevronRight style={{ width: 16, height: 16 }} />}
              onClick={() => cambiarSemana('siguiente')}
              sx={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  bgcolor: 'hsl(var(--accent))',
                  borderColor: 'hsl(var(--accent-foreground))'
                }
              }}
            >
              Semana Siguiente
            </MuiButton>
          </Box>
        </Box>

        {/* Statistics Cards */}
        {data && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: 'hsl(var(--primary))', 
                  mb: 1 
                }}>
                  {data.resumen.total_denuncias}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'hsl(var(--muted-foreground))', 
                  mb: 1 
                }}>
                  Total Denuncias
                </Typography>
                <TrendingUp style={{ 
                  width: 16, 
                  height: 16, 
                  color: 'hsl(var(--primary))', 
                  margin: '0 auto' 
                }} />
              </CardContent>
            </Card>
            
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: 'hsl(var(--warning))', 
                  mb: 1 
                }}>
                  {data.resumen.pendientes}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'hsl(var(--muted-foreground))' 
                }}>
                  Pendientes
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: 'hsl(var(--accent))', 
                  mb: 1 
                }}>
                  {data.resumen.en_proceso}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'hsl(var(--muted-foreground))' 
                }}>
                  En Proceso
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
              <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold', 
                  color: 'hsl(var(--success))', 
                  mb: 1 
                }}>
                  {data.resumen.resueltas}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'hsl(var(--muted-foreground))' 
                }}>
                  Resueltas
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Weekly Calendar Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' },
          gap: 2,
          mb: 4
        }}>
          {diasParaMostrar.map((dia, index) => (
            <Card 
              key={index} 
              sx={{ 
                height: 'auto', 
                minHeight: 300,
                bgcolor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))' 
              }}
            >
              <CardHeader sx={{ pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: 'black !important',
                      backgroundColor: 'yellow !important',
                      lineHeight: 1.2,
                      padding: '4px'
                    }}>
                      {dia.dia_semana} {dia.fecha}
                    </Typography>
                  </Box>
                  <Chip 
                    variant="outlined" 
                    size="small"
                    label={dia.denuncias.length}
                    sx={{ 
                      fontSize: '0.75rem',
                      height: 20,
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--muted-foreground))'
                    }}
                  />
                </Box>
              </CardHeader>
              
              <CardContent sx={{ display: 'grid', gap: 1.5 }}>
                {dia.denuncias.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    color: 'hsl(var(--muted-foreground))' 
                  }}>
                    <BarChart3 style={{ 
                      width: 32, 
                      height: 32, 
                      margin: '0 auto 8px', 
                      opacity: 0.5 
                    }} />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Sin denuncias
                    </Typography>
                  </Box>
                ) : (
                  dia.denuncias.map((denuncia) => (
                    <Link
                      key={denuncia.id}
                      to={`/denuncia/${denuncia.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Card sx={{ 
                        transition: 'box-shadow 0.3s ease',
                        cursor: 'pointer',
                        borderLeft: '4px solid hsl(var(--primary) / 0.2)',
                        bgcolor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        '&:hover': {
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }
                      }}>
                        <CardContent sx={{ p: 1.5, display: 'grid', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <CrimeTypeBadge 
                              type={denuncia.tipo_problema as any} 
                              showIcon={false}
                              className="text-xs"
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Clock style={{ width: 12, height: 12, color: 'hsl(var(--muted-foreground))' }} />
                              <Typography variant="caption" sx={{ 
                                color: 'hsl(var(--muted-foreground))',
                                fontSize: '0.75rem'
                              }}>
                                {denuncia.fecha.split(' ')[1] || denuncia.fecha_relativa}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            lineHeight: 1.3,
                            color: 'hsl(var(--foreground))'
                          }}>
                            {denuncia.descripcion_corta}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusBadge status={denuncia.estado as any} />
                            <Chip 
                              variant="outlined" 
                              size="small"
                              label={denuncia.prioridad}
                              sx={{ 
                                fontSize: '0.75rem',
                                height: 20,
                                color: denuncia.prioridad === 'alta' ? 'hsl(var(--destructive))' :
                                       denuncia.prioridad === 'media' ? 'hsl(var(--warning))' :
                                       'hsl(var(--muted-foreground))',
                                borderColor: denuncia.prioridad === 'alta' ? 'hsl(var(--destructive))' :
                                            denuncia.prioridad === 'media' ? 'hsl(var(--warning))' :
                                            'hsl(var(--muted-foreground))'
                              }}
                            />
                          </Box>
                          
                          <Typography variant="caption" sx={{ 
                            textAlign: 'right',
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '0.75rem'
                          }}>
                            ID: #{denuncia.id.toString().padStart(4, '0')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Link to="/crear-denuncia" style={{ textDecoration: 'none' }}>
            <MuiButton 
              variant="contained"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                '&:hover': { bgcolor: 'hsl(var(--primary) / 0.9)' }
              }}
            >
              <span>Nueva Denuncia</span>
            </MuiButton>
          </Link>
          <Link to="/denuncias" style={{ textDecoration: 'none' }}>
            <MuiButton 
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
              <span>Ver Todas las Denuncias</span>
            </MuiButton>
          </Link>
          <Link to="/reportes" style={{ textDecoration: 'none' }}>
            <MuiButton 
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
              <span>Ver Reportes</span>
            </MuiButton>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default WeeklyCalendar;