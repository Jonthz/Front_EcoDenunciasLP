import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Calendar, MapPin, MessageSquare, Save, Eye, User, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-destructive";
      case "media": return "text-warning";
      case "baja": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gestiona y actualiza el estado de las denuncias ambientales reportadas por la comunidad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Lista de Denuncias */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Denuncias para Gestión</CardTitle>
                <CardDescription>
                  Selecciona una denuncia para revisar y actualizar su estado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : data?.denuncias.map((report: DenunciaResumen) => (
                  <div
                    key={report.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedReport === report.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleSelectReport(report.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CrimeTypeBadge type={report.tipo_problema as any} />
                          <StatusBadge status={report.estado as any} />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(report.prioridad)}
                        >
                          Prioridad {report.prioridad}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold">{report.descripcion_corta}</h3>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{report.fecha} ({report.fecha_relativa})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{report.ubicacion}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {report.dias_transcurridos} días transcurridos
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: #{report.id.toString().padStart(4, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Panel de Detalles */}
          <div>
            {selectedReportData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Detalles de la Denuncia</span>
                  </CardTitle>
                  <CardDescription>
                    ID: #{selectedReportData.id.toString().padStart(4, '0')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Descripción Corta</h4>
                      <p className="text-sm">{selectedReportData.descripcion_corta}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Descripción Completa</h4>
                      <p className="text-sm text-muted-foreground">{selectedReportData.descripcion_completa}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Ubicación</h4>
                      <p className="text-sm text-muted-foreground">{selectedReportData.ubicacion}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Tipo</h4>
                        <CrimeTypeBadge type={selectedReportData.tipo_problema as any} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Estado Actual</h4>
                        <StatusBadge status={selectedReportData.estado as any} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Prioridad</h4>
                        <Badge className={getPriorityColor(selectedReportData.prioridad)}>
                          {selectedReportData.prioridad}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Fecha</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedReportData.fecha}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actualizar Estado */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Gestión Administrativa</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="newStatus" className="text-sm font-medium mb-2 block">
                          Cambiar Estado
                        </Label>
                        <Select value={newStatus} onValueChange={(value: 'pendiente' | 'en_proceso' | 'resuelta') => setNewStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="en_proceso">En Proceso</SelectItem>
                            <SelectItem value="resuelta">Resuelta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="usuarioResponsable" className="text-sm font-medium mb-2 block">
                          Usuario Responsable
                        </Label>
                        <Input
                          id="usuarioResponsable"
                          placeholder="Nombre del operador o responsable"
                          value={usuarioResponsable}
                          onChange={(e) => setUsuarioResponsable(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="adminNotes" className="text-sm font-medium mb-2 block">
                          Notas Administrativas
                        </Label>
                        <Textarea
                          id="adminNotes"
                          placeholder="Agrega comentarios sobre el estado de la investigación, acciones tomadas, etc."
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleUpdateReport}
                      disabled={updating}
                      className="w-full"
                      size="lg"
                    >
                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>

                    {/* Historial section */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium flex items-center space-x-2 mb-3">
                        <History className="h-4 w-4" />
                        <span>Historial de Cambios</span>
                      </h4>
                      
                      {loadingHistorial ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-16" />
                          ))}
                        </div>
                      ) : historial.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {historial.map((entry, index) => (
                            <div key={index} className="border-l-2 border-primary/20 pl-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <StatusBadge status={entry.estado as any} />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.fecha).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                              
                              <div className="text-sm space-y-1">
                                <p className="text-muted-foreground flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>Por: <span className="font-medium">{entry.usuario}</span></span>
                                </p>
                                
                                {entry.notas && (
                                  <p className="text-sm bg-muted/30 p-2 rounded text-muted-foreground">
                                    {entry.notas}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-4 text-sm">
                          No hay historial disponible
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Selecciona una denuncia</h3>
                  <p className="text-muted-foreground">
                    Elige una denuncia de la lista para ver sus detalles y actualizar su estado.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="text-center pt-6">
              <div className="text-2xl font-bold text-warning">
                {loading ? '...' : data?.resumen.pendientes || 0}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center pt-6">
              <div className="text-2xl font-bold text-primary">
                {loading ? '...' : data?.resumen.en_proceso || 0}
              </div>
              <div className="text-sm text-muted-foreground">En Proceso</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="text-center pt-6">
              <div className="text-2xl font-bold text-success">
                {loading ? '...' : data?.resumen.resueltas || 0}
              </div>
              <div className="text-sm text-muted-foreground">Resueltas</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;