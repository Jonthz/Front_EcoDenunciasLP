import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Upload, Send, AlertCircle } from "lucide-react";
import CrimeTypeBadge from "@/components/ui/crime-type-badge";
import { crearDenuncia } from "@/services/apiService";

interface ReportForm {
  categoria: string;
  descripcion: string;
  ubicacion: string;
  latitud: string;
  longitud: string;
  imagen: File | null;
  nombre_reportante: string;
  email_reportante: string;
  telefono_reportante: string;
}

const CreateReport = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<ReportForm>({
    categoria: "",
    descripcion: "",
    ubicacion: "",
    latitud: "",
    longitud: "",
    imagen: null,
    nombre_reportante: "",
    email_reportante: "",
    telefono_reportante: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.categoria || !form.descripcion || !form.ubicacion) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        descripcion: form.descripcion,
        categoria: form.categoria,
        ubicacion: form.ubicacion,
        latitud: form.latitud ? parseFloat(form.latitud) : undefined,
        longitud: form.longitud ? parseFloat(form.longitud) : undefined,
        imagen: form.imagen || undefined,
        nombre_reportante: form.nombre_reportante || undefined,
        email_reportante: form.email_reportante || undefined,
        telefono_reportante: form.telefono_reportante || undefined,
      };

      const response = await crearDenuncia(payload);
      
      if (response.success) {
        toast({
          title: "Denuncia enviada exitosamente",
          description: response.message || "Tu denuncia ha sido registrada y será revisada por nuestro equipo.",
        });
        
        // Reset form
        setForm({
          categoria: "",
          descripcion: "",
          ubicacion: "",
          latitud: "",
          longitud: "",
          imagen: null,
          nombre_reportante: "",
          email_reportante: "",
          telefono_reportante: ""
        });
      } else {
        toast({
          title: "Error al enviar denuncia",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo enviar la denuncia. Por favor intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, imagen: file }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Crear Nueva Denuncia</h1>
          <p className="text-muted-foreground">
            Comparte los detalles del delito ambiental que observaste. 
            Tu reporte ayudará a proteger nuestro medio ambiente.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Denuncia</CardTitle>
            <CardDescription>
              Completa todos los campos para procesar tu denuncia correctamente.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de delito */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría de Denuncia Ambiental *</Label>
                <Select value={form.categoria} onValueChange={(value) => setForm(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contaminacion_agua">
                      <div className="flex items-center space-x-2">
                        <span>Contaminación de Agua</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="contaminacion_aire">
                      <div className="flex items-center space-x-2">
                        <span>Contaminación de Aire</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="deforestacion">
                      <div className="flex items-center space-x-2">
                        <span>Deforestación</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manejo_residuos">
                      <div className="flex items-center space-x-2">
                        <span>Manejo de Residuos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ruido_excesivo">
                      <div className="flex items-center space-x-2">
                        <span>Ruido Excesivo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="contaminacion_suelo">
                      <div className="flex items-center space-x-2">
                        <span>Contaminación de Suelo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="otros">
                      <div className="flex items-center space-x-2">
                        <span>Otros</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {form.categoria && (
                  <div className="mt-2">
                    <CrimeTypeBadge type={form.categoria as any} />
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción del Incidente *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe detalladamente lo que observaste: fecha, hora, personas involucradas, daños causados, etc."
                  value={form.descripcion}
                  onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ubicacion"
                    placeholder="Dirección o descripción del lugar"
                    value={form.ubicacion}
                    onChange={(e) => setForm(prev => ({ ...prev, ubicacion: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Coordenadas opcionales */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitud">Latitud (Opcional)</Label>
                  <Input
                    id="latitud"
                    type="number"
                    step="any"
                    placeholder="-2.1894"
                    value={form.latitud}
                    onChange={(e) => setForm(prev => ({ ...prev, latitud: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longitud">Longitud (Opcional)</Label>
                  <Input
                    id="longitud"
                    type="number"
                    step="any"
                    placeholder="-79.8847"
                    value={form.longitud}
                    onChange={(e) => setForm(prev => ({ ...prev, longitud: e.target.value }))}
                  />
                </div>
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen de Evidencia (Opcional)</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {form.imagen && (
                  <p className="text-sm text-muted-foreground">
                    Archivo seleccionado: {form.imagen.name}
                  </p>
                )}
              </div>

              {/* Información del reportante (opcional) */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Información de Contacto (Opcional)
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_reportante">Nombre Completo</Label>
                    <Input
                      id="nombre_reportante"
                      placeholder="Tu nombre"
                      value={form.nombre_reportante}
                      onChange={(e) => setForm(prev => ({ ...prev, nombre_reportante: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono_reportante">Teléfono</Label>
                    <Input
                      id="telefono_reportante"
                      placeholder="099999999"
                      value={form.telefono_reportante}
                      onChange={(e) => setForm(prev => ({ ...prev, telefono_reportante: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email_reportante">Email</Label>
                  <Input
                    id="email_reportante"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email_reportante}
                    onChange={(e) => setForm(prev => ({ ...prev, email_reportante: e.target.value }))}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Enviar Denuncia</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="mt-6 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Tu denuncia será revisada por nuestro equipo en un plazo de 24-48 horas.</li>
                  <li>• Si la situación requiere atención inmediata, contacta también a las autoridades locales.</li>
                  <li>• Mantén la privacidad y seguridad al documentar el incidente.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateReport;