import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, MapPin, Calendar, MessageSquare, Send, User, Image as ImageIcon, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-24" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-24" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!denuncia) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground">Denuncia no encontrada</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Report Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <CrimeTypeBadge type={denuncia.tipo_problema as any} />
                  <StatusBadge status={denuncia.estado as any} />
                </div>
                <CardTitle className="text-2xl">
                  Denuncia #{denuncia.id.toString().padStart(4, '0')}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Descripción</h4>
              <p className="text-muted-foreground">{denuncia.descripcion}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{denuncia.ubicacion_direccion}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Reportado el {new Date(denuncia.fecha_creacion).toLocaleDateString('es-ES')}
                    {denuncia.dias_transcurridos > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (hace {denuncia.dias_transcurridos} días)
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{denuncia.total_comentarios} comentarios</span>
                </div>
              </div>
              
              {(denuncia.ubicacion_lat && denuncia.ubicacion_lng) && (
                <div>
                  <h4 className="font-medium mb-2">Coordenadas</h4>
                  <p className="text-sm text-muted-foreground">
                    Lat: {denuncia.ubicacion_lat}, Lng: {denuncia.ubicacion_lng}
                  </p>
                </div>
              )}
            </div>

            {denuncia.imagen_url && (
              <div>
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Evidencia fotográfica</span>
                </h4>
                <div className="border rounded-lg p-2 inline-block">
                  <img 
                    src={denuncia.imagen_url} 
                    alt="Evidencia de la denuncia"
                    className="max-w-sm max-h-64 object-cover rounded"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Comentarios</span>
              </CardTitle>
              <CardDescription>
                {comentarios?.estadisticas.total_comentarios || 0} comentarios
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Comments List */}
              {loadingComentarios ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-12" />
                    </div>
                  ))}
                </div>
              ) : comentarios && comentarios.comentarios.length > 0 ? (
                <div className="space-y-4">
                  {comentarios.comentarios.map((comentario: Comentario) => (
                    <div key={comentario.id} className="border-l-2 border-primary/20 pl-4 space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{comentario.nombre_usuario}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{comentario.tiempo_transcurrido}</span>
                      </div>
                      <p className="text-sm">{comentario.comentario}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              )}

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Agregar comentario</h4>
                
                <div>
                  <Input
                    placeholder="Tu nombre"
                    value={newComment.nombre_usuario}
                    onChange={(e) => setNewComment(prev => ({ ...prev, nombre_usuario: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Textarea
                    placeholder="Escribe tu comentario..."
                    value={newComment.comentario}
                    onChange={(e) => setNewComment(prev => ({ ...prev, comentario: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={submittingComment} className="w-full">
                  {submittingComment ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Enviar comentario</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Historial de cambios</span>
              </CardTitle>
              <CardDescription>
                Seguimiento de los cambios de estado
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {loadingHistorial ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8" />
                    </div>
                  ))}
                </div>
              ) : historial.length > 0 ? (
                <div className="space-y-4">
                  {historial.map((entry, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <StatusBadge status={entry.estado as any} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Por: <span className="font-medium">{entry.usuario}</span>
                        </p>
                        
                        {entry.notas && (
                          <p className="text-sm">{entry.notas}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No hay historial de cambios disponible
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;