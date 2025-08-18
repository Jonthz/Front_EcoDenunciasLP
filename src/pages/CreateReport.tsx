import { useState } from "react";
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
  InputAdornment,
  CircularProgress,
  Alert
} from "@mui/material";
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'hsl(var(--background))', py: 4 }}>
      <Container maxWidth="md" sx={{ px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'hsl(var(--primary) / 0.1)', 
              borderRadius: '50%'
            }}>
              <AlertCircle style={{ width: 32, height: 32, color: 'hsl(var(--primary))' }} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'hsl(var(--foreground))' }}>
            Crear Nueva Denuncia
          </Typography>
          <Typography sx={{ color: 'hsl(var(--muted-foreground))' }}>
            Comparte los detalles del delito ambiental que observaste. 
            Tu reporte ayudará a proteger nuestro medio ambiente.
          </Typography>
        </Box>

        <Card sx={{ bgcolor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'hsl(var(--foreground))' }}>
              Información de la Denuncia
            </Typography>
            <Typography variant="body2" sx={{ color: 'hsl(var(--muted-foreground))', mb: 3 }}>
              Completa todos los campos para procesar tu denuncia correctamente.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ '& > *': { mb: 4 } }}>
              {/* Tipo de delito */}
              <FormControl fullWidth>
                <InputLabel>Categoría de Denuncia Ambiental *</InputLabel>
                <Select 
                  value={form.categoria} 
                  onChange={(e) => setForm(prev => ({ ...prev, categoria: e.target.value }))}
                  label="Categoría de Denuncia Ambiental *"
                >
                  <MenuItem value="contaminacion_agua">Contaminación de Agua</MenuItem>
                  <MenuItem value="contaminacion_aire">Contaminación de Aire</MenuItem>
                  <MenuItem value="deforestacion">Deforestación</MenuItem>
                  <MenuItem value="manejo_residuos">Manejo de Residuos</MenuItem>
                  <MenuItem value="ruido_excesivo">Ruido Excesivo</MenuItem>
                  <MenuItem value="contaminacion_suelo">Contaminación de Suelo</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
                
                {form.categoria && (
                  <Box sx={{ mt: 1 }}>
                    <CrimeTypeBadge type={form.categoria as any} />
                  </Box>
                )}
              </FormControl>

              {/* Descripción */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción del Incidente *"
                placeholder="Describe detalladamente lo que observaste: fecha, hora, personas involucradas, daños causados, etc."
                value={form.descripcion}
                onChange={(e) => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
              />

              {/* Ubicación */}
              <TextField
                fullWidth
                label="Ubicación *"
                placeholder="Dirección o descripción del lugar"
                value={form.ubicacion}
                onChange={(e) => setForm(prev => ({ ...prev, ubicacion: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin style={{ width: 16, height: 16, color: 'hsl(var(--muted-foreground))' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Coordenadas opcionales */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Latitud (Opcional)"
                    placeholder="-2.1894"
                    value={form.latitud}
                    onChange={(e) => setForm(prev => ({ ...prev, latitud: e.target.value }))}
                    inputProps={{ step: "any" }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Longitud (Opcional)"
                    placeholder="-79.8847"
                    value={form.longitud}
                    onChange={(e) => setForm(prev => ({ ...prev, longitud: e.target.value }))}
                    inputProps={{ step: "any" }}
                  />
                </Grid>
              </Grid>

              {/* Imagen */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'hsl(var(--foreground))' }}>
                  Imagen de Evidencia (Opcional)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    fullWidth
                    type="file"
                    onChange={handleImageChange}
                    inputProps={{ accept: "image/*" }}
                    sx={{ '& input': { cursor: 'pointer' } }}
                  />
                  <Upload style={{ width: 20, height: 20, color: 'hsl(var(--muted-foreground))' }} />
                </Box>
                {form.imagen && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'hsl(var(--muted-foreground))' }}>
                    Archivo seleccionado: {form.imagen.name}
                  </Typography>
                )}
              </Box>

              {/* Información del reportante (opcional) */}
              <Box sx={{ pt: 4, mt: 2, borderTop: '1px solid hsl(var(--border))' }}>
                <Typography variant="body2" sx={{ 
                  fontWeight: 500, 
                  fontSize: '0.875rem', 
                  color: 'hsl(var(--muted-foreground))',
                  mb: 2
                }}>
                  Información de Contacto (Opcional)
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      placeholder="Tu nombre"
                      value={form.nombre_reportante}
                      onChange={(e) => setForm(prev => ({ ...prev, nombre_reportante: e.target.value }))}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      placeholder="099999999"
                      value={form.telefono_reportante}
                      onChange={(e) => setForm(prev => ({ ...prev, telefono_reportante: e.target.value }))}
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="correo@ejemplo.com"
                  value={form.email_reportante}
                  onChange={(e) => setForm(prev => ({ ...prev, email_reportante: e.target.value }))}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ pt: 4 }}>
                <MuiButton 
                  type="submit" 
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
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
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                      <span>Enviando...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Send style={{ width: 16, height: 16 }} />
                      <span>Enviar Denuncia</span>
                    </Box>
                  )}
                </MuiButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card sx={{ 
          mt: 3, 
          bgcolor: 'hsl(var(--muted) / 0.3)',
          borderColor: 'hsl(var(--border))'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <AlertCircle style={{ 
                width: 20, 
                height: 20, 
                color: 'hsl(var(--primary))', 
                marginTop: 2, 
                flexShrink: 0 
              }} />
              <Box sx={{ fontSize: '0.875rem' }}>
                <Typography sx={{ fontWeight: 500, mb: 0.5, color: 'hsl(var(--foreground))' }}>
                  Información importante:
                </Typography>
                <Box component="ul" sx={{ 
                  listStyle: 'none', 
                  p: 0, 
                  m: 0,
                  color: 'hsl(var(--muted-foreground))',
                  '& li': { mb: 0.5 }
                }}>
                  <li>• Tu denuncia será revisada por nuestro equipo en un plazo de 24-48 horas.</li>
                  <li>• Si la situación requiere atención inmediata, contacta también a las autoridades locales.</li>
                  <li>• Mantén la privacidad y seguridad al documentar el incidente.</li>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateReport;