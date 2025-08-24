import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Download, TrendingUp, MapPin, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  fetchReporteGeneral, 
  fetchReporteCategorias, 
  fetchReporteUbicaciones, 
  exportarReporte,
  ReporteGeneral,
  ReporteCategorias,
  ReporteUbicaciones,
  categoriaMapping,
  ApiResponse 
} from "@/services/apiService";

const Reports = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  const [dateFilters, setDateFilters] = useState({
    fecha_inicio: "",
    fecha_fin: ""
  });
  
  const [reporteGeneral, setReporteGeneral] = useState<ReporteGeneral | null>(null);
  const [reporteCategorias, setReporteCategorias] = useState<ReporteCategorias | null>(null);
  const [reporteUbicaciones, setReporteUbicaciones] = useState<ReporteUbicaciones | null>(null);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [generalRes, categoriasRes, ubicacionesRes] = await Promise.all([
        fetchReporteGeneral(dateFilters),
        fetchReporteCategorias(dateFilters),
        fetchReporteUbicaciones(dateFilters)
      ]);

      if (generalRes.success && generalRes.data) {
        setReporteGeneral(generalRes.data);
      } else {
        toast({
          title: "Error al cargar reporte general",
          description: generalRes.message,
          variant: "destructive"
        });
      }

      if (categoriasRes.success && categoriasRes.data) {
        setReporteCategorias(categoriasRes.data);
      } else {
        console.error("Error al cargar reporte de categorías:", categoriasRes.message);
      }

      if (ubicacionesRes.success && ubicacionesRes.data) {
        setReporteUbicaciones(ubicacionesRes.data);
      } else {
        console.error("Error al cargar reporte de ubicaciones:", ubicacionesRes.message);
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar los reportes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (formato: 'json' | 'csv') => {
    setExporting(true);
    try {
      const response = await exportarReporte({
        formato,
        tipo: 'general',
        ...dateFilters
      });

      if (response.success) {
        if (formato === 'json' && response.data) {
          // Download JSON
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-general-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        toast({
          title: "Reporte exportado",
          description: `El reporte en formato ${formato.toUpperCase()} ha sido descargado`
        });
      } else {
        toast({
          title: "Error al exportar",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo exportar el reporte",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const applyFilters = () => {
    fetchAllReports();
  };

  const clearFilters = () => {
    setDateFilters({ fecha_inicio: "", fecha_fin: "" });
    setTimeout(() => fetchAllReports(), 100);
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  // Chart colors
  const chartColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

  // Transform data for charts
  const categoriasChartData = reporteCategorias?.categorias.map(cat => ({
    name: categoriaMapping[cat.categoria] || cat.categoria,
    value: cat.total
  })) || [];

  const ubicacionesChartData = reporteUbicaciones?.ubicaciones.slice(0, 10).map(ub => ({
    name: ub.ubicacion,
    total: ub.total
  })) || [];

  const estadosChartData = reporteGeneral ? [
  { name: 'Pendientes', value: reporteGeneral.estadisticas_generales.denuncias_pendientes, color: '#f59e0b' },
  { name: 'En Proceso', value: reporteGeneral.estadisticas_generales.denuncias_en_proceso, color: '#06b6d4' },
  { name: 'Resueltas', value: reporteGeneral.estadisticas_generales.denuncias_resueltas, color: '#10b981' }
] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Reportes y Estadísticas</h1>
            <p className="text-muted-foreground">
              Análisis detallado de las denuncias ambientales
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

          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Análisis detallado de las denuncias ambientales registradas en la plataforma
          </p>
        </div>

        {/* Date Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Filtros de Fecha</span>
            </CardTitle>
            <CardDescription>
              Selecciona un rango de fechas para filtrar los reportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Inicio</label>
                <Input
                  type="date"
                  value={dateFilters.fecha_inicio}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Fin</label>
                <Input
                  type="date"
                  value={dateFilters.fecha_fin}
                  onChange={(e) => setDateFilters(prev => ({ ...prev, fecha_fin: e.target.value }))}
                />
              </div>

              <div className="space-y-2 flex items-end">
                <Button onClick={applyFilters} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>

              <div className="space-y-2 flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpiar
                </Button>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => handleExport('json')}
                disabled={exporting}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar JSON
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('csv')}
                disabled={exporting}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {reporteGeneral && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-primary mb-2">
                  {reporteGeneral.estadisticas_generales.total_denuncias}
                </div>
                <div className="text-sm text-muted-foreground">Total Denuncias</div>
                <TrendingUp className="h-4 w-4 mx-auto mt-2 text-primary" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-warning mb-2">
                  {reporteGeneral.estadisticas_generales.denuncias_pendientes}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-accent mb-2">
                  {reporteGeneral.estadisticas_generales.denuncias_en_proceso}
                </div>
                <div className="text-sm text-muted-foreground">En Proceso</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center pt-6">
                <div className="text-2xl font-bold text-success mb-2">
                  {reporteGeneral.estadisticas_generales.denuncias_resueltas}
                </div>
                <div className="text-sm text-muted-foreground">Resueltas</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center space-x-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Categorías</span>
            </TabsTrigger>
            <TabsTrigger value="ubicaciones" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Ubicaciones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Estados Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Estado</CardTitle>
                  <CardDescription>
                    Porcentaje de denuncias según su estado actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={estadosChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {estadosChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Summary Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Período</CardTitle>
                  <CardDescription>
                    Información general y tendencias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reporteGeneral && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Período:</span>
                        <span className="text-sm text-muted-foreground">
                          {reporteGeneral.periodo.fecha_inicio} - {reporteGeneral.periodo.fecha_fin}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Promedio días resolución:</span>
                        <span className="text-sm text-muted-foreground">
                          {reporteGeneral.estadisticas_generales.promedio_dias_resolucion} días
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tasa de resolución:</span>
                        <span className="text-sm font-medium text-success">
                          {reporteGeneral.estadisticas_generales.tasa_resolucion}
                        </span>
                      </div>

                      <div className="pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          {reporteGeneral.explicacion}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categorias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Denuncias por Categoría</CardTitle>
                <CardDescription>
                  {reporteCategorias?.explicacion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoriasChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoriasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ubicaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Ubicaciones</CardTitle>
                <CardDescription>
                  {reporteUbicaciones?.explicacion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={ubicacionesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;