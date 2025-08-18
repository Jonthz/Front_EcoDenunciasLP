import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Catálogo de Denuncias</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora todas las denuncias ambientales reportadas por la comunidad. 
            Utiliza los filtros para encontrar información específica.
          </p>
          {data && (
            <p className="text-sm text-muted-foreground mt-2">
              Mostrando denuncias de los últimos 7 días
            </p>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros de Búsqueda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en descripción o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Delito</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
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

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="resuelta">Resuelta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <Button onClick={applyFilters} className="mr-2">
                Aplicar Filtros
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setTimeout(() => fetchData(), 100);
                }}
              >
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Cargando...' : `Mostrando ${filteredReports.length} denuncias`}
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredReports.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No se encontraron denuncias</p>
                  <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report: DenunciaResumen) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <CrimeTypeBadge type={report.tipo_problema as any} />
                        <StatusBadge status={report.estado as any} />
                        {report.prioridad && (
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              report.prioridad === 'alta' ? 'text-destructive' :
                              report.prioridad === 'media' ? 'text-warning' :
                              'text-muted-foreground'
                            }`}
                          >
                            Prioridad {report.prioridad}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{report.descripcion_corta}</CardTitle>
                    </div>
                    
                    <Link to={`/denuncia/${report.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {report.descripcion_completa}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{report.ubicacion}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{report.fecha} ({report.fecha_relativa})</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {report.imagen && (
                          <Badge variant="outline" className="text-xs">
                            📷 Con evidencia
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {report.dias_transcurridos} días transcurridos
                        </Badge>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        ID: #{report.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results summary */}
        {!loading && filteredReports.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Mostrando {filteredReports.length} denuncias de los últimos 7 días
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;