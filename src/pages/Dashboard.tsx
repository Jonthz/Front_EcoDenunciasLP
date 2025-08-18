import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, MapPin, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock, Calendar, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import StatusBadge from "@/components/ui/status-badge";
import { fetchResumenSemanal, categoriaMapping, ResumenSemanal, DenunciaResumen, ApiResponse } from "@/services/apiService";

const Dashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ResumenSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    zona: "",
    categoria: "all",
    limite: 10
  });

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
        toast({
          title: "Error al cargar datos",
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
      case "alta": return "text-destructive";
      case "media": return "text-warning";
      case "baja": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return <AlertTriangle className="h-3 w-3" />;
      case "media": return <Clock className="h-3 w-3" />;
      case "baja": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Resumen Semanal</h1>
            <p className="text-muted-foreground">
              Dashboard de denuncias ambientales de los últimos 7 días
            </p>
          </div>

          {/* Loading skeleton */}
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

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24" />
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
          <h1 className="text-3xl font-bold mb-4">Resumen Semanal</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dashboard de denuncias ambientales de los últimos 7 días
          </p>
          {data && (
            <p className="text-sm text-muted-foreground mt-2">
              Última actualización: {data.resumen.fecha_consulta}
            </p>
          )}
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
                <Clock className="h-4 w-4 mx-auto mt-2 text-warning" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-accent mb-2">
                  {data.resumen.en_proceso}
                </div>
                <div className="text-sm text-muted-foreground">En Proceso</div>
                <AlertTriangle className="h-4 w-4 mx-auto mt-2 text-accent" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-success mb-2">
                  {data.resumen.resueltas}
                </div>
                <div className="text-sm text-muted-foreground">Resueltas</div>
                <CheckCircle className="h-4 w-4 mx-auto mt-2 text-success" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros de Búsqueda</span>
            </CardTitle>
            <CardDescription>
              Filtra las denuncias por zona, categoría y cantidad de resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zona</label>
                <Input
                  placeholder="Buscar por ubicación..."
                  value={filters.zona}
                  onChange={(e) => handleFilterChange('zona', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select value={filters.categoria} onValueChange={(value) => handleFilterChange('categoria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="contaminacion_agua">Contaminación de Agua</SelectItem>
                    <SelectItem value="contaminacion_aire">Contaminación de Aire</SelectItem>
                    <SelectItem value="deforestacion">Deforestación</SelectItem>
                    <SelectItem value="manejo_residuos">Manejo de Residuos</SelectItem>
                    <SelectItem value="ruido_excesivo">Ruido Excesivo</SelectItem>
                    <SelectItem value="contaminacion_suelo">Contaminación de Suelo</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Límite</label>
                <Select value={filters.limite.toString()} onValueChange={(value) => handleFilterChange('limite', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 resultados</SelectItem>
                    <SelectItem value="10">10 resultados</SelectItem>
                    <SelectItem value="20">20 resultados</SelectItem>
                    <SelectItem value="50">50 resultados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-end">
                <div className="flex space-x-2 w-full">
                  <Button onClick={applyFilters} className="flex-1">
                    Aplicar
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>

            {data?.filtros_aplicados && Object.keys(data.filtros_aplicados).length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Filtros activos:</span>
                {data.filtros_aplicados.zona && (
                  <Badge variant="outline">Zona: {data.filtros_aplicados.zona}</Badge>
                )}
                {data.filtros_aplicados.categoria && (
                  <Badge variant="outline">
                    Categoría: {categoriaMapping[data.filtros_aplicados.categoria] || data.filtros_aplicados.categoria}
                  </Badge>
                )}
                <Badge variant="outline">Límite: {data.filtros_aplicados.limite}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {data && data.denuncias.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No se encontraron denuncias</p>
                  <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            data?.denuncias.map((denuncia: DenunciaResumen) => (
              <Card key={denuncia.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <CrimeTypeBadge type={denuncia.tipo_problema as any} />
                        <StatusBadge status={denuncia.estado as any} />
                        <Badge 
                          variant="outline" 
                          className={`flex items-center space-x-1 ${getPriorityColor(denuncia.prioridad)}`}
                        >
                          {getPriorityIcon(denuncia.prioridad)}
                          <span>Prioridad {denuncia.prioridad}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{denuncia.descripcion_corta}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {denuncia.descripcion_completa}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{denuncia.ubicacion}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{denuncia.fecha} ({denuncia.fecha_relativa})</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {denuncia.imagen && (
                          <Badge variant="outline" className="text-xs">
                            📷 Con evidencia
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {denuncia.dias_transcurridos} días transcurridos
                        </Badge>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        ID: #{denuncia.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results count */}
        {data && data.denuncias.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Mostrando {data.denuncias.length} denuncias del periodo: {data.resumen.periodo}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/calendario-semanal">
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Ver Calendario Semanal</span>
            </Button>
          </Link>
          <Link to="/reportes">
            <Button variant="outline" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Ver Reportes Completos</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;