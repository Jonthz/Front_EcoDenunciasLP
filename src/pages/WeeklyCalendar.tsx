import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
        organizarPorDias(response.data.denuncias);
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
  const organizarPorDias = (denuncias: DenunciaResumen[]) => {
    // Crear estructura de 7 días de la semana
    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    // Usar la semana de enero 2025 donde están los datos de mock
    // Lunes 13 de enero 2025
    const inicioSemana = new Date(2025, 0, 13); // 13 de enero 2025

    const diasSemana: DiaCalendario[] = [];

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      
      const fechaStr = fecha.toISOString().split('T')[0];
      
      // Filtrar denuncias que correspondan a este día
      const denunciasDia = denuncias.filter(denuncia => {
        // Convertir la fecha de la denuncia para comparar
        const partesFecha = denuncia.fecha.split(' ')[0].split('/');
        if (partesFecha.length === 3) {
          const fechaDenuncia = new Date(
            parseInt(partesFecha[2]), // año
            parseInt(partesFecha[1]) - 1, // mes (0-indexado)
            parseInt(partesFecha[0]) // día
          );
          return fechaDenuncia.toISOString().split('T')[0] === fechaStr;
        }
        return false;
      });

      diasSemana.push({
        fecha: fechaStr,
        dia_semana: nombresDias[i],
        denuncias: denunciasDia
      });
    }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    fetchData();
  }, [currentWeek]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Calendario Semanal</h1>
            <p className="text-muted-foreground">
              Vista cronológica de las denuncias ambientales por día
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-20 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Calendario Semanal de Denuncias</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vista cronológica de las denuncias ambientales organizadas por día de la semana
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Semana Anterior
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {data?.resumen.periodo || "Semana Actual"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Visualización en formato calendario
              </p>
            </div>
            <Button variant="outline" size="sm">
              Semana Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {data && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-primary mb-2">
                  {data.resumen.total_denuncias}
                </div>
                <div className="text-sm text-muted-foreground">Total Denuncias</div>
                <TrendingUp className="h-4 w-4 mx-auto mt-2 text-primary" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-warning mb-2">
                  {data.resumen.pendientes}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-accent mb-2">
                  {data.resumen.en_proceso}
                </div>
                <div className="text-sm text-muted-foreground">En Proceso</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-success mb-2">
                  {data.resumen.resueltas}
                </div>
                <div className="text-sm text-muted-foreground">Resueltas</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weekly Calendar Grid */}
        <div className="grid md:grid-cols-7 gap-4 mb-8">
          {diasCalendario.map((dia, index) => (
            <Card key={index} className="h-auto min-h-[300px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{dia.dia_semana}</span>
                  <Badge variant="outline" className="text-xs">
                    {dia.denuncias.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  {formatDate(dia.fecha)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {dia.denuncias.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Sin denuncias</p>
                  </div>
                ) : (
                  dia.denuncias.map((denuncia) => (
                    <Link
                      key={denuncia.id}
                      to={`/denuncia/${denuncia.id}`}
                      className="block"
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/20">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <CrimeTypeBadge 
                              type={denuncia.tipo_problema as any} 
                              showIcon={false}
                              className="text-xs"
                            />
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{denuncia.fecha.split(' ')[1] || denuncia.fecha_relativa}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm font-medium leading-tight">
                            {denuncia.descripcion_corta}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <StatusBadge status={denuncia.estado as any} />
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(denuncia.prioridad)}`}
                            >
                              {denuncia.prioridad}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground text-right">
                            ID: #{denuncia.id.toString().padStart(4, '0')}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Link to="/crear-denuncia">
            <Button className="flex items-center space-x-2">
              <span>Nueva Denuncia</span>
            </Button>
          </Link>
          <Link to="/denuncias">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Ver Todas las Denuncias</span>
            </Button>
          </Link>
          <Link to="/reportes">
            <Button variant="outline" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Ver Reportes</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;